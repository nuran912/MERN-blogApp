import {Link, useNavigate} from 'react-router-dom';
import {Button, Label, TextInput, Alert, Spinner} from 'flowbite-react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';  //useDispatch is used to dispatch the logic we get from userSlice.js
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice'

export default function SignIn() {

  const navigate = useNavigate();
  const [formData,setFormData] = useState({});
  //const [errorMessage, setErrorMessage] = useState(null);
  //const [loading, setLoading] = useState(false);  //for when the page is loading
  const { loading, error: errorMessage } = useSelector(state => state.user);//useSelector is used to get the 'userSlice' information 
  const dispatch = useDispatch(); //dispatch will be used for the logic imported from userSlice.js

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value.trim()})  //if trim() used whitespaces won't be recorded 
  }
  //since we're submitting it to the database, it takes time so we need to use await so we maje this function asynchronous⬇️
  const handleSubmit = async (e) => {
    e.preventDefault(); //to prevent the page from refreshing upon submission by default
    //to prompt an error if a some part of the form is not filled
    if(!formData.email || !formData.password){
      //return setErrorMessage(('please fill out all fields'))
      return dispatch(signInFailure('please fill out all fields'));
    }
    try{
      /*
      setLoading(true); //loading phase is set to true when the try starts
      setErrorMessage(null);  //to cleanup the error message if there's one from the previous instance
      ⬆️instead of these we can dispatch the signInStarts logic we defined in userSlice.js
      */
      dispatch(signInStart());  //instead of⬆️
      //this will be used to submit our form⬇️
      const res = await fetch('/api/auth/signin', {  //fetch method is used to fetch data
        method: 'POST',
        headers: {'content-Type': 'application/json'},
        body: JSON.stringify(formData), //stringify cuz we can't directly send json
      });
      const data = await res.json();
      //if sign in unsuccessful⬇️ 
      if(data.success === false){
        //setLoading(false);
        //return setErrorMessage(data.message); instead of both this and above one we can use ⬇️ 
        dispatch(signInFailure(data.message));
      }
      if(res.ok){
        dispatch(signInSuccess(data))
        navigate('/');
      }
    }catch(error){
      //for example, when the user's internet is slow⬇️
      //setErrorMessage(error.message);
      //setLoading(false); //if there's an error, loading phase will end
      dispatch(signInFailure(error.message));
    }
  }
  return (
    <div className='min-h-screen mt-20'>
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* for the left side ⬇️*/}
        <div className='flex-1'>
        <Link to="/" className=' text-4xl font-bold dark:text-white'>
            <span className='px-2 py-1 bg-gradient-to-r from-green-500 via-turqoise-500 to-blue-500 rounded-lg text-white'>
                Nuran's</span>
            Blog
        </Link>
        <p className="text-sm mt-5">
          This is a demo project. 
          You can sign in with your email and passsword.
          Or with Google.
        </p>
        </div>
        {/* for the right side ⬇️*/}
        <div className='flex-1'>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div>
              <Label value='your email'/>
              <TextInput type='emailonChange={handleChange' placeholder='name@company.com' id='email' onChange={handleChange}/>
            </div>
            <div>
              <Label value='your password'/>
              <TextInput type='password' placeholder='********' id='password' onChange={handleChange}/>
            </div>
            {/* shows a loading effect after clicking. During the loading mode(loading=true), button will be disabled.*/}
            <Button gradientDuoTone='greenToBlue' type='submit' disabled={loading}>
              { //if loading, show spinner and 'Loading...' , otherwise show 'Sign Up'
                loading ? (
                <>
                <Spinner size='sm'/>
                <span className='pl-3'>Loading...</span>
                </>
              ) : 'Sign In'
              }
            </Button>
          </form>
          <div className='flex gap-2 text-sm mt-5'>
            <span>Don't have an account?</span>
            <Link to='/sign-up' className='text-blue-500'>Sign Up</Link>
          </div>
          { //if the error message isn't null, use the alert message. 
            errorMessage && (
              <Alert className='mt-5' color='failure'>
                 {errorMessage}
              </Alert>
            )
          }
        </div>
      </div>
    </div>
  )
}