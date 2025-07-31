const mongoose=require('mongoose')

const userSchema=mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    branch: { 
        type: String, 
        required: true 
    },
    section: { 
        type: String, 
        required: true 
    },
    role: { type: String, 
        enum: ["Student", "Faculty"], 
        },
})
module.exports=mongoose.model('user',userSchema)