"use strict";

const router = require("express").Router();

router.get("/login", (req, res) => res.openid.login({ returnTo: "/user" }));
router.get("/logout", (req, res) => res.openid.logout());

router.get("/", (req, res) => {
  res.render("index", {
    title: "Account Linking Sample",
    user: req.openid && req.openid.user,
  });
});

module.exports = router;
