const mongoose = require('mongoose');

customerSchema = new mongoose.Schema({
   customername: {
   	    type: String,
   	    required: true
   },
   customeremail: {
	   type: String,
	   required: true
   },	    
   customertelnumber: {
	   type: String,
	   required: true
   },	   
});

module.exports = mongoose.model('Customer', customerSchema);


