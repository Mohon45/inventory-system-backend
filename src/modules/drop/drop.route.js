const express = require('express');
const router = express.Router();
const dropController = require('./drop.controller');
const validate = require('../../middleware/validate');
const { createDropSchema, getDropSchema, deactivateDropSchema } = require('./drop.validation');

router.post('/', validate(createDropSchema), dropController.createDrop);
router.get('/', dropController.getActiveDrops);
router.get('/:id', validate(getDropSchema), dropController.getDrop);
router.patch('/:id/deactivate', validate(deactivateDropSchema), dropController.deactivateDrop);

module.exports = router;
