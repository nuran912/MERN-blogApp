import { useSelector } from 'react-redux';  //useSelector is used to get access to our redux toolkit global state

export default function ThemeProvider({children}) {

    const {theme} = useSelector(state => state.theme)
    /*⬆️
    It uses useSelector to access the Redux store.
    The selector function extracts the theme property from the state.
    The extracted theme value is assigned to the constant variable theme using object destructuring.
    */

  return (
    <div className={theme}>
        <div className='bg-white text-gray-700 dark:text-gray-200 dark:bg-[rgb(16,23,42)] min-h-screen'>
            {children}
        </div>
    </div>
  )
}

/*
In the main.jsx file, App component is the children of ThemeProvider component.
so whatever theme we set here will be set throughout App.
*/
