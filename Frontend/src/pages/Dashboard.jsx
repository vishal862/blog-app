import {useLocation} from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import DashSidebar from '../components/DashSidebar';
import DashProfile from '../components/DashProfile';
import DashPosts from '../components/DashPosts';

export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState('');
   
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const getTab = urlParams.get('tab');
    if(getTab){
      setTab(getTab);
    }

  }, [location.search])
  
  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      <div className='md:w-56'>
        {/* sidebar */}
        <DashSidebar/>
      </div>
        {/* profile */}
        {tab === 'profile' && <DashProfile/>}
        {/* post */}
        {tab === 'post' && <DashPosts/>}
    </div>
  )
}
