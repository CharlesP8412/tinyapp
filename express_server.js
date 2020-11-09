//====== Requirements / Modules =============================================
const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");

//======= MiddleWare Settings ====================================================
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));


//========= Site Info & Functions ==================================================
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

function generateRandomString() {
  return Math.random().toString(36).substring(2, 8);
}


//========Set Server to Listen===================================================

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

//=========Method Handling========================================================
app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/hello", (req, res) => {
  const templateVars = { greeting: 'Hello World!' };
  //param 1 is the EJS file(./views), param 2 is what data its using
  res.render("hello_world", templateVars);
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
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
app.post("/urls/*/delete", (req, res) => {
  shortURL = req.url.substring(6,12)
  delete urlDatabase[shortURL];
  res.redirect(`/urls/`)
});

//Short URL Info
app.get("/urls/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  const templateVars = { shortURL: req.params.shortURL, longURL: longURL };
  res.render("urls_show", templateVars);
});

//Redirect to LongURL (using the shortURL)
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  if (longURL === undefined){
    res.redirect(`/urls`)  // If code doesnt exist sent to My URLS ... Nice to add Message of some sort
  }
  res.redirect(longURL)
});

 //===============================================================================

