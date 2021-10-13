const router = require("express").Router();
const passport = require("passport"); // import passport module
const User = require("../models/user-model");
const Post = require("../models/post-model");
const bcrypt = require("bcrypt"); // import bcrypt module

router.get("/login", (req, res) => {
    res.render("login", {user: req.user});
});

router.post("/login",
    passport.authenticate('local', {
        failureRedirect: '/auth/login',
        failureFlash: "Wrong email or password.",
    }), (req, res) => {
        if (req.session.returnTo){
            let newPath = res.session.returnTo;
            res.session.returnTo = "";
            res.redirect(newPath);
        } else {
            res.redirect("/profile");
        }
    }
);

router.get("/google",
    passport.authenticate("google", { 
        scope: ["profile", "email"],
        prompt: "select_account",
    }), (req, res) => {

    }
);

router.get("/signup", (req, res) => {
    res.render("signup", {user: req.user});
})

router.post("/signup", async (req, res, next) => {
    let {name, email, password} = req.body;
    let emailExist = await User.findOne({ email });
    if (emailExist){
        req.flash("error_msg", "Email has been sign up already.");
        res.redirect("signup")
        next();
    };

    const hash = await bcrypt.hash(password, 10); // encrypt the code
    password = hash;
    let newUser = new User({name, email, password});
    try{
        const savedUser = await newUser.save();
        req.flash("success_msg", "Thanks for signing up, you can log in now.");
        res.redirect("/auth/login");
    } catch (err) {
        req.flash("error_msg", err.errors.name.properties.message);
        res.redirect("/auth/signup")
    }
})

router.get("/google/redirect", 
    passport.authenticate("google"),
    async (req, res) => {
        if (req.session.returnTo){
            let newPath = req.session.returnTo;
            req.session.returnTo = "";
            res.redirect(newPath);
        } else {
            let postFound = await Post.find({ author: req.user._id });
            res.render("profile", {user: req.user, posts: postFound});
        // }
    }
})


router.get("/logout", (req, res) => {
    req.logOut();
    res.redirect("/");
})

module.exports = router;