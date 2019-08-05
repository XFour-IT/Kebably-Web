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

exports.getNames = functions.region('europe-west2').https.onRequest((request, response) => {
    db.collection("vanLocations").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            console.log("DB: " + doc.data().name);
            console.log("Loc: " + doc.data().location)
        })})});