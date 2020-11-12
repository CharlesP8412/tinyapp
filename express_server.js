//====== Requirements / Modules =============================================
const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
// const cookieParser = require('cookie-parser')
const bcrypt = require('bcrypt');
const cookieSession = require('cookie-session')

//======= Settings ====================================================
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cookieParser())

app.use(cookieSession({
  name: 'user_id',
  keys: ['key1', 'key2'],
}))


//========= Site Info & Functions ==================================================
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
}

const generateRandomString = function () {
  return Math.random().toString(36).substring(2, 8);
}

const checkCookie = function (cookieID) {
  if (!cookieID) {
    return false;
  }
  return true;
}

const checkEmailExists = function (inputEmail) {
  for (user in users) {
    if (inputEmail === users[user]['email']) {
      return true;
    }
  }
  return false;
}

const findIDbyEmail = function (inputEmail) {
  for (user in users) {
    if (inputEmail === users[user]['email']) {
      return users[user]['id']
    }
  }
  return false;
}

const checkPass = function (userID, inputPass) {
  hashedPassword = users[userID]['password'];
  console.log('checking pass')
  // if (inputPass === users[userID]['password']) {
  if (bcrypt.compareSync(inputPass, hashedPassword)) {
    return true;
  }
  return false;
  
}

//========Set Server to Listen===================================================

app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});

//=========Method Handling========================================================

//----------CREATE----------------

app.post("/register", (req, res) => {
  const userEmail = req.body.email
  const userPass = req.body.password
  if (userEmail === '' || userPass === '') {
    res.status(400)
    res.send("Email and/or password cannot be blank")
  } else if (checkEmailExists(userEmail) === true) {
    res.status(400)
    res.send("Email already exists")
  } else {
    const userID = generateRandomString();
    users[userID] = {
      id: userID,
      email: userEmail,
      password: bcrypt.hashSync(userPass, 10)
    };
    console.log("hash", users)
    //Set Cookie w. ID
    console.log("NEW REG:", users[userID]['id'])
    res.cookie('user_id', users[userID]['id']);
    //redirect to /urls
    res.redirect(`/urls/`)
  }
})

// LOGIN
app.post("/login", (req, res) => {
  const userEmail = req.body.email
  const userPass = req.body.password

  if (userEmail === '' || userPass === '') {
    res.status(400)
    res.send("Email and/or password cannot be blank")
  }
  const userID = findIDbyEmail(userEmail)
  if (userID === false) {
    res.status(403)
    res.send("User does not exists")
  } else if (checkPass(userID, userPass) !== true) {
    res.status(403)
    res.send("Password is incorrect")
  } else {
    //Set Cookie w. ID
    console.log("NEW LOGIN BY:", users[userID]['id'])
    req.session['user_id'] = users[userID]['id'];

    //redirect to /urls
    res.redirect('/urls')
  }
});

//LOGOUT
app.post("/logout", (req, res) => {
  console.log(req.body.username + " Logged OUT")
  req.session = null;  // Should this be res?
  res.redirect(`/login/`)
});

//POST > Create new shortURL 
app.post("/urls", (req, res) => {
  const cookieID = req.session.user_id;
  let userEmail = null;
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
  res.redirect(`/login/`)
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
  const templateVars = { username: null };
  res.render("urls_register", templateVars)
});

app.get("/login", (req, res) => {
  const cookieID = req.session['user_id'];
  console.log("CookieID",cookieID)
  let userEmail = null;
  if (checkCookie(cookieID) === true) {
    res.redirect('/urls')
  } else {
    const templateVars = { username: userEmail };
    res.render('urls_login', templateVars)
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
    res.redirect("/login")
  }

});

//----------UPDATE----------------

//----------DELETE----------------
//POST > DELETE an Entry from DB
app.post("/urls/:shortURL/delete", (req, res) => {
  const cookieID = req.session.user_id;
  let userEmail = null;
  if (checkCookie(cookieID) === true) {
    shortURL = req.url.substring(6, 12)
    console.log(`Deleted Entry for shortURL ${shortURL}`)
    delete urlDatabase[shortURL];
    res.redirect(`/urls/`)
  } else {
    res.redirect(`/login/`)
  }
});


//----------OTHER / REFERENCED----------------

//Short URL Info
app.get("/urls/:shortURL", (req, res) => {
  const cookieID = req.session.user_id;
  let userEmail = null;
  if (checkCookie(cookieID) === true) {
    userEmail = users[cookieID].email;
    const longURL = urlDatabase[req.params.shortURL]['longURL'];
    const templateVars = { shortURL: req.params.shortURL, longURL: longURL, username: userEmail };
    res.render("urls_show", templateVars);
  } else {
    res.redirect('/login');
  }
});

//POST > EDIT an Entry in DB
app.post("/urls/:shortURL", (req, res) => {
  const cookieID = req.session.user_id;
  let userEmail = null;
  if (checkCookie(cookieID) === true) {
    const inputLongURL = req.body.longURL;
    shortURL = req.url.substring(6, 12)
    console.log(`EDIT Entry for ${shortURL}, is now ${inputLongURL}`)
    urlDatabase[shortURL]['longURL'] = inputLongURL;
    res.redirect(`/urls/`)
  } else {
    res.redirect('/login');
  }

});

//Redirect to LongURL (using the shortURL)
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]['longURL'];
  if (longURL === undefined) {
    res.redirect(`/urls/`)  // If code doesnt exist sent to My URLS ... Nice to add Message of some sort
  }
  res.redirect(longURL)
});
