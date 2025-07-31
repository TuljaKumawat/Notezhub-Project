const noteTable = require("../models/note");
const userTable = require("../models/user");


exports.noteForm=(req,res)=>{
    let mess=''
    const username=req.session.name
    const userbranch=req.session.branch
    const usersection=req.session.section
    console.log(req.session)
    res.render('user/addNotes.ejs',{mess,username,userbranch,usersection})
}
exports.addNote=async(req,res)=>{
    let mess=''
    
    const username=req.session.name
    const userbranch=req.session.branch
    const usersection=req.session.section
    const uploadedBy = req.session.userId;
    const{subject,description}=req.body
    try{
    if(!subject || !description || !req.file){
        throw new Error("All fields are Requirred. Please Fill!!")
    }
    const User = await userTable.findById(uploadedBy);
        if (!User) {
            throw new Error("User not found!");
        }
    const filename=req.file.filename
    const newNote=new noteTable({subject:subject,description:description,file:filename,uploadedBy: User._id,userType: User.role,userId: User._id  })
    
    await newNote.save()
    mess = 'New note Successfully Added!!'
    }catch(error){
        mess = error.message
    }
    res.render('user/addNotes.ejs',{mess,username,userbranch,usersection})
    console.log(req.session)
    console.log(req.body)
    
}

exports.getExploreMore = async (req, res) => {
    const username = req.session.name;
    const userbranch = req.session.branch;
    const usersection = req.session.section;

    try {
        // ✅ 1. Fetch dusre users jo same branch me hain (excluding logged-in user)
        const users = await userTable.find({ branch: userbranch, _id: { $ne: req.session.userId } });

        // ✅ 2. Fetch dusre users ke notes
        const notes = await noteTable.find({ uploadedBy: { $in: users.map(user => user._id) } });

        // ✅ 3. User ke details ke sath notes ko map karein
        const userNotes = users.map(user => ({
            name: user.name,
            branch: user.branch,
            section: user.section,
            role: user.role,
            notes: notes.filter(note => note.uploadedBy.toString() === user._id.toString()), // Sirf us user ke notes
        }));

        res.render("user/exploreMore.ejs", {
            username,
            userbranch,
            usersection,
            userNotes, // ✅ Dusre users aur unke notes frontend ko bhejne ke liye
        });
    } catch (error) {
        console.log("Error fetching explore more data:", error);
        res.render("user/exploreMore.ejs", { username, userbranch, usersection, userNotes: [] });
    }
};

exports.deleteNote = async (req, res) => {
    try {
        const noteId = req.params.id; // ✅ Get note ID from URL
        const userId = req.session.userId; // ✅ Get logged-in user's ID
        console.log(userId)
        console.log("Note ID to Delete:", noteId);

        // ✅ Find note by ID
        const note = await noteTable.findById(noteId);

        if (!note) {
            throw new Error("Note not found!");
        }

        console.log(note.uploadedBy)

        // ✅ Check if logged-in user is the owner of the note
        if (note.uploadedBy.toString() !== userId) {
            throw new Error("You are not authorized to delete this note!");
        }

        // ✅ Delete Note
        await noteTable.findByIdAndDelete(noteId);
        res.redirect("/user/dashboard"); // ✅ Redirect to dashboard after deletion
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.noteupdate=async(req,res)=>{
    let mess=''
    const username=req.session.name
    const userbranch=req.session.branch
    const usersection=req.session.section
    const id=req.params.id
    const data=await noteTable.findById(id)
    console.log(req.session)
    res.render('user/noteupdateform.ejs',{mess,username,userbranch,usersection,data})
}

exports.noteimgupdate=async(req,res)=>{
    let mess=''
    const id=req.params.id
    const username=req.session.name
    const userbranch=req.session.branch
    const usersection=req.session.section
    const uploadedBy = req.session.userId;
    const{subject,description}=req.body
    if(req.file){
    const filename=req.file.filename
    await noteTable.findByIdAndUpdate(id,{subject:subject,description:description,file:filename})
    }else{
        await noteTable.findByIdAndUpdate(id,{subject:subject,description:description})
    }
    res.redirect('/user/dashboard')
}

