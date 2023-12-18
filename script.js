// Immediately invoked function expression
// to not pollute the global scope
(function() {
  const wheel = document.querySelector('.wheel');
  const startButton = document.querySelector('.button');
  const timeoutOverlay = document.querySelector('.modal__overlay--timeout');
  const timeoutModal = document.querySelector('.modal__content--timeout');
  const successOverlay = document.querySelector('.modal__overlay--success');
  const successModal = document.querySelector('.modal__content--success');
  const closeSuccess = document.querySelector('.close');
  const winId = document.querySelector('#winId');
  const rewardBtn = document.querySelector('.reward');
  const info = document.querySelector('.info');
  const wonItem = document.querySelector('#wonItem');

  localStorage.clear();
  // Presets
  timeoutOverlay.classList.add('hide');
  successOverlay.classList.add('hide');
  info.classList.add('hide');
  
  // events
  closeSuccess.addEventListener('click', (e) => {
    successOverlay.classList.add('hide');
  });
  rewardBtn.addEventListener('click', (e) => {
    e.preventDefault();
    info.classList.remove('hide');
  });




  let deg = 0;
  let finalRotationAngle = 0;
  let count = parseInt(localStorage.getItem('countClicks')) || 0;
  let timer;
  let confetti;
  var confettiSettings = { 
    target: 'my-canvas', 
    "max":"180",
    // "animate": false,
    "props":["circle","square","triangle","line"],
    "colors":[[165,104,246],[230,61,135],[0,199,228],[253,214,126]],
    "clock":"70"
  };

  // Functional Logic here --->

  function generateRandomID() {
    return Math.floor(100000 + Math.random() * 900000);
  }

  let randomId = generateRandomID();

  function startCountdownTimer() {
    // Set the countdown time to 5 minutes (300 seconds)
    let countdownTime = 300;
  
    // Update the countdown every second
    timer = setInterval(() => {
      // Convert seconds to minutes:seconds format
      const minutes = Math.floor(countdownTime / 60);
      const seconds = countdownTime % 60;
  
      // Display the countdown in a format like 05:00
      const countdownDisplay = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
      // Update a DOM element to display the countdown
      // Replace 'timerDisplay' with the actual ID or class of your timer display element
      document.getElementById('timerDisplay').innerText = countdownDisplay;
  
      // Decrease the countdown time
      countdownTime -= 1;
  
      // Check if the countdown has reached 00:00
      if (countdownTime < 0) {
        // Stop the timer
        clearInterval(timer);
  
        // Enable the startButton
        startButton.classList.remove('hide');
        timeoutOverlay.classList.add('hide');
  
        // Reset the countClicks to 0
        count = 0;
        localStorage.setItem('countClicks', count);
      }
    }, 1000);
  }

  startButton.addEventListener('click', () => {
    count += 1;
    localStorage.setItem('countClicks', count);
    // Check if countClicks is 3
    if (count === 4) {
      // Disable button
      startButton.classList.add('hide');
      timeoutOverlay.classList.remove('hide');
      // Start the countdown timer
      startCountdownTimer();
    }
    if(count !== 4) {
      // Disable button during spin
      startButton.style.pointerEvents = 'none';
      // Calculate a new rotation between 5000 and 10 000
      deg = Math.floor(5000 + Math.random() * 5000);
      // Set the transition on the wheel
      wheel.style.transition = 'all 10s ease-out';
      // Rotate the wheel
      wheel.style.transform = `rotate(${deg}deg)`;
      // Apply the blur
      wheel.classList.add('blur');

      wheel.addEventListener('transitionend', () => {
        // Remove blur
        wheel.classList.remove('blur');
        // Enable button when spin is over
        startButton.style.pointerEvents = 'auto';
        // Need to set transition to none as we want to rotate instantly
        wheel.style.transition = 'none';
        // Calculate degree on a 360 degree basis to get the "natural" real rotation
        // Important because we want to start the next spin from that one
        // Use modulus to get the rest value from 360
        const actualDeg = deg % 360;
        // Set the real rotation instantly without animation
        wheel.style.transform = `rotate(${actualDeg}deg)`;

        // Store the final rotation angle
        finalRotationAngle = actualDeg;

        // You can now use finalRotationAngle to determine the outcome
        determineOutcome(finalRotationAngle);
      });
    }
  });

  function determineOutcome(angle) {
    // Define your image sections and corresponding angles
    const tryAgainSection = { start: 0, end: 45 };
    const win1BTCSection = { start: 46, end: 90 };
    const win10KSection = { start: 91, end: 135 };
    const winTeslaSection = { start: 136, end: 180 };
    const win50KSection = { start: 181, end: 225 };
    const winLamborghiniSection = { start: 226, end: 270 };
    const losingSection = { start: 271, end: 315 };
    const win20KSection = { start: 316, end: 360 };

    // Check which section the final angle falls into
    if (isInRange(angle, losingSection)) {
      console.log('Player loses!', losingSection.start, losingSection.end);
      // Implement the logic for a losing scenario
      stopConfetti();
      successOverlay.classList.add('hide');
    } else if (isInRange(angle, win20KSection)) {
      console.log('Player wins $20K!', win20KSection.start, win20KSection.end);
      winId.innerText = randomId;
      wonItem.innerText = '$20,000';
      successOverlay.classList.remove('hide');
      startConfetti();
    } else if (isInRange(angle, tryAgainSection)) {
      console.log('Please try again!', tryAgainSection.start, tryAgainSection.end);
      // Implement the logic for trying again
      stopConfetti();
      successOverlay.classList.add('hide');
    } else if (isInRange(angle, win1BTCSection)) {
      startConfetti();
      console.log('Player wins 1 BTC!', win1BTCSection.start, win1BTCSection.end);
      winId.innerText = randomId;
      wonItem.innerText = '1 Bitcoin';
      successOverlay.classList.remove('hide');
    } else if (isInRange(angle, win10KSection)) {
      startConfetti();
      console.log('Player wins $10K!', win10KSection.start, win10KSection.end);
      winId.innerText = randomId;
      wonItem.innerText = '$10,000';
      successOverlay.classList.remove('hide');
    } else if (isInRange(angle, winTeslaSection)) {
      startConfetti();
      console.log('Player wins a Tesla Car!', winTeslaSection.start, winTeslaSection.end);
      winId.innerText = randomId;
      wonItem.innerText = 'A Tesla Car';
      successOverlay.classList.remove('hide');
    } else if (isInRange(angle, win50KSection)) {
      startConfetti();
      console.log('Player wins $50K!', win50KSection.start, win50KSection.end);
      winId.innerText = randomId;
      wonItem.innerText = '$50,000';
      successOverlay.classList.remove('hide');
    } else if (isInRange(angle, winLamborghiniSection)) {
      startConfetti();
      console.log('Player wins a Lamborghini!', winLamborghiniSection.start, winLamborghiniSection.end);
      winId.innerText = randomId;
      wonItem.innerText = 'A Lamborghini';
      successOverlay.classList.remove('hide');
    }
  }

  // Function to start the confetti
  function startConfetti() {
    confetti = new ConfettiGenerator(confettiSettings);
    confetti.render();
  }

  // Function to stop the confetti
  function stopConfetti() {
    if (confetti) {
      confetti.clear();
    }
  }

  // Function to check if the angle is in the specified range
  function isInRange(angle, section) {
    return angle >= section.start && angle <= section.end;
  }

})();


// Modal function
const modalOverlay = document.querySelector('.modal__overlay');
const btnAccept = document.querySelector('.btn__accept');
const shareOverlay = document.querySelector('.modal__overlay--share');
const shareBtn = document.querySelector('#shareBtn');

btnAccept.addEventListener('click', (e) => {
  e.preventDefault();
  modalOverlay.classList.add('hide');
})

// Whatsapp share modal ---->
shareBtn.addEventListener('click', (e) => {
  setTimeout(() => {
    shareOverlay.classList.add('hide');
  }, 5000);
});