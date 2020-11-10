//====== Requirements / Modules =============================================
const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')

//======= Settings ====================================================
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())



//========= Site Info & Functions ==================================================
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  },
  "user0": {
    id: "user0", 
    email: "chuck@example.com", 
    password: "1234"
  }
}

function generateRandomString() {
  return Math.random().toString(36).substring(2, 8);
}


//========Set Server to Listen===================================================

app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});

//=========Method Handling========================================================

//----------CREATE----------------
//----------READ------------------
//----------UPDATE----------------
//----------DELETE----------------

app.get("/", (req, res) => {
  res.redirect(`/urls/`)
});

app.get("/register", (req,res) =>{
  const templateVars = { urls: urlDatabase, username: req.cookies.name };
  res.render("urls_register", templateVars)
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase, username: req.cookies.name };
  res.render("urls_index", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});


// LOGIN
app.post("/login", (req, res) => {
  const inputUsername = req.body.username
  res.cookie('name', inputUsername);      //Sends cookie TO CLIENT
  const templateVars = { urls: urlDatabase, username: inputUsername };
  console.log(templateVars.username + " LOGGED IN")  
  res.render("urls_index", templateVars);
});

//LOGOUT
app.post("/logout", (req, res) => {
  console.log(req.body.username + " Logged OUT")
  res.clearCookie('name')
  res.redirect(`/urls/`)
});


app.post("/register", (req,res) =>{
  const userEmail = req.body.email
  const userPass = req.body.password
  const userID = generateRandomString();
  users[userID] = {
    id: userID,
    email: userEmail,
    password: userPass
  };
  //Set Cookie w. ID
  console.log("NEW REG:",users[userID]['id'])
  res.cookie('name', users[userID]['id']); 
  

  //redirect to /urls
  res.redirect(`/urls/`)

})


app.get("/urls/new", (req, res) => {
  const templateVars = { username: req.cookies.name };
  res.render("urls_new", templateVars);
});

//POST > Create new shortURL 
app.post("/urls", (req, res) => {
  const inputLongURL = req.body.longURL;  // req.body =  { longURL: 'google.ca' }
  const urlID = generateRandomString();
  urlDatabase[urlID] = inputLongURL;
  res.redirect(`/urls/${urlID}`)
});



//POST > DELETE an Entry from DB
app.post("/urls/:shortURL/delete", (req, res) => {
  shortURL = req.url.substring(6, 12)
  console.log(`Deleted Entry for ${shortURL}, ${urlDatabase[shortURL]}`)
  delete urlDatabase[shortURL];
  res.redirect(`/urls/`)
});

//Short URL Info
app.get("/urls/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  const templateVars = { shortURL: req.params.shortURL, longURL: longURL, username: req.cookies.name};
  res.render("urls_show", templateVars);
});

//POST > EDIT an Entry in DB
app.post("/urls/:shortURL", (req, res) => {
  const inputLongURL = req.body.longURL;
  shortURL = req.url.substring(6, 12)
  console.log(`EDIT Entry for ${shortURL}, is now ${inputLongURL}`)
  urlDatabase[shortURL] = inputLongURL;
  res.redirect(`/urls/`)
});

//Redirect to LongURL (using the shortURL)
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  if (longURL === undefined) {
    res.redirect(`/urls/`)  // If code doesnt exist sent to My URLS ... Nice to add Message of some sort
  }
  res.redirect(longURL)
});

// app.get("/hello", (req, res) => {
//   const templateVars = { greeting: 'Hello World!' };
//   //param 1 is the EJS file(./views), param 2 is what data its using
//   res.render("hello_world", templateVars);
// });

 //===============================================================================

