const express = require('express');
const router = express.Router();
const reservationController = require('./reservation.controller');
const validate = require('../../middleware/validate');
const { createReservationSchema, getUserReservationsSchema } = require('./reservation.validation');

router.post('/', validate(createReservationSchema), reservationController.createReservation);
router.get('/user/:userId', validate(getUserReservationsSchema), reservationController.getUserReservations);

module.exports = router;
