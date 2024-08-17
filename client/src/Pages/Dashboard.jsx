import { useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import DashSidebar from '../Components/DashSidebar';
import DashProfile from '../Components/DashProfile';
import DashPosts from '../Components/DashPosts';

export default function Dashboard() {

  const location = useLocation(); //initialize useLocation
  const [tab, setTab] = useState('');
  
  //evach time we come to this page, we get irs tab⬇️
  useEffect( ()=> {
    const urlParams = new URLSearchParams(location.search); //URLSearchParams returns parameters
    const tabFromUrl = urlParams.get('tab');
    if(tabFromUrl){ //if the tab from the url is not null, do⬇️
      setTab(tabFromUrl)
    }
  }, [location.search]) //this useEffect renders every time location.search updates

  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      <div className='md:w-56'>
        {/* Sidebar */}
        <DashSidebar/>
      </div>
      {/* profile... */}
      {tab === 'profile' && <DashProfile/>} {/* DashProfile is only visible when we're in the profile tab */}
      { tab === 'posts' && <DashPosts/>} {/* DashPosts is only visible when we're in the posts tab */}
    </div>
  )
}
