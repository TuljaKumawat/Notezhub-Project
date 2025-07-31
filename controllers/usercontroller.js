const userTable=require('../models/user')

exports.registerForm=(req,res)=>{
    let mess=''
    res.render('user/register.ejs',{mess})
}
exports.registerVerify=async (req, res) => {
    console.log(req.body)
    const { name, email, password, branch, section, role } = req.body;
    let mess=''
    try {
        let newUser = await userTable.findOne({ email:email });
        if (newUser) return res.send("User already exists");
        newUser = new userTable({ name, email, password, branch, section, role });
        console.log('new:',newUser)
        await newUser.save();
        req.session.isAuth=true
        req.session.name=name
        req.session.section=section
        req.session.branch=branch
        res.redirect('/user/dashboard');
    } catch (error) {
        mess=error.message
        res.render('user/register.ejs',{mess})
        //res.send("Error in registration");
        
    }
}

exports.loginForm=(req,res)=>{
    let mess=''
    res.render('user/login.ejs',{mess})
}
exports.loginVerify=async(req,res)=>{
    console.log(req.body)
    let mess=''
    const{email,password}=req.body
    
    try{
        if(!email){
            throw new Error('Please fill email!!')
        }if(!password){
            throw new Error('Please fill Password!!')
        }
        const data=await userTable.findOne({email:email})
    if(data){
        if(data.password==password){
            req.session.isAuth=true
            req.session.userId = data._id;
            req.session.name=data.name
            req.session.section=data.section
            req.session.branch=data.branch
            req.session.role = data.role;
            res.redirect('/user/dashboard')
        }
        else{
            //console.log('password not match')
            throw new Error('password not match!!')
        }
    }
    else{
        //console.log('email not Found!!')
        throw new Error('email not Found!!')
    }
}catch(error){
    mess=error.message
    //console.log(error.message)
    res.render('user/login.ejs',{mess})
    }
}

exports.userLogout=(req,res)=>{
    req.session.destroy()
    res.redirect('/user/login')
}