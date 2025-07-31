const mongoose=require('mongoose')

const noteSchema=mongoose.Schema({
    subject: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true, 
    },
    file:{
        type:String
    },
    uploadedBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "user", 
        required: true 
    },  // Ye reference lega user model se
    userType: { 
        type: String,  
        enum: ["Faculty", "Student"],  // ✅ Faculty ya Student hi ho sakta hai
        required: true
    },
    createdAt: { 
        type: Date, 
        default: Date.now }
    })
module.exports=mongoose.model('note',noteSchema)