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

  var audioElement = document.createElement('audio');
  audioElement.setAttribute('src', 'audio.mp3');
  // audioElement.setAttribute('autoplay', 'autoplay');

  audioElement.addEventListener("load", function() {
    audioElement.play();
  }, true);

  function stopMusic() {
    audioElement.pause();
  }

  function playMusic() {
    audioElement.play();
  }


  //sets easy mode as default 
  $("#easy").click();

  //hide you lose msg
  $("#lose-msg").hide();

  //hide fb
  $("#fb").hide();

  //gameplay

  $('body').on('click', '#play-button', function(){
    $("span.best-score").text(0);
    $("#play-button").hide();
    startGame();
    newRound();
 
  });

  //click highlight listeners
  $("div[id*='-box']").click(function(){
    $(this).addClass("hover").delay(200).queue(function(){
      $(this).removeClass("hover").dequeue();
    });
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
    $("#fb").hide();
    $('#mode').hide(); 
    playMusic();
  }

  function endGame() {
    $("#lose-msg").show().delay(2000);
    $("#play-button").show().delay(2000);
    $("#mode").show().delay(2000);
    $("#fb").show().delay(2000);
    stopMusic();
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

  function registerClick(e) {
    console.log("REGISTER CLICK")
    var expectedResponse = gameData.copy.shift();
    var actualResponse = e.target.id.substring(0,1);
    console.log(expectedResponse);
    console.log(actualResponse);
    gameData.active = (expectedResponse === actualResponse);
    if (gameData.active === true) {$('span.best-score').text(++gameData.score * 5);};
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
    $('#game-container').on('click', '[data-box]', function(e) {
      registerClick(e);
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

