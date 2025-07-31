const express = require('express')
const app = express()
require('dotenv').config()
app.use(express.urlencoded({ extended: false }))
require('./dbconfiguration/dbconfiguration.js')
const session = require('express-session')
const userRouter = require('./routers/userrouter')
const adminRouter = require('./routers/adminrouter')

app.use(session({
    secret: process.env.KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 24 * 365 }
}))

app.get('/', (req, res) => {
    res.redirect('/user');
})
// app.use('/ad',adminRouter)
// //app.use(homeRouter)
app.use('/user', userRouter)
app.use(express.static('public'))
app.set('view engine', 'ejs')

app.listen(process.env.PORT, () => { console.log(`Server is running on port ${process.env.PORT}`) })