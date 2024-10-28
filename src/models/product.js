const mongoose = require('mongoose');

productSchema = new mongoose.Schema({
   productname: {
            type: String,
            required: true
   },
   productdescription: {
           type: String,
           required: true
   },       
   productpriceeuros: {
           type: Number,
           required: true
   },
});

module.exports = mongoose.model('Product', productSchema);

