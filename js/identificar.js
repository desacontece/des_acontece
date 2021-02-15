let faceapi;
let video;
let detections;

let x, y;
let boxWidth, boxHeight;
let imagen_avatar;


let timer;
let contador_button;
let button;

var files
var snapshot=[];

var canvasCamara
var ancho;
var alto;




// by default all options are set to true
const detection_options = {
    withLandmarks: true,
    withDescriptors: false,
}

// Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  var firebaseConfig = {
    apiKey: "AIzaSyByLXZOtrC_bcS9g8HJjZH2hLsrVt-oLe0",
    authDomain: "desacontece-b8e40.firebaseapp.com",
    databaseURL: "https://desacontece-b8e40-default-rtdb.firebaseio.com",
    projectId: "desacontece-b8e40",
    storageBucket: "desacontece-b8e40.appspot.com",
    messagingSenderId: "930130613129",
    appId: "1:930130613129:web:8e5a626828cb268fb20758",
    measurementId: "G-LXSDSG256D"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
  console.log(firebase)
  var firebaseRef= firebase.database().ref();

  function centerCanvas(){
    var x = (windowWidth - width) / 2;
    var y = (windowHeight - height) / 2;
    canvasCamara.position(x, y);
  }
  
function setup() {
    ancho = (80 / 100) * windowHeight
    alto = (80 / 100) * windowHeight
    canvasCamara = createCanvas(ancho,alto);
    canvasCamara.parent('canvas2');
    centerCanvas()    

    // load up your video
    video = createCapture(VIDEO);
    video.size(width, height);
    // video.hide(); // Hide the video element, and just show the canvas
    faceapi = ml5.faceApi(video, detection_options, modelReady)
    //textAlign(CENTER);
    video.hide();
    
    contador_button = 0;
  }
  function windowResized(){
    ancho = (80 / 100) * windowHeight
    alto = (80 / 100) * windowHeight
      resizeCanvas(ancho,alto)
      centerCanvas();
  }

function modelReady() {
    console.log('ready!')
    console.log(faceapi)
    faceapi.detect(gotResults)
    alert("Necesitamos identificarte")

}

function gotResults(err, result) {
    if (err) {
        console.log(err)
        return
    }
    // console.log(result)
    detections = result;

    // background(220);
    background(255);
    image(video, 0,0, width, height)
    if (detections) {
        if (detections.length > 0) {
            // console.log(detections)
            drawBox(detections)
            drawLandmarks(detections)
            
        }

    }
    faceapi.detect(gotResults)
}

function drawBox(detections){
    for(let i = 0; i < detections.length; i++){
        const alignedRect = detections[i].alignedRect;
        x = alignedRect._box._x
        y = alignedRect._box._y
        boxWidth = alignedRect._box._width
        boxHeight  = alignedRect._box._height
        
        noFill();
        stroke(0,255,0);
        strokeWeight(2);
        rect(x, y, boxWidth, boxHeight);

    }

    imagen_avatar = copy(video, x, y, boxWidth, boxHeight, 0, 0, width, height);

    button = createButton('Identificarme');
    button.position((windowWidth/2), (windowHeight/3));
    button.mousePressed(Captura);

    




    
    
}

function drawLandmarks(detections){
    noFill();
    stroke(0,255,0);
    strokeWeight(2)

    for(let i = 0; i < detections.length; i++){
        const mouth = detections[i].parts.mouth; 
        const nose = detections[i].parts.nose;
        const leftEye = detections[i].parts.leftEye;
        const rightEye = detections[i].parts.rightEye;
        const rightEyeBrow = detections[i].parts.rightEyeBrow;
        const leftEyeBrow = detections[i].parts.leftEyeBrow;

    }

}

function drawPart(feature, closed){
    
    beginShape();
    for(let i = 0; i < feature.length; i++){
        const x = feature[i]._x
        const y = feature[i]._y
        vertex(x, y)
    }
    
    if(closed === true){
        endShape(CLOSE);
    } else {
        endShape();
    }
    
}


function Captura() {
    save("avatar.png");
    subimeAvatar();
    document.getElementById("continuar").hidden = false;
}
function redireccion(){
    window.location.href = 'elegir.html';
    noLoop();
}

function subimeAvatar(){
file = video.canvas.toDataURL();
firebaseRef.child("avatar").set(file);
}

