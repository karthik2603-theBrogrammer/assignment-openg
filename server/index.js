// Post Creation:
// Users can create a root post displayed on the homepage.
// Users can add replies to any post, creating nested comments under a post.
// Each post must have basic details, such as content and timestamp.

// Post Viewing:
// The homepage should display only root posts in a list format.
// When viewing a specific post, display all its nested comments in a clear, hierarchical format.

// API Requirements:
// Create Post API: To create a root post or reply to an existing post.
// Get Root Posts API: To retrieve a paginated list of root posts for the homepage.
// Get Post with Comments API: To retrieve a post and all its nested comments in a structured format.

// create-post
// get-posts
// get-posts-with-comments

// post table
// id, content, timestamp, parentPost (-1 in case of a root post, id of the parent post)

// when landing page - getPosts and getPostsWithComments


let posts = [
    {
        id: 1,
        content: "Hello",
        timestamp: Date.now(),
        childPosts: [
            {
                id: 10,
                content: "Hello",
                timestamp: Date.now(),
                childPosts: [],
                parentPostId: -1,
                likes: 0,
                dislike: 0
            }
        ],
        parentPostId: -1,
        likes: 0,
        dislike: 0
    },
    {
        id: 2,
        content: "Hello",
        timestamp: Date.now(),
        childPosts: [],
        parentPostId: -1,
        likes: 0,
        dislike: 0
    },
    {
        id: 3,
        content: "Hello",
        timestamp: Date.now(),
        childPosts: [],
        parentPostId: -1,
        likes: 0,
        dislike: 0
    },
    {
        id: 4,
        content: "Hello",
        timestamp: Date.now(),
        childPosts: [],
        parentPostId: -1,
        likes: 0,
        dislike: 0
    },
];
var latestPost = posts.length + 1
const getPostsWithComments = (postId) => {
  for (var i = 0; i < posts.length; i++) {
    if (posts[i].id == postId) {
      return posts[i];
    }
  }
  return null;
};

const createPostWithParentPostId = (parentPostId, childPost) => {
    for(var i = 0; i < posts.length; i++){
        if(posts[i].id == parentPostId){
            posts[i].childPosts.push(childPost)
            return true
        }
    }
    return false

}

const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json())

const likePost = (postId) => {
    for(i = 0; i < posts.length; i++){
        if(posts[i].id == postId){
            posts[i].likes += 1;
        }
    }
}

const dislikePost = (postId) => {
    for(i = 0; i < posts.length; i++){
        if(posts[i].id == postId){
            posts[i].likes -= 1;
        }
    }
}

app.get("/", (req, res) => {
    res.status(200).json({})
})

app.get("/get-posts", async (req, res) => {
  try {
    res.status(200).json({ posts });
  } catch (error) {
    console.log(error);
    res.status(500).send(`Error`);
  }
});

app.get("/get-post-with-comments/:postId", async (req, res) => {
  try {
    const postId = req.params["postId"];
    var responsePost = getPostsWithComments(postId);
    if (responsePost == null) {
      res.status(404).json({ response: "No Post with that Id Found!" });
    }
    res.status(200).json({ response: responsePost });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Error" });
  }
});

app.post("/create-post/", async (req, res) => {
    const {content} = req.body;
    console.log(content)
    const newPost = {
        id: latestPost,
        content: content,
        timestamp: Date.now(),
        childPosts: [],
        parentPostId: -1
    } 
    posts.push(newPost)
    latestPost += 1
    res.status(200).json({"res": newPost})
})

app.post("/create-post/:parentPostId", async (req, res) => {
    const {content} = req.body;
    const parentPostId = req.params['parentPostId']

    const newPost = {
        id: latestPost,
        content: content,
        timestamp: Date.now(),
        childPosts: [],
        parentPostId: parentPostId
    } 
    latestPost += 1

    var addChildPostRes = createPostWithParentPostId(parentPostId, newPost)
    res.status(200).json({"status": addChildPostRes})
})

app.post('/like-post/:postId', async (req, res) => {
    try {
        const postId = req.params['postId']
        likePost(postId)
        res.status(200).send({"res": "success"})
    } catch (error) {
        res.status(500).send({"res": "error"})
    }
})
app.post('/dislike-post/:postId', async (req, res) => {
    try {
        const postId = req.params['postId']
        dislikePost(postId)
        res.status(200).send()
    } catch (error) {
        res.status(500).send()
    }
})

app.listen(3000, () => {
  console.log("Listening to port 3000");
});
