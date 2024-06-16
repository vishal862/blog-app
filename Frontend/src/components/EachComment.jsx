import React, { useEffect, useState } from "react";
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Button, Textarea } from "flowbite-react";

export default function EachComment({ comment, onLike, onEdit }) {
  const { currentUser } = useSelector((state) => state.user);
  console.log(currentUser);
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  console.log(editedContent);
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/user/${comment.userId}`);
        const data = await res.json();
        if (res.ok) {
          setUser(data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [comment]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedContent(comment.content);
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/comment/editComment/${comment._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: editedContent,
        }),
      });
      if (res.ok) {
        setIsEditing(false);
        onEdit(comment, editedContent);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex gap-2 p-3 border-b dark:border-gray-600 text-sm">
      <div className="flex-shrink-0 mr-3">
        <img
          className="h-10 w-10 rounded-full"
          src={user.profilePicture}
          alt="image"
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-1">
          <p className="text-xs truncate font-bold mr-1">
            {user ? `@${user.username}` : "Anonymus user"}
          </p>
          <div className="text-xs text-gray-500">
            {moment(comment.createdAt).fromNow()}
          </div>
        </div>
        {isEditing ? (
          <>
            <Textarea
              className="mb-2"
              onChange={(e) => setEditedContent(e.target.value)}
              value={editedContent}
            />
            <div className="flex gap-2 justify-end text-xs">
              <div className="">
                <Button
                  onClick={handleSave}
                  type="button"
                  size={"sm"}
                  gradientDuoTone={"purpleToBlue"}
                >
                  Save
                </Button>
              </div>
              <div className="">
                <Button
                  onClick={() => setIsEditing(false)}
                  type="button"
                  size={"sm"}
                  gradientDuoTone={"purpleToBlue"}
                  outline
                >
                  Cancel
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-500 text-md pb-2">{comment.content}</p>
            <div className="flex gap-2">
              <button
                type="button"
                className={`text-gray-400 hover:text-blue-500 ${
                  currentUser &&
                  comment.likes.includes(currentUser._id) &&
                  "!text-blue-500"
                }`}
              >
                {/* //basically using ! means we are overriding the original color of
            the button with blue */}
                <FaThumbsUp
                  className="text-sm"
                  onClick={() => onLike(comment._id)}
                />
              </button>
              <p className="text-xs text-gray-500">
                {comment.numberOfLikes > 0 &&
                  comment.numberOfLikes +
                    " " +
                    (comment.numberOfLikes === 1 ? "Like" : "Likes")}
              </p>
              {currentUser &&
                (currentUser._id === comment.userId || currentUser.isAdmin) && (
                  <button
                    onClick={handleEdit}
                    className="text-gray-400 text-xs hover:text-blue-700 hover:cursor-pointer"
                  >
                    Edit
                  </button>
                )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
