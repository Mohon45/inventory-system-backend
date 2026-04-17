const catchAsync = require("../../utils/catchAsync");
const { httpResponse } = require("../../utils/httpResponse");
const purchaseService = require("./purchase.service");

const completePurchase = catchAsync(async (req, res) => {
    try {
        const purchase = await purchaseService.completePurchase(
            req.body.reservation_id,
            req.body.user_id,
        );
        res.status(201).json(
            httpResponse(
                "success",
                purchase,
                "Purchase completed successfully",
            ),
        );
    } catch (error) {
        res.status(500).json(httpResponse("error", {}, error.message));
    }
});

const getUserPurchases = catchAsync(async (req, res) => {
    try {
        const purchases = await purchaseService.getUserPurchases(req.params.userId);
        res.status(200).json(httpResponse("success", purchases, "User purchases retrieved"));
    } catch (error) {
        res.status(500).json(httpResponse("error", {}, error.message));
    }
});

module.exports = { completePurchase, getUserPurchases };
