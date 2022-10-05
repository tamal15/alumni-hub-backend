const express= require("express")
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;
require('dotenv').config();
const cors = require("cors");
const app=express();
const port = process.env.PORT || 5000;
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use(express.json())

// pizzahub_bd 
// OfExTH7qprxutPEi 

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.li1977d.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {

    try{
        await client.connect();
        console.log("connected to database");
        const database = client.db('PizzaHUB');


        const userCollection = database.collection('users');
        const buyerCollection = database.collection('buyerproducts');
        const branchCollection = database.collection('branchName');
        const contactCollection = database.collection('contact');



                  // add database user collection 
                  app.post('/users', async(req,res)=>{
                    const user=req.body;
                    console.log(user)
                    const result=await userCollection.insertOne(user);
                    // console.log(body)
                    res.json(result);
                   
                })


                app.put('/users', async(req,res) =>{
                    const user=req.body;
                    console.log(user)
                    const filter= {email:user.email}
                    const option = {upsert:true}
                    const updateDoc= {$set : user}
                    const result= await userCollection.updateOne(filter,updateDoc,option)
                    res.json(result)
                });


                // database admin role 
     app.put('/userLogin/admin', async(req,res)=>{
        const user=req.body;
        console.log('put',user)
        const filter={email:user.email}
        const updateDoc={$set:{role:'admin'}}
        const result=await userCollection.updateOne(filter,updateDoc)
        res.json(result)
    });

       // database searching check admin 
       app.get('/userLogin/:email', async(req,res)=>{
        const email=req.params.email;
        const query={email:email}
        const user=await userCollection.findOne(query)
        let isAdmin=false;
        if(user?.role==='admin'){
          isAdmin=true;
        }
        res.json({admin:isAdmin})
    });


                 // database searching check buyer
    app.get('/users/:email', async(req,res)=>{
        const email=req.params.email;
        const query={email:email}
        const user=await userCollection.findOne(query)
        let isbuyer=false;
        if(user?.client==='buyer'){
          isbuyer=true;
        }
        res.json({buyer:isbuyer})
    });


    //    post product buyer 
    app.post('/PostUploadBuyer', async(req,res) =>{
        const user=req.body;
      console.log(user);
      
        const result=await buyerCollection.insertOne(user);
        res.json(result)
    });
  
    app.get('/PostUploadBuyer', async(req,res)=>{
        const result=await buyerCollection.find({}).toArray()
        res.json(result)
    });
  
     // get sharee 
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


//   details product 
// app.get('/product', async(req,res)=>{
//     const branchs=req.body
//     console.log(branchs)
//     // const query={branch:branchs}
//     const result=await buyerCollection.findOne(branchs)
//     res.json(result)
//   });

app.get('/product', async(req,res)=>{
    const body=req.body;
    console.log(body)
    const result=await buyerCollection.find({}).toArray()
    res.json(result)
});

//   branch name 
app.post('/branch', async(req,res)=>{
    const user=req.body;
    console.log(user)
    const result=await branchCollection.insertOne(user);
    // console.log(body)
    res.json(result);
   
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
        const cursor = branchCollection.find(query, status = "approved");
        const count = await cursor.count()
        const allData = await cursor.skip(page * size).limit(size).toArray()
        res.json({
            allData, count
        });
    } else {
        const cursor = branchCollection.find({
            // status: "approved"
        });
        const count = await cursor.count()
        const allData = await cursor.skip(page * size).limit(size).toArray()

        res.json({
          allData, count
        });
    }

});

// contact databse 
app.post('/contact', async(req,res)=>{
    const data=req.body;
    const result=await contactCollection.insertOne(data);
    res.json(result)
});

// contact database show the ui 
app.get('/contact', async(req,res)=>{
    const data=contactCollection.find({})
    const result=await data.toArray()
    res.json(result)
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


    }

    finally{
        // await client.close();
    }
}

run().catch(console.dir)

app.get('/', (req,res)=>{
    res.send("online pizzaHUB");
   });

   app.listen(port, ()=>{
    console.log("runnning online on port", port);
  }); 


