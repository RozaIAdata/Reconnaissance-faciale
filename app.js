const file = document.getElementById("fileUpload");
const ImageDiv = document.getElementById("uploadedImage");

file.addEventListener('change', getImage, false);
const MODEL_URL = "./models";
let modelsLoaded = [];

faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL).then(() => {
  
  modelsLoaded = [...modelsLoaded, "tinyFaceDetector loaded"];
});

faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL).then(() => {
  console.log("ssdMobilenetv1 loaded");
  modelsLoaded = [...modelsLoaded, "ssdMobilenetv1 loaded"];
});

function getImage(){
  ImageDiv.innerHTML= "";
  const imageToProcess = this.files[0];
  let image = new Image(imageToProcess.width, imageToProcess.height);
  image.src = URL.createObjectURL(imageToProcess);
  ImageDiv.appendChild(image);
  
  image.addEventListener("load",() => {
    const imageDimensions = {width: image.width, height: image.height};
    const data= {
      image,
      imageDimensions, 
    };
    console.log(data);
    processImage(data);
  });
}

function processImage({image, imageDimensions}){
  if (modelsLoaded.length !== 2){
    console.log("please wait while: models are still loading");
    return;
  }
  faceapi.detectAllFaces(image).then(facesDetected => {
   
    const canvas = faceapi.createCanvasFromMedia(image);
    faceapi.draw.drawDetections(canvas, facesDetected);
    document.body.append(canvas)
    canvas.style.position = "absolute";
    canvas.style.top = ImageDiv.y + "px";
    canvas.style.left = ImageDiv.x + "px";

    facesDetected.map((face) => {
      faceapi.draw.drawDetections(canvas, face);
    });

  });
}
