// an api to manage channels
const express = require('express');

const blogRouter = require('./data/blog-router.js')

const server = express();

server.use(express.json())

server.use('/api/posts', blogRouter)

server.listen(8000, () => console.log('\nAPI running \n'))