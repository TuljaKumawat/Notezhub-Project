const router=require('express').Router()
const userc=require('../controllers/usercontroller')
const notec=require('../controllers/notescontroller')
const logincheck=require('../middleware/sessioncheck')
const upload=require('../middleware/multer')
const nodemailer=require('nodemailer')
const noteTable=require("../models/note")


router.get('/',userc.registerForm)
router.post('/',userc.registerVerify)


// router.get('/dashboard',logincheck,(req,res)=>{
//     const username=req.session.name
//     const userbranch=req.session.branch
//     const usersection=req.session.section
//     console.log(req.session)
//     res.render('user/dashboard.ejs',{username,userbranch,usersection})
// })

router.get("/dashboard", logincheck, async (req, res) => {
    const username = req.session.name;
    const userbranch = req.session.branch;
    const usersection = req.session.section;
    
    try {
        // ✅ Get logged-in user's notes from database
        const userNotes = await noteTable.find({ uploadedBy: req.session.userId });

        res.render("user/dashboard.ejs", {
            username,
            userbranch,
            usersection,
            notes: userNotes, // ✅ Notes frontend ko bhejne ke liye
        });
    } catch (error) {
        console.log("Error fetching notes:", error);
        res.render("user/dashboard.ejs", { username, userbranch, usersection, notes: [] });
    }
});

router.get('/login',userc.loginForm)
router.post('/login',userc.loginVerify)

//notes
router.get('/addnotes',notec.noteForm)
router.post('/addnotes',upload.single("file"),notec.addNote)
router.get('/updatenotes/:id',notec.noteupdate)
router.post('/updatenotes/:id',upload.single("file"),notec.noteimgupdate)
router.get('/deletenotes/:id',notec.deleteNote)
router.get("/explore-more", logincheck, notec.getExploreMore);


router.get('/logout',userc.userLogout)

module.exports=router