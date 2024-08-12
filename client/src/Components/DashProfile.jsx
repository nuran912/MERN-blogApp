import { Alert, Button, TextInput } from 'flowbite-react'
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';  //app is initialized and exported in firebase.js

//for the circuar progress bar for image upload
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function DashProfile() {

    const {currentUser} = useSelector(state => state.user)
    const [ imageFile, setImageFile ] = useState(null); //to save the image
    const [ imageFileUrl, setImageFileUrl ] = useState(null);   //to convert the image into a temporary image url
    const [ imageFileUploadProgress, setImageFileUploadProgress ] = useState(null);
    const [ imageFileUploadError , setImageFileUploadError ] = useState(null);
    const filePickerRef = useRef();

    const handleImageChange  = (e) => {
        const file = e.target.files[0]  //since we're only uploading one file, we want to select the first one(Hence [0])
        if(file){   //if image file exists
            setImageFile(file);
            setImageFileUrl(URL.createObjectURL(file)); //URL.createObjectURL(file) method creates a url for file
        }
    }

    useEffect( ()=> {
        if(imageFile){  //if imageFile exists, do:
            uploadImage();
        }
    }, [imageFile])
    /* How the firebase storage rules are set for when the user uploads images ⬇️
    service firebase.storage {
        match /b/{bucket}/o {
            match /{allPaths=**} {
            allow read;
            allow write: if 
            request.resource.size < 2 * 1024 * 1024 &&      ⬅️ image size should be less than 2MB
            request.resource.contentType.matches('image/.*')        ⬅️ file type should be image
            }
        }
    }
    */
    const uploadImage = async () => {
        setImageFileUploadError(null);
        const storage = getStorage(app);    //to acess the firebase storage of 'app'
        const fileName = new Date().getTime() + imageFile.name; //a user could upload several images with the same name, but we want to make it unique. so we add new Date().getTime() and then it will act as extra info making the filename unique as the date/time is always unique
        const storageRef = ref(storage, fileName);   //ref() is a method from 'firebase/storage' which takes the storage we created and the filename
        const uploadTask = uploadBytesResumable(storageRef, imageFile)  //uploadTask is used to upload our imageFile, we get info while it is uploading.
        uploadTask.on(
            'state_changed',    //track the changes when we are uploading
            (snapshot) => { //snapshot is the piece of info you get while uploading
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;   //gives progress of upload; percenatage of how much has been uploaded.
                setImageFileUploadProgress(progress.toFixed(0));    // .toFixed(0) is used to remove decimals
            },
            (error) => {
                setImageFileUploadError('could not upload error (File must be <2MB)');
                setImageFileUploadProgress(null);
                setImageFile(null);
                setImageFileUrl(null);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
                    setImageFileUrl(downloadURL);
                });
            }
        )
    }

    return (
    <div className='max-w-lg mx-auto p-3 w-full'>
        <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
        <form className='flex flex-col gap-4'>
            <input type="file" accept='image/*' onChange={handleImageChange} ref={filePickerRef} hidden/>  {/* to upload an image type file */}
            {/* when we click on this⬇️ div we want to call this⬆️ reference. So essentially when we click on the div, we'll be clicking on the input. */}
            <div className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full' onClick={()=>filePickerRef.current.click()}>
                {/* if imageFileUrl exists show that else show currentUser.profilePic ⬇️ */}
                { imageFileUploadProgress && (
                    <CircularProgressbar value={ imageFileUploadProgress || 0 } 
                        text={`${imageFileUploadProgress}%`}
                        strokeWidth={5} 
                        styles={{
                            root: {
                                width: '100%',
                                height: '100%',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                            },
                            path: {
                                stroke: `rgba(62,152,199, ${imageFileUploadProgress / 100})`,
                            }
                        }}/>
                )}
                <img src={imageFileUrl || currentUser.profilePicture} alt="user" className={`rounded-full w-full h-full  object-cover border-8 border-[lightgray] ${imageFileUploadProgress && imageFileUploadProgress<100 && 'opacity-60'}`}/>
            </div>
            {imageFileUploadError && (
                <Alert color='failure'>{imageFileUploadError}</Alert>
            )   }
            <TextInput type='text' id='username' placeholder='username' defaultValue={currentUser.username}/>
            <TextInput type='email' id='email' placeholder='email' defaultValue={currentUser.email}/>
            <TextInput type='password' id='password' placeholder='password'/>
            <Button type='submit' gradientDuoTone='greenToBlue' outline>Update</Button>
        </form>
        <div className='text-red-500 flex justify-between mt-5'>
            <span className='cursor-pointer'>Delete Account</span>
            <span className='cursor-pointer'>Sign Out</span>
        </div>
    </div>
  )
}
