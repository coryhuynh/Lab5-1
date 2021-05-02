// script.js
var synth = window.speechSynthesis;
var voiceSelect = document.getElementById("voice-selection");
var voices = []
function populateVoiceList() {
  console.log("Hello");
  voices = synth.getVoices();

  console.log(voices[1]);
  for(var i = 0; i < voices.length ; i++) {
    var option = document.createElement('option');

    option.textContent = voices[i].name + ' (' + voices[i].lang + ')';

    if(voices[i].default) {
      option.textContent += ' -- DEFAULT';
    }

    option.setAttribute('data-lang', voices[i].lang);
    option.setAttribute('data-name', voices[i].name);
    voiceSelect.appendChild(option);
  }
  voiceSelect.remove(0);
  // voiceSelect.removeChild(document.querySelector("[value='none']"));
  voiceSelect.disabled = false;
}

populateVoiceList();
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}
const img = new Image(); // used to load image from <input> and draw to canvas
var imageBtn = document.getElementById("image-input");
imageBtn.addEventListener('change', (event) =>{
    img.src = URL.createObjectURL(event.target.files[0]);
    img.alt = event.target.files[0]['name'];
    console.log(img.alt);
});

// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {
  // TODO
  const canvas = document.getElementById("user-image");
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'black';
  ctx.fillRect(0,0, 400, 400);

  document.querySelector("[type='submit']").disabled = false;
  document.querySelector("[type='reset']").disabled = true;
  document.querySelector("[type='button']").disabled = true;

  var dimensions = getDimmensions(400, 400, img.width, img.height);
  ctx.drawImage(img, dimensions.startX, dimensions.startY, dimensions.width, dimensions.height);
  // Some helpful tips:
  // - Fill the whole Canvas with black first to add borders on non-square images, then draw on top
  // - Clear the form when a new image is selected
  // - If you draw the image to canvas here, it will update as soon as a new image is selected
});

const form = document.getElementById("generate-meme");
form.addEventListener('submit', (event)=>{
  var topText = document.getElementById("text-top").value;
  var bottomText = document.getElementById("text-bottom").value;


  const canvas = document.getElementById("user-image");
  const ctx = canvas.getContext('2d');

  ctx.font = "40px Comic Sans MS";
  ctx.textAlign = "center";
  ctx.fillStyle = "white";
  ctx.fillText(topText, canvas.width/2, 40);
  ctx.fillText(bottomText, canvas.width/2, 385);

  document.querySelector("[type='submit']").disabled = true;
  document.querySelector("[type='reset']").disabled = false;
  document.querySelector("[type='button']").disabled = false;

  event.preventDefault();
});

const clearBtn = document.querySelector("[type='reset']");
clearBtn.addEventListener('click', ()=>{
  const canvas = document.getElementById("user-image");
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  document.querySelector("[type='submit']").disabled = false;
  document.querySelector("[type='reset']").disabled = true;
  document.querySelector("[type='button']").disabled = true;
});

const volumeSlider = document.getElementById("volume-group");
var volume = volumeSlider.children[1].value;
console.log(volume);
volumeSlider.children[1].addEventListener('input', ()=>{
  volume = volumeSlider.children[1].value;
  if(volume >= 67){
    volumeSlider.children[0].src = "icons/volume-level-3.svg"
  }
  else if(volume >= 34){
    volumeSlider.children[0].src = "icons/volume-level-2.svg"
  }
  else if(volume >= 1){
    volumeSlider.children[0].src = "icons/volume-level-1.svg"
  }
  else{
    volumeSlider.children[0].src = "icons/volume-level-0.svg"
  }
});


const readBtn = document.querySelector("[type='button']");
readBtn.addEventListener('click', ()=>{
  var topText = document.getElementById("text-top").value;
  var bottomText = document.getElementById("text-bottom").value;
  var readThis = topText + " " + bottomText;

  var utterThis = new SpeechSynthesisUtterance(readThis);

  var selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');

  for(var i = 0; i < voices.length ; i++) {
    if(voices[i].name === selectedOption) {
      utterThis.voice = voices[i];
    }
  }

  utterThis.volume = volume/100;
  
  synth.speak(utterThis);

});


/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimmensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}
