const mongoose = require("mongoose");

let postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        default: Date.now,
    },
    author: String,
});

module.exports = mongoose.model("Post", postSchema);