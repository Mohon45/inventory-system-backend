const catchAsync = require("../../utils/catchAsync");
const { httpResponse } = require("../../utils/httpResponse");
const userService = require("./user.service");

const createOrGetUser = catchAsync(async (req, res) => {
    try {
        const { username } = req.body;
        const { user, isNew } = await userService.createOrGetUser(username);
        res.status(isNew ? 201 : 200).json(httpResponse("success", user));
    } catch (error) {
        res.status(500).json(httpResponse("error", {}, error.message));
    }
});

module.exports = { createOrGetUser };
