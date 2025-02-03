const ConnectionRequest = require("../model/ConnectionRequest");
const validation = require("../utils/Validation");

const ConnectionRequestController = {
  sendRequest: async (req, res) => {
    try {
      const user = req.user;
      await validation.validSendRequestData(req);
      const { status, toUserId } = req.params;
      const fromUserId = user._id;

      const newConnectionRequest = new ConnectionRequest({
        fromUser: fromUserId,
        toUser: toUserId,
        status,
      });

      await newConnectionRequest.save();

      return res
        .status(200)
        .json({ message: "Request sent successfully!!!!", success: true });
    } catch (error) {
      res.status(500).json({ error: "Error!!! " + error.message });
    }
  },
  reviewRequest: async (req, res) => {
    try {
      await validation.validateReviewRequestData(req);
      const { status, requestId } = req.params;

      const currentRequest = await ConnectionRequest.findOne({
        _id: requestId,
      });

      if (!currentRequest) {
        return res.status(404).json({ error: "Request not found" });
      }

      currentRequest.status = status;

      await currentRequest.save();

      res
        .status(200)
        .json({
          message: `Connection request ${status} successfully!`,
          success: true,
        });
    } catch (error) {
      res.status(500).json({ error: "Error!!! " + error.message });
    }
  },
};

module.exports = ConnectionRequestController;
