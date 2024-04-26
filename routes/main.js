const express = require('express');
const router = express.Router();
const mainLayout = '../views/layouts/main.ejs';
const ClientASList = require("../models/ClientTodo");
const asynchandler = require("express-async-handler");

/**
 * GET / , /home
 * 게시물 전체 보기
 */
router
.get(
  ['/', '/home'], 
  asynchandler(async (req, res) => {
    const locals = {
      title: 'Home Page',
    };
    const data = await ClientASList.find({});
    res.render("index", { locals, data, layout: mainLayout });
  })
);

router
  .get('/about',  (req, res) => {
    const locals = {
      title: 'About Page',
    };
    res.render('about', { locals, layout: mainLayout })
});

/**
 * GET clientaspage/:id
 * 게시물 상세 보기
 */
router.get(
  "/clientaspage/:id",
  asynchandler(async (req, res) => {
    const data = await ClientASList.findOne({ _id: req.params.id });
    res.render("clientaspage", { data, layout: mainLayout });
  })
);


module.exports = router;
