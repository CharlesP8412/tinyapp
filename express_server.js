const express = require("express");
const app = express();
const PORT = 8080; 

app.set('view engine', 'ejs');

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

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

// app.get("/set", (req, res) => {
//   const a = 1;
//   res.send(`a = ${a}`);
//  });
 
//  app.get("/fetch", (req, res) => {
//   res.send(`a = ${a}`);
//  });

 app.get("/urls", (req, res) =>{
   const templateVars = {urls: urlDatabase};
   res.render("urls_index", templateVars);
 });

 app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls/:shortURL", (req,res) =>{
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});

 //===============================================================================

