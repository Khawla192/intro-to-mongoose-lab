const mongoose = require('mongoose');

// EXAMPLE OF HOW THE DATA SHOULD LOOK LIKE
// name: 'Ahmed'
// age: 25

const customerSchema = new mongoose.Schema({
    name: String,
    age: Number,
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
