import { Button } from "flowbite-react";
import React from "react";

export default function CallToAction() {
  return (
    <div className=" p-3 border border-teal-500 flex flex-col sm:flex-row justify-center items-center w-full rounded-tl-3xl rounded-br-3xl gap-3">
      <div className="p-3 flex-1">
        {/* content  */}
        <h1 className="sm:text-3xl sm:font-lg text-2xl my-2 text-center">
          Want to learn HTML, CSS and JavaScript by building fun and engaging
          projects?
        </h1>
        <p className="text-slate-600 my-3 text-center">
          Check our 100 js prjects website and start building your own projects
        </p>
        <Button
          gradientDuoTone={"purpleToPink"}
          className="w-full my-5 border rounded-tr-xl rounded-tl-xl rounded-br-xl rounded-bl-none"
        >
          <a href="https://www.100jsprojects.com" target="_blank" rel="noopener noreferrer">
            100 JS Projects Website
          </a>
          {/* When you use target="_blank" to open a link in a new tab, the newly opened page can access the window.opener property. This property allows the new page to control the original page that opened it, which can be exploited by malicious websites. */}
          {/* The rel="noreferrer" attribute ensures that the referrer information (the URL of the original page) is not sent to the new page. */}
        </Button>
      </div>
      <div className="p-3 flex-1">
        {/* image */}
        <img
          src="https://media.geeksforgeeks.org/wp-content/cdn-uploads/20221114110410/Top-10-JavaScript-Project-Ideas-For-Beginners-2023.png"
          alt="image"
        />
      </div>
    </div>
  );
}
