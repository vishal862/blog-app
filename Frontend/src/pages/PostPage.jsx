import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Spinner } from "flowbite-react";

export default function PostPage() {
  const { postSlug } = useParams();
  //here postSlug is specifically used bcz in App.jsx we have configured a route of that name
  //<Route path='/posts/:postSlug' element={<PostPage/>}/>
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  console.log(post);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/getPost?slug=${postSlug}`);
        const data = await res.json();
        console.log(data);
        if (!res.ok) {
          setLoading(false);
          setError(true);
          return;
        }
        if (res.ok) {
          setPost(data.posts[0]);
          setLoading(false);
          setError(false);
        }
      } catch (error) {
        setLoading(false);
        setError(true);
        console.log(error);
      }
    };
    fetchPosts();
  }, [postSlug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <main className="min-h-screen p-3 flex flex-col max-w-6xl mx-auto">
      <h1 className="text-center font-serif p-3 text-3xl mt-10 max-w-2xl mx-auto lg:text-4xl">
        {post && post.title}
      </h1>
      <Link to={`/search?category=${post && post.category}`}>
        <Button color={"gray"} pill size="xs" className="my-5 mx-auto mt-5">
          {post && post.category}
        </Button>
      </Link>
      <img
        className="mt-10 p-3 max-h-[600px] w-full object-cover"
        src={post && post.image}
        alt={post && post.title}
      />
      <div className="flex justify-between p-3 border-b border-slate-300 text-xs">
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span className="italic">{post && (post.content.length / 1000).toFixed(0)} mins read</span>
      </div>
      <div className="p-3 max-w-2xl mx-auto w-full post-content" dangerouslySetInnerHTML={{__html:post && post.content}}>

      </div>
    </main>
  );
}
