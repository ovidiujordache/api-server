const express = require('express');
const mongoose = require('mongoose');
const Customer = require('./models/customer');
const Product = require('./models/product');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
//dotenv.config();

const app = express();
const cors = require('cors');
// require("dotenv").config();
mongoose.set('strictQuery', false);

const corsOptions = {
  origin: 'http://localhost:3000', 
  methods: ['GET', 'POST'], 
  credentials: true, 
};

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if(process.env.NODE_ENV !== 'production') {
   require('dotenv').config();
}

const PORT = process.env.PORT || 5000;
const CONNECTION = process.env.CONNECTION;
const SECRETKEY = process.env.SECRETKEY;

async function authenticateCustomer(emailid, authpassword) {
  const customer = await Customer.findOne({ customeremail: emailid }); 
  if (!customer) {
     return null; 
  }
  const isMatch = await bcrypt.compare(authpassword, customer.password);
  return isMatch ? customer : null;
}



//customer.save();

app.get('/', (req, res) => {
   res.send("Welcome!");
});

app.get('/api/customers', async (req, res) => {
  console.log(await mongoose.connection.db.listCollections().toArray());
  try {
     const result = await Customer.find();
	   res.json({"customers": result});
  } catch(e){
    res.status(500).json({error: e.message});
  };
});

app.get('/api/products', async (req, res) => {
  console.log(await mongoose.connection.db.listCollections().toArray());
  try {
     const result = await Product.find();
       res.json({"products": result});
  } catch(e){
    res.status(500).json({error: e.message});
  };
});

app.post('/api/customers', async (req, res) => {
   console.log(req.body);
   const customer = new Customer(req.body);
   try {
      await customer.save();
      res.status(201).json({customer});
   } catch(e) {
      res.status(400).json({error: e.message});
   };
});

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

app.post('/auth/register', async (req, res) => {
    const { customername, customeremail, password } = req.body;
    console.log('SECRETKEY:', SECRETKEY); 
    console.log("customername", customername);
    console.log("customeremail", customeremail);
    console.log("password", password);

    if (!customername || !customeremail || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const existingCustomer = await Customer.findOne({ customeremail });
    if (existingCustomer) {
        return res.status(400).json({ error: 'Email already registered' });
    }

    const customer = new Customer({
        customername,
        customeremail,
        password,
    });

 
    try {
        await customer.save();
      
        return res.status(201).json({
            customeremail: customer.customeremail,
            customername: customer.customername,
       
        });
    } catch (error) {
        console.error('Error saving customer:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});



app.post('/auth/login', async (req, res) => {
    const { customeremail, password } = req.body;

  
    const customer = await authenticateCustomer(customeremail, password);


    if (!customer) {
        return res.status(401).json({ error: 'Authentication failed' });
    }

    const token = jwt.sign(
        { customerId: customer._id, customeremail: customer.customeremail },
        SECRETKEY,
        { expiresIn: '1h' } 
    );

   
    res.json({
        token,
        customer: {
            email: customer.customeremail,
            name: customer.customername 
        }
    });
});


app.get('/api/customers/:id', async(req, res) => {
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
});

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

app.put('/api/customers/:id', async(req, res) => {
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
});

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


app.patch('/api/customers/:id', async(req, res) => {
   try {
       const customerId = req.params.id;
       const customer = await Customer.findOneAndUpdate({_id: customerId}, req.body, {new: true});
       console.log(customer);
       res.json({customer});
  } catch (e) {
       console.log(e.message);
       res.status(500).json({error: 'something went wrong'});
  }  
});

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

app.delete('/api/customers/:id', async(req, res) => {
  try {
    const customerId = req.params.id;
    const result = await Customer.deleteOne({_id: customerId});
    res.json({deletedCount: result.deletedCount});
  } catch(e){
    res.status(500).json({error: "Something went wrong"});
  } 
});

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