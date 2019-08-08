const router = require('express').Router();

const db = require('./db.js')

////// POSTS SECTION
// get all posts
router.get('/', (request, response) => {
  db.find()
    .then(posts => {
      response.status(200).json(posts)
    })
    .catch(error => {
      response.status(500).json({ message: 'Error getting list of the posts'})
    })
})

// get post by id
router.get("/:id", (request, response) => {
  const id = request.params.id;
  db.findById(id)
    .then(post => {
      if (post) {
        response.status(200).json(post)
      } else {
        response.status(404).json({ message: 'post not found' })
      }
    })
    .catch(error => {
      console.log('get post by id catch error', error)
      response.status(500).json({ message: 'error fetching post'})
    })
});

// create a new post
router.post("/", (request, response) => {
  const { title, contents } = request.body;

  if (!title || !contents) {
    response.status(400).send({
      errorMessage: "Please provide title and contents for the user."
    });
  } else {
    db.insert(request.body)
      .then(post => {
        response.status(201).json(post)
      })
      .catch(error => {
        response.status(500).json({ message: 'error creating new post'})
      })
  }
});

// modify a post by id
router.put("/:id", (request, response) => {
  const { title, contents } = request.body;
  const id = request.params.id;

  if (!title || !contents) {
    response.status(400).send({
      errorMessage: "Please provide title and contents for the user."
    });
  } else {
    db.update(id, request.body)
      .then(post => {
        if (post) {
          response.status(200).json(post)
        } else {
          response.status(404).json({ message: 'post not found' })
        } 
      })
      .catch(error => {
        response.status(500).json({ message: 'error creating new post'})
      })
  }
});

// delete a post by id
router.delete("/:id", async (request, response) => {
  const id = request.params.id;
  db.remove(id)
    .then(post => {
      if (post) {
        response.status(200).json(post)
      } else {
        response.status(404).json({ message: 'post not found' })
      } 
    })
    .catch(error => {
      response.status(500).json({ message: 'error deleting the post'})
    })
});

////// COMMENTS SECTION
// get a post's comments
router.get("/:id/comments", (request, response) => {
  const id = request.params.id;
  db.findPostComments(id)
    .then(post => {
      if (post) {
        response.status(200).json(post)
      } else {
        response.status(404).json({ message: 'The post with the specified ID does not exist.' })
      }
    })
    .catch(error => {
      console.log('get post by id catch error', error)
      response.status(500).json({ message: 'error fetching post'})
    })
});

// create a comment on a post
router.post('/:id/comments', (req,res)=>{

  console.log("Data recieved from Body", req.body);
  const {text, post_id} = req.body;

  // No name or bio in Body? That returns an error
  !text || !post_id ? res.status(400).json({errorMessage: "Please provide text and post ID for the comment."}) :

  db.insertComment(req.body)
  .then(id => {
      console.log("Success, Here is comment ID", id)
      // res.status(201).json({ message: 'A new comment has been created '})
      const passedID = id.id
      console.log('heres a passedID', passedID)
      db.findCommentById(passedID)
          .then(response => {
              res.status(200).json(response)
              console.log('this hurr is the response', response)
              console.log('right hurr be the id', id)
          })
          .catch(err => {
              res.status(500).json({ error: "There was an error while saving the comment to the database" })
          })
  })
  .catch( err => {
    console.log(err)
    res.status(404).json({ message: "we done goofed insertign a Comment" })
  })
})
// router.post("/:id/comments", (request, response) => {
//   const { text } = request.body;
//   const id = request.params.id

//   if (!text) {
//     response.status(400).send({
//       errorMessage: "Please provide text content for this comment."
//     });
//   } else {
//     db.findById(id)
//     .then(post => {
//       console.log(id)
//       console.log(request.body)
//       console.log(post)
//      db.insertComment(request.body)
//       .then(comment => {
//         response.status(201).json(comment)
//       })
//       .catch(error => {
//         response.status(500).json({ message: 'error creating new comment'})
//       })
//     })
//     .catch(error => {
//       response.status(404).json({ message: 'The post with the specified ID does not exist.' })
//     })
//   }
// });


// export default router
module.exports = router;