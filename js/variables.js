// let base64Image = '';
// let image = document.getElementById('original');
// const fileInput = document.getElementById('fileInput');
// let res = document.getElementById('res');
// let load = document.getElementById('load');
// // const gammaCont = document.getElementById("gammaCont");
// const dialogWindow = document.getElementById('dialogWindow');

// const canvas = document.getElementById("previewCanvas");
// const context = canvas.getContext("2d");
// var imageData = context.getImageData(0, 0, canvas.width, canvas.height);

// const fullCanvas       = document.getElementById("fullCanvas");
// const fullCtx          = fullCanvas.getContext("2d");

// let currentImageData; // Store original pixel data

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const fileInput = document.getElementById('fileInput');
const img = new Image();

let originalImageData = null;
let currentImageData = null;