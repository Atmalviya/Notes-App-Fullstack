const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const noteSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    tags:{
        type: [String],
        required: false,
        default: [],
    },
    isPinned: {
        type: Boolean,
        default: false,
    },
    createdOn: {
        type: Date,
        default: Date.now(),
    }
});

module.exports = mongoose.model("Note", noteSchema)