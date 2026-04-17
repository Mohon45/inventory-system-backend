const express = require('express');
const router = express.Router();
const purchaseController = require('./purchase.controller');
const validate = require('../../middleware/validate');
const { completePurchaseSchema } = require('./purchase.validation');

router.post('/', validate(completePurchaseSchema), purchaseController.completePurchase);
router.get('/user/:userId', purchaseController.getUserPurchases);

module.exports = router;
