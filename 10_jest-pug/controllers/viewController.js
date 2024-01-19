const { Todo } = require('../models');
const { catchAsync } = require('../utils');

exports.home = (req, res) => {
  res.status(200).render('home', {
    active: 'home',
    title: 'Home page =^^=',
  });
};

exports.todos = catchAsync(async (req, res) => {
  const todos = await Todo.find().populate('owner');

  res.status(200).render('todos', {
    active: 'todos',
    title: 'Todos list !!!!',
    todos,
  });
});
