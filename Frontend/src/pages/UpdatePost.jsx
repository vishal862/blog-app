import React, { useEffect, useState } from "react";
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
import {useNavigate,useParams} from 'react-router-dom'
import {useSelector} from 'react-redux'

export default function UpdatePost() {
  const navigate = useNavigate();
  const {postId} = useParams();
  const currentUser = useSelector((state)=>state.user)
  const [file, setfile] = useState(null);
  const [fileUploadProgress, setFileUploadProgress] = useState(null);
  const [fileUploadError, setFileUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const [publishSuccess, setPublishSuccess] = useState(null)
  console.log(formData);
 
  useEffect(() => {
    try {
        const fetchPost = async()=>{
          //how useParams will fetch the postId from the params?
          //basically useParams will match the route defin with the url from the params that is in address bar
          //which is :<Route path='/update-post/:postId' element={<UpdatePost/>}/> &&
          // http://localhost:5173/update-post/66490f3d43dc775195e433a4
          //so thats how the postId will be fetched

            const res = await fetch(`/api/post/getPost?postId=${postId}`)
            const data = await res.json();
            if(!res.ok){
                console.log(data.message);
                setPublishError(data.message)
                return;
            }
            if(res.ok){
                setPublishError(null)
                setFormData(data.posts[0])
            }
        }
        fetchPost();
    } catch (error) {
        console.log(error);
    }
  }, [postId])
  

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
      // console.log(error);
    }
  };

  const handleSubmit = async (e)=>{
    e.preventDefault()
    // console.log(postId);
    // console.log(formData._id);
    console.log(currentUser.currentUser);
    try {
      const res = await fetch(`/api/post/updatePost/${formData._id}/${currentUser.currentUser._id}`,{
        method : 'PUT',
        headers : {
          'Content-Type' : 'application/json'
        },
        body : JSON.stringify(formData)
      })
      const data = await res.json();
      if(data === false){
        setPublishError(data.message)
        return;
      }
      // console.log(res);
      console.log(data);
      if(!res.ok){
        setPublishError(data.message);
        return;
      }if(res.ok){
        setPublishError(null);
        setPublishSuccess('Post Created successfully')
        navigate(`/posts/${data.slug}`)
      }
    } catch (error) {
      setPublishError('Something went wrong')
    }
  }

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-4xl font-semibold text-center my-8">Update a Post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            className="flex-1"
            required
            type="text"
            defaultValue={formData.title}
            id="title"
            onChange={(e)=>setFormData({...formData,title : e.target.value})}
          />
          <Select value={formData.category} onChange={(e)=>setFormData({...formData,category : e.target.value})}>
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
        value={formData.content}
          onChange={
            (value)=>{
              setFormData({...formData,content : value})
            }
          }
          required
          theme="snow"
          placeholder="Write Something..."
          className="h-72 mb-14"
        />
        <Button
          type="submit"
          className="mb-6"
          gradientDuoTone={"purpleToPink"}
          disabled={fileUploadProgress}
        >
          Update
        </Button>
        {
          publishError && (
            <Alert className="mb-3" color={'failure'}>{publishError}</Alert>
          )
        }
        {
          publishSuccess && (
            <Alert className="mb-3" color={'success'}>{publishSuccess}</Alert>
          )
        }
      </form>
    </div>
  );
}
