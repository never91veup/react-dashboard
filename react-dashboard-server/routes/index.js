const Router = require('express');
const router = new Router();
const userRouter = require('./userRouter');
const basketRouter = require('./basketRouter');

router.use('/user', userRouter);
router.use('/basket', basketRouter);

module.exports = router;