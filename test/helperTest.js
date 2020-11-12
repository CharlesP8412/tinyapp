const { assert } = require('chai');

const getUserByEmail = require('../helpers.js');

const testUserDB = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUserDB);
    const expectedOutput = "userRandomID";
    assert.equal(user, expectedOutput);
  });
  it('should return undefined with a non-existant email', function() {
    const user = getUserByEmail("something@example.com", testUserDB);
    const expectedOutput = undefined;
    assert.equal(user, expectedOutput);
  });
});