import React from "react";
import { Footer } from "flowbite-react";
import { Link } from "react-router-dom";
import {Bs0Circle, BsFacebook, BsGithub, BsInstagram, BsTwitterX} from 'react-icons/bs'

export default function FooterCode() {
  return (
    <Footer container className="border border-t-8 border-teal-500">
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid w-full justify-between sm:flex md:grid-cols-1">
          <div className="mt-5">
            <Link
              to="/"
              className="self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white"
            >
              <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
                Marshal's
              </span>
              Blog
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6">
            <div>
              <Footer.Title
                title="About"
                target="_blank"
                rel="noopener noreferrer"
              />
              <Footer.LinkGroup col>
                <Footer.Link href="https://www.100jsprojects.com/">
                  100 jS Projects
                </Footer.Link>
                <Footer.Link href="#">Marshal's Blog</Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title
                title="follow us"
                target="_blank"
                rel="noopener noreferrer"
              />
              <Footer.LinkGroup col>
                <Footer.Link href="https://www.github.com/vishal862">
                  GitHub
                </Footer.Link>
                <Footer.Link href="https://www.linkedin.com/in/vishal-devkate-94131a28a/">
                  Linkedin
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title
                title="Legal"
                target="_blank"
                rel="noopener noreferrer"
              />
              <Footer.LinkGroup col>
                <Footer.Link href="#">
                  Privacy policy
                </Footer.Link>
                <Footer.Link href="#">
                  Terms &amp; Conditions
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider/>
        <div className="w-full sm:flex sm:justify-between sm:items-center">
          <Footer.Copyright href="#" by="Marshal's Blog" year={new Date().getFullYear()}/>
          <div className=" flex gap-8 mt-4 sm:mt-0 sm:justify-center">
            <Footer.Icon href="#" icon={BsFacebook}/>
            <Footer.Icon href="#" icon={BsInstagram}/>
            <Footer.Icon href="#" icon={BsGithub}/>
            <Footer.Icon href="#" icon={BsTwitterX}/>
          </div>
        </div>
      </div>
    </Footer>
  );
}
