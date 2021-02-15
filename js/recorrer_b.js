// Copyright (c) 2019 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
PoseNet example using p5.js
=== */

let camara_web;
let poseNet;
let poses = [];
let eje_x_deteccion, eje_y_deteccion;
let deteccion_width, deteccion_height;
let camara_vigilancia;
let tabla;
let numero_random;
let timer, timer_movimiento;
let nueva_fila;
let nueva_imagen;
let pics = [];
let detecta;
let zoom_camara;
let invertir;
let desplazamiento_zoom_x, desplazamiento_zoom_y;
let avatar;

let imagen_subida;
let button;
let timer_button;
let contador_button;

var firebaseConfig = {
  apiKey: "AIzaSyByLXZOtrC_bcS9g8HJjZH2hLsrVt-oLe0",
  authDomain: "desacontece-b8e40.firebaseapp.com",
  projectId: "desacontece-b8e40",
  storageBucket: "desacontece-b8e40.appspot.com",
  messagingSenderId: "930130613129",
  appId: "1:930130613129:web:8e5a626828cb268fb20758",
  measurementId: "G-LXSDSG256D"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
database=firebase.database();
console.log(firebase)

var firebaseRef= firebase.database().ref();
var archivos


function setup() {

  var c = createCanvas(windowWidth - 20, windowHeight - 20);
  pixelDensity(1);
  camara_web = createCapture(VIDEO);
  camara_web.size(width, height);
c.parent("canvasContainer")
  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(camara_web, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on("pose", function (results) {
    poses = results;
  });
  // Hide the video element, and just show the canvas
  camara_web.hide();

  camara_vigilancia = createVideo("js/assets/2.mp4", camara_vigilanciaLoad);
  camara_vigilancia.size(width, height);
  camara_vigilancia.hide();

  tabla = new p5.Table();
  tabla.addColumn("id");
  tabla.addColumn("eje_x");
  tabla.addColumn("eje_y");

  numero_random = random(500);
  timer = 0;

  invertir = true;

  desplazamiento_zoom_x = width * 0.5;
  desplazamiento_zoom_y = height * 0.5;

  c.drop(gotFile);

  textSize(width / 30);
  textAlign(CENTER, CENTER);

  contador_button = 1;

}


function camara_vigilanciaLoad() {
  camara_vigilancia.loop();
  camara_vigilancia.volume(0);
}

function modelReady() {
  select("#status").html("Model Loaded");
}

function draw() {
  background(0);
  //image(camara_vigilancia, 0, 0); // camara de vigilancia

  fill(255);
  let texto_inicial = "Arrastre su avatar aquí";
  text(texto_inicial, width/2, height/2);

 

  if (invertir == true) {
    translate(camara_web.width, 0); // invertir la carama apretando la 'i'
    scale(-1, 1);
  }

  drawKeypoints();

  if(imagen_subida){
  
    document.getElementById("texto").hidden = false;

  //zoom_camara = camara_vigilancia.get(eje_x_deteccion*0.75, eje_y_deteccion * 0.9, 230, 120);
  zoom_camara = camara_vigilancia.get(desplazamiento_zoom_x, desplazamiento_zoom_y, 230, 120);
  image(zoom_camara, 0, 0, width, height);

  blendMode(MULTIPLY);
  
  
    image(imagen_subida, eje_x_deteccion, eje_y_deteccion, deteccion_width, deteccion_height);
  
  
  
    if (contador_button == 40){
  
    /*
    button = createButton('CONTINUAR A MAPAS');
    button.position(width/2, height * .75);
    button.mousePressed(redireccion);
    */
   subirTabla();
    redireccion();
  
    }

  }

  //image(avatar, eje_x_deteccion, eje_y_deteccion, deteccion_width * 0.75, deteccion_height * 0.75);
  blendMode(NORMAL);



  if (millis() >= 1000 + timer) {
    if (detecta == 1) {
      // empieza a guardar datos cuando detecta rostros, evitamos tener NaN en el .csv
      guardarTabla();
      contador_button = contador_button + 1;
      console.log(contador_button);
    }
    timer = millis();
  }

  Desplazamiento();


  
  

}

function Desplazamiento(){
  if (detecta == 1) {
    if (eje_x_deteccion < width * 0.3) { desplazamiento_zoom_x = desplazamiento_zoom_x - 1.5 } // aumenta +1 el valor de X de zoom camara
    if (eje_x_deteccion > width * 0.7) { desplazamiento_zoom_x = desplazamiento_zoom_x + 1.5 } // resta -1 el valor de X de zoom camara  
    if (eje_y_deteccion < height * 0.3) { desplazamiento_zoom_y = desplazamiento_zoom_y - 1.5 } // aumenta +1 a Y zoom camara
    if (eje_y_deteccion > height * 0.7) { desplazamiento_zoom_y = desplazamiento_zoom_y + 1.5 } 
    
    if (eje_x_deteccion < width * 0.2) { desplazamiento_zoom_x = desplazamiento_zoom_x - 3 }
    if (eje_x_deteccion > width * 0.8) { desplazamiento_zoom_x = desplazamiento_zoom_x + 3 } 
    if (eje_y_deteccion < height * 0.2) { desplazamiento_zoom_y = desplazamiento_zoom_y - 3 } 
    if (eje_y_deteccion > height * 0.8) { desplazamiento_zoom_y = desplazamiento_zoom_y + 3 }
  }



// limites para desplazamientos

if ( desplazamiento_zoom_x <= width * 0.1 ) { desplazamiento_zoom_x = width * 0.11}
if ( desplazamiento_zoom_x >= width * 0.8 ) { desplazamiento_zoom_x = width * 0.79}

if ( desplazamiento_zoom_y <= height * 0.05 ) { desplazamiento_zoom_y = height * 0.051}
if ( desplazamiento_zoom_y >= height * 0.8 ) { desplazamiento_zoom_y = height * 0.79}
}



// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    let pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      // 0 nariz
      // 1 y 2 ojos
      let keypoint = pose.keypoints[0];

      let ojo_1 = pose.keypoints[1];

      let distancia =
        dist(
          ojo_1.position.x,
          ojo_1.position.y,
          keypoint.position.x,
          keypoint.position.y
        ) * 3;
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        eje_x_deteccion = keypoint.position.x - 100;
        eje_y_deteccion = keypoint.position.y - 100;
        deteccion_width = distancia;
        deteccion_height = distancia;
        detecta = 1;
      }
    }
  }
}

function guardarTabla() {
  nueva_fila = tabla.addRow();
  nueva_fila.setNum("id", tabla.getRowCount() - 1);
  nueva_fila.setNum("eje_x", eje_x_deteccion);
  nueva_fila.setNum("eje_y", eje_y_deteccion);
}

function keyTyped() {
  if (key === "i") {
    // apretando la tecla 'i' invertimos la camara
    invertir = !invertir;
  }

  if (key === "g") {
    saveTable(tabla, "new" + numero_random + ".csv"); // apretando la 's' guarda el .csv
  }
}

function gotFile(file) {
  if (file.type === 'image') {
    imagen_subida = createImg(file.data).hide();
  }
}

function redireccion() {
  if (window.confirm("¿Queres recuperar tu recorrido?")) {
    window.location.href="transitar.html"
  } else {
    window.location.href="https://www.instagram.com/desacontece/"
  }
  
}

function subirTabla(){
  archivos = (tabla.getArray())
  console.log("sesu bio")
  firebaseRef.child("nubePuntos").set(archivos)
}