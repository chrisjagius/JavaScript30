// TODO: look into Safari audio lag. Firefox fixed with Web Audio API

/**
 * Removes "playing" class after CSS transition ends
 * @param {TransitionEvent} e
 */
function removePlaying(e) {
  if (e.propertyName !== "transform") return;
  this.classList.remove("playing");
}

/**
 * Plays sound on keypress
 * @param {KeyboardEvent} e
 */
function playSound(e) {
  const keyCode = e.code;
  const audio = document.querySelector(`audio[data-key=${keyCode}]`);
  if (!audio) return;
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
  audio.currentTime = 0;
  audio.play();
  const kbdDiv = document.querySelector(`.key[data-key=${keyCode}]`);
  kbdDiv.classList.add("playing");
}

const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();
console.log(audioContext);

window.addEventListener("keypress", playSound);

document.addEventListener("DOMContentLoaded", () => {
  const audioElements = Array.from(
    document.querySelectorAll(`audio[data-key]`)
  );
  audioElements.forEach((audioElement) => {
    const track = audioContext.createMediaElementSource(audioElement);
    track.connect(audioContext.destination);
  });

  const keys = Array.from(document.querySelectorAll(".key"));
  keys.forEach((key) => key.addEventListener("transitionend", removePlaying));
});
