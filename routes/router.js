// These lines make "require" available
import { createRequire } from "module";
const require = createRequire(import.meta.url);

import express from "express";
import validator from "../controllers/validator.cjs";

var router = express.Router();
var userController = require("../controllers/userController.cjs");
var articleController = require("../controllers/articleController.cjs");

router.get("/", (req, res) => {
  res.render("home", {
    isAdmin: req.session.isAdmin,
    loggedin: req.session.loggedin,
    username: req.session.username,
  });
});
router.get("/about", (req, res) => {
  res.render("about", {
    isAdmin: req.session.isAdmin,
    loggedin: req.session.loggedin,
    username: req.session.username,
  });
});
router.get("/mission", (req, res) => {
  res.render("mission", {
    isAdmin: req.session.isAdmin,
    loggedin: req.session.loggedin,
    username: req.session.username,
  });
});

router.get("/articles", articleController.viewAllArticles);
router.get("/articles/:id", articleController.viewArticle);

router.get("/projets", (req, res) => {
  res.render("projets", {
    isAdmin: req.session.isAdmin,
    loggedin: req.session.loggedin,
    username: req.session.username,
  });
});
router.get("/contact", (req, res) => {
  res.render("contact", {
    isAdmin: req.session.isAdmin,
    loggedin: req.session.loggedin,
    username: req.session.username,
  });
});
router.get("/login", (req, res) => {
  res.render("login");
});
router.get("/logout", (req, res) => {
  if (req.session) {
    // delete session object
    req.session.destroy((err) => {
      if (err) {
        throw err;
      } else {
        res.redirect("/");
      }
    });
  }
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/auth", (req, res) => {
  if (!req.session.isAdmin) {
    res.render("client-acceuil", {
      loggedin: req.session.loggedin,
      username: req.session.username,
      first_name: req.session.first_name,
    });
  } else {
    res.render("admin-acceuil", {
      loggedin: req.session.loggedin,
      username: req.session.username,
      first_name: req.session.first_name,
    });
  }
});

router.post("/auth", userController.login);

router.post("/auth", userController.login);
// user registration
router.post("/post-register", validator.createUser, userController.register);

router.get("/404", (req, res) => {
  res.render("error");
});

export default router;
