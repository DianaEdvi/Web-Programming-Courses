import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import dotenv from 'dotenv';
import session from "express-session";
import passport from "passport";
import { Strategy } from "passport-local";

dotenv.config();

const app = express();
const port = 3000;
const saltRounds = 10;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day expiry for cookie 
  }
}));

// Make sure session is initialized before 
app.use(passport.initialize());
app.use(passport.session());


const db = new pg.Client({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.PORT,
});
db.connect();

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.get("/secrets", (req, res) => {
  if (req.isAuthenticated()){
    res.render("secrets.ejs");
  }
  else {
    res.redirect("/login"); 
  }
});

app.post("/register", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  try {
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (checkResult.rows.length > 0) {
      res.send("Email already exists. Try logging in.");
    } else {
      //hashing the password and saving it in the database
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          console.error("Error hashing password:", err);
        } else {
          console.log("Hashed Password:", hash);
          const result = await db.query("INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",[email, hash]);
          const user = result.rows[0];
          req.login(user, (err) => {
            console.log(err);
            res.redirect("/secrets");            
          })
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/login", passport.authenticate("local", {
  successRedirect: "/secrets",
  failureRedirect: "/login"
}));

passport.use(new Strategy(async function verify(username, password, cb) {
  // Verify function grabs username and password from submitted form (assuming param names match form names). No need for body parser
  
  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [username,]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const storedHashedPassword = user.password;
      bcrypt.compare(password, storedHashedPassword, (err, result) => {
        if (err) {
          return cb(err); // Error with authentication 
        } else {
          if (result) {
            return cb(null, user); // User is authenticated 
          } else {
            return cb(null, false); // User is not authenticated
          }
        }
      });
    } else {
      return cb("User not found"); // User not found
    }
  } catch (err) {
    return cb(err); // Error with query 
  }
}));

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
