import React from "react";
import { Link } from "react-router-dom";
import {Button, Label, TextInput} from 'flowbite-react'

export default function Signup() {
  return (
    <div className="min-h-screen mt-20">
      <div className="flex gap-5 p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center">

        {/* left */}
        <div className="flex-1">
          <Link to="/" className="text-4xl font-bold dark:text-white">
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
              Marshal's
            </span>
            Blog
          </Link>
          <p className="mt-5 text-sm">
            This is a demo project. You can sign up with your email and password
            or with Google.
          </p>
        </div>
        
        {/* right */}
        <div className="flex-1">
          <form className="flex flex-col gap-4">
            <div>
              <Label value="Your username"/>
              <TextInput placeholder="username"  type="text" id="username"/>
            </div>
            <div>
              <Label value="Your email"/>
              <TextInput placeholder="email" type="email" id="email"/>
            </div>
            <div>
              <Label value="Password"/>
              <TextInput placeholder="password" type="password" id="password"/>
            </div>
            <Button gradientDuoTone='purpleToPink' type="submit">Sign Up</Button>
            <div className="flex gap-2 text-sm">
              <span>Have an account?</span>
              <Link to='/sign-in' className="text-blue-500 hover:underline">Sign in</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
