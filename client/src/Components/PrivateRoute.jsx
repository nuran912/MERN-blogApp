//To make dashboard private

import { useSelector } from 'react-redux'
import { Outlet, Navigate } from 'react-router-dom'

export default function PrivateRoute() {

    const {currentUser} = useSelector(state => state.user)

  return currentUser ? <Outlet/> : <Navigate to='/sign-in'/>
  // Dashboard is only accessible when signed in. Otherwise redirect to sign in page.
  //when currentUser = true (signed in),  return children(in this case dashboard), which is done by <Outlet/>
}
