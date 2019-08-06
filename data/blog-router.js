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
      response.status(500).json({ message: 'error getting list of the users'})
    })
})

// get post by id
router.get("/:id", (request, response) => {
  const id = request.params.id;
  db.findById(id)
    .then(user => {
      if (user) {
        response.status(200).json(user)
      } else {
        response.status(404).json({ message: 'user not found' })
      }
    })
    .catch(error => {
      response.status(500).json({ message: 'error fetching user'})
    })
});

// create a new post
router.post("/", (request, response) => {
  const { name, bio } = request.body;

  if (!name || !bio) {
    response.status(400).send({
      errorMessage: "Please provide name and bio for the user."
    });
  } else {
    db.insert(request.body)
      .then(user => {
        response.status(201).json(user)
      })
      .catch(error => {
        response.status(500).json({ message: 'error creating new user'})
      })
  }
});

// modify a post by id
router.put("/:id", (request, response) => {
  const { name, bio } = request.body;
  const id = request.params.id;

  if (!name || !bio) {
    response.status(400).send({
      errorMessage: "Please provide name and bio for the user."
    });
  } else {
    db.update(id, request.body)
      .then(user => {
        if (user) {
          response.status(200).json(user)
        } else {
          response.status(404).json({ message: 'user not found' })
        } 
      })
      .catch(error => {
        response.status(500).json({ message: 'error creating new user'})
      })
  }
});

// delete a post by id
router.delete("/:id", async (request, response) => {
  const id = request.params.id;

  db.remove(id)
    .then(user => {
      if (user) {
        response.status(200).json(user)
      } else {
        response.status(404).json({ message: 'user not found' })
      } 
    })
    .catch(error => {
      response.status(500).json({ message: 'error deleting the user'})
    })
});

////// COMMENTS SECTION


// export default router
module.exports = router;