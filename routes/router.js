// These lines make "require" available
import { createRequire } from "module";
const require = createRequire(import.meta.url);

import express from "express";
import validator from "../controllers/validator.cjs";

var router = express.Router();
var userController = require("../controllers/userController.cjs");
var articleController = require("../controllers/articleController.cjs");

router.get("/", (req, res) => {
  res.render("home");
});
router.get("/about", (req, res) => {
  res.render("about");
});
router.get("/mission", (req, res) => {
  res.render("mission");
});

router.get("/articles", articleController.viewAllArticles);
router.get("/addarticle", articleController.form);
router.post("/addarticle", articleController.createArticle);

router.get("/projets", (req, res) => {
  res.render("projets");
});
router.get("/contact", (req, res) => {
  res.render("contact");
});
router.get("/login", (req, res) => {
  res.render("login");
});
router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/auth", userController.login);
// user registration
router.post("/post-register", validator.createUser, userController.register);

export default router;
