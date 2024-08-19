import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase.js';
import { useEffect, useState } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux';

export default function UpdatePost() {

  const{ currentUser } = useSelector((state) => state.user)
  const [ file, setFile ] = useState(null);
  const [ imageUploadProgress, setImageUploadProgress ] = useState(null);
  const [ imageUploadError, setImageUploadError ] = useState(null);
  const [ FormData, setFormData ] = useState({});
  const [ publishError, setPublishError ] = useState(null);
  const navigate = useNavigate();
  const { postId } = useParams();

  //To get the post that we wanna edit.this post is the one in the url.
  useEffect( () => {
    try {
        const fetchPost = async () => {
            const res = await fetch(`/api/post/getposts?postId=${postId}`);
            const data = await res.json();    //  we convert the response into data with json
            if(!res.ok){
                console.log(data.message);
                setPublishError(data.message);
                return;
            }
            if(res.ok){
                setPublishError(null);
                setFormData(data.posts[0]); //we wanna get the first member of the array we get as a response
            }
        }
        fetchPost();    //call this function to create the request. need to use a function within useEffect for this cuz useEffect has issues related to async usage.
    } catch (error) {
        console.log(error.message);
    }
  }, [postId])

  const handleUploadImage = async () => {
    try{
      if(!file){
        setImageUploadError('Please select an image');
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);  
      const fileName = new Date().getTime() + '-' + file.name;  //to make fileName unique
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(  // to do the process of uploading
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));  //progress gives a decimal value. toFixed(0) gives a fixed value
        },
        (error) => {
          setImageUploadError('Image upload failed');
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData({...FormData, image: downloadURL});
          });
        }
      )

    } catch(error){
      setImageUploadError('Image upload failed');
      setImageUploadProgress(null);
      console.log(error);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{                                            //post id
      const res = await fetch(`/api/post/updatepost/${FormData._id}/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(FormData),
      });
      const data = await res.json();
      if(!res.ok){
        setPublishError(data.message);
        return;
      }
      if(res.ok){
        setPublishError(null);
        navigate(`/post/${data.slug}`); //if response is ok, navigate to post page
      }
    } catch (error) {
      setPublishError('Something went wrong');
    }
  }

  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-3 font-semibold'>Update Post</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
          <TextInput type='text' placeholder='Title' required id='title' className='flex-1' 
                value={FormData.title} onChange={(e) => setFormData({...FormData, title: e.target.value})} />
          <Select value={FormData.category} onChange={(e)=> setFormData({...FormData, category: e.target.value})}>
            <option value='uncategorized'>Select a category</option>
            <option value='javascript'>JavaScript</option>
            <option value='reactjs'>React.js</option>
            <option value='nextjs'>Next.js</option>
          </Select>
        </div>
        <div className='flex gap-4 items-center justify-between border-4 border-teal-600 border-dotted p-3'>
          <FileInput type='file' accept='image/*' onChange={ (e) => setFile(e.target.files[0]) }/>
          <Button type='button' gradientDuoTone='greenToBlue' size='sm' outline onClick={handleUploadImage} disabled={imageUploadProgress}>
            { imageUploadProgress ? 
                (<div className='w-16 h-16'>
                  <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress || 0}%`} />
                </div>)
                : ('Upload Image') }
          </Button>
        </div>
        { imageUploadError &&  (<Alert color='failure'>{imageUploadError}</Alert>) }
        { FormData.image && ( <img src={FormData.image} alt='upload' className='w-full h-72 object-cover'/>)}
        <ReactQuill value={FormData.content} theme='snow' placeholder='write something...' className='h-72 mb-12' required onChange={ (value)=> setFormData({...FormData, content: value})}/>
        <Button type='submit' gradientDuoTone='greenToBlue'>Update</Button>
        { publishError && <Alert color='failure' className='mt-5'>{publishError}</Alert>}
      </form>
    </div>
  )
}
