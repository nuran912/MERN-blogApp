import { Alert, Button, Modal, TextInput } from 'flowbite-react'
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';  //app is initialized and exported in firebase.js

//for the circuar progress bar for image upload
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

//For update functionality
import { updateStart, updateSuccess, updateFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure, signoutSuccess } from '../redux/user/userSlice'
import { useDispatch } from 'react-redux';

//For delete user functionality
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function DashProfile() {

    const {currentUser, error} = useSelector(state => state.user)
    const [ imageFile, setImageFile ] = useState(null); //to save the image
    const [ imageFileUrl, setImageFileUrl ] = useState(null);   //to convert the image into a temporary image url
    const [ imageFileUploadProgress, setImageFileUploadProgress ] = useState(null);
    const [ imageFileUploadError , setImageFileUploadError ] = useState(null);
    const [ imageFileUploading , setImageFileUploading ] = useState(false); 
    const [ updateUserSuccess , setUpdateUserSuccess ] = useState(null);
    const [ updateUserError, setUpdateUserError ] = useState(null);
    const filePickerRef = useRef();
    const [ formData, setFormData ] = useState({});
    const dispatch = useDispatch();
    const [ showModal, setShowModal ] = useState(false);

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
        setImageFileUploading(true);    //set to true wen image upload process starts
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
                setImageFileUploading(false);   //set to false when there's an error
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
                    setImageFileUrl(downloadURL);
                    setFormData({ ...formData, profilePicture: downloadURL });
                    setImageFileUploading(false);   //set to false when image upload is completely successful
                });
            }
        )
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); //to stop the deault paage refresh caused by submitting
        setUpdateUserError(null);
        setUpdateUserSuccess(null);
        if( Object.keys(formData).length === 0 ) {  //to check if the formData object is empty. (if submit is done without changing any data.)
            setUpdateUserError("No changes made");
            return;
        }
        if(imageFileUploading){ //if the image is still uploading (true) 
            setUpdateUserError("Please wait for image to uplaod");
            return;             
        }
        //process won't start until image uploading is complete
        try {
            dispatch(updateStart());
            //the data for the response(res) will be fetched from this dynamic url cuz we wanna send the info for the id of the user we wanna update
            const res = await fetch(`api/user/update/${currentUser._id}`, { //this is the response for the api route
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json(); 
            if(!res.ok){    //there is an error
                dispatch(updateFailure(data.message));
                setUpdateUserError(data.message)
            }else{
                dispatch(updateSuccess(data)); //if the update is successful we pass the data
                setUpdateUserSuccess("User profile updated successfully");
            }
        } catch (error) {
            dispatch(updateFailure(error.message));
            setUpdateUserError(error.message);
        }
    }
    const handleDeleteUser = async () => {
        setShowModal(false);
        try {
            dispatch(deleteUserStart());
            const res = await fetch(`/api/user/delete/${currentUser._id}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if(!res.ok){
                dispatch(deleteUserFailure(data.message));
            }else{
                dispatch(deleteUserSuccess(data)); //if the delete is successful we pass the data
            }
        } catch (error) {
            dispatch(deleteUserFailure(error.message));
        }
    }

    const handleSignout = async () => {
        try {
            const res = await fetch('/api/user/signout', {
                method: 'POST',
            });
            const data = res.json();
            if(!res.ok){
                console.log(data.message);
            } else {
                dispatch(signoutSuccess());
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
    <div className='max-w-lg mx-auto p-3 w-full'>
        <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
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
            <TextInput type='text' id='username' placeholder='username' defaultValue={currentUser.username} onChange={handleChange}/>
            <TextInput type='email' id='email' placeholder='email' defaultValue={currentUser.email} onChange={handleChange}/>
            <TextInput type='password' id='password' placeholder='password' onChange={handleChange}/>
            <Button type='submit' gradientDuoTone='greenToBlue' outline>Update</Button>
        </form>
        <div className='text-red-500 flex justify-between mt-5'>
            <span onClick={()=>setShowModal(true)} className='cursor-pointer'>Delete Account</span>
            <span onClick={ handleSignout } className='cursor-pointer'>Sign Out</span>
        </div>
        { updateUserSuccess  &&  (
            <Alert color='success' className='mt-5'>{updateUserSuccess}</Alert>
        )}
        { updateUserError && (
            <Alert color='failure' className='mt-5'>{updateUserError}</Alert>
        )}
        { error && (
            <Alert color='failure' className='mt-5'>{updateUserError}</Alert>
        )}
        <Modal show={showModal} onClose={ ()=>setShowModal(false) } popup size='md'>
            <Modal.Header />
            <Modal.Body>
                <div className='text-center'>
                    <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 darl:text-gray-200 mb-4 mx-auto'/>
                    <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete your account?</h3>
                    <div className='flex justify-center gap-4'>
                        <Button color='failure' onClick={handleDeleteUser}>Yes, I'm sure</Button>
                        <Button color='gray'onClick={ ()=> setShowModal(false) }>No, Cancel</Button>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    </div>
  )
}

//test