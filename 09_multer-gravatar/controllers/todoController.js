const { todoServices } = require('../services');
const { catchAsync } = require('../utils');

exports.createTodo = catchAsync(async (req, res) => {
  const newTodo = await todoServices.createTodo(req.body, req.user);
  res.status(201).json({
    msg: 'Success',
    todo: newTodo,
  });
});

exports.getTodosList = catchAsync(async (req, res) => {
  const { todos, total } = await todoServices.getTodos(req.query, req.user);

  res.status(200).json({
    msg: 'Success',
    todos,
    total,
    user: req.user,
  });
});
