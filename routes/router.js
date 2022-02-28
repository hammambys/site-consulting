import express from "express";
import validator from "../controllers/validator.cjs";

// These lines make "require" available
import { createRequire } from "module";
const require = createRequire(import.meta.url);

var router = express.Router();
var userController = require("../controllers/userController.cjs");

router.get("/", (req, res) => {
  res.render("home");
});
router.get("/about", (req, res) => {
  res.render("about");
});
router.get("/mission", (req, res) => {
  res.render("mission");
});
router.get("/articles", (req, res) => {
  res.render("articles");
});
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
router.get("/rdv", (req, res) => {
  res.render("rdv");
});
router.get("/clients", (req, res) => {
  res.render("clients");
});

router.post("/auth", userController.login);

// user registration
router.post("/post-register", validator.createUser, userController.register);

router.get("/clients", userController.viewAll);

export default router;
