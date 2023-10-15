const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const cors = require("cors");

app.use(cors());
app.use(express.json());
require('dotenv').config();

const db_user = process.env.db_user;
const db_password = process.env.db_password;


const uri = `mongodb+srv://${db_user}:${db_password}@cluster0.uzyhqeg.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        const db = client.db("country-app");
        const favouriteCountryCollection = db.collection("favourites");
        app.get("/favourites", async (req, res) => {
            const cursor = favouriteCountryCollection.find({});
            const countries = await cursor.toArray();

            res.send({ status: true, data: countries });
        });
        app.post("/addfavourite", async (req, res) => {
            const country = req.body;

            const result = await favouriteCountryCollection.insertOne(country);

            res.send(result);
        }),
            app.get('/favourites/:email', async (req, res) => {
                const email = req.params.email;
                const query = { userEmail: email };
                const myFavouriteProducts = await favouriteCountryCollection.find(query).map(data => data.data).toArray();
                res.send(myFavouriteProducts);
            }),
            app.put('/update/favourite', async (req, res) => {
                const filter = { _id: new ObjectId('652b02b9abacf549162eae54') };
                const countries = req.body;
                const options = { upsert: true };
                const updatedDoc = {
                    $set: {
                        countries: countries
                    }
                }
                const result = await favouriteCountryCollection.updateOne(filter, updatedDoc, options);
                res.send(result);
            })
            ;
    } finally {
    }
}
run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log(`demo app is listening on port ${port}`);
});