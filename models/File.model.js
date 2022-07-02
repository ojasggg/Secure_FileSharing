const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema(
  {
    fileOriginalName: {
      type: String,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    password: String,
    downloadCount: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("File", FileSchema);
