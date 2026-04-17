const catchAsync = require("../../utils/catchAsync");
const { httpResponse } = require("../../utils/httpResponse");
const dropService = require("./drop.service");

const createDrop = catchAsync(async (req, res) => {
    try {
        const drop = await dropService.createDrop(req.body);
        res.status(201).json(
            httpResponse("success", drop, "Drop created successfully"),
        );
    } catch (error) {
        res.status(500).json(httpResponse("error", {}, error.message));
    }
});

const getActiveDrops = catchAsync(async (req, res) => {
    try {
        const drops = await dropService.getActiveDrops();
        res.status(200).json(
            httpResponse("success", drops, "Drops fetched successfully"),
        );
    } catch (error) {
        res.status(500).json(httpResponse("error", {}, error.message));
    }
});

const getDrop = catchAsync(async (req, res) => {
    try {
        const drop = await dropService.getDropById(req.params.id);
        res.status(200).json(
            httpResponse("success", drop, "Drop fetched successfully"),
        );
    } catch (error) {
        res.status(500).json(httpResponse("error", {}, error.message));
    }
});

const deactivateDrop = catchAsync(async (req, res) => {
    try {
        const drop = await dropService.deactivateDrop(req.params.id);
        res.status(200).json(
            httpResponse("success", drop, "Drop deactivated successfully"),
        );
    } catch (error) {
        res.status(500).json(httpResponse("error", {}, error.message));
    }
});

module.exports = { createDrop, getActiveDrops, getDrop, deactivateDrop };
