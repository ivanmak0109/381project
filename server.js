var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    session = require('express-session');
const mongourl = 'mongodb+srv://makyuiming0109:makyuiming0109@cluster0.gkgj9.mongodb.net/381project?retryWrites=true&w=majority&appName=Cluster0'
var {MongoClient, ServerApiVersion, ObjectId} = require("mongodb");
const { default: mongoose, connection } = require('mongoose');

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
    }))
app.use(passport.initialize())
app.use(passport.session())
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: false}))

const dbName = '381project';
const client = new MongoClient(mongourl, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    }
})

const loginSchema = new mongoose.Schema({
    userid: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    }
})

const User = client.db(dbName).collection('account', loginSchema)

passport.serializeUser((user, done) => {
    done(null, user.id);
})
passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id)
    done(null, user)
})

passport.use(new LocalStrategy(function (userid, password, done){
    const existingUser = User.findOne({userid: userid})
    if(existingUser && (existingUser.password == password)){
        return done(null, existingUser);
    }else{
        return done(null, false);
    }
})) 

function isLoggedIn(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }else{
        res.redirect('/login')
    }
}

const createAc = async (doc) =>{
    const existingUser = await User.findOne({userid: doc.userid})
    if(existingUser){
        
    }else {
        await User.insertOne(doc)
    }
}

const handle_CreateAc = async (req, res) =>{
    await client.connect()
    let newAc = {
        userid: req.body.userid,
        password: req.body.password
    }
    await createAc(newAc)
    res.redirect('/login')
}

const handle_DeleteAc = async (req, res) =>{
    await client.connect();
    await User.deleteOne({userid: req.userid})
    res.redirect('/');
}

app.get('/',(req, res) => {
    res.render('login')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/login', passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/login'
    })
)

app.get('/home', isLoggedIn, (req, res) => {
    res.render('home', {userid: req.body.userid})
})

app.get("/createAc", (req, res) =>{
    res.render('createAc')
})

app.post("/createAc", (req, res) =>{
    handle_CreateAc(req, res);
})

app.get('/deleteAc', async(req, res) =>{
    handle_DeleteAc(req, res)
})

app.listen(3000)