const { Router } = require("express");
const avisoController = require("../controllers/aviso.controller");
const { body } = require("express-validator");

const avisoRouter = Router();

avisoRouter.route("/").get(avisoController.getAll);
avisoRouter
  .route("/")
  .post(
    [
      body("titulo").isString(),
      body("contenido").isString(),
      body("importante").isBoolean(),
    ],
    avisoController.save
  );

module.exports = avisoRouter;
