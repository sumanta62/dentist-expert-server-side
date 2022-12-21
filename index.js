const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;
app.use(express.json());
app.use(cors());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster2.cv4uqat.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {
    
    try {

    const servicesCollection = client.db("dentistUser").collection("servicesUser");
    const reviewCollection = client.db("dentistUser").collection("reviewUser");

        app.post('/jwt', (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' })
            res.send({ token })
        })

        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = servicesCollection.find(query);
            const services = await cursor.limit(3).toArray();
            res.send(services);
        })

        app.get('/allServices',  async (req, res) => {
            const query = {}
            const cursor = servicesCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });


        app.get('/services/:id',  async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.send(service);
        })

        app.post('/services',  async (req, res) => {
            const order = req.body;
            const result = await servicesCollection.insertOne(order);
            res.send(result);

        })

        app.post('/review',  async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);

        })

        app.get('/review',  async (req, res) => {
            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const service = reviewCollection.find(query);
            const review = await service.toArray();
            res.send(review);
        })

        app.delete('/review/:id',  async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await reviewCollection.deleteOne(query)
            res.send(result);
        })

        app.get('/review/:id',  async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const updateUser = await reviewCollection.findOne(query);
            res.send(updateUser);
        })

        app.patch('/update/:id',  async (req, res) => {
            const id = req.params.id;
            const user = req.body;
            console.log(user);

            const query = { _id: ObjectId(id) }
            const option = { upsert: true };
            const updateDoc = {
                $set: {
                    name: user.name,
                    picture: user.photoUrl,
                    details: user.massage,
                    reting: user.reting,
                }
            }
            const result = await reviewCollection.updateOne(query, updateDoc, option);
            res.send(result);

        })

    }
    finally {

    }
}
run().catch(err => console.log(err));

app.get('/', (req, res) => {
    res.send('Dentist Expert server side is runing');
})

app.listen(port, () => {
    console.log(`listener to port ${port}`);
})