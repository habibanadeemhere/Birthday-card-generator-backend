import mongoose from "mongoose";

const cardSchema = new mongoose.Schema(
  {
    recipientName: {
      type: String,
      required: [true, "Recipient name is required"],
      trim: true,
      maxlength: 60,
    },
    senderName: {
      type: String,
      required: [true, "Sender name is required"],
      trim: true,
      maxlength: 60,
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      maxlength: 500,
    },
    theme: {
      type: String,
      enum: [
        "velvet-confetti",
        "citrus-pop",
        "galaxy-candles",
        "mint-parade",
        "rose-bloom",
        "midnight-glass",
      ],
      default: "midnight-glass",
    },
    font: {
      type: String,
      enum: ["playfair", "caveat", "quicksand"],
      default: "playfair",
    },
    // Optional small base64-encoded photo (data URL). Kept small on purpose.
    photo: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const Card = mongoose.model("Card", cardSchema);

export default Card;
