const express = require('express');
const router = express.Router();
const userController = require('./user.controller');
const validate = require('../../middleware/validate');
const { createOrGetUserSchema } = require('./user.validation');

router.post('/', validate(createOrGetUserSchema), userController.createOrGetUser);

module.exports = router;
