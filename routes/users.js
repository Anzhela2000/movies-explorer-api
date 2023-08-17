const router = require('express').Router();
const { getMe, patchUser } = require('../controllers/users');

router.get('/me', getMe);
router.patch('/me', patchUser);

module.exports = router;
