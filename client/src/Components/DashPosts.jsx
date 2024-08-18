// npm install --save-dev tailwind-scrollbar      <--in the client folder

import { Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { Link } from "react-router-dom";

export default function DashPosts() {

  const {currentUser} = useSelector((state) =>state.user);
  const [ userPosts, setUserPosts ] = useState([]);
  const [ showMore, setShowMore ] = useState(true);
  console.log(userPosts);

  //to get the posts uploaded by the admin that is signed in
  useEffect( () => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`)  //here we add the query userId cuz that's wha we wanna search. 
        const data = await res.json()
        if(res.ok){
          setUserPosts(data.posts);
          if( data.posts.length < 9 ){  //if the no. of posts is < 9 , no need to show 'show more'
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    if(currentUser.isAdmin){
      fetchPosts(); //Since async can't directly be used for useEffect(), we define a createPosts() function and call it inside the useEffect()
    }
  }, [currentUser._id]);

  //if user clicks show more, show 9 more posts
  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    try {
      const res = await fetch (`/api/post/getposts?userId=${currentUser._id}&startIndex${startIndex}`); //get the posts after a certain
      const data = await res.json();
      if(res.ok){
        setUserPosts( (prev) => [...prev, ...data.posts] );
        if(data.posts.length<9){
          setShowMore(false);
        }
      }
    } catch (error) {
        console.log(error.message)
    }
  }

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      { currentUser.isAdmin && userPosts.length > 0 ? (
        <>
        <Table hoverable className="shadow-md" >
          <Table.Head>
            <Table.HeadCell>Date Updated</Table.HeadCell>
            <Table.HeadCell>Post Image</Table.HeadCell>
            <Table.HeadCell>Title</Table.HeadCell>
            <Table.HeadCell>Category</Table.HeadCell>
            <Table.HeadCell>Delete</Table.HeadCell>
            <Table.HeadCell><span>Edit</span></Table.HeadCell>
          </Table.Head>
          { userPosts.map((post) => ( //for every user post show the follwoing
            <Table.Body key={post._id} className="divide-y">  {/* key={post._id}  <-- helps identify the which post is considered in each iteration */}
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell>{new Date(post.updatedAt).toLocaleDateString()}</Table.Cell>
                <Table.Cell>
                  <Link to={`/post/${post.slug}`}>
                    <img src={post.image} alt={post.title} className="w-20 h-10 object-cover bg-gray-500"/>
                  </Link>
                </Table.Cell>
                <Table.Cell>
                  <Link className="font-medium text-gray-900 dark:text-white" to={`/post/${post.slug}`}>{post.title}</Link>
                </Table.Cell>
                <Table.Cell>{post.category}</Table.Cell>
                <Table.Cell>
                  <span className="font-medium text-red-500 hover:underline cursor-pointer">Delete</span>
                </Table.Cell>
                <Table.Cell>
                  <Link className="text-teal-500" to={`/update-post/${post._id}`}>
                    <span className="hover:underline">Edit</span>
                  </Link>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          ))}
        </Table>
        { showMore && (
          <button onClick={handleShowMore} className='w-full text-teal-500 self-center text-sm py-7'>Show More</button>
        )} 
        </>
      ) : 
      (<p>You have no posts yet</p>)}
    </div>
  )
}
