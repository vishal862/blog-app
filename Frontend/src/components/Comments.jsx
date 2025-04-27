import { Alert, Button, Modal, Textarea } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import EachComment from "./EachComment";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { useDispatch } from 'react-redux';
import { signOutSuccess } from '../redux/users/userSlice'; // adjust the path if needed

export default function Comments({ postId }) {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const [comment, setComment] = useState(""); //the comment that is we will write in that comment box
  const [charRemaining, setCharRemaining] = useState(200);
  const [commentError, setCommentError] = useState(null);
  const [comments, setComments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [commentToBeDeleted, setCommentToBeDeleted] = useState(null);
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
      console.log(res);
      
      // const data = await res.json();
      if (res.status === 401) {
        dispatch(signOutSuccess()); // this will clear user from Redux
        localStorage.removeItem('user');
        localStorage.removeItem('_persist');
        navigate('/sign-in');
      }
      
      if (res.ok) {
        setComment("");
        setCommentError(null);
        setCharRemaining(200);
      
        // Re-fetch all comments to get fully populated data
        const updatedRes = await fetch(`/api/comment/showComments/${postId}`);
        if (updatedRes.ok) {
          const updatedData = await updatedRes.json();
          setComments(updatedData);
        }
      }
      // if (res.ok) {
      //   setComment("");
      //   setCommentError(null);
      //   setComments([data, ...comments]);
        
      //   setCharRemaining(200);
      // }
    } catch (error) {
      setCommentError(error.message);
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
        console.log(data);
        setComments(
          comments.map((comment) =>
            //jyawr(commentId) like zaly tyachyashi match karnar (with every comment on that page)and update it's data
            comment._id === commentId
              ? {
                  ...comment,
                  likes: data.likes,
                  numberOfLikes: data.likes.length,
                }
              : comment
          )
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  //for frontend
  const handleEdit = async (comment, editContent) => {
    setComments(
      comments.map((c) =>
        c._id === comment._id ? { ...c, content: editContent } : c
      )
    );
  };

  const handleDelete = async (commentId) => {
    try {
      if (!currentUser) {
        navigate("/sign-in");
        return;
      }
      const res = await fetch(`/api/comment/deleteComment/${commentId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setComments(comments.filter((comment) => comment._id !== commentId));
        setShowModal(false);
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
        <React.Fragment key={postId}>
          <div className="flex gap-2 my-5 items-center">
            <p>Comments</p>
            <div className="border px-2">
              <p>{comments.length}</p>
            </div>
          </div>

          {comments.length > 0 ? (
            comments.map((comm) => (
              <EachComment
                key={comm._id}
                comment={comm}
                onLike={handleLike}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <p className="text-gray-500">No comments available.</p>
          )}
        </React.Fragment>
      )}
      <Modal show={showModal} onClose={() => setShowModal(false)} size="md">
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <AiOutlineExclamationCircle className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-200 mb-4" />
            <h1 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete the Post?
            </h1>
            <div className="flex justify-center gap-4">
              <Button
                onClick={() => {
                  handleDelete(commentToBeDeleted);
                  setShowModal(false);
                }}
                color="failure"
              >
                Yes, I'm sure
              </Button>
              <Button onClick={() => setShowModal(false)} color="gray">
                No, Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
