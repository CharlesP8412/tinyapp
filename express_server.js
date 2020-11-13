//====== Requirements / Modules =============================================
const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const cookieSession = require('cookie-session');
const { getUserByEmail, checkCookie, checkEmailExists, findShortURLOwner } = require('./helpers');

//======= Settings ====================================================
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'user_id',
  keys: ['key1', 'key2'],
}));


//========= Site Info & Functions =========================================================
const urlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "mlbu81" },
  "1sg5eL": { longURL: "http://www.google.com", userID: "mlbu81" },
  "9sm5xK": { longURL: "http://www.google.com", userID: "user2RandomID" }
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "$2b$10$MKiLD8HfLurkYLCVz4ypAuYO3VJ4q1AAA4Ry8iQ7CuvQVllE098Ii" //purple-monkey-dinosaur
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "$2b$10$ciB7sG1gxJEEw5AFVKh6XuSZVg.IKQuTBZBIuB2RvJ6M.iCWwHeNC"  //"dishwasher-funk"
  },
  "mlbu81": {
    id: "mlbu81",
    email: "2@2.com",
    password: "$2b$10$XWgGwPp/8ue7cK/iFYfU3eooTtBLmXABnKzZyIvptkC4GFu1nZavC"  //2
  },
  "asd234": {
    id: "asd234",
    email: "1@2.com",
    password: "$2b$10$XWgGwPp/8ue7cK/iFYfU3eooTtBLmXABnKzZyIvptkC4GFu1nZavC" //2
  }
};

const generateRandomString = function() {
  return Math.random().toString(36).substring(2, 8);
};


const checkPass = function(userID, inputPass, database) {
  const hashedPassword = database[userID]['password'];
  // console.log('checking pass');
  // if (inputPass === users[userID]['password']) {
  if (bcrypt.compareSync(inputPass, hashedPassword)) {
    return true;
  }
  return false;

};



//========Set Server to Listen===================================================

app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});

//=========Method Handling========================================================

//----------CREATE----------------

app.post("/register", (req, res) => {
  const userEmail = req.body.email;
  const userPass = req.body.password;
  if (userEmail === '' || userPass === '') {
    res.status(400);
    res.send("Email and/or password cannot be blank");
  } else if (checkEmailExists(userEmail, users) === true) {
    res.status(400);
    res.send("Email already exists");
  } else {
    const userID = generateRandomString();
    users[userID] = {
      id: userID,
      email: userEmail.toLowerCase(),
      password: bcrypt.hashSync(userPass, 10)
    };
    //Set Cookie w. ID
    req.session['user_id'] = users[userID]['id'];
    //redirect to /urls
    res.redirect(`/urls/`);
  }
});

// LOGIN
app.post("/login", (req, res) => {
  let userEmail = req.body.email;
  userEmail = userEmail.toLowerCase();
  const userPass = req.body.password;

  if (userEmail === '' || userPass === '') {
    res.status(400);
    res.send("Email and/or password cannot be blank");
  }
  const userID = getUserByEmail(userEmail, users);
  if (userID === undefined) {
    res.status(403);
    res.send("User does not exists");
  } else if (checkPass(userID, userPass, users) !== true) {
    res.status(403);
    res.send("Password is incorrect");
  } else {
    //Set Cookie w. ID
    // console.log("NEW LOGIN BY:", users[userID]['id']);
    req.session['user_id'] = users[userID]['id'];
    //redirect to /urls
    res.redirect('/urls');
  }
});

//LOGOUT
app.post("/logout", (req, res) => {
  // console.log(req.body.username + " Logged OUT");
  req.session = null;  // Should this be res?
  res.redirect(`/urls/`);
});

//POST > Create new shortURL
app.post("/urls", (req, res) => {
  const cookieID = req.session.user_id;
  if (checkCookie(cookieID) === true) {
    const inputLongURL = req.body.longURL;  // req.body =  { longURL: 'google.ca' }
    const urlID = generateRandomString();
    urlDatabase[urlID] = {
      longURL: inputLongURL,
      userID: cookieID
    };
    res.redirect(`/urls/${urlID}`);
  }
});


//----------READ------------------
app.get("/", (req, res) => {
  res.redirect(`/login/`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  const cookieID = req.session['user_id'];
  let userEmail = null;
  if (checkCookie(cookieID) === true) {
    userEmail = users[cookieID].email;
    const templateVars = { urls: urlDatabase, username: userEmail, cookieID: cookieID };
    res.render("urls_index", templateVars);
  } else {
    res.redirect('/login');
  }

});

app.get("/register", (req, res) => {
  const cookieID = req.session['user_id'];
  if (checkCookie(cookieID) === true) {
    res.redirect('/urls');
  } else {
    const templateVars = { username: null };
    res.render("urls_register", templateVars);
  }
});

app.get("/login", (req, res) => {
  const cookieID = req.session['user_id'];
  // console.log("CookieID", cookieID);
  let userEmail = null;
  if (checkCookie(cookieID) === true) {
    res.redirect('/urls');
  } else {
    const templateVars = { username: userEmail };
    res.render('urls_login', templateVars);
  }
});

app.get("/urls/new", (req, res) => {
  const cookieID = req.session.user_id;
  let userEmail = null;
  if (checkCookie(cookieID) === true) {
    userEmail = users[cookieID].email;
    const templateVars = { username: userEmail };
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login");
  }

});

//----------UPDATE----------------

//----------DELETE----------------
//POST > DELETE an Entry from DB
app.post("/urls/:shortURL/delete", (req, res) => {
  const cookieID = req.session.user_id;
  const inputShortURL = req.url.substring(6, 12);
  if (checkCookie(cookieID) === true) {
    //Check is shortURL belongs to user
    const urlOwner = findShortURLOwner(inputShortURL, urlDatabase);
    if (cookieID === urlOwner) {
      // console.log(`Deleted Entry for shortURL ${inputShortURL}, by ${cookieID}`);
      delete urlDatabase[inputShortURL];
      res.redirect(`/urls/`);
    } else {
      res.status(403);
      res.send("Input Error: ensure your short URL is typed correctly");
    }
  } else {
    res.redirect(`/login/`);
  }
});


//----------OTHER / REFERENCED----------------

//Short URL Info
app.get("/urls/:shortURL", (req, res) => {
  const cookieID = req.session.user_id;
  const inputShortURL = req.params.shortURL;
  // IF Logged in
  if (checkCookie(cookieID) === true) {
    //Check is shortURL belongs to user
    const urlOwner = findShortURLOwner(inputShortURL, urlDatabase);
    if (cookieID === urlOwner) {
      //Generage Page
      const userEmail = users[cookieID].email;
      const longURL = urlDatabase[inputShortURL]['longURL'];
      const templateVars = { shortURL: inputShortURL, longURL: longURL, username: userEmail };
      res.render("urls_show", templateVars);
    } else {
      res.status(403);
      res.send("Input Error: ensure your short URL is typed correctly");
    }
  } else {
    res.redirect('/login');
  }
});

//POST > EDIT an Entry in DB
app.post("/urls/:shortURL", (req, res) => {
  const cookieID = req.session.user_id;
  const inputLongURL = req.body.longURL;
  const inputShortURL = req.url.substring(6, 12);
  //Check if logged in
  if (checkCookie(cookieID) === true) {
    //Check is shortURL belongs to user
    const urlOwner = findShortURLOwner(inputShortURL, urlDatabase);
    if (cookieID === urlOwner) {
      // console.log(`EDIT Entry for ${inputShortURL}, is now ${inputLongURL}, by ${cookieID}`);
      urlDatabase[inputShortURL]['longURL'] = inputLongURL;
      res.redirect(`/urls/`);
    } else {
      res.status(403);
      res.send("Input Error: ensure your short URL is typed correctly");
    }
  } else {
    res.redirect('/login');
  }

});

//Redirect to LongURL (using the shortURL)
app.get("/u/:shortURL", (req, res) => {
  const inputShortURL = req.params.shortURL;
  const urlKey = urlDatabase[inputShortURL];
  if (urlKey === undefined) {
    res.status(403);
    res.send("Error: Short URL does not exist");
  } else {
    const longURL = urlDatabase[inputShortURL]['longURL'];
    res.redirect(longURL);
  }
});
