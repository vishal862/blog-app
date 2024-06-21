import { Button, Modal, Table } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { HiOutlineCheck } from "react-icons/hi";
import { HiOutlineXMark } from "react-icons/hi2";
import { AiOutlineExclamationCircle } from "react-icons/ai";

export default function DashComments() {
  const currentUser = useSelector((state) => state.user);
  const [fetchUsersError, setFetchUsersError] = useState(null);
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [commentIdToBeDeleted, setCommentIdToBeDeleted] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch("/api/comment/getComments");
        const data = await res.json();
        console.log(data);
        if (res.ok) {
          setComments(data.comments);
        }
        if (data.comments.length < 9) {
          setShowMore(false);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchComments();
  }, [currentUser.isAdmin]);

  const handleDeleteComment = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/comment/deleteComment/${commentIdToBeDeleted}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setComments((prev) =>
          prev.filter((comment) => comment._id !== commentIdToBeDeleted)
        );
        setShowModal(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      <Table>
        <Table.Head>
          <Table.HeadCell>Data updated</Table.HeadCell>
          <Table.HeadCell>Comment Content</Table.HeadCell>
          <Table.HeadCell>Number of likes</Table.HeadCell>
          <Table.HeadCell>PostId</Table.HeadCell>
          <Table.HeadCell>UserId</Table.HeadCell>
          <Table.HeadCell>Delete</Table.HeadCell>
        </Table.Head>
        {comments.map((comment) => (
          <Table.Body key={comment._id}>
            <Table.Row>
              <Table.Cell>
                {new Date(comment.updatedAt).toLocaleDateString()}
              </Table.Cell>
              <Table.Cell>
                {comment.content}
              </Table.Cell>
              <Table.Cell>{comment.numberOfLikes}</Table.Cell>
              <Table.Cell>{comment.postId}</Table.Cell>
              <Table.Cell>
                {comment.userId}
              </Table.Cell>
              <Table.Cell>
                <span
                  onClick={() => {
                    setShowModal(true);
                    setCommentIdToBeDeleted(comment._id);
                  }}
                  className="text-red-600 hover:underline cursor-pointer"
                >
                  Delete
                </span>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        ))}
      </Table>
      <Modal show={showModal} onClose={() => setShowModal(false)} size="md">
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <AiOutlineExclamationCircle className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-200 mb-4" />
            <h1 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete the Comment?
            </h1>
            <div className="flex justify-center gap-4">
              <Button
                onClick={() => {
                  handleDeleteComment();
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
