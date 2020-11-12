const findIDbyEmail = function (inputEmail, database) {
  for (user in database) {
    if (inputEmail === database[user]['email']) {
      return database[user]['id']
    }
  }
  return false;
}


module.exports = findIDbyEmail