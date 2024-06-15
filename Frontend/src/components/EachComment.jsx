import React, { useEffect, useState } from "react";
import moment from "moment";
import {FaThumbsUp} from 'react-icons/fa'
import { useSelector } from "react-redux";

export default function EachComment({ comment , onLike}) {
  const { currentUser } = useSelector((state) => state.user);
  const [user, setUser] = useState({});
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
        <p className="text-gray-500 text-md pb-2">{comment.content}</p>
        <div className="flex gap-2">
          <button type="button" className={`text-gray-400 hover:text-blue-500 ${currentUser && comment.likes.includes(currentUser._id) && '!text-blue-500'}`}>
            <FaThumbsUp className="text-sm" onClick={()=>onLike(comment._id)}/>
          </button>
          <p className="text-sm text-gray-500">{comment.numberOfLikes > 0 && comment.numberOfLikes + " " +(comment.numberOfLikes === 1 ? 'Like' : 'Likes')}</p>
        </div>
      </div>
    </div>
  );
}
