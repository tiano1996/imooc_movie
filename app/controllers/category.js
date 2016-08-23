var Movie = require('../models/movie');
var Comment = require('../models/comment');
var Category = require('../models/category');
var _ = require('underscore');


// admin new page
exports.new = function(req, res) {
  res.render('category_admin', {
    title: 'imooc 电影分类录入',
    category: {}
  });
}

// admin post category
exports.save = function(req, res) {
  var _category = req.body.category;

  var category = new Category(_category);

  category.save(function(err, category) {
    if(err) {
      console.log(err);
    }

    res.redirect('/admin/category/list');
  });
}

// category list page
exports.list = function(req, res) {
  Category.fetch(function(err, categories) {
    if(err) {
      console.log(err);
    }

    res.render('categorylist', {
      title: 'imooc 电影分类列表',
      categories: categories
    });
  });
}
