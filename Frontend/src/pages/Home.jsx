import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import PostCard from '../components/PostCard'
export default function Home() {
  const [posts, setPosts] = useState([]);
console.log(posts);
  useEffect(() => {
    const fetchPosts = async ()=>{
      try {
        const res = await fetch('/api/post/getPost');
        const data = await res.json();
        if(res.ok){
          setPosts(data.posts);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchPosts();
  }, [])
  
  return (
    <div className="p-3">
      <div className="max-w-6xl mx-auto py-36  flex flex-col gap-5">
        <h1 className="lg:text-6xl font-bold text-3xl">Welcome to my Blog</h1>
        <p className="text-sm text-gray-500">
          Here you'll find a variety of articles and tutorials on topics such as
          web development, software engineering, and programming languages.
        </p>
        <Link to={'/search'}>
          <span className="text-teal-500 font-semibold hover:underline hover:cursor-pointer">
            View all posts
          </span>
        </Link>
      </div>
      <div className="dark:bg-slate-700 bg-amber-100 p-3">
        <CallToAction />
      </div>
      <div className="p-3 flex flex-col justify-center items-center gap-8 lg:pl-20 py-7">
        {
          posts && posts.length > 0 && (
            <div className="flex flex-col gap-6">
              <h1 className="text-center font-semibold text-2xl">Recent Posts</h1>
              <div className="flex flex-wrap gap-3">
                {posts && posts.map((post)=>(
                  <PostCard key={post._id} post={post}/>
                ))}
              </div>
              <Link to={'/search'} className="text-lg text-teal-500 hover:underline text-center">View all posts</Link>
            </div>
          )
        }       
      </div>
    </div>
  );
}
