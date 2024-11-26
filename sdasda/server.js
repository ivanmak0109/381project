var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    session = require('express-session'),
    path = require('path')
;
const mongourl = 'mongodb+srv://makyuiming0109:makyuiming0109@cluster0.gkgj9.mongodb.net/381project?retryWrites=true&w=majority&appName=Cluster0'
const { ALL } = require('dns');
var {MongoClient, ServerApiVersion} = require("mongodb");
const{ObjectId} =require('mongodb')
const { default: mongoose, connection } = require('mongoose');
const collectionName = "booking";

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
    }))
app.use(passport.initialize())
app.use(passport.session())
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: false}))
app.use(express.static(path.join(__dirname,'public')))

const dbName = '381project';
const client = new MongoClient(mongourl, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: false,
        deprecationErrors: false,
        useNewUrlParser: true, 
        useUnifiedTopology: true
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

const bookingSchema = new mongoose.Schema({
    bookingname: {
       type: String,
       require: true
   },
   mobile: {
       type: String,
       require: true
   },
   size: {
       type: String, 
       require: true,
       unique: true
    },
    date: {
       type: String, 
       require:true,
       }
})

const Booking = client.db(dbName).collection('booking',bookingSchema)

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(new LocalStrategy(
    {
        usernameField: 'userid',
        passportField: 'password',
        passReqToCallback: true
    },async(req, username, password, done)=>{
        try{
            const user = await User.findOne({userid: username})
            if(!user){
                return done(null, false)
            }
            if(password != user.password){
                return done(null, false)
            }
            return done(null, user)
        }catch(error){
            return done(error)
        }
    }
))

function isLoggedIn(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }else{
        res.redirect('/login')
    }
}

const handle_CreateAc = async (req, res) =>{
    await client.connect()
    let message =""
    let newAc = {
        userid: req.body.userid,
        password: req.body.password
    }
    const existingUser = await User.findOne({userid: newAc.userid})
    if(existingUser){
        message = "Existing user id, please use another"
    }else {
        await User.insertOne(newAc)
        message = "Create Successful"
    }
    res.render('createAc', {message: message})
}

const handle_Createbooking = async (req, res) =>{
    await client.connect()
    let message = ""
    let newbooking = {
           bookingname: req.body.bookingname,  
           mobile: req.body.mobile,
           size: req.body.size,
           date: req.body.date
    }
    await Booking.insertOne(newbooking)
    message = "Create Successful"
    res.render('create', {message: message})
}    

const handle_Display = async (req, res) =>{
    await client.connect()
    let docs = await Booking.find().toArray()
    res.render('home', {userid: req.user.userid, nBookings: docs.length, bookings: docs})
}

const handle_DeleteAc = async (req, res) =>{
    await client.connect();
    await User.deleteOne({userid: req.user.userid})
    res.redirect('/');
}

app.get('/',(req, res) => {
    res.render('login', {message: ""})
})

app.get('/login', (req, res) => {
    res.render('login', {message: ""})
})

app.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (!user) {
            let message = "Invalid user id or password"
            return res.render('login', {message: message});
        }
        req.logIn(user, (err) => {
            return handle_Display(req, res);
        });
    })(req, res, next);
});

app.get('/details', isLoggedIn, async (req, res) => {
    try {
        await client.connect();
        const bookingId = req.query._id;
        const booking = await Booking.findOne({ _id: new ObjectId(bookingId) });
        if (booking) {
            res.render('detail', { user: req.user, booking: booking });
        } else {
            res.send('Booking not found');
        }
    } catch (error) {
        console.error(error);
        res.send('An error occurred');
    }
});
app.get('/edit', isLoggedIn, async (req, res) => {
    try {
        await client.connect();
        const bookingId = req.query._id;
        const booking = await Booking.findOne({ _id: new ObjectId(bookingId) });
        if (booking) {
            res.render('edit', { user: req.user, booking: booking });
        } else {
            res.send('Booking not found');
        }
    } catch (error) {
        console.error(error);
        res.send('An error occurred');
    }
});


app.post('/update', isLoggedIn, async (req, res) => {
    try {
        await client.connect();
        const bookingId = new ObjectId(req.query._id);
        let updatedBooking = {
            bookingname: req.body.bookingname,
            mobile: req.body.mobile,
            size: req.body.size,
            date: req.body.date
        };
        console.log('Updated Booking Data:', updatedBooking);
        const result = await Booking.updateOne({ _id: bookingId }, { $set: updatedBooking });
        if (result.modifiedCount > 0) {
            res.redirect('/home');
        } else {
            res.send('No changes were made to the booking.');
        }
    } catch (error) {
        console.error(error);
        res.send('An error occurred while updating the booking.');
    }
});



app.get('/home', isLoggedIn, (req, res) => {
    handle_Display(req, res)
})

app.get("/createAc",(req, res) =>{
    res.render('createAc', {message: ""})
})

app.post("/createAc",(req, res) =>{
    handle_CreateAc(req, res);
})

app.get('/create',isLoggedIn, (req, res) =>{
    res.render('create', {userid: req.user.userid, message: ""})
})

app.post('/create',isLoggedIn, (req, res) =>{
    handle_Createbooking(req, res);
})

app.get('/deleteAc', isLoggedIn,async(req, res) =>{
    handle_DeleteAc(req, res)
})

app.get('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/login');
    });
})

const insertDocument = async (db, doc) => {
    var collection = db.collection(collectionName);
    let results = await collection.insertOne(doc);
	console.log("insert one document:" + JSON.stringify(results));
    return results;
}

const findDocument = async (db, criteria) => {
    var collection = db.collection(collectionName);
    let results = await collection.find(criteria).toArray();
	console.log("find the documents:" + JSON.stringify(results));
    return results;
}
const updateDocument = async (db, criteria, updateData) => {
    var collection = db.collection(collectionName);
    let results = await collection.updateOne(criteria, { $set: updateData });
	console.log("update one document:" + JSON.stringify(results));
    return results;
}
const deleteDocument = async (db, criteria) => {
    var collection = db.collection(collectionName);
    let results = await collection.deleteMany(criteria);
	console.log("delete one document:" + JSON.stringify(results));
    return results;
}
app.use(bodyParser.json());



// Connect to MongoDB
client.connect(err => {
    if (err) throw err;
    console.log('Connected to MongoDB');
    const db = client.db(dbName);
    const bookingsCollection = db.collection('booking')});
    

    
    // Create (POST)
/* RESTful */
// Task 3
app.post('/api/booking/:bookingname', async (req, res) => { //async programming way
    if (req.params.bookingname) {
        console.log(req.body);
        await client.connect();
        console.log("Connected successfully to server");
        const db = client.db(dbName);
        let newDoc = {
            bookingname: req.params.bookingname,
            mobile: req.body.mobile,
            size: req.body.size,
            date: req.body.date
        };
        if (req.files && req.files.filetoupload && req.files.filetoupload.size > 0) {
            const data = await fsPromises.readFile(req.files.filetoupload.path);
            newDoc.photo = Buffer.from(data).toString('base64');
        }
        await insertDocument(db, newDoc);
        res.status(200).json({ "Successfully inserted": newDoc }).end();
    } else {
        res.status(500).json({ "error": "missing bookingname" });
    }
});

app.get('/api/booking/:bookingname', async (req, res) => {
    if (req.params.bookingname) {
        console.log(req.body);
        let criteria = {};
        criteria['bookingname'] = req.params.bookingname;
        await client.connect();
        console.log("Connected successfully to server");
        const db = client.db(dbName);
        const docs = await findDocument(db, criteria);
        res.status(200).json(docs);
    } else {
        res.status(500).json({ "error": "missing bookingname" }).end();
    }
});

app.put('/api/booking/:bookingname', async (req, res) => {
    if (req.params.bookingname) {
        console.log(req.body);
        let criteria = {};
        criteria['bookingname'] = req.params.bookingname;
        await client.connect();
        console.log("Connected successfully to server");
        const db = client.db(dbName);
        let updateData = {
            bookingname: req.body.bookingname || req.params.bookingname,
            mobile: req.body.mobile,
            size: req.body.size,
            date: req.body.date
        };

        if (req.files && req.files.filetoupload && req.files.filetoupload.size > 0) {
            const data = await fsPromises.readFile(req.files.filetoupload.path);
            updateData.photo = Buffer.from(data).toString('base64');
        }

        const results = await updateDocument(db, criteria, updateData);
        res.status(200).json(results).end();
    } else {
        res.status(500).json({ "error": "missing bookingname" });
    }
});

app.delete('/api/booking/:bookingname', async (req, res) => {
    if (req.params.bookingname) {
        console.log(req.body);
        let criteria = {};
        criteria['bookingname'] = req.params.bookingname;
        await client.connect();
        console.log("Connected successfully to server");
        const db = client.db(dbName);
        const results = await deleteDocument(db, criteria);
        console.log(results);
        res.status(200).json(results).end();
    } else {
        res.status(500).json({ "error": "missing bookingname" });
    }
});


/* End of Restful */

app.get('/*', (req,res) => {
    res.status(404).render('info', {message: `${req.path} - Unknown request!` });
});
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

