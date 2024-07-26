import {Link} from 'react-router-dom';
import {Button, Label, TextInput} from 'flowbite-react';

export default function SignUp() {
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
          You can sign up with your email and passsword.
          Or with Google.
        </p>
        </div>
        {/* for the right side ⬇️*/}
        <div className='flex-1'>
          <form className='flex flex-col gap-4'>
            <div>
              <Label value='your username'/>
              <TextInput type='text' placeholder='Username' id='username' />
            </div>
            <div>
              <Label value='your email'/>
              <TextInput type='text' placeholder='name@company.com' id='email' />
            </div>
            <div>
              <Label value='your password'/>
              <TextInput type='text' placeholder='password' id='password' />
            </div>
            <Button gradientDuoTone='greenToBlue' type='submit'>Sign Up</Button>
          </form>
          <div className='flex gap-2 text-sm mt-5'>
            <span>Have and account?</span>
            <Link to='/sign-in' className='text-blue-500'>Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
