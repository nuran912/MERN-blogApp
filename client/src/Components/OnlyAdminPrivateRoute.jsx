//To make dashboard private

import { useSelector } from 'react-redux'
import { Outlet, Navigate } from 'react-router-dom'

export default function OnlyAdminPrivateRoute() {

    const {currentUser} = useSelector(state => state.user)

  return currentUser && currentUser.isAdmin ? <Outlet/> : <Navigate to='/sign-in'/>
  // create-post page is only accessible when an admin signed in. Otherwise redirect to sign in page.
  //when currentUser.isAdmin = true (is an admin),  return children(in this case CreatePost), which is done by <Outlet/>
}
