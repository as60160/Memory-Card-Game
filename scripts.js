const cards = document.querySelectorAll('.memory-card')
const cardArea = document.querySelector('.memory-game')
const showTimeText = document.querySelector('.js-timer')
const spendTimeText = document.querySelector('.js-spendTime')
const messageText = document.querySelector('.js-message')
const newGameButton = document.querySelector('.js-newGame')

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let unflipCardNumbers = cards.length
let startTime
let spendTimes
let counting

function flipCard() {
  if (lockBoard) return
  if (this === firstCard) return

  this.classList.add('flip')

  if (!hasFlippedCard) {
    firstCard = this
    hasFlippedCard = true
    return
  }
  secondCard = this
  hasFlippedCard = false

  checkForMatch()
}

function checkForMatch() {
  let isMatch = firstCard.dataset.img === secondCard.dataset.img
  isMatch ? disableCards() : unflipCards()
}

function disableCards() {
  firstCard.removeEventListener('click', flipCard)
  secondCard.removeEventListener('click', flipCard)
  resetBoard()
  countUnflipCards()
}

function countUnflipCards() {
  unflipCardNumbers -= 2
  if (unflipCardNumbers == 0) stopTime()
}

function unflipCards() {
  lockBoard = true
  setTimeout(() => {
    firstCard.classList.remove('flip')
    secondCard.classList.remove('flip')
    resetBoard()
  }, 700)
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false]
  [firstCard, secondCard] = [null, null]
}

(function shuffle() {
  cards.forEach(card => {
    let random = Math.floor(Math.random() * 12)
    card.style.order = random
  })
})()

function startTimer() {
  cardArea.removeEventListener('click', startTimer)
  startTime = new Date()
  counting = setInterval(countTime, 1000)
}

function countTime() {
  let currentTime = new Date()
  let spendMilliseconds = currentTime - startTime
  let spendMinutes = Math.floor(spendMilliseconds / 1000 / 60).toString().padStart(2, 0)
  let spendSeconds = Math.floor((spendMilliseconds / 1000) - (spendMinutes * 60)).toString().padStart(2, 0)
  spendTimes = spendMinutes + ":" + spendSeconds
  showTimeText.innerHTML = spendTimes
}

function stopTime() {
  clearInterval(counting)
  spendTimeText.innerHTML = spendTimes
  messageText.classList.remove('none')
}

function startNewGame() {
  messageText.classList.add('none')
  window.location.reload()
}

cards.forEach(card => {
  card.addEventListener('click', flipCard)
})
cardArea.addEventListener('click', startTimer)
newGameButton.addEventListener('click', startNewGame)