import { Navbar, TextInput, Button } from 'flowbite-react'
//Link redirects you to page but without redirecting it. In this case it'll redirect to the home page("/" is the path of Home)
import { Link, useLocation } from 'react-router-dom'
import { AiOutlineSearch } from 'react-icons/ai' //react-icons package was installed from the terminal using npm i react-icons
import { FaMoon } from 'react-icons/fa'

export default function Header() {

    const path = useLocation().pathname

  return (
    <Navbar className='border-b-2'>
        {/* to create the logo ⬇️ */}
        <Link to="/" className='self-center whitespace-nowrap text-sm 
            sm:text-xl font-semibold dark:text-white'>
            {/* self-center centers it inside itslef. whitespace-nowrap will prevent wrapping the name.  
                dark:text-white will change the text color to white when in dark mode*/}
            <span className='px-2 py-1 bg-gradient-to-r from-green-500 via-turqoise-500 to-blue-500 rounded-lg text-white'>
                {/* bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 sets background color to variate(gradient) from indigo->purple->pink 
                    rounded-lg will round the corners. text-white sets text color to whote in both light and dark modes*/}
                Nuran's</span>
            Blog
        </Link>
        <form>
            {/* to create search bar ⬇️ */}
            <TextInput 
                type="text" placeholder="Search" rightIcon={AiOutlineSearch}    
                className='hidden lg:inline'    /> {/* hidden lg:inline hides search bar excpet in large screens(doesn't show on small screens) 
                                                    rightIcon={AiOutlineSearch} sets the icon to the right of the search bar*/}         
        </form>
        {/* in a smaller screen it'll show a search button but it'll be hidden in large screens cuz of lg:hidden ⬇️*/}
        <Button className='w-12 h-10 lg:hidden' color='gray' pill>  {/* pill -> rounds the button */}
            <AiOutlineSearch/>
        </Button>
        <div className="flex gap-2 md:order-2">
            <Button className='w-12 h-10 hidden sm:inline' color='gray' pill>
                <FaMoon/>
            </Button>
            <Link to='/sign-in'>
                    <Button gradientDuoTone='greenToBlue' outline>Sign In</Button>  {/* outline: the button will only show the outline until you hover over it */}
            </Link>
            <Navbar.Toggle/>
        </div>
        <Navbar.Collapse>
                <Navbar.Link active={path === "/"} as={'div'}>
                    <Link to='/'> Home </Link>
                </Navbar.Link>
                <Navbar.Link active={path === "/about"} as={'div'}>
                    <Link to='/about'> About </Link>
                </Navbar.Link>
                <Navbar.Link active={path === "/projects"} as={'div'}>
                    <Link to='/projects'> Projects </Link>
                </Navbar.Link>
            </Navbar.Collapse>
    </Navbar>
  )
}
