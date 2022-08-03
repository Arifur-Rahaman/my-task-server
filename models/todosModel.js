const mongoose = require('mongoose')

const todoSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        todo:{
            type: String,
            required: [true, 'Please select a product']
        },
        description:{
            type: String,
            required: [true, 'Please enter a description of the todo']
        },
        status:{
            type: String,
            enum: ['new', 'pending', 'completed', 'cancelled'],
            default: 'new',
        },
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Todo', todoSchema)