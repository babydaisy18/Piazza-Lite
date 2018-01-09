// This file contains client (aka browser) side code. Please don't modify the below line;
// it is a flag for our linter.
/* global $, io */

$(document).ready(function () {
  // This code connects to your server via websocket;
  // please don't modify it.
  window.socketURL = 'http://localhost:8080';

  window.socket = io(window.socketURL);

  window.socket.on('connect', function () {
    // console.log('Connected to server!');
  });

  // The below two functions are helper functions you can use to
  // create html from a question object.
  // DO NOT MODIFY these functions - they're meant to help you. :)
  window.makeQuestion = function (question) {
    var html = '<div data-question-id="' + question.id + '" class="question"><h1>Question ' + '<span class="qid">' + question.id + '</span>' + '</h1><p class="the-question">' +
      question.text + '</p><br><p>Asked by Socket user ID: <span class="socket-user">' +
      question.author + '</p></div><div class="answer"><h1>Answer</h1><p>' +
      '<div class="form-group"><textarea class="form-control" rows="5" id="answer">' +
      question.answer + '</textarea></div></p><button class="btn btn-default" id="update-answer">Add Answer</button></div>';
    return html;
  };

  window.makeQuestionPreview = function (question) {
    var html = [
      '<li data-question-id="' + question.id + '" class="question-preview"><h1><span class="preview-content">' +
      question.text + '</span></h1><p><em>Author: ' + question.author + '</em></p>'
    ];
    html.join('');
    return html;
  };

  // handler to hide the add question modal when the 'close' button is clicked.
  $('#closeModal').on('click', function () {
    $('#questionModal').modal('hide');
  });

  // You will now need to implement both socket handlers,
  // as well as click handlers.


//handle the here_are_the_current_questions
  window.socket.on('here_are_the_current_questions', function (questions) {
    $.each(questions, function (key, questionText) {
      var currentHTML = window.makeQuestionPreview(questionText);
      $('.question-list').append(currentHTML);
    });
  });

//handle submitQuestion/add_new_question
  $('#submitQuestion').on('click', function () {
    var text = $('#question-text').val();
    if (text !== '') {
      window.socket.emit('add_new_question', {text: text});
    }
  });

//handle new_question_added
  window.socket.on('new_question_added', function (question) {
    var questionHTML = window.makeQuestionPreview(question);
    $('.question-list').append(questionHTML);
  });

//question-preview
  $('.question-list').on('click', '.question-preview', function () {
    var data = Number($(this).data('question-id'));
    window.socket.emit('get_question_info', data);
  });

//question_info
  window.socket.on('question_info', function (questionAsked) {
    if (questionAsked !== null) {
      var questionInfo = window.makeQuestion(questionAsked);
      $('.question-view').html(questionInfo);
    }
  });

//update the answer
  $('.question-view').on('click', '#update-answer', function () {
    var answer = $('#answer').val();
    var id = $('.question-view .question').data('question-id');
    window.socket.emit('add_answer', {id: id, answer: answer});
  });

//answer_added
  window.socket.on('answer_added', function (question) {
    var id = $('.question-view .question').data('question-id');
    if (id === question.id) {
      var questionHTML = window.makeQuestion(question);
      $('.question-view').html(questionHTML);
    }
  });

});