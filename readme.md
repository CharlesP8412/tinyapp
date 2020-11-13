# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product

!["screenshot of URLs Page"](https://raw.githubusercontent.com/CharlesP8412/tinyapp/master/docs/urls_page.png)
!["screenshot of Registration Page"](https://raw.githubusercontent.com/CharlesP8412/tinyapp/master/docs/registration.png)
!["screenshot of Edit Page"](https://raw.githubusercontent.com/CharlesP8412/tinyapp/master/docs/edit_page.png)

## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session


## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.

## Known Issues
- No URL Validation (a user can enter any string it isn't checked if it is a valid URL).  *Possible Solution Send a GET to the submitted URL to confirm it works.*


## Features to be added
- Analytics - # of times a short URL is visited
- Analytics - # of unique visitors for each URL
- Analytics - Track every visit w. DTG and visitor_ID


