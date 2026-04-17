const express = require('express');
const router = express.Router();

const userRoutes = require('../modules/user/user.route');
const dropRoutes = require('../modules/drop/drop.route');
const reservationRoutes = require('../modules/reservation/reservation.route');
const purchaseRoutes = require('../modules/purchase/purchase.route');

router.use('/users', userRoutes);
router.use('/drops', dropRoutes);
router.use('/reservations', reservationRoutes);
router.use('/purchases', purchaseRoutes);

module.exports = router;
