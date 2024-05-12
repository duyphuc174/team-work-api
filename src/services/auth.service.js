const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const sercretKey = process.env.JWT_SECRET_KEY;
const expiration = process.env.JWT_EXPIRATION;

const hashPassword = (password) => {
  try {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
  } catch (error) {
    console.log(error);
  }
};

const comparePassword = (password, hashPassword) => {
  try {
    return bcrypt.compareSync(password, hashPassword);
  } catch (error) {
    console.log(error);
  }
};

const makeToken = (id, roleId) => {
  try {
    return jwt.sign({ id, roleId }, sercretKey, { expiresIn: expiration });
  } catch (error) {
    console.log(error);
  }
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, sercretKey);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  hashPassword,
  comparePassword,
  makeToken,
  verifyToken,
};
