import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Modal, Table } from "flowbite-react";
import { Link } from "react-router-dom";
import { AiOutlineExclamationCircle } from "react-icons/ai";

export default function DashPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [postIdToDeleted, setPostIdToDeleted] = useState(null);
  console.log(currentUser);
  console.log(userPosts);
  useEffect(() => {
    const fetchPost = async (e) => {
      try {
        const res = await fetch(`/api/post/getPost?userId=${currentUser._id}`);
        const data = await res.json();
        if (res.ok) {
          setUserPosts(data.posts);
          if (data.posts.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (currentUser.isAdmin) {
      fetchPost();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    try {
      const res = await fetch(
        `/api/post/getPost?userId=${currentUser._id}&startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setUserPosts((prev) => [...prev, ...data.posts]);
        if (data.posts.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/post/deletePost/${postIdToDeleted}/${currentUser._id}`,{
          method: "DELETE",
        }
      );
      const data = res.json();
      if(!res.ok){
        console.log(data.message);
      }else{
        setUserPosts((prev)=>
          prev.filter((post)=> post._id !== postIdToDeleted)
        )
      }
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.isAdmin && userPosts.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date posted</Table.HeadCell>
              <Table.HeadCell>Post Image</Table.HeadCell>
              <Table.HeadCell>Post Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>
                <span>Delete</span>
              </Table.HeadCell>
              <Table.HeadCell>Edit</Table.HeadCell>
            </Table.Head>
            {userPosts.map((post) => (
              <Table.Body className="divide-y" key={post._id}>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-700">
                  <Table.Cell>
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/posts/${post.slug}`}>
                      <img
                        className="h-10 w-20 object-cover bg-gray-500"
                        src={`${post.image}`}
                        alt="image"
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className="font-medium text-gray-900 dark:text-white hover:underline"
                      to={`/posts/${post.slug}`}
                    >
                      {post.title}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{post.category}</Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setPostIdToDeleted(post._id);
                      }}
                      className="text-red-500 font-semibold hover:underline cursor-pointer"
                    >
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/update-post/${post._id}`}>
                      <span className="text-green-500 font-semibold hover:underline">
                        Edit
                      </span>
                    </Link>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className="self-center w-full text-green-400 hover:underline py-7 text-sm"
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <p>You have no posts yet!</p>
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
                  handleDeletePost();
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
