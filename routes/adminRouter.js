// These lines make "require" available
import { createRequire } from "module";
const require = createRequire(import.meta.url);

import express from "express";
const multer = require("multer");
const path = require("path");

var adminRouter = express.Router();
var rdvController = require("../controllers/rdvController.cjs");
var userController = require("../controllers/userController.cjs");
var articleController = require("../controllers/articleController.cjs");

function ensureAuthenticatedAndisAdmin(req, res, next) {
  if (req.session.loggedin) {
    if (req.session.isAdmin) return next();
    else res.redirect("/client");
  } else {
    res.redirect("/login");
  }
}

var storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, "./public/img/article-img"); // './public/images/' directory name where save the file
  },
  filename: (req, file, callBack) => {
    callBack(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
var upload = multer({
  storage: storage,
});

adminRouter.get("/", ensureAuthenticatedAndisAdmin, (req, res) => {
  res.render("admin-acceuil", {
    isAdmin: req.session.isAdmin,
    user_id: req.session.user_id,
    loggedin: req.session.loggedin,
    first_name: req.session.first_name,
    username: req.session.username,
  });
});

adminRouter.get(
  "/rdv",
  ensureAuthenticatedAndisAdmin,
  rdvController.viewAllRdv
);
adminRouter.get(
  "/clients",
  ensureAuthenticatedAndisAdmin,
  userController.viewAll
);
adminRouter.get(
  "/viewclient/:id",
  ensureAuthenticatedAndisAdmin,
  userController.viewClient
);
adminRouter.get(
  "/editclient/:id",
  ensureAuthenticatedAndisAdmin,
  userController.editClient
);
adminRouter.post(
  "/editclient/:id",
  ensureAuthenticatedAndisAdmin,
  userController.updateClient
);
adminRouter.post(
  "/clients/:id",
  ensureAuthenticatedAndisAdmin,
  userController.activateClient
);
adminRouter.get(
  "/articles",
  ensureAuthenticatedAndisAdmin,
  articleController.viewAll
);
adminRouter.get(
  "/articles/:id",
  ensureAuthenticatedAndisAdmin,
  articleController.viewArticle
);
adminRouter.get(
  "/addarticle",
  ensureAuthenticatedAndisAdmin,
  articleController.createArticleform
);
adminRouter.post(
  "/addarticle",
  [ensureAuthenticatedAndisAdmin, upload.single("article_img")],
  articleController.createArticle
);
adminRouter.get(
  "/editarticle/:id",
  ensureAuthenticatedAndisAdmin,
  articleController.editArticle
);
adminRouter.post(
  "/editarticle/:id",
  ensureAuthenticatedAndisAdmin,
  articleController.updateArticle
);
adminRouter.get(
  "/articles/delete/:id",
  ensureAuthenticatedAndisAdmin,
  articleController.deleteArticle
);
adminRouter.get(
  "/rdv/:rdv_id",
  ensureAuthenticatedAndisAdmin,
  rdvController.cancelRdvAdmin
);
adminRouter.get("/rdv/:rdv_id/*", (req, res) => {
  res.redirect("/admin");
});

export default adminRouter;
