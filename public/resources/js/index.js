//------ PARAM NAMES ------ //
const PARAM_TOTAL_DURATION = 'totalDuration';
const PARAM_CURRENT_LVL = 'currentLvl';
const PARAM_TIME_LEFT = 'timeLeft';

//------ APP STATE ------ //
let stateTimeLeft = [0, 27, 0];

$(function() {
  initUIEffects();
  initGame();
  
  /* Game's configuration */
  loadConfiguration();
  
  // Form submit
  $('.js--submit').click(function() {
    saveConfiguration();
    generateTournament();
    
    // waypoint to Game
    $('html, body').animate({scrollTop: $('.js--section-game').offset().top}, 1000);
  });
  
  // implement play
  $('.js--play-button').click(function() {
    console.log('PLAY');
    // stateTimeLeft = subtractOneSecond(stateTimeLeft);
    this.interval = setInterval(() => tick(), 1000);
  });
  
  // implement pause
  // add automatic stop when 00:00

  /* Game's actions */
  // manage next/play/pause/previous actions
  $('.js--play').click(function() {
    $('.js--time-left').toggleClass('paused');
    $('.js--end').toggleClass('deleted')
    $('.js--play-button').toggleClass('active');
    $('.js--pause-button').toggleClass('active');
  });
  $('.js--previous').click(function() {
    console.log('previous');
  });
  $('.js--next').click(function() {
    console.log('next');
  });

});

let tick = function() {
  console.log('tick');
};

let initGame = function() {
  loadConfiguration();
  
  $('.js--time-left').addClass('paused');
  $('.js--play-button').addClass('active');
  $('.js--pause-button').removeClass('active');
};

let loadConfiguration = function() {
  let totalDuration = localStorage.getItem(PARAM_TOTAL_DURATION);
  if (totalDuration) {
    $('.js--total-duration').val(totalDuration);
  }

  let timeLeft = localStorage.getItem(PARAM_TIME_LEFT);
  if (timeLeft) {
    $('.js--time-left').html(timeLeft);
  }
  
  let currentLvl = localStorage.getItem(PARAM_CURRENT_LVL);
  if (currentLvl) {
  }
};

let saveConfiguration = function() {
  let totalDuration = $('.js--total-duration').val();
  if (! totalDuration) {
    return;
  }

  localStorage.setItem(PARAM_TOTAL_DURATION, totalDuration);
  localStorage.setItem(PARAM_CURRENT_LVL, 0);
  localStorage.setItem(PARAM_TIME_LEFT, 0);
}

let generateTournament = function() {
  console.log('generateTournament');
  
  // TODO timeLeft dynamization
  let timeLeft = '27:00';
  localStorage.setItem(PARAM_TIME_LEFT, timeLeft);

  // TODO currentLvl
  console.log('TODO currentLvl');
  // load duration
  // + save
  
  // load blinds
  // + save

  initGame();
};

let initUIEffects = function() {
  /* For the sticky navigation */
  // sticky nav appear when section Slogan is reached
  $('.js--slogan').waypoint(function(direction) {
    if(direction === 'down') {
      $('nav').addClass('sticky');
    } else {
      $('nav').removeClass('sticky');
    }
  }, {
    offset: '60px;'
  });

  /* Navigation scroll from CSS-tricks */
  // Select all links with hashes
  $('a[href*="#"]')
  // Remove links that don't actually link to anything
  .not('[href="#"]')
  .not('[href="#0"]')
  .click(function(event) {
    // On-page links
    if (
      location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') 
      && 
      location.hostname == this.hostname
    ) {
      // Figure out element to scroll to
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      // Does a scroll target exist?
      if (target.length) {
        // Only prevent default if animation is actually gonna happen
        event.preventDefault();
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 1000, function() {
          // Callback after animation
          // Must change focus!
          var $target = $(target);
          $target.focus();
          if ($target.is(":focus")) { // Checking if the target was focused
            return false;
          } else {
            $target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
            $target.focus(); // Set focus again
          };
        });
      }
    }
  });
};