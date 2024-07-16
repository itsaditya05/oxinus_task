const jwt = require('jsonwebtoken');
const bCrypt = require('bcryptjs');
const passport = require('passport');
const BearerStrategy = require('passport-http-bearer').Strategy;
const { Account, Token } = require('../models');

const getUserInfoForRequest = (user) => ({
  id: user.id,
  first_name: user.first_name,
  last_name: user.last_nam,
  email: user.email,
  phone: user.mobile,
});

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { valid: true, expired: false, decoded };
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return { valid: false, expired: true, decoded: null };
    } else {
      return { valid: false, expired: false, decoded: null };
    }
  }
};

module.exports = (app, res, next) => {
  app.use(passport.initialize());

  passport.serializeUser((user, done) => {
    done(null, user.user_id);
  });
  passport.deserializeUser((id, done) => {
    Account.findByPk(id).then((user) => {
      if (user) {
        done(null, user.get());
      } else {
        done(user.errors, null);
      }
    });
  });

  passport.use(new BearerStrategy(
    async (token, done) => {
      const checkValidToken = await Token.findOne({
        where: {
          token,
        },
        raw: true,
      });
      if (!checkValidToken) {
        res.status(400).json({ error: 'Invalid access.' });
      }
      const tokenValid = verifyToken(token);
      const isTokenValid = tokenValid.valid;
      if (!isTokenValid) {
        res.status(400).json({ error: 'Invalid access.' });
      }
      try {
        const user = await Account.findOne({
          where: {
            id: checkValidToken.id,
          },
        });
        if (!user) {
          res.status(400).json({ error: 'Invalid access.' });
        }

        const userinfo = user.get();
        return done(null, getUserInfoForRequest(userinfo));
      } catch (err) {
        console.log('Error:', err);
        res.status(400).json({ error: err.message });
      }
    },
  ));

  next();
};
