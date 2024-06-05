import { Alert, Button, Textarea } from "flowbite-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function Comments({ postId }) {
  const { currentUser } = useSelector((state) => state.user);

  const [comment, setComment] = useState("");
  const [charRemaining, setCharRemaining] = useState(200);
  const [commentError, setCommentError] = useState(null);

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
      }
    } catch (error) {
      setCommentError(error.messsage);
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
    </div>
  );
}
