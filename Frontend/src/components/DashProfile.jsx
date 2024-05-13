import { Alert, Button, Modal, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRef } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteStart,
  deleteSuccess,
  deleteFailure
} from "../redux/users/userSlice";
import { AiOutlineExclamationCircle } from "react-icons/ai";


export default function DashProfile() {
  const dispatch = useDispatch();
  const filePickRef = useRef();
  const { currentUser } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [imageFileUPloadProgress, setImageFileUPloadProgress] = useState(null);
  const [imageFileUPloadError, setImageFileUPloadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [userUpdateSuccess, setUserUpdateSuccess] = useState(null);
  const [userUpdateError, setUserUpdateError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteUserFailure, setDeleteUserFailure] = useState(null)

  console.log(formData);

  const handleImages = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };
  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async (e) => {
    //why app is used
    // When you want to use Firebase storage, you need to access it through the initialized app instance.
    //This is why you pass app to functions like getStorage, which is a part of the Firebase Storage SDK.
    //By passing app, you're providing the necessary context for the function to work correctly
    // within the Firebase ecosystem.
    setImageFileUPloadError(null);
    const storage = getStorage(app);
    const filename = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, filename);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    //The .on() method provides real-time updates on the state of the upload process

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUPloadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUPloadError(
          "Could not upload Image,(Image size should be less than 3MB)"
        );
        setImageFileUPloadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setImageFileUrl(downloadUrl);
          setFormData({ ...formData, profilePicture: downloadUrl });
        });
      }
    );
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    setUserUpdateError(null);
    setUserUpdateSuccess(null);
    e.preventDefault();
    if (Object.keys(formData).length === 0) {
      setUserUpdateError("No changes made!");
      return;
    }
    if (imageFileUploading) {
      setUserUpdateError("Image file is uploading");
      return;
    }
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      //data contains this
      //       {success: false, statusCode: 400, message: "don't be oversmart bro, just use letters and numbers nothin else!"}
      // message
      // :
      // "don't be oversmart bro, just use letters and numbers nothin else!"
      // statusCode
      // :
      // 400
      // success
      // :
      // false

      // console.log(data);

      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUserUpdateError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUserUpdateSuccess("User Profile updated successfully");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUserUpdateError(error.message);
    }
  };

  const handleDelete = async () => {
    setShowModal(false)
   try {
    dispatch(deleteStart())
     const res = await fetch(`/api/user/delete/${currentUser._id}`, {
       method: "DELETE",
     });
     const data = await res.json();
     if(!res.ok){
      dispatch(deleteFailure(data.message))
      setDeleteUserFailure(data.message)
     }else{
      dispatch(deleteSuccess(data))
     }
   } catch (error) {
    dispatch(deleteFailure(error.message))
    setDeleteUserFailure(error.message)
   }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-3">
      <h1 className="text-center my-7 font-bold text-3xl">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          accept="images/*"
          onChange={handleImages}
          ref={filePickRef}
          hidden
        />
        <div className="relative h-32 w-32 self-center shadow-md rounded-full overflow-hidden">
          {imageFileUPloadProgress && (
            <CircularProgressbar
              value={imageFileUPloadProgress || 0}
              text={`${imageFileUPloadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62,152,199),${imageFileUPloadProgress / 100}`,
                },
              }}
            />
          )}
          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt="profilePicture"
            className={`rounded-full border-8 border-[lightgray] cursor-pointer object-cover w-full h-full ${
              imageFileUPloadProgress &&
              imageFileUPloadProgress < 100 &&
              "opacity-60"
            }`}
            onClick={() => filePickRef.current.click()}
          />
        </div>
        {imageFileUPloadError && (
          <Alert color="failure">{imageFileUPloadError}</Alert>
        )}
        <TextInput
          type="text"
          id="username"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <TextInput
          type="email"
          id="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="*********"
          onChange={handleChange}
        />
        <Button gradientDuoTone="purpleToBlue" outline type="submit">
          Update
        </Button>
      </form>
      <div className="flex justify-between mt-9">
        <button onClick={() => setShowModal(true)} className=" text-red-500">
          Delete Account
        </button>
        <button className=" text-red-500">Sign Out</button>
      </div>
      {userUpdateSuccess && (
        <Alert className="mt-5" color="success">
          {userUpdateSuccess}
        </Alert>
      )}
      {userUpdateError && (
        <Alert className="mt-5" color="failure">
          {userUpdateError}
        </Alert>
      )}
      {
        deleteUserFailure && (
          <Alert className="mt-5" color='failure'>{deleteUserFailure}</Alert>
        )
      }
      <Modal show={showModal} onClose={() => setShowModal(false)} size='md'>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <AiOutlineExclamationCircle className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-200 mb-4" />
            <h1 className="mb-5 text-lg text-gray-500 dark:text-gray-400">Are you sure you want to delete the account?</h1>
            <div className="flex justify-center gap-4">
              <Button onClick={handleDelete} color='failure'>Yes, I'm sure</Button>
              <Button onClick={()=>setShowModal(false)} color='gray'>No, Cancel</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
