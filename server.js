var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var mongoose = require('mongoose')

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

mongoose.Promise = Promise

var dbUrl = 'mongodb+srv://koko:1234@app-chat.tlwk3rv.mongodb.net/?retryWrites=true&w=majority'

var Message = mongoose.model('Message', {
    name: String,
    message: String
})

app.get('/messages', (req, res) => {
    Message.find({}).then((messages) => {
        res.send(messages)
    }).catch((err) => {
        console.log('Error ', err)
    });
    
})

app.post('/messages', async (req, res) => {

    try {
        var message = new Message(req.body)

        var savedMessage = await message.save()
    
        console.log('Saved')

        var censored = await Message.findOne({message: 'badword'})
        
        if(censored) {
            await Message.deleteOne({_id: censored.id})
        } else 
            io.emit('message', req.body);
        res.sendStatus(200);

    } catch (error) {
        res.sendStatus(500);
        return console.error(error);
    } finally {
        console.log('Message post called');
    }

})

io.on('connection', (socket) => {
    console.log('new user connected')
})

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Database connected successfully')
    })
    .catch((err) => {
        console.error('Error: ', err)
    });


var server = http.listen(3000, () => {
    console.log('Server is listening on port', server.address().port)
})