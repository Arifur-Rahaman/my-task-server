const asyncHandler = require('express-async-handler')
const User = require('../models/userModels')
const Todo = require('../models/todosModel')
const { NotBeforeError } = require('jsonwebtoken')

//@desc Create new todos
//@route Post /api/todos
//@access Private
const createTodo = asyncHandler(async(req, res)=>{
    const {todo, description} = req.body
    
    if(!todo || !description){
        res.status(400)
        throw new Error('Please add a todo and description')
    }

    //Get user using the id in jwt
    const user = await User.findById(req.user.id)

    if(!user){
        res.status(401)
        throw new Error('User not found')
    }
    const newTodo = await Todo.create({
        todo,
        description,
        user: req.user.id,
        status: 'new'
    })
    res.status(201).json(newTodo)
})


//@desc get user todos
//@route Get /api/todos
//@access Private
const getTodos = asyncHandler(async (req, res)=>{
    const user = await User.findById(req.user.id)

    if(!user){
        res.status(401)
        throw new Error('User not found')
    }

    const todos = await Todo.find({user: req.user.id})
    res.status(200).json(todos)
})

//@desc update user todo
//@route Put /api/todos/todoId
//@access Private
const updateTodo = asyncHandler(async(req, res)=>{
    const user = await User.findById(req.user.id)
    if(!user){
        res.status(401)
        throw new Error('User not found')
    }

    const todo = await Todo.findById(req.params.id)
    if(!todo){
        res.status(404)
        throw new Error('Todo not found')
    }

    if(todo.user.toString() !== req.user.id){
        res.status(401)
        throw new Error('Not authorized')
    }

    const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, req.body, {new: true})
    res.status(200).json(updatedTodo)
})

//@Desc update user
//@route Delete api/todos/todoId
//@access private

const deleteTodo = asyncHandler(async (req, res)=>{
    //Get user using the id in jwt
    const user = await User.findById(req.user.id)
    if(!user){
        res.status(401)
        throw new Error('User not found')
    }

    const todo = await Todo.findById(req.params.id)
    if(!todo){
        res.status(404)
        throw new Error('Ticket not found')
    }
    
    if(todo.user.toString() !== req.user.id){
        res.status(401)
        throw new Error('Not authorized')
    }
    const deletedTodo = await todo.remove()
    console.log(deletedTodo)
    res.status(200).json(deletedTodo)
})
module.exports = {
    createTodo,
    getTodos,
    updateTodo,
    deleteTodo,
}