const { userRolesEnum } = require('../constants');
const { Todo } = require('../models');

exports.createTodo = (todoData, owner) => {
  const { title, details, due } = todoData;

  return Todo.create({
    title,
    details,
    due,
    owner,
  });
};

exports.getTodos = async (query, owner) => {
  // const todos = await Todo
  //   .find({ title: { $regex: 'test', $options: 'i' } })
  //   .populate('owner')
  //   .sort('-details')
  //   .skip(1)
  //   .limit(3);

  // SEARCH FEATURE =====================================
  // const todos = await Todo.find({ title: { $regex: query.search, $options: 'i' } });
  const findOptions = query.search
    ? {
        $or: [
          { title: { $regex: query.search, $options: 'i' } },
          { details: { $regex: query.search, $options: 'i' } }
        ],
      }
    : {};

  if (query.search && owner.role === userRolesEnum.USER) {
    for (const findOption of findOptions.$or) findOption.owner = owner;
  }

  if (!query.search && owner.role === userRolesEnum.USER) {
    findOptions.owner = owner;
  }

  // INIT DB QUERY ================================
  const todosQuery = Todo.find(findOptions).populate({ path: 'owner', select: 'name role' });

  // SORTING FEATURE ================================
  // order = 'ASC' | 'DESC'
  // todosQuery.sort('title' | '-title') ;
  todosQuery.sort(`${query.order === 'DESC' ? '-' : ''}${query.sort ?? 'title'}`);

  // PAGINATION FEATURE =============================
  // todosQuery.limit(5); - limit of number of docs to fetch from DB
  // todosQuery.skip(2); - numnber of docs to skip

  // page 1 = limit 10, skip 0
  // page 2 = limit 10, skip 10
  // page 3 = limit 10, skip 20

  const paginationPage = query.page ? +query.page : 1;
  const paginationLimit = query.limit ? +query.limit : 5;
  const docsToSkip = (paginationPage - 1) * paginationLimit;

  todosQuery.skip(docsToSkip).limit(paginationLimit);

  const todos = await todosQuery;
  const total = await Todo.countDocuments(findOptions);

  return {
    todos,
    total,
  };
};
