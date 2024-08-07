const express = require("express")
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;
const { v4: uuidv4 } = require("uuid");
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
// app.use(express.urlencoded({ extended: true }));
const SSLCommerzPayment = require('sslcommerz')
// app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors())
app.use(express.json())
// projectdefence9 
// yVWKJRh1rYivqCfF 

// const uri = `mongodb+srv://cap27711:S0dlPqVP7Ql3ogOS@cluster0.4awdg7q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const uri = "mongodb+srv://projectdefence9:yVWKJRh1rYivqCfF@cluster0.7dyjpba.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {

    try {
        await client.connect();
        console.log("connected to database");
       
        const database = client.db('AlumniHub');


        const userCollection = database.collection('users');
        const developerCollection = database.collection('developer');
        const homePostCollection = database.collection('HomePost');
        const contactCollection = database.collection('contact');
        const paymentCollection = database.collection('paymentData');
        const feedbacksCollection = database.collection('userfeedbacks');
        const projectCollection = database.collection('project');
        const noteCollection = database.collection('note');
        const shareCollection = database.collection('sharePost');
        const allysCollection = database.collection('ally');
        const messageCollection = database.collection('message');
        const addfriendCollection = database.collection('addfriend');
        const groupdataCollection = database.collection('groupdata');
        let groupCollection = database.collection('Groups');
        let addgroupsCollection = database.collection('addgroups');



        // add database user collection 
        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log(user)
            const result = await userCollection.insertOne(user);
            // console.log(body)
            res.json(result);
        });

        // post message 
        app.post('/messages', async (req, res) => {
            const user = req.body;
            console.log(user)
            const result = await messageCollection.insertOne(user);
            // console.log(body)
            res.json(result);
        });
        // post group data
        app.post('/groupdata', async (req, res) => {
            const user = req.body;
            console.log(user)
            const result = await groupdataCollection.insertOne(user);
            // console.log(body)
            res.json(result);
        });
        // post add group data
        app.post('/addgroupdata', async (req, res) => {
            const user = req.body;
            console.log(user)
            const result = await addgroupsCollection.insertOne(user);
            // console.log(body)
            res.json(result);
        });
        // post add friend
        app.post('/addfriend', async (req, res) => {
            const user = req.body;
            console.log(user)
            const result = await addfriendCollection.insertOne(user);
            // console.log(body)
            res.json(result);
        });


        // delete add friend 
        app.delete('/deleteManage/:id', async(req,res)=>{
            const result=await addfriendCollection.deleteOne({_id:ObjectId(req.params.id)});
            res.json(result)
        })
        app.get('/friendstatus', async (req, res) => {
            const { userEmail, friendEmail } = req.query;
            
            try {
              const status = await addfriendCollection.findOne({
                email: userEmail,
                friendEmail: friendEmail
              });
              
              if (status) {
                res.json(status.status);
              } else {
                res.json('no request');
              }
            } catch (error) {
              res.status(500).send({ message: error.message });
            }
          });

        app.get('/userdata', async (req, res) => {
            
            const result = await userCollection.find({}).toArray()
            // console.log(body)
            res.json(result);

        })
        app.get('/getgroups', async (req, res) => {
            
            const result = await groupdataCollection.find({}).toArray()
            // console.log(body)
            res.json(result);

        })
        app.get('/showrequest', async (req, res) => {
            
            const result = await addfriendCollection.find({}).toArray()
            // console.log(body)
            res.json(result);

        })

        app.put('/updateFriendStatus/:id', async (req, res) => {
            const { id } = req.params;
            const { status } = req.body;
            
            try {
              const result = await addfriendCollection.updateOne(
                { _id: ObjectId(id) },
                { $set: { status: status } }
              );
              res.json(result);
            } catch (error) {
              res.status(500).send({ message: error.message });
            }
          });

        // get message 
        app.get('/getmessage', async (req, res) => {
            
            const result = await messageCollection.find({}).toArray()
            // console.log(body)
            res.json(result);

        })

      // GET all groups
      // GET all groups

      let groups = [];

      app.post('/create-group', (req, res) => {
          const { name, user } = req.body;
          const newGroup = { id: groups.length + 1, name, members: [user], posts: [] };
          groups.push(newGroup);
          res.status(201).json(newGroup);
      });
      
      app.post('/join-group', (req, res) => {
          const { groupId, user } = req.body;
          const group = groups.find(g => g.id === groupId);
          if (group) {
              if (!group.members.some(member => member.email === user.email)) {
                  group.members.push(user);
                  res.status(200).json({ message: 'Joined successfully' });
              } else {
                  res.status(400).json({ message: 'User already a member' });
              }
          } else {
              res.status(404).json({ message: 'Group not found' });
          }
      });
      
      app.post('/create-post', (req, res) => {
          const { groupId, post } = req.body;
          const group = groups.find(g => g.id === groupId);
          if (group) {
              group.posts.push(post);
              res.status(201).json(post);
          } else {
              res.status(404).json({ message: 'Group not found' });
          }
      });
      
      app.get('/groups', (req, res) => {
          res.status(200).json(groups);
      });
      
      app.get('/group/:id', (req, res) => {
          const group = groups.find(g => g.id === parseInt(req.params.id, 10));
          if (group) {
              res.status(200).json(group);
          } else {
              res.status(404).json({ message: 'Group not found' });
          }
      });


      app.put('/Singlegroup', async (req, res) => {
        
        console.log(req.body)
        // const filter = { _id: ObjectId(req.params.id) };
        const query={
            type:req.body.type}
        const options = { upsert: true };
        // const data=req.body
       
           
                const updateDoc = { $push: { services: req.body } };
                const result = await groupdataCollection.updateOne(query, updateDoc, options);
                res.json(result)
            
          


});


      


         // details show admin product 
     app.get('/userdatadetails/:id', async(req,res)=>{
        const id=req.params.id
        const query={_id:new ObjectId(id)}
        const result=await userCollection.findOne(query)
        res.json(result)
    });
         // details show admin produt
     app.get('/userprofiledetails/:id', async(req,res)=>{
        const id=req.params.id
        const query={_id:new ObjectId(id)}
        const result=await addfriendCollection.findOne(query)
        res.json(result)
    });
        
         // details group data
     app.get('/groupdatacollected/:id', async(req,res)=>{
        const id=req.params.id
        const query={_id:new ObjectId(id)}
        const result=await groupdataCollection.findOne(query)
        res.json(result)
    });

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
                mobile:user.mobile,
                schoolName:user.schoolName,
                degree:user.degree,
                schoolyear:user.schoolyear,
                collegeName:user.collegeName,
                collegeDegree:user.collegeDegree,
                collegeYear:user.collegeYear,
                UniversityName:user.UniversityName,
                Universitydegree:user.Universitydegree,
                Universityear:user.Universityear,
                schoolimg:user.schoolimg,
                collegeimg:user.collegeimg,
                universityimg:user.universityimg,
            }
        }
        const result=await userCollection.updateOne(query,updateDoc);
        res.json(result)
    });

    // skill update 
    // Update profile endpoint

    app.put('/updateUserskill', async (req, res) => {
        try {
            const user = req.body;
            const query = { email: user.email };
            const updateDoc = {
                $set: {
                    displayName: user.displayName,
                    skillone: user.skillone,
                    skilltwo: user.skilltwo,
                    skillthree: user.skillthree,
                    skillfour: user.skillfour,
                    skillfive: user.skillfive,
                    skillsix: user.skillsix,
                    skillseven: user.skillseven,
                    address: user.address
                }
            };
            const result = await userCollection.updateOne(query, updateDoc);
            res.json(result);
        } catch (error) {
            console.error(error);
            res.status(500).send('An error occurred while updating the user profile.');
        }
    });
    

    // newprofile update data 
    app.put('/updateprofiledata', async (req, res) => {
        try {
            const user = req.body;
            const query = { email: user.email };
            const updateDoc = {
                $set: {
                    displayName: user.displayName,
                    designation: user.designation,
                    work: user.work,
                    img:user.img,
                    varsityInitial: user.varsityInitial,
                    department: user.department
                }
            };
            const result = await userCollection.updateOne(query, updateDoc);
            res.json(result);
        } catch (error) {
            console.error(error);
            res.status(500).send('An error occurred while updating the user profile.');
        }
    });
    

    // experience update 
    app.put('/experirnceupdate', async (req, res) => {
        try {
            const user = req.body;
            const query = { email: user.email };
            const updateDoc = {
                $set: {
                    images: user.images,
                    designations: user.designations,
                    works: user.works,
                    years: user.years,
                    locations: user.locations
                }
            };
            const result = await userCollection.updateOne(query, updateDoc);
            res.json(result);
        } catch (error) {
            console.error(error);
            res.status(500).send('An error occurred while updating the user profile.');
        }
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
            let isalumni = false;
            if (user?.client === 'alumni') {
                isalumni = true;
            }
            res.json({ alumni: isalumni })
        });


       
        app.post('/homePostCollection', async (req, res) => {
            const user = req.body;
            const result = await homePostCollection.insertOne(user);
            res.json(result)
        });
        app.post('/developer', async (req, res) => {
            const user = req.body;
            const result = await developerCollection.insertOne(user);
            res.json(result)
        });
        app.post('/project', async (req, res) => {
            const user = req.body;
            const result = await projectCollection.insertOne(user);
            res.json(result)
        });
        app.post('/note', async (req, res) => {
            const user = req.body;
            const result = await noteCollection.insertOne(user);
            res.json(result)
        });
        app.post('/postally', async (req, res) => {
            const user = req.body;
            const result = await allysCollection.insertOne(user);
            res.json(result)
        });

        app.get('/PostUploadBuyer', async (req, res) => {
            const result = await buyerCollection.find({}).toArray()
            res.json(result)
        });
     

        

              
                app.post('/PostUploads', async (req, res) => {
                    const user = req.body;
                    const result = await adminUploadEquipCollection.insertOne(user);
                    res.json(result)
                });
        

                app.get('/PostUpload', async (req, res) => {
                    const result = await adminUploadEquipCollection.find({}).toArray()
                    res.json(result)
                });

                // note 
                app.get('/shownote', async (req, res) => {
                    const result = await noteCollection.find({}).toArray()
                    res.json(result)
                });

                // admin product details 
               

                app.get("/PostUpload/:email", async (req, res) => {
                    // const buyeremail=req.body.cartProducts.map((data)=>data.buyerEmail)
                    console.log(req.params.email);
                    const email = req.params.email;
                    const result = await buyerCollection
                        .find({ buyerEmail: email })
                        .toArray();
                    console.log(result)
                    res.send(result);
                });



              

               


       



      
        // get homedata
        app.get("/homepagedata", async (req, res) => {
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
                const cursor = homePostCollection.find(query, status = "approved");
                const count = await cursor.count()
                const allData = await cursor.skip(page * size).limit(size).toArray()
                res.json({
                    allData, count
                });
            } else {
                const cursor = homePostCollection.find({
                    // status: "approved"
                });
                const count = await cursor.count()
                const allData = await cursor.skip(page * size).limit(size).toArray()

                res.json({
                    allData, count
                });
            }

        });


         // get homedata
         app.get("/newgroup", async (req, res) => {
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
                const cursor = groupdataCollection.find(query, status = "approved");
                const count = await cursor.count()
                const allData = await cursor.skip(page * size).limit(size).toArray()
                res.json({
                    allData, count
                });
            } else {
                const cursor = groupdataCollection.find({
                    // status: "approved"
                });
                const count = await cursor.count()
                const allData = await cursor.skip(page * size).limit(size).toArray()

                res.json({
                    allData, count
                });
            }

        });

        // single data post 
app.get("/mypost/:email", async (req, res) => {
    const email = req.params.email;
    console.log(email);
    const result = await homePostCollection.find({ buyerEmail: email }).toArray();
    res.send(result);
});



        // get developer 
        app.get("/getdeveloper", async (req, res) => {
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
                const cursor = developerCollection.find(query, status = "approved");
                const count = await cursor.count()
                const allData = await cursor.skip(page * size).limit(size).toArray()
                res.json({
                    allData, count
                });
            } else {
                const cursor = developerCollection.find({
                    // status: "approved"
                });
                const count = await cursor.count()
                const allData = await cursor.skip(page * size).limit(size).toArray()

                res.json({
                    allData, count
                });
            }

        });
        app.get("/project", async (req, res) => {
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
                const cursor = projectCollection.find(query, status = "approved");
                const count = await cursor.count()
                const allData = await cursor.skip(page * size).limit(size).toArray()
                res.json({
                    allData, count
                });
            } else {
                const cursor = projectCollection.find({
                    // status: "approved"
                });
                const count = await cursor.count()
                const allData = await cursor.skip(page * size).limit(size).toArray()

                res.json({
                    allData, count
                });
            }

        });

        app.get('/detailsdeveloper/:id', async (req, res) => {
            const id = req.params.id;
            const result = await developerCollection.findOne({ _id: ObjectId(id) });
            res.json(result)
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

    


      

        

         app.put('/service', async (req, res) => {
        
            console.log(req.body)
            // const filter = { _id: ObjectId(req.params.id) };
            const query={
                userName:req.body.userName}
            const options = { upsert: true };
            // const data=req.body
           
               
                    const updateDoc = { $push: { comment: req.body } };
                    const result = await homePostCollection.updateOne(query, updateDoc, options);
                    res.json(result)

    });

    app.put("/commentUpdate/:id", async (req, res) => {
        // console.log(req.body)
    
        const filter = { _id: ObjectId(req.params.id) };
        
        const result = await homePostCollection.updateOne(filter, {
            $push: {
                comment: req.body.comment,
            },
            
        });
        // console.log(result)
        res.send(result);
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



// ================================Like in post====================================================
        //Link post----------------------------------------------------------------------------------------
        app.put('/like/:id', async (req, res) => {
            try {
                // console.log(req.body)
                const filter = { _id: ObjectId(req.params.id) };
                const post = await homePostCollection.findOne(filter);
                const check = post?.likes?.filter(like => like?.email?.toString() === req?.body?.email).length;
                if (!check) {
                    const options = { upsert: true };
                    const updateDoc = { $push: { likes: req.body } };
                    const result = await homePostCollection.updateOne(filter, updateDoc, options);
                    res.status(200).json(result)
                } else {
                    return res.status(400).json({ massage: "Post has not yet been liked" });
                }

            } catch (err) {
                res.status(500).send('Server Error')
            }

        })




            //unLink post-----------------------------------------------------------------------------------------
            app.put('/unlike/:id', async (req, res) => {
                try {
                    const filter = { _id: ObjectId(req.params.id) };
                    const post = await homePostCollection.findOne(filter);
                    const check = post?.likes?.filter(like => like?.email?.toString() === req?.body?.email).length;
                    if (check) {
                        const removeIndex = post?.likes?.filter(like => like.email.toString() !== req.body.email);
                        const options = { upsert: true };
                        const updateDoc = { $set: { likes: removeIndex } };
                        const result = await homePostCollection.updateOne(filter, updateDoc, options);
                        res.status(200).json(result,)
                    } else {
                        return res.status(400).json({ massage: "Post has not yet been liked" });
                    }
                } catch (err) {
                    res.status(500).send('Server Error')
                }
            })
    
    // ==========================================================================================

   


    

   

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
            const sslcommer = new SSLCommerzPayment('pizza63d67b1718f34', 'pizza63d67b1718f34@ssl',false) //true for live default false for sandbox
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
    res.send("Alumni Hub");
});

app.listen(port, () => {
    console.log("runnning online on port", port);
});


