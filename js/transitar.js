const tilesProvider = "http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png"
const mymap = L.map('mapid').setView([0,0], 10);
var latitude = 0
var longitude =0
var table = new p5.Table
table.addColumn("id");
table.addColumn("eje_x");
table.addColumn("eje_y");
var tablita
var firebaseTabla = []
var niIdea

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
database = firebase.database();

var ref = database.ref().child("nubePuntos")
ref.once('value', gotData, errData);


function gotData(data){
  console.log(data.val());
  tablita = data.val();
  convertirTabla(data.val())
  
}

function errData(data){
  console.log("ele pe eme")
}

function convertirTabla(leTablita) {
  /*
  fila = tabla.addRow()
  for each array in tablita{
    
    fila.setNum(id[0])
    fila.setNum(eje_x[1])
    fila.setNum(eje_x[3])*/
    var fila = table.addRow();
    leTablita.forEach(firebaseTeOdio => {
      let id = firebaseTeOdio[0];
      
      let eje_x = firebaseTeOdio[1];
      
      let eje_y = firebaseTeOdio[2];
      
      
      console.log("Firebase, te odio", id, eje_x, eje_y);
      
      firebaseTabla.push({"id":id, "puntoEnPantalla": L.point(eje_x, eje_y) })
      
    }
    )
    
    
  }
  
  
  var marker;
  
  L.tileLayer(tilesProvider,{
    maxZoom:40, 
  }).addTo(mymap)
  
  if ("geolocation" in navigator) {
    console.log("la geolocalización está disponible")
    navigator.geolocation.getCurrentPosition(position =>{
      latitude= (position.coords.latitude);
      longitude= (position.coords.longitude);
      var latlng= L.latLng(latitude,longitude);  
        
      marker= L.marker([latitude,longitude],{draggable: true}).addTo(mymap)
      mymap.flyTo(latlng, 10);
      marker.bindPopup("Arrastra el marcador hasta tu ubicacion actual y confirmá").openPopup();
      console.log(latitude, longitude)
    });
  } else {
    console.log("la geolocalización NO está disponible")
    marker=L.marker([-38.416097, -63.616672],{draggable: true}).addTo(mymap)
  }
  
  document.getElementById("boton").addEventListener('click', (event) => {
    event.preventDefault();
    dibujameLa();
  });
  
  // mejor seria: dibujameLa(data)
  function dibujameLa(){
    console.log(firebaseTabla);
    var posActual = marker.getLatLng();
    const latlngs = [posActual,]
    
    // recorremos lo que vino de firebase
    firebaseTabla.forEach(firebaseTodaviaTeOdio => {
      // sacamos el punto de la lista
      let unPuntoEnPantalla = firebaseTodaviaTeOdio.puntoEnPantalla;
      // calcula las coordendas dale, calcula
      let lasCoordenadas = daleDameLasCoordenadasDale(unPuntoEnPantalla);
      // pintamos el mapa con un marcador
      niIdea = L.marker(lasCoordenadas).addTo(mymap);
      // vamos acumuladno las coordenadas en un array pa usar mas tarde y dibujar alto poly
      latlngs.push(lasCoordenadas);
    })
    
    var polyline = L.polyline(latlngs, {color: '#a31916'}).addTo(mymap);
    niIdea.bindPopup("<b>Transitá tu recorrido. Compartilo en </b><a href='https://www.instagram.com/desacontece/'>@desacontece.</a>").openPopup();
    
  }
  // puntoEnPantalla es del tipo "Point" y tiene valores en ejeX y ejeY
  function daleDameLasCoordenadasDale(puntoEnPantalla) {
    var posActual = marker.getLatLng() 
    const area = L.latLng(posActual.lat, posActual.lng).toBounds(2000); // podes usar esto para obtener los valores de Lat minimos y maximos y Long min y max.
    let minLong = area.getWest()
    let maxLong = area.getEast()
    let minLat = area.getSouth()
    let maxLat = area.getNorth()
    let maxX = 1600
    let maxY = 800
    // area en la que queremos dibujar el camino
    
    // primero se calcula el punto                         
    let misterioLat = ((puntoEnPantalla.x / maxX) * (maxLong - minLong)) + minLat
    let misterioLong  = ((puntoEnPantalla.y / maxY) * (maxLat - minLat)) + minLong
    let puntoConLatLong = L.latLng(misterioLat,misterioLong)
    return puntoConLatLong;
  }
  
  