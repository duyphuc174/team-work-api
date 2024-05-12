const userRouter = require('./user.router');
const authRouter = require('./auth.router');
const workspaceRouter = require('./workspace.router');
const workRouter = require('./work.router');
const uploadRouter = require('./upload.router');
const importantRouter = require('./important.router');
const memberRouter = require('./member.router');
const taskRouter = require('./task.router');
const sprintRouter = require('./sprint.router');
const commentRouter = require('./comment.router');
const isAuth = require('./../middlewares/auth.middleware');

const initRoutes = (app) => {
  app.use('/auth', authRouter);
  app.use('/users', isAuth, userRouter);
  app.use('/workspaces', isAuth, workspaceRouter);
  app.use('/works', isAuth, workRouter);
  app.use('/importants', isAuth, importantRouter);
  app.use('/members', isAuth, memberRouter);
  app.use('/tasks', isAuth, taskRouter);
  app.use('/sprints', isAuth, sprintRouter);
  app.use('/comments', isAuth, commentRouter);

  app.use('/uploads', isAuth, uploadRouter);
};

module.exports = initRoutes;
