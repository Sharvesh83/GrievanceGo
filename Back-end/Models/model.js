const mongoose = require("mongoose");

const DataSchema = mongoose.Schema(
  {
    name: { type: String, require: true },
    wardno: { type: Number, require: true },
    phoneno: { type: String, require: true },
    arealimit: { type: String, require: true },
    subject: { type: String, require: true },
    department: { type: String, require: true },
    address: { type: String },
    description: { type: String, require: true },
    userId: { type: String, required: true }, // Auth0 sub
    createdBy: { type: String, required: true }, // Auth0 email/name
    chats: [{ type: String }],
    createdOn: { type: Date },
    resolvedOn: { type: Date },
    status: { type: String, default: "In progress" },
  },
  {
    timestamps: true,
  }
);

// module.exports = mongoose.model("reginfo", DataSchema);

const Grievance = mongoose.model("Grievance", DataSchema);

module.exports = { Grievance };
