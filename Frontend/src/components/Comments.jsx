import { Alert, Button, Textarea } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import EachComment from "./EachComment";

export default function Comments({ postId }) {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [comment, setComment] = useState("");//the comment that is we will write in that comment box
  const [charRemaining, setCharRemaining] = useState(200);
  const [commentError, setCommentError] = useState(null);
  const [comments, setComments] = useState([]);
  console.log(comments);

  const handleChange = (e) => {
    setComment(e.target.value);
    setCharRemaining(200 - e.target.value.length);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (comment.length > 200) {
      return;
    }
    try {
      const res = await fetch("/api/comment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: comment,
          postId,
          userId: currentUser._id,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setComment("");
        setCommentError(null);
        setComments([data, ...comments]);
        //data is new comment that has been added and ...comments are the comments that are already present
        //so we are keeping the previous comments and adding the new comment i.e data to the 1st place
        setCharRemaining(200);
      }
    } catch (error) {
      setCommentError(error.messsage);
    }
  };

  useEffect(() => {
    const fetchComments = async (e) => {
      try {
        const res = await fetch(`/api/comment/showComments/${postId}`);
        if (res.ok) {
          const data = await res.json();
          setComments(data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchComments();
  }, [postId]);

  const handleLike = async (commentId) => {
    try {
      if (!currentUser) {
        navigate("/sign-in");
        return;
      }
      const res = await fetch(`/api/comment/likeComment/${commentId}`, {
        method: "PUT",
      });
      if (res.ok) {
        const data = await res.json();
        setComments(comments.map((comment)=>(
          comment._id === commentId ? {
            ...comment,
            likes : data.likes,
            numberOfLikes : data.likes.length
          } : comment
        )))
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-2xl w-full p-3 mx-auto">
      {currentUser ? (
        <div className="flex gap-2 text-sm my-5 items-center">
          <p className="text-gray-500">Signed in as: </p>
          <img
            className="rounded-full h-8 w-8 object-cover"
            src={currentUser.profilePicture}
            alt="image"
          />
          <Link
            className="hover:underline text-xs text-cyan-600"
            to={"/dashboard?tab=profile"}
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="text-teal-500 my-5 text-sm flex gap-1">
          You must be logged in to comment.
          <Link className="hover:underline" to={"/sign-in"}>
            Login
          </Link>
        </div>
      )}
      {currentUser && (
        <form onSubmit={handleSubmit} className="border border-teal-500 p-3">
          <Textarea
            onChange={handleChange}
            value={comment}
            rows="3"
            maxLength="200"
            placeholder="Add a comment..."
          />
          <div className="flex justify-between items-center mt-5">
            <p className="text-xs text-gray-400">
              {charRemaining} characters remaining
            </p>
            <Button type="submit" gradientDuoTone="purpleToBlue" outline>
              Submit
            </Button>
          </div>
          {commentError && (
            <Alert color="failure" className="mt-5">
              {commentError}
            </Alert>
          )}
        </form>
      )}
      {comments.length === 0 ? (
        <p className="text-sm my-5">No comments</p>
      ) : (
        <>
          <div className="flex gap-2 my-5 items-center">
            <p>Comments</p>
            <div className="border ">
              <p className="px-2">{comments.length}</p>
            </div>
          </div>
          {comments.map((comment) => (
            <EachComment
              key={comment._id}
              comment={comment}
              onLike={handleLike}
            />
          ))}
        </>
      )}
    </div>
  );
}
