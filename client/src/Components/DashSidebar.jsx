import { Sidebar } from 'flowbite-react'
import { useEffect, useState } from 'react';
import { HiUser, HiArrowSmRight, HiDocumentText } from 'react-icons/hi'
import { Link, useLocation } from 'react-router-dom';
import { signoutSuccess } from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux'

export default function DashSidebar() {

    const location = useLocation(); //initialize useLocation
    const [tab, setTab] = useState('');
    const dispatch = useDispatch();
    const { currentUser } = useSelector(state => state.user);
    
    //evach time we come to this page, we get irs tab⬇️
    useEffect( ()=> {
      const urlParams = new URLSearchParams(location.search); //URLSearchParams returns parameters
      const tabFromUrl = urlParams.get('tab');
      if(tabFromUrl){ //if the tab from the url is not null, do⬇️
        setTab(tabFromUrl)
      }
    }, [location.search]) //this useEffect renders every time location.search updates  

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
    <Sidebar className='w-full md:w-56'>
        <Sidebar.Items>
            <Sidebar.ItemGroup className='flex flex-col gap-1'>
                <Link to='/dashboard?tab=profile'>  {/* when profile is clicked, navigate to profile tab */}
                {/* active only when in the profile tab ⬇️ */}
                <Sidebar.Item active={tab === 'profile'} icon={HiUser} label={currentUser.isAdmin? "Admin":"User"} labelColor='dark' as='div'>
                    Profile
                </Sidebar.Item>
                </Link>
                { currentUser.isAdmin && 
                    <Link to='/dashboard?tab=posts'>
                        <Sidebar.Item active={tab === 'posts'} icon={HiDocumentText} as='div'>Posts</Sidebar.Item>
                    </Link>  
                }
                <Sidebar.Item onClick={handleSignout} icon={HiArrowSmRight} className='cursor-pointer'>
                    Sign Out
                </Sidebar.Item>
            </Sidebar.ItemGroup>
        </Sidebar.Items>
    </Sidebar>
  )
}
