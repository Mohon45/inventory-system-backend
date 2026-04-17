const catchAsync = require("../../utils/catchAsync");
const { httpResponse } = require("../../utils/httpResponse");
const reservationService = require("./reservation.service");

const createReservation = catchAsync(async (req, res) => {
    try {
        const reservation = await reservationService.createReservation(
            req.body.drop_id,
            req.body.user_id,
        );
        res.status(201).json(httpResponse("success", reservation));
    } catch (error) {
        res.status(500).json(httpResponse("error", {}, error.message));
    }
});

const getUserReservations = catchAsync(async (req, res) => {
    try {
        const reservations = await reservationService.getUserReservations(
            req.params.userId,
        );
        res.status(200).json(httpResponse("success", reservations));
    } catch (error) {
        res.status(500).json(httpResponse("error", {}, error.message));
    }
});

module.exports = { createReservation, getUserReservations };
