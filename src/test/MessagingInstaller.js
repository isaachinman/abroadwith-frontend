var express = require('express');
var nunjucks = require('nunjucks');

var router1 = express.Router();
var router2 = express.Router();

var current_user = {
    id:1,
    name:"Just you",
    photo:"/users/1.jpg"
}

var everything = [
{
    id:1234,
    from_date:"2016-01-29",
    to_date:"2016-03-28",
    with: {
      id:56,
      name:"Jose",
      photo:"/users/56.jpg"
    },
    last_timestamp: 1456145961518
},
{
    id:2222,
    from_date:"2016-01-10",
    to_date:"2016-01-16",
    with: {
      id:23,
      name:"Luis",
      photo:"/users/23.jpg"
    },
    last_timestamp: 1456059561518
},
{
    id:1111,
    from_date:"2016-01-22",
    to_date:"2016-02-22",
    with: {
      id:33,
      name:"Amanda",
      photo:"/users/33.jpg"
    },
    last_timestamp: 1455541161518
}
];

var threads = {
  "1111":[
    {
      author: 33,
      timestamp: 1456145961518,
      message: "Oporteat dissentias vel eu, an graece ridens per. Congue doctus convenire qui id, cu dolores conceptam repudiandae mei, vel zril aliquid ex. Illum eruditi recusabo qui an. Ei nullam graeco mel, pri ut omnesque perpetua vulputate. Et noluisse accommodare vis. Exerci signiferumque vituperatoribus no sit, vitae iisque nusquam ne per, duis erant ius ea. Mel at quodsi explicari, usu tale diam accommodare ne."
    },
    {
      author: 1,
      timestamp: 1456145861518,
      message: "Oporteat dissentias vel eu, an graece ridens per. Congue doctus convenire qui id, cu dolores conceptam repudiandae mei, vel zril aliquid ex. Illum eruditi recusabo qui an. Ei nullam graeco mel, pri ut omnesque perpetua vulputate. Et noluisse accommodare vis. Exerci signiferumque vituperatoribus no sit, vitae iisque nusquam ne per, duis erant ius ea. Mel at quodsi explicari, usu tale diam accommodare ne."
    },
    {
      author: 1,
      timestamp: 1456145761518,
      message: "Congue doctus convenire qui id, cu dolores conceptam repudiandae mei, vel zril aliquid ex. Illum eruditi recusabo qui an. Ei nullam graeco mel, pri ut omnesque perpetua vulputate. Et noluisse accommodare vis. Exerci signiferumque vituperatoribus no sit, vitae iisque nusquam ne per, duis erant ius ea. Mel at quodsi explicari, usu tale diam accommodare ne."
    },
    {
      author: 33,
      timestamp: 1456145661518,
      message: "Oporteat dissentias vel eu, an graece ridens per. Congue doctus convenire qui id, cu dolores conceptam repudiandae mei, vel zril aliquid ex. Illum eruditi recusabo qui an. Ei nullam graeco mel, pri ut omnesque perpetua vulputate. Et noluisse accommodare vis. Exerci signiferumque vituperatoribus no sit, vitae iisque nusquam ne per, duis erant ius ea. Mel at quodsi explicari, usu tale diam accommodare ne."
    },
    {
      author: 1,
      timestamp: 1456145561518,
      message: "Oporteat dissentias vel eu, an graece ridens per. Congue doctus convenire qui id, cu dolores conceptam repudiandae mei, vel zril aliquid ex. Illum eruditi recusabo qui an. Ei nullam graeco mel, pri ut omnesque perpetua vulputate. Et noluisse accommodare vis. Exerci signiferumque vituperatoribus no sit, vitae iisque nusquam ne per, duis erant ius ea. Mel at quodsi explicari, usu tale diam accommodare ne."
    },
    {
      author: 33,
      timestamp: 1446145961518,
      message: "Oporteat dissentias vel eu, an graece ridens per. Congue doctus convenire qui id, cu dolores conceptam repudiandae mei, vel zril aliquid ex. Illum eruditi recusabo qui an. Ei nullam graeco mel, pri ut omnesque perpetua vulputate. Et noluisse accommodare vis. Exerci signiferumque vituperatoribus no sit, vitae iisque nusquam ne per, duis erant ius ea. Mel at quodsi explicari, usu tale diam accommodare ne."
    },
    {
      author: 1,
      timestamp: 1436145861518,
      message: "Oporteat dissentias vel eu, an graece ridens per. Congue doctus convenire qui id, cu dolores conceptam repudiandae mei, vel zril aliquid ex. Illum eruditi recusabo qui an. Ei nullam graeco mel, pri ut omnesque perpetua vulputate. Et noluisse accommodare vis. Exerci signiferumque vituperatoribus no sit, vitae iisque nusquam ne per, duis erant ius ea. Mel at quodsi explicari, usu tale diam accommodare ne."
    },
    {
      author: 1,
      timestamp: 1426145761518,
      message: "Congue doctus convenire qui id, cu dolores conceptam repudiandae mei, vel zril aliquid ex. Illum eruditi recusabo qui an. Ei nullam graeco mel, pri ut omnesque perpetua vulputate. Et noluisse accommodare vis. Exerci signiferumque vituperatoribus no sit, vitae iisque nusquam ne per, duis erant ius ea. Mel at quodsi explicari, usu tale diam accommodare ne."
    },
    {
      author: 33,
      timestamp: 1416145661518,
      message: "Oporteat dissentias vel eu, an graece ridens per. Congue doctus convenire qui id, cu dolores conceptam repudiandae mei, vel zril aliquid ex. Illum eruditi recusabo qui an. Ei nullam graeco mel, pri ut omnesque perpetua vulputate. Et noluisse accommodare vis. Exerci signiferumque vituperatoribus no sit, vitae iisque nusquam ne per, duis erant ius ea. Mel at quodsi explicari, usu tale diam accommodare ne."
    },
    {
      author: 1,
      timestamp: 1406145561518,
      message: "Oporteat dissentias vel eu, an graece ridens per. Congue doctus convenire qui id, cu dolores conceptam repudiandae mei, vel zril aliquid ex. Illum eruditi recusabo qui an. Ei nullam graeco mel, pri ut omnesque perpetua vulputate. Et noluisse accommodare vis. Exerci signiferumque vituperatoribus no sit, vitae iisque nusquam ne per, duis erant ius ea. Mel at quodsi explicari, usu tale diam accommodare ne."
    }
  ],
  "2222":[
    {
      author: 23,
      timestamp: 1456145961518,
      message: "Oporteat dissentias vel eu, an graece ridens per. Congue doctus convenire qui id, cu dolores conceptam repudiandae mei, vel zril aliquid ex. Illum eruditi recusabo qui an. Ei nullam graeco mel, pri ut omnesque perpetua vulputate. Et noluisse accommodare vis. Exerci signiferumque vituperatoribus no sit, vitae iisque nusquam ne per, duis erant ius ea. Mel at quodsi explicari, usu tale diam accommodare ne."
    },
    {
      author: 1,
      timestamp: 1456145861518,
      message: "Oporteat dissentias vel eu, an graece ridens per. Congue doctus convenire qui id, cu dolores conceptam repudiandae mei, vel zril aliquid ex. Illum eruditi recusabo qui an. Ei nullam graeco mel, pri ut omnesque perpetua vulputate. Et noluisse accommodare vis. Exerci signiferumque vituperatoribus no sit, vitae iisque nusquam ne per, duis erant ius ea. Mel at quodsi explicari, usu tale diam accommodare ne."
    },
    {
      author: 23,
      timestamp: 1456145761518,
      message: "Congue doctus convenire qui id, cu dolores conceptam repudiandae mei, vel zril aliquid ex. Illum eruditi recusabo qui an. Ei nullam graeco mel, pri ut omnesque perpetua vulputate. Et noluisse accommodare vis. Exerci signiferumque vituperatoribus no sit, vitae iisque nusquam ne per, duis erant ius ea. Mel at quodsi explicari, usu tale diam accommodare ne."
    },
    {
      author: 23,
      timestamp: 1456145661518,
      message: "Oporteat dissentias vel eu, an graece ridens per. Congue doctus convenire qui id, cu dolores conceptam repudiandae mei, vel zril aliquid ex. Illum eruditi recusabo qui an. Ei nullam graeco mel, pri ut omnesque perpetua vulputate. Et noluisse accommodare vis. Exerci signiferumque vituperatoribus no sit, vitae iisque nusquam ne per, duis erant ius ea. Mel at quodsi explicari, usu tale diam accommodare ne."
    },
    {
      author: 1,
      timestamp: 1456145561518,
      message: "Oporteat dissentias vel eu, an graece ridens per. Congue doctus convenire qui id, cu dolores conceptam repudiandae mei, vel zril aliquid ex. Illum eruditi recusabo qui an. Ei nullam graeco mel, pri ut omnesque perpetua vulputate. Et noluisse accommodare vis. Exerci signiferumque vituperatoribus no sit, vitae iisque nusquam ne per, duis erant ius ea. Mel at quodsi explicari, usu tale diam accommodare ne."
    }
  ],
  "1234":[
    {
      author: 56,
      timestamp: 1456145961518,
      message: "Oporteat dissentias vel eu, an graece ridens per. Congue doctus convenire qui id, cu dolores conceptam repudiandae mei, vel zril aliquid ex. Illum eruditi recusabo qui an. Ei nullam graeco mel, pri ut omnesque perpetua vulputate. Et noluisse accommodare vis. Exerci signiferumque vituperatoribus no sit, vitae iisque nusquam ne per, duis erant ius ea. Mel at quodsi explicari, usu tale diam accommodare ne."
    },
    {
      author: 56,
      timestamp: 1456145861518,
      message: "Oporteat dissentias vel eu, an graece ridens per. Congue doctus convenire qui id, cu dolores conceptam repudiandae mei, vel zril aliquid ex. Illum eruditi recusabo qui an. Ei nullam graeco mel, pri ut omnesque perpetua vulputate. Et noluisse accommodare vis. Exerci signiferumque vituperatoribus no sit, vitae iisque nusquam ne per, duis erant ius ea. Mel at quodsi explicari, usu tale diam accommodare ne."
    },
    {
      author: 1,
      timestamp: 1456145761518,
      message: "Congue doctus convenire qui id, cu dolores conceptam repudiandae mei, vel zril aliquid ex. Illum eruditi recusabo qui an. Ei nullam graeco mel, pri ut omnesque perpetua vulputate. Et noluisse accommodare vis. Exerci signiferumque vituperatoribus no sit, vitae iisque nusquam ne per, duis erant ius ea. Mel at quodsi explicari, usu tale diam accommodare ne."
    },
    {
      author: 56,
      timestamp: 1456145661518,
      message: "Oporteat dissentias vel eu, an graece ridens per. Congue doctus convenire qui id, cu dolores conceptam repudiandae mei, vel zril aliquid ex. Illum eruditi recusabo qui an. Ei nullam graeco mel, pri ut omnesque perpetua vulputate. Et noluisse accommodare vis. Exerci signiferumque vituperatoribus no sit, vitae iisque nusquam ne per, duis erant ius ea. Mel at quodsi explicari, usu tale diam accommodare ne."
    },
    {
      author: 56,
      timestamp: 1456145561518,
      message: "Oporteat dissentias vel eu, an graece ridens per. Congue doctus convenire qui id, cu dolores conceptam repudiandae mei, vel zril aliquid ex. Illum eruditi recusabo qui an. Ei nullam graeco mel, pri ut omnesque perpetua vulputate. Et noluisse accommodare vis. Exerci signiferumque vituperatoribus no sit, vitae iisque nusquam ne per, duis erant ius ea. Mel at quodsi explicari, usu tale diam accommodare ne."
    }
  ]
};

router1.get('/', function (req, res) {
  if(!req.context) res.status(404).send('No text context.');
  var result = {};
  result.current_user = current_user;
  result.threads = everything;
  res.send(JSON.stringify(result));
});

threadIdHandler = function (req, res, next, value) {
  if(!req.context) req.context = {};
  if(isNaN(value) || parseInt(Number(value)) != value || isNaN(parseInt(value, 10))){
    res.status(400).send('Not a proper thread id.');
    return;
  }

  req.thread = threads[value].sort(function(a,b){return -(a.timestamp-b.timestamp);});

  next();
}

router2.post('/', function (req, res) {
  if(!req.context) res.status(404).send('No text context.');
  if(req.thread){
    var new_message = req.body;
    new_message.author = req.context.user.id;
    new_message.timestamp = new Date().getTime();
    req.thread.push(new_message);
    res.send("OK");
  }
  else{
    res.status(404).send('Thread not found.');
  }
});

router2.get('/', function (req, res) {
  if(!req.context) res.status(404).send('No text context.');
  var results = [];
  var pool = req.thread;
  if(req.query.timestamp){
    for(var i = 0; i < pool.length; i++){
      if(req.query.timestamp > pool[i].timestamp ){
        results.push(pool[i]);
        if(req.query.size && results.length >= req.query.size){
          break;
        }
      }
    }
  }
  else{
    if(req.query.size){
      for(var i = 0; i < req.query.size && i < pool.length; i++){
        results.push(pool[i]);
      }
    }
    else{
      results = pool;
    }
  }
  res.send(JSON.stringify(results));
});


var bodyParser = require('body-parser');

var installer = function(app) {
  app.use(bodyParser.json());
  app.use('/users/*/messages/',router1);
  app.use('/users/*/messages/:threadId',router2);
  app.param('threadId',threadIdHandler);
};

module.exports = installer;
