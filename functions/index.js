const firebase = require('firebase-admin');
const functions = require('firebase-functions');
firebase.initializeApp();
var db = firebase.firestore();

exports.createJSON = functions.region('europe-west2').https.onRequest((request, response) => {
    response.set('Access-Control-Allow-Origin', '*');
    var basicJSON1 = `{
        "id": "places",
        "type": "symbol",
        "layout": {
            "icon-image": "{icon}",
            "icon-allow-overlap": true
            },
        "source": {
            "type": "geojson",
            "data": {
                "type": "FeatureCollection",
                "features": [`;
                var basicJSON2 = `
            ]}
        }
    }`;
    var secondJSON = "";
    var stringJSON = "";
    db.collection("vanLocations").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            console.log("DB: " + doc.data().name);
            basicJSON1 = basicJSON1 + `{
                "type": "Feature",
                "properties": {
                "description": "`+doc.data().description+`",
                "icon": "custom-marker"
                },
                "geometry": {
                "type": "Point",
                "coordinates": [`+doc.data().location.longitude+`,`+doc.data().location.latitude+`]
                }
            },`})}).then(() => {
                secondJSON = basicJSON1.slice(0, -1);
                stringJSON = secondJSON+basicJSON2;
                console.log(secondJSON);
                console.log(stringJSON);
            }).then(() => {
                var responseJSON = JSON.parse(stringJSON);
                response.send(200, responseJSON);
            }).catch(error => {
                    console.error("Error: " + error);
                });
});

exports.nearestPoint = functions.region('europe-west2').https.onRequest((request, response) => {
    var closest
    function rad(x) {return x*Math.PI/180;}
    function findClosest(request) {
        console.log("Running");
        var location = request.body;
        var lat = location.lat;
        var lng = location.lng;
        var i = 0
        const R = 6371; // radius of earth in km
        var distances = [];
        closest = -1;
        db.collection("vanLocations").get().then((querySnapshot) =>
        querySnapshot.forEach((doc) => {
            console.log("Testing: "+doc.data().name);
            i += 1;
            var mlat = doc.data().location.latitude;
            var mlng = doc.data().location.longitude;
            var dLat  = rad(mlat - lat);
            var dLong = rad(mlng - lng);
            var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(rad(lat)) * Math.cos(rad(lat)) * Math.sin(dLong/2) * Math.sin(dLong/2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            var d = R * c;
            distances[i] = d;
            if ( closest == -1 || d < distances[closest] ) {
                closest = doc.data().location;
                console.log(closest);
                response.send(200, closest)
            }
        }));
    }
    findClosest(request);
})