import { useState, useEffect } from 'react'
import axios from "axios"
import './App.css'

function App() {
  const [posts, setPosts] = useState(null)
  const [newPostContent, setNewPostContent] = useState(""); // State for input field

  const fetchPosts = () => {
    axios.get("https://assignment-openg-backend.vercel.app/get-posts").then((res) => {
      console.log(res)
      const sortedPosts = res.data['posts']
        .sort((a, b) => b.timestamp - a.timestamp)
        .map(post => {
          // Sort child posts by timestamp if they exist
          if (post.childPosts && post.childPosts.length > 0) {
            post.childPosts = post.childPosts.sort((a, b) => b.timestamp - a.timestamp);
          }
          return post;
        });
      setPosts(sortedPosts)
      console.log(res.data)
    }).catch((e) => {
      console.log(e)
    })
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  // const createPost = (e) => {
  //   e.preventDefault();
  //   axios.post("https://assignment-openg-backend.vercel.app/create-post/", { content: newPostContent })
  //     .then((res) => {
  //       setPosts((prevPosts) => [res.data.res, ...prevPosts]); // Add new post to the top
  //       setNewPostContent(""); // Clear input field
  //     })
  //     .catch((e) => {
  //       console.error(e);
  //     });
  // };

  const handlePost = (key) => {
    e.preventDefault();
    axios.post(`https://assignment-openg-backend.vercel.app/create-post/${key}`, { content: newPostContent })
      .then((res) => {
        const fet = fetchPosts()
        setPosts(fet)
        setNewPostContent(""); // Clear input field
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const likePost = (key) => {
    axios.post(`https://assignment-openg-backend.vercel.app/like-post/${key}`).then(() => {
      alert("Post", key, "liked")
      fetchPosts()
    })
  }

  const dislikePost = (key) => {
    axios.post(`https://assignment-openg-backend.vercel.app/dislike-post/${key}`).then(() => {
      alert("Post", key, "liked")
      fetchPosts()
    })
  }

  return (
    <>
      <div className=''>
        {
          posts == null ? (
            <p>Fetching Post Data...</p>
          ) : (
            <div>
              {
                posts?.map((post, key) => (
                  <div key={key} className='p-3 m-3'>
                    <div className="bg-blue-400 rounded-md w-fit p-3">
                      <p>{post.id} {post.content}</p>
                      <p>{new Date(post.timestamp).toLocaleTimeString()}</p>
                      <p className='' onClick={() => likePost(post.id)}>Like: {post.likes}</p>
                      <p className='' onClick={() => dislikePost(post.id)}>Dislike</p>
                      {/* <form onSubmit={createPost} className="mb-2"> */}
                        <input
                          type="text"
                          value={newPostContent}
                          onChange={(e) => setNewPostContent(e.target.value)}
                          placeholder="Enter new post content"
                          className="p-1 border rounded text-xs"
                          required
                        />
                        <button type="submit" className="p-1 ml-1 text-xs bg-blue-500 text-white rounded" >
                          Submit
                        </button>
                      {/* </form> */}
                    </div>
                    <div>
                      {
                        post?.childPosts.length > 0 && (
                          post?.childPosts?.map((childPost, key) => (
                            <div className="ml-7 bg-red-500 w-fit p-3 rounded-md m-3" key={key}>
                              <p>{childPost.id} {childPost.content}</p>
                              <p>{new Date(childPost.timestamp).toLocaleTimeString()}</p>
                            </div>
                          ))
                        )
                      }
                    </div>
                  </div>
                ))
              }
            </div>
          )
        }
      </div>
    </>
  )
}

export default App
