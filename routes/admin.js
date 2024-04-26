const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const adminLayout = '../views/layouts/admin.ejs';
const adminLayout2 = '../views/layouts/admin-nologout.ejs';
const bcrypt = require("bcrypt");
const User = require("../models/User");

/**
 * GET /admin
 * Admin page
 */
router.get("/admin", (req, res) => {
  const locals = {
    title: "관리자 페이지",
  }
  res.render("admin/index", { locals, layout: adminLayout2 });
});

/**
 * GET /register
 * Register administrator
 */
router.get(
  "/register",
  asyncHandler( async (req, res) => {
    const locals = {
      title: "관리자 등록",
    }
    res.render("admin/index", { locals, layout: adminLayout2 });
  })
);
/**
 * post /admin
 * Check admin login
 */
router.post(
  "/admin",
  asyncHandler( async (req, res) => {
    const { username, password} = req.body;
    if (username == "admin" && password == "admin") {
      res.send('Success');
    } else {
      res.send("Fail");
    }
  })
);

/**
 * post /register
 * Register administrator
 */
// router.post(
//   "/register",
//   asyncHandler( async (req, res) => {
//     const hashedPassword = await bcrypt.hash(req.body.password, 10);
//     const user = await User.create({
//       username : req.body.username,
//       password: hashedPassword,
//     });
//     res.json(`user create: ${user}`);
//   })
// );

module.exports = router;