   const mongoose = require('mongoose');
   const bcrypt = require('bcrypt');
   SALT_WORK_FACTOR = 10;

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
   	   required: false
      },
      password: {
         type: String,
         required: true
      },
   });

   customerSchema.pre('save', function(next) {
       let customer = this;

       // only hash the password if it has been modified (or is new)
       if (!customer.isModified('password')) return next();

       // generate a salt
       bcrypt.genSalt(SALT_WORK_FACTOR, async function(err, salt) {
       if (err) return next(err);

       // hash the password using our new salt
       await bcrypt.hash(customer.password, salt, function(err, hash) {
           if (err) return next(err);

           // override the cleartext password with the hashed one
           customer.password = hash;
           next();
       });
   });

   });

    // Hashing data before updating into database
  customerSchema.pre("put", async function (next) {
  try {
    if (this._update.password) {
      const hashed = await bcrypt.hash(this._update.password, SALT_WORK_FACTOR);
      this._update.password = hashed;
    }
      next();
    } catch (err) {
      return next(err);
    }
   });

   // Hashing data before updating into database
  customerSchema.pre("findOneAndUpdate", async function (next) {
  try {
    if (this._update.password) {
      const hashed = await bcrypt.hash(this._update.password, SALT_WORK_FACTOR);
      this._update.password = hashed;
    }
      next();
    } catch (err) {
      return next(err);
    }
   });

   customerSchema.methods.comparePassword = function(candidatePassword, cb) {
       bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
           if (err) return cb(err);
           cb(null, isMatch);
       });
   };

   module.exports = mongoose.model('Customer', customerSchema);


