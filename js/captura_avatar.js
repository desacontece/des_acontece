let faceapi;
let video;
let detections;

let x, y;
let boxWidth, boxHeight;
let imagen_avatar;


let timer;
let contador_button;
let button;

// by default all options are set to true
const detection_options = {
    withLandmarks: true,
    withDescriptors: false,
}


function setup() {
    createCanvas(350, 350);

    // load up your video
    video = createCapture(VIDEO);
    video.size(width, height);
    // video.hide(); // Hide the video element, and just show the canvas
    faceapi = ml5.faceApi(video, detection_options, modelReady)
    textAlign(RIGHT);
    video.hide();

    contador_button = 0;
  }

function modelReady() {
    console.log('ready!')
    console.log(faceapi)
    faceapi.detect(gotResults)

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

    button = createButton('CREAR AVATAR');
    button.position(145, 315);
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
}