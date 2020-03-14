const express = require('express');
const app = express();
const mongodb = require('mongodb');
const bodyParser = require('body-parser');

const mongoClient = mongodb.MongoClient;
const url = "mongodb://localhost:27017/crudapp";

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());



app.get('/',(req,res) => {
    res.sendFile(__dirname + "/form.html");
})

app.post('/add',(req,res) => {
    

    mongoClient.connect(url, (err,db) => {
        if(err) throw err

        let newData = {
            name : req.body.name,
            regno : req.body.regno
        }
        let dbo = db.db("crudapp");

        dbo.collection("first").insertOne(newData,(dbErr,result) => {
            if(dbErr) throw dbErr

            console.log(result)
        })
    })

    res.redirect('/')
})

app.get('/display',(req,res) => {
    
    mongoClient.connect(url,(err,db) => {
        if (err) throw err

        let dbo = db.db("crudapp")
        let query = {}

        dbo.collection("first").find(query).toArray((dbErr,result) => {
            if(dbErr) throw dbErr

            res.send(result)

            db.close()
        })
    })
})


app.post('/delete',(req,res) => {

    mongoClient.connect(url,(err,db) => {
        if(err) throw err

        let dbo = db.db("crudapp")
        let query = {
            name : req.body.name
        }

        dbo.collection("first").deleteOne(query, (dbErr,result) => {
            if(dbErr) throw dbErr

            console.log("deleted")
            db.close()
        })
    })

    res.redirect('/')
})

app.post('/update',(req,res) => {

    mongoClient.connect(url,(err,db) => {
        if(err) throw err

        let dbo = db.db("crudapp")
        let query = {
            name : req.body.cname
        }
        let newData = { $set : {
            name : req.body.nname,
            regno : req.body.nregno }
        }

        dbo.collection("first").updateOne(query,newData, (dbErr,result) => {
            if(dbErr) throw dbErr

            console.log("1 document updated")
            db.close()
        })
    })

    res.redirect('/')
})

app.listen(3000)