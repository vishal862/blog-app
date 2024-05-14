import React, { useState } from "react";
import {
  Alert,
  Button,
  FileInput,
  Label,
  Select,
  TextInput,
} from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function CreatePost() {
  const [file, setfile] = useState(null);
  const [fileUploadProgress, setFileUploadProgress] = useState(null);
  const [fileUploadError, setFileUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  console.log(formData);

  const handleUploadImage = async (e) => {
    try {
      if (!file) {
        setFileUploadError("Please Select a file");
        setFileUploadProgress(null);
        return;
      }
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + File.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setFileUploadProgress(progress.toFixed(0));
          //For example, if progress is 67.89, progress.toFixed(0) would return "68"
        },
        (error) => {
          setFileUploadError("Image upload failed");
          setFileUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            setFileUploadProgress(null);
            setFileUploadError(null);
            setFormData({ ...formData, image: downloadUrl });
          });
        }
      );
    } catch (error) {
      setFileUploadError("Image upload error!");
      setFileUploadProgress(null);
      console.log(error);
    }
  };

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
          <FileInput
            type="file"
            accept="images/*"
            onChange={(e) => setfile(e.target.files[0])}
          />
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            outline
            onClick={handleUploadImage}
            disabled={fileUploadProgress}
          >
            {fileUploadProgress ? (
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={fileUploadProgress}
                  text={`${fileUploadProgress || 0}%`}
                />
              </div>
            ) : (
              "Upload Image"
            )}
          </Button>
        </div>
        {fileUploadError && <Alert color={"failure"}>{fileUploadError}</Alert>}
        {formData.image && (
          <img src={formData.image} className="h-72 w-full object-cover" alt="image" />
        )}
        <ReactQuill
          required
          theme="snow"
          placeholder="Write Something..."
          className="h-72 mb-14"
        />
        <Button
          type="submit"
          className="mb-10"
          gradientDuoTone={"purpleToPink"}
        >
          Publish
        </Button>
      </form>
    </div>
  );
}
