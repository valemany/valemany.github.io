var sequence;
var mode; 
var speed; 
var round;
var active;
var options = ["r","b","y", "g"]
var copy;
var score; 

$(function(){

  //data of the game 
  var gameData = {
    sequence: sequence, 
    speed: speed, 
    round: round, 
    active: active, 
    copy: copy, 
    score: score
  }

  //sets easy mode as default 
  $("#easy").click();

  //hide you lose msg
  $("#lose-msg").hide();

  //gameplay

  $('body').on('click', '#play-button', function(){
    $("#play-button").hide();
    startGame();
    newRound();
    activateBoard();
 
  });

  //methods:

  //initial setup to get speed based on mode selected
  function initialSetup(){
    $("#lose-msg").hide();
    $("input[type='radio']:checked").each(function() {
      mode = $(this).attr("id")
      mode === 'easy' ? gameData.speed = 1200 : gameData.speed = 600;
    });
  }

  function startGame() {
    console.log("STARTGAME");
    initialSetup();
    gameData.sequence = []; 
    gameData.copy = []
    gameData.round = 0; 
    gameData.score = 0;
    gameData.active = true; 
    console.log(gameData);
    $('#lose-msg').hide(); 
  }

  function endGame() {
    $("#lose-msg").show().delay(1000);
    $("#play-button").show().delay(2000);
  }

  function randomColor() {
    return options[Math.floor(Math.random() * options.length)];
  }

  function newRound() {
    console.log("NEW ROUND");
    $('span.round').text(++gameData.round);
    $('span.best-score').text(++gameData.score);
    gameData.sequence.push(options[Math.floor(Math.random() * options.length)]); 
    gameData.copy = gameData.sequence.slice(0);
    console.log(gameData.copy);
    console.log(gameData.sequence);
    animate(gameData.sequence);
  }
 
  function animate(sequence) {
    console.log("ANIMATE");
    var i = 0;
    var interval = setInterval(function() {
      console.log(gameData.sequence)
      highlight(gameData.sequence[i]);

      i++;
      if (i >= gameData.sequence.length) {
        clearInterval(interval);
        activateBoard();
      }
     }, gameData.speed);
  }

  function highlight(box) {
    console.log("HIGHLIGHTING");
    console.log(box);
    if (box === "b") {
      $("#blue-box").css("backgroundColor", "blue");
      setTimeout(function() {
        $("#blue-box").css("backgroundColor", "#5CACEE");
      }, gameData.speed);
    } else if (box === "r") {
        $("#red-box").css("backgroundColor", "red");
        setTimeout(function() {
          $("#red-box").css("backgroundColor", "#CD5555");
      }, gameData.speed);
    } else if (box === "g") {
        $("#green-box").css("backgroundColor", "green");
        setTimeout(function() {
          $("#green-box").css("backgroundColor", "#8CDD81");
      }, gameData.speed);
    } else if (box === "y") {
        $("#yellow-box").css("backgroundColor", "yellow");
        setTimeout(function() {
          $("#yellow-box").css("backgroundColor", "#ffffc7");
      }, gameData.speed);
    }
  }

  function registerClick() {
    console.log("REGISTER CLICK")
    var expectedResponse = gameData.copy.shift();
    var actualResponse = event.target.id.substring(0,1);
    console.log(expectedResponse);
    console.log(actualResponse);
    gameData.active = (expectedResponse === actualResponse);
    console.log(gameData.active);
    verifyLoseStatus();
  }

  function verifyLoseStatus() {
    // copy array will be empty when user has successfully completed sequence
    if (gameData.copy.length === 0 && gameData.active) {
      disableBoard(); 
      newRound(); 
    } else if (!gameData.active) {//user lost 
      disableBoard(); 
      endGame();
    }
  }

   function activateBoard() {
    $('#game-container').on('click', '[data-box]', function() {
        registerClick();
      }).on('mousedown', '[data-box]', function(){
        $(this).addClass('active');
      }).on('mouseup', '[data-box]', function(){
        $(this).removeClass('active');
      });

    $('[data-box]').addClass('hoverable');
  }

  // prevent user from interacting until sequence is done animating
  function disableBoard() {
    $('#game-container')
      .off('click', '[data-box]')
      .off('mousedown', '[data-box]')
      .off('mouseup', '[data-box]');

    $('[data-box]').removeClass('hoverable');
  }

});

