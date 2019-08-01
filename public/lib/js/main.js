const firebaseConfig = {
    apiKey: "AIzaSyBuXp-d0Dvvq3au_2yecyPm9ehdV4hCzFo",
    authDomain: "junehack.firebaseapp.com",
    databaseURL: "https://junehack.firebaseio.com",
    projectId: "junehack",
    storageBucket: "junehack.appspot.com",
    messagingSenderId: "739569160546",
    appId: "1:739569160546:web:68baca3bf461fca2"
  };
  firebase.initializeApp(firebaseConfig);

var xmlHttp = new XMLHttpRequest();
xmlHttp.open( "GET", "https://junehack.firebaseio.com/map.json", false ); // false for synchronous request
xmlHttp.send( null );
var responseData = xmlHttp.responseText;

var kebabData = JSON.parse(responseData)

mapboxgl.accessToken = 'pk.eyJ1IjoiYmVuamlzb2Z0IiwiYSI6ImNqeXJrcTFkODA0enEzb3N5eW1ubHk0NTAifQ.yzYfg4Oiyly_WJJ25W81CQ';
    var map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-0.9713584,51.4581074],
      zoom: 11
    });

map.on('load', function() {
    map.loadImage("https://i.imgur.com/MK4NUzI.png", function(error, image) {
    if (error) throw error;
    map.addImage("custom-marker", image)});
    map.addLayer(kebabData);
});

map.on('click', 'places', function (e) {
    var coordinates = e.features[0].geometry.coordinates.slice();
    var description = e.features[0].properties.description;
     
    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }
     
    new mapboxgl.Popup()
    .setLngLat(coordinates)
    .setHTML(description)
    .addTo(map);
    });
     
// Change the cursor to a pointer when the mouse is over the places layer.
map.on('mouseenter', 'places', function () {
    map.getCanvas().style.cursor = 'pointer';
});
    
// Change it back to a pointer when it leaves.
map.on('mouseleave', 'places', function () {
    map.getCanvas().style.cursor = '';
});