import React from "react";
import { Button, FileInput, Label, Select, TextInput } from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function CreatePost() {
  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-4xl font-semibold text-center my-8">Create a Post</h1>
      <form className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            className="flex-1"
            required
            type="text"
            placeholder="Title"
            id="title"
          />
          <Select>
            <option value={"uncategorized"}>Select a Category</option>
            <option value={"javajcript"}>JavaScript</option>
            <option value={"reactjs"}>React.js</option>
            <option value={"nextjs"}>Next.js</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput type="file" accept="images/*" />
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            className="p-5"
          >
            Upload Image
          </Button>
        </div>
        <ReactQuill required theme="snow" placeholder="Write Something..." className="h-72 mb-14" />
        <Button type="submit" className="mb-10" gradientDuoTone={'purpleToPink'}>Publish</Button>
      </form>
    </div>
  );
}
