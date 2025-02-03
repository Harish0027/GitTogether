const mongoose = require("mongoose");

const ConnectionRequestSchema = new mongoose.Schema(
  {
    toUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["ignore", "interasted", "accepted", "rejected"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ConnectionRequest", ConnectionRequestSchema);
