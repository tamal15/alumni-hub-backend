const express = require("express")
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;
const { v4: uuidv4 } = require("uuid");
require('dotenv').config();
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
// app.use(express.urlencoded({ extended: true }));
const SSLCommerzPayment = require('sslcommerz')
// app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use(express.json())

// pizzahub_bd 
// OfExTH7qprxutPEi 
const uri = `mongodb+srv://carp27711:S0dlPqVP7Ql3ogOS@cluster0.4awdg7q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.li1977d.mongodb.net/?retryWrites=true&w=majority`; 
// // const uri = "mongodb://localhost:27017"
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {

    try {
        await client.connect();
        console.log("connected to database");
        // const database = client.db('PizzaHUB');
        const database = client.db('CarWash');


        const userCollection = database.collection('users');
        const buyerCollection = database.collection('buyerproducts');
        const branchCollection = database.collection('branchName');
        const contactCollection = database.collection('contact');
        const paymentCollection = database.collection('paymentData');
        const feedbacksCollection = database.collection('userfeedbacks');
        const carStoreCollection = database.collection('carstore');
        const adminUploadEquipCollection = database.collection('adminEquipment');
        const shareCollection = database.collection('sharePost');
        const orderEquipmentCollection = database.collection('orderEquipment');
        const telpumpserviceCollection = database.collection('telpump');



        // add database user collection 
        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log(user)
            const result = await userCollection.insertOne(user);
            // console.log(body)
            res.json(result);

        });
        app.get('/userdata', async (req, res) => {
            
            const result = await userCollection.find({}).toArray()
            // console.log(body)
            res.json(result);

        })
        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log(user)
            const result = await userCollection.insertOne(user);
            // console.log(body)
            res.json(result);

        })


        app.put('/users', async (req, res) => {
            const user = req.body;
            console.log(user)
            const filter = { email: user.email }
            const option = { upsert: true }
            const updateDoc = { $set: user }
            const result = await userCollection.updateOne(filter, updateDoc, option)
            res.json(result)
        });

          // update profile 

    app.put('/updateUser', async(req,res)=>{
        const user=req.body;
        const query={email:user.email}
        const updateDoc={
            $set:{
                address:user.address,
                mobile:user.mobile
            }
        }
        const result=await userCollection.updateOne(query,updateDoc);
        res.json(result)
    });

              // update sharepost

              app.put('/postShare', async(req,res)=>{
                const user=req.body;
                console.log(user)
                // const query={email:user.email}
                const query={code:req.body.code}
                console.log(query)
                const updateDoc={
                    $set:{  
                        shareName:user.shareName,
                        // mobile:user.mobile
                    }
                }
                const result=await shareCollection.updateOne(query,updateDoc);
                console.log(result)
                res.json(result)
            });

     // user profile email 
     app.get('/updateUser/:email', async(req,res)=>{
        const email=req.params.email;
        const query={email:email};
        const result=await userCollection.findOne(query)
        res.json(result)
    });


        // database admin role 
        app.put('/userLogin/admin', async (req, res) => {
            const user = req.body;
            console.log('put', user)
            const filter = { email: user.email }
            const updateDoc = { $set: { role: 'admin' } }
            const result = await userCollection.updateOne(filter, updateDoc)
            res.json(result)
        });

        // database searching check admin 
        app.get('/userLogin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email }
            const user = await userCollection.findOne(query)
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin })
        });


        // database searching check buyer
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email }
            const user = await userCollection.findOne(query)
            let isbuyer = false;
            if (user?.client === 'buyer') {
                isbuyer = true;
            }
            res.json({ buyer: isbuyer })
        });


       
        app.post('/PostUploadBuyer', async (req, res) => {
            const user = req.body;
            const result = await buyerCollection.insertOne(user);
            res.json(result)
        });

        app.get('/PostUploadBuyer', async (req, res) => {
            const result = await buyerCollection.find({}).toArray()
            res.json(result)
        });

        

              
                app.post('/PostUploadpizza', async (req, res) => {
                    const user = req.body;
                    const result = await adminUploadEquipCollection.insertOne(user);
                    res.json(result)
                });
        

                app.get('/PostUploadpizza', async (req, res) => {
                    const result = await adminUploadEquipCollection.find({}).toArray()
                    res.json(result)
                });

                // admin product details 
                 app.get('/adminDetailsproduct/:id', async (req, res) => {
                 const id = req.params.id;
                 const result = await adminUploadEquipCollection.findOne({ _id: ObjectId(id) });
                 res.json(result)
                 });

                app.get("/PostUploadpizza/:email", async (req, res) => {
                    // const buyeremail=req.body.cartProducts.map((data)=>data.buyerEmail)
                    console.log(req.params.email);
                    const email = req.params.email;
                    const result = await buyerCollection
                        .find({ buyerEmail: email })
                        .toArray();
                    console.log(result)
                    res.send(result);
                });



              

                app.get("/carWashsShow", async (req, res) => {
                    const page = req.query.page;
                    const size = parseInt(req.query.size);
                    const query = req.query;
                    delete query.page
                    delete query.size
                    Object.keys(query).forEach(key => {
                        if (!query[key])
                            delete query[key]
                    });
            
                    if (Object.keys(query).length) {
                        const cursor = buyerCollection.find(query, status = "approved");
                        const count = await cursor.count()
                        const allQuestions = await cursor.skip(page * size).limit(size).toArray()
                        res.json({
                            allQuestions, count
                        });
                    } else {
                        const cursor = buyerCollection.find({
                            // status: "approved"
                        });
                        const count = await cursor.count()
                        const allQuestions = await cursor.skip(page * size).limit(size).toArray()
            
                        res.json({
                            allQuestions, count
                        });
                    }
            
                });


        app.get('/UploadBuyerProduct/:id', async (req, res) => {
            const id = req.params.id;
            const result = await buyerCollection.findOne({ _id: ObjectId(id) });
            res.json(result)
        });



      
        // get burger
        app.get("/products", async (req, res) => {
            const page = req.query.page;
            const size = parseInt(req.query.size);
            const query = req.query;
            delete query.page
            delete query.size
            Object.keys(query).forEach(key => {
                if (!query[key])
                    delete query[key]
            });

            if (Object.keys(query).length) {
                const cursor = buyerCollection.find(query, status = "approved");
                const count = await cursor.count()
                const allData = await cursor.skip(page * size).limit(size).toArray()
                res.json({
                    allData, count
                });
            } else {
                const cursor = buyerCollection.find({
                    // status: "approved"
                });
                const count = await cursor.count()
                const allData = await cursor.skip(page * size).limit(size).toArray()

                res.json({
                    allData, count
                });
            }

        });


        // myorder show 

        app.get("/myOrder/:email", async (req, res) => {
            // const buyeremail=req.body.cartProducts.map((data)=>data.buyerEmail)
            console.log(req.params.email);
            const email = req.params.email;
            const result = await paymentCollection
              .find({ cus_email: email })
              .toArray();
            res.send(result);
          });


        //   myorder delete 

        app.delete("/manageAllOrderDelete/:id", async (req, res) => {
            const result = await paymentCollection.deleteOne({_id:ObjectId(req.params.id)});
            res.send(result);
          });


        //   details product 
        // app.get('/product', async(req,res)=>{
        //     const branchs=req.body
        //     console.log(branchs)
        //     // const query={branch:branchs}
        //     const result=await buyerCollection.findOne(branchs)
        //     res.json(result)
        //   });

        app.get('/product', async (req, res) => {
            const body = req.body;
            const result = await buyerCollection.find({}).toArray()
            res.json(result)
        });

        //   branch name 
        app.post('/branch', async (req, res) => {
            const user = req.body;
            console.log(user)
            const result = await carStoreCollection.insertOne(user);
            // console.log(body)
            res.json(result);

        });

        app.get('/branchshow', async (req, res) => {
            // const id = req.params.id;
            const result = await branchCollection.findOne({});
            res.json(result)
        });


       

        // get branch
        app.get("/branch", async (req, res) => {
            const page = req.query.page;
            const size = parseInt(req.query.size);
            const query = req.query;
            delete query.page
            delete query.size
            Object.keys(query).forEach(key => {
                if (!query[key])
                    delete query[key]
            });

            if (Object.keys(query).length) {
                const cursor = carStoreCollection.find(query, status = "approved");
                const count = await cursor.count()
                const allData = await cursor.skip(page * size).limit(size).toArray()
                res.json({
                    allData, count
                });
            } else {
                const cursor = carStoreCollection.find({
                    // status: "approved"
                });
                const count = await cursor.count()
                const allData = await cursor.skip(page * size).limit(size).toArray()

                res.json({
                    allData, count
                });
            }

        });
        app.get("/branchPump", async (req, res) => {
            const page = req.query.page;
            const size = parseInt(req.query.size);
            const query = req.query;
            delete query.page
            delete query.size
            Object.keys(query).forEach(key => {
                if (!query[key])
                    delete query[key]
            });

            if (Object.keys(query).length) {
                const cursor = telpumpserviceCollection.find(query, status = "approved");
                const count = await cursor.count()
                const allData = await cursor.skip(page * size).limit(size).toArray()
                res.json({
                    allData, count
                });
            } else {
                const cursor = telpumpserviceCollection.find({
                    // status: "approved"
                });
                const count = await cursor.count()
                const allData = await cursor.skip(page * size).limit(size).toArray()

                res.json({
                    allData, count
                });
            }

        });

        app.get('/branch/:id', async (req, res) => {
            const id = req.params.id;
            const result = await carStoreCollection.findOne({ _id: ObjectId(id) });
            res.json(result)
        });
        app.get('/telpumpdetails/:id', async (req, res) => {
            const id = req.params.id;
            const result = await telpumpserviceCollection.findOne({ _id: ObjectId(id) });
            res.json(result)
        });
        app.get('/buyerDetailsproduct/:id', async (req, res) => {
            const id = req.params.id;
            const result = await buyerCollection.findOne({ _id: ObjectId(id) });
            res.json(result)
        });

        // admin pizza pasta details 
        app.get('/Detailsproduct/:id', async (req, res) => {
            const id = req.params.id;
            const result = await adminUploadEquipCollection.findOne({ _id: ObjectId(id) });
            res.json(result)
        });

        // contact databse 
        app.post('/contact', async (req, res) => {
            const data = req.body;
            const result = await contactCollection.insertOne(data);
            res.json(result)
        });

        // contact database show the ui 
        app.get('/contact', async (req, res) => {
            const data = contactCollection.find({})
            const result = await data.toArray()
            res.json(result)
        });

        

        app.get('/userOrder', async(req,res)=>{
            const userOrders=orderEquipmentCollection.find({})
            const orderResult=await userOrders.toArray()
            res.json(orderResult)
        })

        app.get("/buyerproducts/:email", async (req, res) => {
            // const buyeremail=req.body.cartProducts.map((data)=>data.buyerEmail)
            console.log(req.params.email);
            const email = req.params.email;
            const result = await buyerCollection
                .find({ buyerEmail: email })
                .toArray();
            console.log(result)
            res.send(result);
        });

        // admin 

        app.get("/admiinsCars", async (req, res) => {
            const page = req.query.page;
            const size = parseInt(req.query.size);
            const query = req.query;
            delete query.page
            delete query.size
            Object.keys(query).forEach(key => {
                if (!query[key])
                    delete query[key]
            });

            if (Object.keys(query).length) {
                const cursor = adminUploadEquipCollection.find(query, status = "approved");
                const count = await cursor.count()
                const allData = await cursor.skip(page * size).limit(size).toArray()
                res.json({
                    allData, count
                });
            } else {
                const cursor = adminUploadEquipCollection.find({
                    // status: "approved"
                });
                const count = await cursor.count()
                const allData = await cursor.skip(page * size).limit(size).toArray()

                res.json({
                    allData, count
                });
            }

        });

          // feedback 
        app.post('/feedbacks', async(req,res) =>{
            const user=req.body;
          console.log(user)
            // console.log(like)
            const result=await feedbacksCollection.insertOne(user);
            res.json(result)
        });
        app.get('/feedbacks', async(req,res)=>{
            const result=await feedbacksCollection.find({}).toArray()
            res.json(result)
        });
          // sharepost
        app.post('/sharePost', async(req,res) =>{
            const user=req.body;
          console.log(user)
            // console.log(like)
            const result=await shareCollection.insertOne(user);
            res.json(result)
        });

        // order food
        app.post('/orderFood', async(req,res) =>{
            const user=req.body;
          console.log(user)
            // console.log(like)
            const result=await orderEquipmentCollection.insertOne(user);
            res.json(result)
        });


        // carWashsservice name post 
                app.post('/carWashsservice', async(req,res) =>{
            const user=req.body;
          console.log(user);
          
            const result=await carStoreCollection.insertOne(user);
            res.json(result)
        });
        // telpump name post 
                app.post('/telpumpservice', async(req,res) =>{
            const user=req.body;
          console.log(user);
          
            const result=await telpumpserviceCollection.insertOne(user);
            res.json(result)
        });

         app.get('/carWashsservice', async(req,res)=>{
            const result=await carStoreCollection.find({}).toArray()
            res.json(result)
        });
         app.get('/pumpService', async(req,res)=>{
            const result=await telpumpserviceCollection.find({}).toArray()
            res.json(result)
        });

         app.put('/service', async (req, res) => {
        
            console.log(req.body)
            // const filter = { _id: ObjectId(req.params.id) };
            const query={
                branch:req.body.branch}
            const options = { upsert: true };
            // const data=req.body
           
               
                    const updateDoc = { $push: { services: req.body } };
                    const result = await carStoreCollection.updateOne(query, updateDoc, options);
                    res.json(result)
                
              


    });
         app.put('/Singleservice', async (req, res) => {
        
            console.log(req.body)
            // const filter = { _id: ObjectId(req.params.id) };
            const query={
                branch:req.body.branch}
            const options = { upsert: true };
            // const data=req.body
           
               
                    const updateDoc = { $push: { services: req.body } };
                    const result = await telpumpserviceCollection.updateOne(query, updateDoc, options);
                    res.json(result)
                
              


    });

     app.get("/my/:email", async (req, res) => {
    // const buyeremail=req.body.emails.map((data)=>data.buyerEmail)
    // console.log(emails)
    // console.log(req.params.email);
    const email = req.params.email;
    console.log(email)
    const result = await paymentCollection
      .find({ emails: email })
      .toArray();
    res.send(result);
  });


    // customer order 

    app.get("/mys", async (req, res) => {
       
        const email = req.params.email;
        console.log(email)
        const result = await paymentCollection
          .find()
          .toArray();
        res.send(result);
      });

      // upadate status for put api 
 app.put('/updateStatus/:id', async(req,res)=>{
    const id=req.params.id;
    const updateDoc=req.body.status;
    console.log(updateDoc)
    console.log(updateDoc)
    const filter={_id:ObjectId(id)}
    const result=await paymentCollection.updateOne(filter,{
        $set:{status:updateDoc}
    })
    res.json(result)
});

// Delete manage all product ----------
app.delete("/manageAllOrderDelete/:id", async (req, res) => {
    const result = await paymentCollection.deleteOne({_id:ObjectId(req.params.id)});
    res.send(result);
  });



//   admin all product show 
app.get("/adminShowproduct", async (req, res) => {
        const page = req.query.page;
        const size = parseInt(req.query.size);
        const query = req.query;
        delete query.page
        delete query.size
        Object.keys(query).forEach(key => {
            if (!query[key])
                delete query[key]
        });

        if (Object.keys(query).length) {
            const cursor = buyerCollection.find(query, status = "approved");
            const count = await cursor.count()
            const allQuestions = await cursor.skip(page * size).limit(size).toArray()
            res.json({
                allQuestions, count
            });
        } else {
            const cursor = buyerCollection.find({
                // status: "approved"
            });
            const count = await cursor.count()
            const allQuestions = await cursor.skip(page * size).limit(size).toArray()

            res.json({
                allQuestions, count
            });
        }

    });


    // admin update product 
    // so store the data 

    app.get('/update/:id', async(req,res)=>{
        const id=req.params.id;
        const query={_id:ObjectId(id)};
        const user=await buyerCollection.findOne(query)
        res.json(user)
    });


    // update product 

    app.put("/updateProduct/:id", async (req, res) => {

        const id=req.params.id;
        const updateUser=req.body
        console.log(updateUser)
        const filter={_id: ObjectId(id)};
        const options={upsert:true};

        const updateDoc={
            $set:{
                productName:updateUser.productName,
                ProductPrice:updateUser.ProductPrice
            }
        }
        const result=await buyerCollection.updateOne(filter,updateDoc,options);
        console.log('uodateinf',id);
        res.json(result)

    });


    // admin product delete 

    app.delete('/deleteadmin/:id',async(req,res)=>{
        const result= await buyerCollection.deleteOne({_id:ObjectId(req.params.id)});
        res.json(result)
    });


        // ssl commerce init 

        app.post('/init', async(req, res) => {
            // console.log(req.body)
            const email=req.body.cartProducts.map((data)=>data.buyerEmail)
            const schedule=req.body.cartProducts.map((data)=>data.schedule)
            const adminemail=req.body.cartProducts.map((data)=>data.adminEmail)
            console.log(email)
            console.log(schedule)
            const data = {
                emails:email,
                admindata:adminemail,
                total_amount: req.body.total_amount,
                currency: req.body.currency,
                tran_id: uuidv4(),
                success_url: 'http://localhost:5000/success',
                fail_url: 'http://localhost:5000/fail',
                cancel_url: 'http://localhost:5000/cancel',
                ipn_url: 'http://yoursite.com/ipn',
                shipping_method: 'Courier',
                product_name: "req.body.product_name",
                product_category: 'Electronic',
                product_profile: "req.body.product_profile",
                cus_name: req.body.cus_name,
                cus_email: req.body.cus_email,
                date: req.body.date,
                // data update 
                status: req.body.status,
                cartProducts: req.body.cartProducts,
                // buyerDetails: req.body.email,
                // buyerDetails: req.body.console.log(cartProducts),
                product_image: "https://i.ibb.co/t8Xfymf/logo-277198595eafeb31fb5a.png",
                cus_add1: req.body.cus_add1,
                cus_add2: 'Dhaka',
                cus_city: req.body.cus_city,
                date: req.body.date,
                code: req.body.code, 
                item: req.body.item,
                schedules:req.body.schedules,
                purchase:req.body.purchase,
                ShareName: req.body.ShareName,
                mobile: req.body.mobile,
                cus_state:  req.body.cus_state,
                cus_postcode: req.body.cus_postcode,
                cus_country: req.body.cus_country,
                cus_phone: req.body.cus_phone,
                cus_fax: '01711111111',
                ship_name: 'Customer Name',
                ship_add1: 'Dhaka',
                ship_add2: 'Dhaka',
                ship_city: 'Dhaka',
                ship_state: 'Dhaka',
                ship_postcode: 1000,
                ship_country: 'Bangladesh',
                multi_card_name: 'mastercard',
                value_a: 'ref001_A',
                value_b: 'ref002_B',
                value_c: 'ref003_C',
                value_d: 'ref004_D'
            };
            // insert order data into database 
            const order=await paymentCollection.insertOne(data)
            console.log(data)
            const sslcommer = new SSLCommerzPayment(process.env.STORE_ID,process.env.STORE_PASSWORD,false) //true for live default false for sandbox
            sslcommer.init(data).then(data => {
                //process the response that got from sslcommerz 
                //https://developer.sslcommerz.com/doc/v4/#returned-parameters
                // console.log(data);
                // res.redirect(data.GatewayPageURL)
                if(data.GatewayPageURL){
                    res.json(data.GatewayPageURL)
                  }
                  else{
                    return res.status(400).json({
                      message:'payment session failed'
                    })
                  }
            });
        });

        app.post('/success',async(req,res)=>{
            // console.log(req.body)
            const order = await paymentCollection.updateOne({tran_id:req.body.tran_id},{
                $set:{
                  val_id:req.body.val_id
                }
            
              })
            res.status(200).redirect(`http://localhost:3000/success/${req.body.tran_id}`)
            // res.status(200).json(req.body)
        })
        
        app.post ('/fail', async(req,res)=>{
            // console.log(req.body);
          const order=await paymentCollection.deleteOne({tran_id:req.body.tran_id})
            res.status(400).redirect('http://localhost:3000')
          })
          app.post ('/cancel', async(req,res)=>{
            // console.log(req.body);
            const order=await paymentCollection.deleteOne({tran_id:req.body.tran_id})
            res.status(200).redirect('http://localhost:3000')
          })
        // store data 
        
          app.get('/orders/:tran_id', async(req,res)=>{
            const id=req.params.tran_id;
            const order =await paymentCollection.findOne({tran_id:id});
            console.log(order)
            res.json(order)
          });



        //   SharepostShow 

       
        app.get('/sharePostShow', async (req, res) => {
            const data = shareCollection.find({})
            const result = await data.toArray()
            res.json(result)
        })
        //   app.get('/orders/:tran_id', async(req,res)=>{
        //     const id=req.params.tran_id;
        //     const order =await paymentCollection.findOne({tran_id:id});
        //     console.log(order)
        //     res.json(order)
        //   });
        
        
        


    }

    finally {
        // await client.close();
    }
}

run().catch(console.dir)

app.get('/', (req, res) => {
    res.send("online CarWash Service");
});

app.listen(port, () => {
    console.log("runnning online on port", port);
});


