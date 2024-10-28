const express = require('express');
const mongoose = require('mongoose');
const Customer = require('./models/customer');
const Product = require('./models/product');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const cors = require('cors');
// require("dotenv").config();
mongoose.set('strictQuery', false);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if(process.env.NODE_ENV !== 'production') {
   require('dotenv').config();
}

const PORT = process.env.PORT || 5000;
const CONNECTION = process.env.CONNECTION;


//customer.save();

app.get('/', (req, res) => {
   res.send("Welcome!");
});

/*app.get('/api/customers', async (req, res) => {
  console.log(await mongoose.connection.db.listCollections().toArray());
  try {
     const result = await Customer.find();
	   res.json({"customers": result});
  } catch(e){
    res.status(500).json({error: e.message});
  };
});*/

app.get('/api/products', async (req, res) => {
  console.log(await mongoose.connection.db.listCollections().toArray());
  try {
     const result = await Product.find();
       res.json({"products": result});
  } catch(e){
    res.status(500).json({error: e.message});
  };
});

/*app.post('/api/customers', async (req, res) => {
   console.log(req.body);
   const customer = new Customer(req.body);
   try {
      await customer.save();
      res.status(201).json({customer});
   } catch(e) {
      res.status(400).json({error: e.message});
   };
});*/

app.post('/api/products', async (req, res) => {
   console.log(req.body);
   const product = new Product(req.body);
   try {
      await product.save();
      res.status(201).json({product});
   } catch(e) {
      res.status(400).json({error: e.message});
   };
});

/*app.get('/api/customers/:id', async(req, res) => {
   console.log({
       requestParams: req.params,
       requestQuery: req.query
   });
   try {
      const {id: customerId} = req.params;
      console.log(customerId); 
      const customer = await Customer.findById(customerId);
      console.log(customer);
      if(!customer) {
        res.status(404).json({error: 'User not found'});
      } else {
        res.json({customer});
      }
   } catch(e) {
      res.status(500).json({error: 'something went wrong'});
   }
});*/

app.get('/api/products/:id', async(req, res) => {
   console.log({
       requestParams: req.params,
       requestQuery: req.query
   });
   try {
      const {id: productId} = req.params;
      console.log(productId); 
      const product = await Product.findById(productId);
      console.log(product);
      if(!product) {
        res.status(404).json({error: 'User not found'});
      } else {
        res.json({product});
      }
   } catch(e) {
      res.status(500).json({error: 'something went wrong'});
   }
});

/*app.put('/api/customers/:id', async(req, res) => {
  try {
       const customerId = req.params.id;
       // const result = await Customer.replaceOne({_id: customerId}, req.body);
       const customer = await Customer.findOneAndReplace({_id: customerId}, req.body, {new: true});
       console.log(customer);
       // res.json({updatedCount: result.modifiedCount});
       res.json({customer});
  } catch (e) {
       console.log(e.message);
       res.status(500).json({error: 'something went wrong'});
  }     
});*/

app.put('/api/products/:id', async(req, res) => {
  try {
       const productId = req.params.id;
       // const result = await Customer.replaceOne({_id: customerId}, req.body);
       const product = await Product.findOneAndReplace({_id: productId}, req.body, {new: true});
       console.log(product);
       // res.json({updatedCount: result.modifiedCount});
       res.json({product});
  } catch (e) {
       console.log(e.message);
       res.status(500).json({error: 'something went wrong'});
  }     
});


/*app.patch('/api/customers/:id', async(req, res) => {
   try {
       const customerId = req.params.id;
       const customer = await Customer.findOneAndUpdate({_id: customerId}, req.body, {new: true});
       console.log(customer);
       res.json({customer});
  } catch (e) {
       console.log(e.message);
       res.status(500).json({error: 'something went wrong'});
  }  
});*/

app.patch('/api/products/:id', async(req, res) => {
   try {
       const productId = req.params.id;
       const product = await Product.findOneAndUpdate({_id: productId}, req.body, {new: true});
       console.log(product);
       res.json({product});
  } catch (e) {
       console.log(e.message);
       res.status(500).json({error: 'something went wrong'});
  }  
});

//app.patch('/api/orders/:id', async(req, res) => {
//   console.log(req.params);
//   const orderId = req.params.id;
//   req.body._id = orderId;
//   try {
//       const result = await Customer.findOneAndUpdate(
//          {'orders._id' : orderId},
//          { $set: {'orders.$': req.body }},
//          { new: true} 
//        );
//
//       console.log(result);
//
//       if (result){
//          res.json(result);
//       } else {
//          res.status(404).json({error: 'order not found'});
//       }
//   } catch(e) {
//      console.log(e.message);
//      res.status(500).json({error: 'something went wrong'});
//   }
// });

//app.get('/api/orders/:id', async(req, res) => {
//   try {
//      const result = await Customer.findOne({'orders._id': req.params.id});
//      if (result) {
//         res.json(result);
//      } else {
//        res.status(404).json({'error': 'Order not found'});
//      }
//
//   } catch (e) {
//     console.log(e);
//     res.status(500).json({error: 'something went wrong'}); 
//   }

//});

/*app.delete('/api/customers/:id', async(req, res) => {
  try {
    const customerId = req.params.id;
    const result = await Customer.deleteOne({_id: customerId});
    res.json({deletedCount: result.deletedCount});
  } catch(e){
    res.status(500).json({error: "Something went wrong"});
  } 
});
*/
app.delete('/api/products/:id', async(req, res) => {
  try {
    const productId = req.params.id;
    const result = await Product.deleteOne({_id: productId});
    res.json({deletedCount: result.deletedCount});
  } catch(e){
    res.status(500).json({error: "Something went wrong"});
  } 
});

app.post('/', (req, res) => {
   res.send('This is a post request.')
});

const start = async() => {
  try {
       await mongoose.connect(CONNECTION);
 

       app.listen(PORT, () => {
       console.log('App listening on port ' + PORT);
      });
} catch(e) {
   console.log(e.message);
 }
};

start();