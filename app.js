const express = require('express');
const bodyParser = require('body-parser')
const app = express();
let Sent = require('sentiment')
let sentiment = new Sent()

let signups = []

// set up handlebars view engine
var handlebars = require('express-handlebars').create({
    defaultLayout:'main'
});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3000);

app.use(express.static(__dirname + '/public'));

// middleware to add list data to context
app.use(function(req, res, next){
	if(!res.locals.partials) res.locals.partials = {};
  // 	res.locals.partials.listOfWorks = listOfWorks;
 	next();
});

// bodyParser allows us to parse form data as JSON
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.get('/about', function(req,res){
  res.render('about');
});


let messages = [{messageId: 0, message: "The series follows the Gods of Olympus with a trio of friends. Highly recommend this amazing series.", name: "Percy Jackson Series", author: "Rick Riordan", likes: 5}, {messageId: 1, message: "What might seem like a boring book of a girl trying to make books. It's a heartwarming story of a girl holding onto her family when she has little time left with them.", name: "Ascendance of a Bookworm", author: "Miya Kazuki", likes: 10},
{messageId: 2, message: "A journey of twins. Each book leaves us with more questions than answers.", name: "The Secrets of the Immortal Nicholas Flamel", author: "Michael Scott", likes: 3}]
function sentimentToEmoji(message) {
  message.sentiment = sentiment.analyze(message.message)
  if (message.sentiment.score > 0) {
    message.emoji = "😊"
  } else if (message.sentiment.score == 0) {
    message.emoji = "😐"
  } else {
    message.emoji = "☹️"
  }

}


sentimentToEmoji(messages[0])
console.log('message: ', messages[0])
app.get('/', function(req,res) {
  res.render('messages')
})



app.post('/message', function(req, res) {
  console.log('messages')
  let newId = messages.length
  let newMessage = req.body
  sentimentToEmoji(newMessage)
  newMessage.messageId = newId
  newMessage.likes = 0
  messages.push(newMessage)
  console.log('messages: ', messages)
  res.send({success: true})
})


app.get('/data/messages', function(req, res) {
  res.json(messages)
})



app.put('/like/:id', function(req, res) {
  console.log('id: ', req.params.id)
  let messageToChange = messages.filter(message => {
    // have to parseInt because the put/post request always sends it in as a string
    return message.messageId == parseInt(req.params.id)
  })[0]
  console.log('message to change: ', messageToChange)
  // add +=1 to messageToChange.likes
    res.send({success: true})
    messageToChange.likes += 1;
})


app.delete('/message', function(req, res) {
  console.log('request: ', req.body)
  console.log('messages: ', messages)
 let messageToDelete = messages.filter(message => {
    return message.messageId == parseInt(req.body.messageId)
  })[0]
  console.log('message to delete: ', messageToDelete)
 let index = messages.indexOf(messageToDelete)
  messages.splice(index, 1)
  res.send({success:true})

})

app.put('/message', function(req, res) {
  console.log('request body: ', req.body)
  let messageToChange = messages.filter(message => {
    // have to parseInt because the put/post request always sends it in as a string
    return message.messageId == parseInt(req.body.messageId)
  })[0]
  messageToChange.name =  req.body.name
  messageToChange.author = req.body.author
  messageToChange.message = req.body.message
  sentimentToEmoji(messageToChange)
  res.send({success: true})
})
// 404 catch-all handler (middleware)
app.use(function(req, res, next){
	res.status(404);
	res.render('404');
});

// 500 error handler (middleware)
app.use(function(err, req, res, next){
	console.error(err.stack);
	res.status(500);
	res.render('500');
});

app.listen(app.get('port'), function(){
  console.log( 'Express started on http://localhost:' +
    app.get('port') + '; press Ctrl-C to terminate.' );
});
