//type rfc and press enter to create an initial react functional component

import { BrowserRouter, Routes, Route }  from 'react-router-dom'
import Home from './Pages/Home'
import About from './Pages/About'
import SignIn from './Pages/SignIn'
import SignUp from './Pages/SignUp'
import Projects from './Pages/Projects'
import Dashboard from './Pages/Dashboard'
import Header from './Components/Header'
import FooterComp from './Components/Footer'
import PrivateRoute from './Components/PrivateRoute'
import OnlyAdminPrivateRoute from './Components/OnlyAdminPrivateRoute'
import CreatePost from './Pages/CreatePost'
import UpdatePost from './Pages/UpdatePost'

export default function App() {
  return (
    <BrowserRouter>
      <Header/> {/* this is the position for the header, so that it will appear in all of the following pages */}
      <Routes>
        {/* all the pages within the website are implemented below */}
        <Route path="/" element={<Home/>} />
        <Route path="/about" element={<About/>} /> 
        <Route path="/sign-in" element={<SignIn/>} />
        <Route path="/sign-up" element={<SignUp/>} />
        <Route path="/projects" element={<Projects/>} />
        <Route element={<PrivateRoute/>}> {/*to make the dashboard private.    can only be accessed if signed in*/}
          <Route path="/dashboard" element={<Dashboard/>} />
        </Route>
        <Route element={<OnlyAdminPrivateRoute/>}>
          <Route path='/create-post' element={<CreatePost/>} />
          <Route path='/update-post/:postId' element={<UpdatePost/>} />
        </Route>
      </Routes>
      <FooterComp/>
    </BrowserRouter>
  )
}
