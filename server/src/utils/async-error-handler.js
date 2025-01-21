const { validationResult } = require("express-validator");

const asyncErrorHandler = (controller = () => new Promise()) => {
  return (req, res, next) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      return next(validationErrors);
    }

    controller(req, res, next).catch((err) => next(err));
  };
};

module.exports = asyncErrorHandler;
