const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const authRoute = require("./routes/auth-route");
const profileRoute = require("./routes/profile-route");
require("./config/mypassport");
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");


// Connect to database
mongoose.connect(
    process.env.MONGO_ATLAS_ID,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
).then(()=>{
    console.log("Connect to Mongoose Atlas");
}).catch((e)=>{
    console.log(e);
});

// Middleware
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
   res.locals.success_msg = req.flash("success_msg");
   res.locals.error_msg = req.flash("error_msg"); 
   res.locals.error = req.flash("error");
   next();
});

// Patically router
app.use("/auth", authRoute);
app.use("/profile", profileRoute);

// Router
app.get("/", (req, res) => {
   res.render("index", {user: req.user}); 
});

app.listen(8080, () => {
    console.log("Server is running on port 8080.");
});