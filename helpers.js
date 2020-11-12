const getUserByEmail = function (inputEmail, database) {
  for (user in database) {
    if (inputEmail === database[user]['email']) {
      return database[user]['id']
    }
  }
  return undefined;
}


module.exports = getUserByEmail;