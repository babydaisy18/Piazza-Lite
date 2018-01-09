// The below code creates a simple HTTP server with the NodeJS `http` module,
// and makes it able to handle websockets. However, currently it does not
// actually have any websocket functionality - that part is your job!

var http = require('http');
var io = require('socket.io');

var requestListener = function (request, response) {
  response.writeHead(200);
  response.end('Hello, World!\n');
};

var server = http.createServer(requestListener);

server.listen(8080, function () {
  console.log('Server is running...');
});

var socketServer = io(server);

// This is the object that will keep track of all the current questions in the server.
// It can be considered to be the (in-memory) database of the application.
var questions = {};
var questionID = 0;

// Your code goes here:
//define connection event handler
socketServer.on('connection', function (socket) {
  
  socket.emit('here_are_the_current_questions', questions);

  socket.on('add_new_question', function (textObj) {
    var question = {
      text: textObj.text,
      answer: '',
      author: socket.id,
      id: questionID
    };
    questions[questionID] = question;
    questionID += 1;
    socketServer.emit('new_question_added', question);
  });

  socket.on('get_question_info', function (id) {
    socket.emit('question_info', questions[id]);
  });

  socket.on('add_answer', function (answer) {
    questions[answer.id].answer = answer.answer;
    socket.broadcast.emit('answer_added', questions[answer.id]);
  });

});
