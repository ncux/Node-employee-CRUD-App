const mongoose = require('mongoose');

const Employee = mongoose.Schema(
    {
        fullName: {type: String},
        email: {type: String},
        phone: {type: String},
        city: {type: String},
    },

);

module.exports = mongoose.model('Node_Employee_CRUD_App', Employee);
