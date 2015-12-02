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
 
  });

  //methods:

  //initial setup to get speed based on mode selected
  function initialSetup(){
    $("#lose-msg").hide();
    $("input[type='radio']:checked").each(function() {
      mode = $(this).attr("id")
      mode === 'easy' ? gameData.speed = 1000 : gameData.speed = 500;
    });
  }

  function newRound() {
    console.log("NEW ROUND");
    $('span.round').text(++gameData.round);
    gameData.sequence.push(options[Math.floor(Math.random() * options.length)]); 
    gameData.copy = gameData.sequence.slice(0);
    console.log(gameData.copy);
    console.log(gameData.sequence);
    animate(gameData.sequence);
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
    $('#mode').hide(); 
  }

  function endGame() {
    $("#lose-msg").show().delay(2000);
    $("#play-button").show().delay(2000);
    $("#mode").show().delay(2000);
  }
 
  function animate(sequence) {
    console.log("ANIMATE");
    disableBoard(); 
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
    if (box === "b") {
      changeColor($("#blue-box"), "highlighted-blue")
    } else if (box === "r") {
      changeColor($("#red-box"), "highlighted-red")
    } else if (box === "g") {
        changeColor($("#green-box"), "highlighted-green")
    } else if (box === "y") {
        changeColor($("#yellow-box"), "highlighted-yellow")
    }
  }

  function changeColor(element, css) {
    setTimeout(function() {
      $(element).addClass(css);
      }, 200);
    
    setTimeout(function() {
      $(element).removeClass(css);
      }, gameData.speed);

  }

  function registerClick() {
    console.log("REGISTER CLICK")
    var expectedResponse = gameData.copy.shift();
    var actualResponse = event.target.id.substring(0,1);
    console.log(expectedResponse);
    console.log(actualResponse);
    gameData.active = (expectedResponse === actualResponse);
    if (gameData.active === true) {$('span.best-score').text(++gameData.score * 2);};
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

