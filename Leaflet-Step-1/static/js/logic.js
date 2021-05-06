var geoLink = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'

var myMap = L.map('map', {
    center: [10, 0],
    zoom: 3    
})

var streetLayer = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);

satelliteLayer = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/satellite-streets-v11",
    accessToken: API_KEY
    });

    // Load in geojson data
// var geoData = "static/GeoJSON/PB2002_boundaries.json";
// var geoData = "https://edumaps.esri.ca/ArcGIS/rest/services/MapServices/TectonicPlates/MapServer/0/query?outFields=*&where=1%3D1&f=geojson";
// var tectonicPlates = L.geoJson(geoData);

var baseMaps = {
    Streets: streetLayer, 
    'Satellite View': satelliteLayer,
    // 'Tectonic Plates': tectonicPlates
};

function markerColor(depth) {
    if (depth >90) {
        return 'red'}
    else if (depth >70) {
        return 'orangered'}
    else if (depth > 50) {
        return 'orange'}
    else if (depth > 30) {
        return 'gold'}
    else if (depth > 10) {
        return 'yellow'}
    else {return 'greenyellow'}
    };

function markerSize(magnitude) {
    return magnitude * 50000;
}

d3.json(geoLink).then(function(earthquakes) {
    
    console.log(earthquakes)
    var quakeMarkers = []

    for (i=0; i< earthquakes.features.length; i++) {
        var feature = earthquakes.features[i];
        var lat = feature.geometry.coordinates[1];
        var long = feature.geometry.coordinates[0];
        var magnitude = feature.properties.mag;
        var location = feature.properties.place;
        var depth = feature.geometry.coordinates[2];

        var marker = L.circle([lat, long], {
            stroke: true,
            weight: 1,
            color: 'white',
            fillColor: markerColor(depth),
            fillOpacity: 0.75,
            radius: markerSize(magnitude), 

        }).bindPopup("<b>Location: </b>" + location + "<br><b>Magnitude: </b>" + magnitude + "<br><b>Depth: </b>" + depth + "<br><b>Lat,Long: </b>(" + lat +","+ long +")");

        quakeMarkers.push(marker);
       var quakeLayer = L.layerGroup(quakeMarkers).addTo(myMap);

    };

    var Layers = {
        Earthquakes: quakeLayer
    }

    L.control.layers(baseMaps, Layers, {collapsed: false}).addTo(myMap);
    
    var legend = L.control({postion: "bottomright"});

    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var colors = ['greenyellow', 'yellow', 'gold', 'orange', 'orangered', 'red'];
        var limits = ['-10 to 10', '10 to 30', '30 to 50', '50 to 70', '70 to 90', '90+'];
        var labels = [];
       
        var legendInfo = "<h3>Earthquake Depth</h3>";
        
        div.innerHTML = legendInfo;
        
        limits.forEach(function(limit, index) {
            labels.push("<li style=\"background-color: " + colors[index] + "\"></li> " + limits[index] + "<br>");
        });

        div.innerHTML += "<ul>" + labels.join(" ") + "</ul>";
        return div;
    };

    legend.addTo(myMap);
});

