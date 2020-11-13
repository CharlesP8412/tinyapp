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

const findShortURLOwner = function(inputShortURL, database) {
  for (let url in database) {
    if (inputShortURL === url) {
      const urlOwner = database[url]['userID'];
      return urlOwner;
    }
  }
  return undefined;
};




module.exports = {
  getUserByEmail,
  checkCookie,
  checkEmailExists,
  findShortURLOwner
};