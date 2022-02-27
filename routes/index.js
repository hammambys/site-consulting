import express from "express";
var router = express.Router();

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

export default router;
