function logincheck(req,res,next){
    if(req.session.isAuth){
        next()
    }
    else{
        res.redirect('/user')
    }
}

module.exports=logincheck