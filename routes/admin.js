const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const adminLayout = '../views/layouts/admin.ejs';
const adminLayout2 = '../views/layouts/admin-nologout.ejs';
const bcrypt = require("bcrypt");
const User = require("../models/User");
const ClientToodo = require("../models/ClientTodo")
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

/**
 * Check login
 */
const checkLogin = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    res.redirect("/admin");
  }
  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.redirect("/admin");
  }
}

/**
 * GET /allClientTodos
 * Get all clienttodos
 */
router.get(
  "/allClientTodos", 
  checkLogin,
  asyncHandler(async (req, res) => {
    const locals = {
      title: "거래처 할일들",
    };
    const data = await ClientToodo.find().sort({ updatedAt: 'desc', createdAt: 'desc'});
    res.render("admin/allClientTodos", {
      locals,
      data,
      layout: adminLayout,
    });
  })
);

/**
 * GET /edit/:id
 * Admin edit clienttodo
 */
router.get(
  "/edit/:id", 
  checkLogin,
  asyncHandler(async (req, res) => {
    const locals = {
      title: "게시물 편집",
    };
    const data = await ClientToodo.findOne({ _id: req.params.id });

    res.render("admin/edit", 
    { locals, 
      data,
      layout: adminLayout
    });
  })
);

/**
 * PUT /edit/:id
 * Admin post clienttodo
 */
router.put(
  "/edit/:id", 
  checkLogin,
  asyncHandler(async (req, res) => {
    await ClientToodo.findByIdAndUpdate(req.params.id, {
      title:  req.body.title,
      body: req.body.body,
      createdAt: Date.now(),
    });
    res.redirect('/allClientTodos');
  })
);

/**
 * PUT /delete/:id
 * Admin delete clienttodo
 */
router.delete(
  "/delete/:id", 
  checkLogin,
  asyncHandler(async (req, res) => {
    await ClientToodo.deleteOne({ _id: req.params.id });
    res.redirect('/allClientTodos');
  })
);

/**
 * POST /add
 * Admin add clienttodo
 */
router.post(
  "/add", 
  checkLogin,
  asyncHandler(async (req, res) => {
    const { title, body } = req.body;
    const newClientTodo = new ClientToodo({
      title: title,
      body: body,
      client: '원바이트',
      makename: '담당자',
      dateid: Date.now().toString(),
    });
    await ClientToodo.create(newClientTodo);
    res.redirect('/allClientTodos');
  })
);

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
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "일치하는 사용자가 없습니다"});
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "비밀번호가 일치하지 않습니다."});
    }
    const token = jwt.sign({ id: user._id }, jwtSecret)
    res.cookie("token", token, { httpOnly: true });
    res.redirect("/allClientTodos");
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

/**
 * GET /logout
 * Admin logout
 */
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

module.exports = router;