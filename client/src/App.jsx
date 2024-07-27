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
        <Route path="/dashboard" element={<Dashboard/>} />
      </Routes>
      <FooterComp/>
    </BrowserRouter>
  )
}
