//type rfc and press enter to create an initial react functional component

import { BrowserRouter, Routes, Route }  from 'react-router-dom'
import Home from './Pages/Home'
import About from './Pages/About'
import SignIn from './Pages/SignIn'
import SignUp from './Pages/SignUp'
import Projects from './Pages/Projects'
import Dashboard from './Pages/Dashboard'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/about" element={<About/>} /> 
        <Route path="/sign-in" element={<SignIn/>} />
        <Route path="/sign-up" element={<SignUp/>} />        <Route path="/sign-up" element={<SignUp/>} />
        <Route path="/projects" element={<Projects/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
      </Routes>
    </BrowserRouter>
  )
}
