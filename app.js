const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();
const session = require("express-session");
const MongoStore = require("connect-mongo");
const DB_Name = "notABlog"
const DB_URL ="mongodb+srv://akkshaat:GEnH4XsMsR0FESqE@cluster0.sfypf0c.mongodb.net/" +DB_Name+ "?retryWrites=true&w=majority";

const Blog = require("./blogModel");
const User = require("./userModel");
const {removeUserBlogID,  findBlogs} = require("./userUtils");

mongoose.connect(DB_URL, { useNewUrlParser: true, })
.then(()=>{
  console.log("Connected to DB");
})

// TODO: mongoose-encryption

app.set("view engine", "ejs");
app.set("json spaces", 2);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


// MongoDB session
const sessionStorage = MongoStore.create({
  mongoUrl: DB_URL,
  dbName: DB_Name,
  collectionName: "sessions",
  ttl: 2*24*60*60,
  autoRemove:"native"
});

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
    // cookie: { secure: true },  Change to `secure: true` in a production environment with HTTPS
    store: sessionStorage
  })
);

const PORT = process.env.PORT || 3000;


app.get("/", async (req, res) => {
  const allBlog = await Blog.find();
  try {
    if(req.session.isAuthenticated){
      const user = User.findOne({_id: req.session.userID})
      .then(user=>{
        res.render("home", { allBlog: allBlog , renderDelete: false, user: user});
      })
    } else{
      res.render("home", { allBlog: allBlog , renderDelete: false, user: null});
    }

  } catch (error) {
    console.log(error);
  }
});

app.get("/create", async (req, res) => {
  if (req.session.isAuthenticated) {
      const user = User.findOne({_id: req.session.userID})
      .then(user=>{
        res.render("Create", {user: user});
      });
  } else {
    res.render("login", {messege: "loggin to Start blogging", user: null});
  }
});

app.get("/blog/:postid", async (req, res) => {
  const id = req.params.postid;
  try {
    const post = await Blog.findOne({ _id: id }).then((post) => {
      if(req.session.isAuthenticated){
          const user = User.findOne({_id: req.session.userID})
          .then(user=>{
            if (!post) {
              res.send("Blog not found!");
            } else {
              res.render("blog", { Post: post, user:user });
            }
        });
      } else {
        if (!post) {
          res.send("Blog not found!");
        } else {
          res.render("blog", { Post: post, user:null});
        }
      }

    });
  } catch (error) {
    console.log("ERROR IN TEST!: " + error);
  }
});

app.get("/about", (req,res)=>{
  const user = User.findOne({_id: req.session.userID})
  .then(user=>{
    if (!user) {
      res.render("about",{user: null});
    } else {
      res.render("about",{user: user});
    }
  })
});
// POST FUNCTIONS

app.post("/create", async (req, res) => {
  const user = await User.findOne({ _id: req.session.userID }).then(
    async (user) => {
      const post = new Blog({
        name: req.body.name,
        content: req.body.content,
        author: user.userName,
      });

      const isSaved = await post.save().then((isSaved) => {
        // console.log("\n    in post(create)   postID: " + isSaved._id + "\n\n");
        user.usersBlogsID.push(isSaved._id);
        user.save().then(() => {
          res.redirect("/");
        });
      });
    }
  );
});

app.post("/delete", async (req, res) => {
  const blogID = req.body.deleteForm;
    //   TODO: also delete blog from req.session.user array;
  try {
        deletedForm = await Blog.deleteOne({ _id: blogID })
        .then(() => {
            const user = User.findOne({_id: req.session.userID})
            .then(user=>{
                if( removeUserBlogID(user, blogID) ){
                    res.redirect("/success");
                } else {
                    res.send("<h1>error</h1>");
                }
            });
    });
  } catch (error) {
    console.log("ERROR WHILE DELETING: " + error);
  }
});

// ROUTS

app.route("/success").get(async (req, res) => {
  if (req.session.isAuthenticated) {
    // console.log("           IN SUCCESS: ", req.session.userID);
    try {
      const allBlogs = await Blog.find();
      const user = await User.findOne({ _id: req.session.userID }).then( (user) => {
        if(user){
            const userBLogs = findBlogs(allBlogs, user.usersBlogsID);
            console.log("\n           FIND BLOG: ", userBLogs);
            res.render("dashboard", { user: user , allBlog: userBLogs, renderDelete: true});
          } else {
            res.redirect("/");
          }
        } 
      );
    } catch (error) {
      console.log(error);
    }
  } else {
    res.redirect("/login");
    console.log(req.session);
  }
});

app
  .route("/login")
  .get((req, res) => {
    res.render("login", {messege: null, user: null});
  })

  .post(async (req, res) => {
    const enteredUsername = req.body.username;
    const enteredPassword = req.body.password;

    try {
      const user = await User.findOne({ userName: enteredUsername }).then(
        (user) => {
          if (!user) {
            res.render("login", {messege: "User not found!", user:null});
          } else {
            if (user.password === enteredPassword) {
              req.session.userID = user._id;
              req.session.isAuthenticated = true;
              res.redirect("/success");
            } else {
              res.render("login", {messege: "Wrong password!", user:null});
            }
          }
        }
      );
    } catch (error) {
      console.log("Error in Login: ", error);
    }
  });

app
  .route("/register")
  .get((req, res) => {
    res.render("register", {messege: null , user: null});
  })

  .post(async (req, res) => { 
    const enteredUsername = req.body.username;
    const enteredPassword = req.body.password;
    const user = await User.findOne({userName: enteredUsername})
    .then(async (user)=>{
      if(user){
        res.render("register", {messege: "User alredy exists", user:null});
      } else {
        const newUser = new User({
          userName: enteredUsername,
          password: enteredPassword,
        });
        // TODO: check if user alredy exists 
        try {
          let saveUser = await newUser.save().then((saveUser) => {
            console.log("Saved! ", saveUser);
            req.session.isAuthenticated = true;
            res.redirect("/success");
          });
        } catch (error) {
          console.log("error saving user: ", error);
          res.redirect("/register");
        }
      }
      
    })
   
  });

app.route("/logout")
  .post((req,res)=>{
    if(req.session.isAuthenticated){
      req.session.isAuthenticated = false;
    }
    res.redirect("/");
  })

app.listen(PORT, () => {
  console.log("server is running at " + PORT);
});
