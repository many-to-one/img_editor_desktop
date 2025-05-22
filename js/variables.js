let base64Image = '';
let image = document.getElementById('original');
const fileInput = document.getElementById('fileInput');
let res = document.getElementById('res');
let load = document.getElementById('load');
// const gammaCont = document.getElementById("gammaCont");
const dialogWindow = document.getElementById('dialogWindow');

const canvas = document.getElementById("previewCanvas");
const context = canvas.getContext("2d");
var imageData = context.getImageData(0, 0, canvas.width, canvas.height);

const fullCanvas       = document.getElementById("fullCanvas");
const fullCtx          = fullCanvas.getContext("2d");

let bufferImageData; // Store original pixel data