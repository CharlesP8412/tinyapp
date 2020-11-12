const getUserByEmail = function(inputEmail, database) {
  for (let user in database) {
    if (inputEmail === database[user]['email']) {
      return database[user]['id'];
    }
  }
  return undefined;
};


const checkCookie = function(cookieID) {
  if (!cookieID) {
    return false;
  }
  return true;
};

const checkEmailExists = function(inputEmail, database) {
  for (let user in database) {
    if (inputEmail === database[user]['email']) {
      return true;
    }
  }
  return false;
};






module.exports = {
  getUserByEmail,
    checkCookie,
  checkEmailExists
};