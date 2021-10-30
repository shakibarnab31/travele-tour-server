const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000;

// user:traveleTour
// pass:IFO7eUNqHKx54zoR

// middlewire
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dampa.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('traveleTour');
        const packageCollection = database.collection('packages');
        const bookedPackageCollection = database.collection('bookedPackages')

        // Get api for all packages

        app.get('/packages', async (req, res) => {
            const cursor = packageCollection.find({});
            const result = await cursor.toArray();
            res.json(result)
        });

        // Get api for single package

        app.get('/packages/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) };
            const package = await packageCollection.findOne(query);
            res.json(package)
        })

        // Post api for booked package
        app.post('/bookedPackage', async (req, res) => {
            const bookedPackage = req.body;
            const result = await bookedPackageCollection.insertOne(bookedPackage)
            res.json(result)

        })
        // Get api for all bookings

        app.get('/allBookings', async (req, res) => {
            const cursor = bookedPackageCollection.find({});
            const result = await cursor.toArray();
            res.json(result);
        })

        // Get api for my booking
        app.get('/myBooking/:email', async (req, res) => {
            const result = await bookedPackageCollection.find({ email: req.params.email }).toArray();
            res.send(result)
        })
        // Get api for bookedPackage
        app.get('/bookedPackage/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await bookedPackageCollection.findOne(query);
            res.json(result);
        })

        // Update Status api

        app.put('/updateStatus/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const updatedStatus = req.body;
            const result = await bookedPackageCollection.updateOne(query, {
                $set: {
                    status: updatedStatus.status
                }
            })
            res.json(result)
        })

        // Delete api for myBooking
        app.delete('/deletePackage/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await bookedPackageCollection.deleteOne(query)
            res.send(result);
        })

        // Delete api from all booking
        app.delete('/deleteBooking/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await bookedPackageCollection.deleteOne(query);
            res.send(result);
        })
    }
    finally {
        // client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
    console.log("server is running")
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})