// These lines make "require" available
import { createRequire } from "module";
const require = createRequire(import.meta.url);

import express from "express";
var clientRouter = express.Router();
var rdvController = require("../controllers/rdvController.cjs");

function ensureAuthenticatedAndisClient(req, res, next) {
  if (req.session.loggedin) {
    if (!req.session.isAdmin) return next();
    else res.redirect("/client");
  } else {
    res.redirect("/login");
  }
}

clientRouter.get("/", ensureAuthenticatedAndisClient, (req, res) => {
  res.redirect("/client/" + req.session.user_id);
});

clientRouter.get("/:id", ensureAuthenticatedAndisClient, (req, res) => {
  res.render("client-acceuil", {
    user_id: req.session.user_id,
    loggedin: req.session.loggedin,
    first_name: req.session.first_name,
    username: req.session.username,
  });
});

clientRouter.get("/:id/addrdv", ensureAuthenticatedAndisClient, (req, res) => {
  res.render("client-add-rdv", {
    user_id: req.session.user_id,
    loggedin: req.session.loggedin,
    username: req.session.username,
  });
});
clientRouter.post(
  "/:id/addrdv",
  ensureAuthenticatedAndisClient,
  rdvController.createRdv
);

clientRouter.get(
  "/:id/viewrdv",
  ensureAuthenticatedAndisClient,
  rdvController.viewAllRdvOfClient
);

clientRouter.get(
  "/:id/:rdv_id",
  ensureAuthenticatedAndisClient,
  rdvController.cancelRdvClient
);

export default clientRouter;
