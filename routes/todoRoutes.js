const express = require('express')
const {protect} = require('../middleware/authMiddleware')
const {createTodo, getTodos, updateTodo, deleteTodo} = require('../controllers/todoControllers') 
const router = express.Router()


router.route('/')
    .post(protect, createTodo)
    .get(protect, getTodos)

router.route('/:id')
    .put(protect, updateTodo)
    .delete(protect, deleteTodo)

module.exports = router