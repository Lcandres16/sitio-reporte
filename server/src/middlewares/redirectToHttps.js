const asyncErrorHandler = require("../utils/async-error-handler");

const redirectHttpToHttps = asyncErrorHandler(async (req, res, next) => {
  if (req.secure) {
    return next();
  }
  res.redirect(`https://${req.headers.host}${req.url}`);
});

module.exports = redirectHttpToHttps;
