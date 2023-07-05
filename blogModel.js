const mongoose = require("mongoose");

const blogSchema = mongoose.Schema( {
    name: {type:String, required:true},
    content: String,
    author: String,
    date: {type: String, default: Date("<YYYY-mm-dd>").toString()}
} );

module.exports = mongoose.model("blog", blogSchema);