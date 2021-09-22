const express = require('express');
const app = express();
const bodyParser = require('body-parser')
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }))

const ObjectId = require('mongodb').ObjectID
const MongoClient = require('mongodb').MongoClient

const caminho = 'mongodb://localHost/Escola'

MongoClient.connect(caminho,{useNewUrlParser: true, useUnifiedTopology: true},(err, client) => {

    db = client.db('Escola')
})


app.get('/', (req, res) => {
    res.render('pages/index.ejs')
});

app.get('/show', (req, res) => {
    db.collection('data').find().toArray((err, results) => {
    res.render('pages/Show.ejs', { data: results })
    })
}) 

app.post('/show', (req, res) => {
    db.collection('data').save(req.body, (err, result) => {
        res.redirect('/show')
    })
});

app.route('/edit/:id').get((req, res) => {
    var id = req.params.id
    
    db.collection('data').find(ObjectId(id)).toArray((err, result) => {
        if (err) return res.send(err)
        res.render('pages/edit.ejs', { data: result })
        })
}).post((req, res) => {
    var id = req.params.id
    var name = req.body.name
    var surname = req.body.surname
    
    db.collection('data').updateOne({_id: ObjectId(id)}, {
        $set: {
        name: name,
        surname: surname
        }
    }, (err, result) => {
    if (err) return res.send(err)
    res.redirect('/show')
    console.log('Atualizado no Banco de Dados')
 })
});

app.route('/delete/:id').get((req, res) => {
    var id = req.params.id
    db.collection('data').deleteOne({_id: ObjectId(id)}, (err, result) => {
    if (err) return res.send(500, err)
    console.log('Deletado do Banco de Dados!')
    res.redirect('/show')
    })
});





app.listen(3300, function() {
    console.log('Server rodando na portinha 3300')
});