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

function generateRandomString() {
  return Math.random().toString(36).substring(2, 8);
}

let cookies = {};

//========Set Server to Listen===================================================

app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});

//=========Method Handling========================================================
app.get("/", (req, res) => {
  res.redirect(`/urls/`)
});

// app.get("/hello", (req, res) => {
//   const templateVars = { greeting: 'Hello World!' };
//   //param 1 is the EJS file(./views), param 2 is what data its using
//   res.render("hello_world", templateVars);
// });

app.get("/urls", (req, res) => {
  console.log(req.cookies.name)
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
  console.log(templateVars.username)  
  res.render("urls_index", templateVars);
});


app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

//POST > Create new shortURL 
app.post("/urls", (req, res) => {
  const inputLongURL = req.body.longURL;  // req.body =  { longURL: 'google.ca' }
  const urlID = generateRandomString();
  urlDatabase[urlID] = inputLongURL;
  res.redirect(`/urls/${urlID}`)
  // res.send("Ok");         // Respond with 'Ok' (we will replace this)
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
  const templateVars = { shortURL: req.params.shortURL, longURL: longURL };
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
    res.redirect(`/urls`)  // If code doesnt exist sent to My URLS ... Nice to add Message of some sort
  }
  res.redirect(longURL)
});

 //===============================================================================

