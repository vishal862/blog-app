import { Button, TextInput } from "flowbite-react";
import React from "react";
import { useSelector } from "react-redux";

export default function DashProfile() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className="w-full max-w-lg mx-auto p-3">
      <h1 className="text-center my-7 font-bold text-3xl">Profile</h1>
      <form className="flex flex-col gap-4">
        <div className="h-32 w-32 self-center shadow-md rounded-full overflow-hidden">
          <img
            src={currentUser.profilePicture}
            alt="profilePicture"
            className="rounded-full border-8 border-[lightgray] cursor-pointer object-cover w-full h-full"
          />
        </div>
        <TextInput
          type="text"
          id="username"
          defaultValue={currentUser.username}
        />
        <TextInput type="email" id="email" defaultValue={currentUser.email} />
        <TextInput type="password" id="password" placeholder="*********" />
        <Button gradientDuoTone="purpleToBlue" outline type="submit">
          Update
        </Button>
      </form>
      <div className="flex justify-between mt-9">
        <span className=" text-red-500">Delete Account</span>
        <span className=" text-red-500">Sign Out</span>
      </div>
    </div>
  );
}
