const mongoose = require("mongoose");

const userSchema = mongoose.Schema( {
    userName:{"type": "String", require: true},
    password:{"type": "String", require: true},
    usersBlogsID:[]
} );

module.exports = mongoose.model("user", userSchema);