Wards = new Meteor.Collection("wards");
var map, ward;

Meteor.startup(function() { })

function getColor(d) {
    return d > 1000 ? '#800026' :
           d > 500  ? '#BD0026' :
           d > 200  ? '#E31A1C' :
           d > 100  ? '#FC4E2A' :
           d > 50   ? '#FD8D3C' :
           d > 20   ? '#FEB24C' :
           d > 10   ? '#FED976' :
                      '#FFEDA0';
}

function style(feature) {
    return {
        fillColor: getColor(feature.properties.density),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 2,
        color: '#333',
        dashArray: '',
        fillOpacity: 0.4
    });

    if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
    }
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function resetHighlight(e) {
    ward.resetStyle(e.target);
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

function onMapLoad(){
  var myStyle = {
  	"color": "#ff7800",
	"weight": 2,
	"opacity": 0.65
  };

  var wardTitle = "<h3>72-Ahmed Nagar</h3>";
  var wardText = "<p>East: Starts from North-East Corner of Nala and runs along the Western boundary of election Ward No.74 i.e., Street No.3 upto A.P.Khadi Village Board on S.D.Eye Hospital road.</p>" +
					"<p>South: Starts from above point & runs along the border of Ward No.10-5 block and joins at Circle boundary at filter bed area at Pr.No.10-6-392/9.</p>" +
					"<p>West: Starts at the above and runs all along the S.D. Eye Hospital road upto Military Main Gate.</p>" +
					"<p>North: Starts at Nala and meets at North-east side at Street No.3 at Starting point.</p>"

  ward = L.geoJson( 
  	Wards.find({}, {fields: {'_id': 0}}).fetch(), {
  		style: myStyle,
  		onEachFeature: onEachFeature
  	}).addTo(map).bindPopup(wardTitle + wardText);

}

Template.map.rendered = function() {
  var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  var osmAttrib='Map data © OpenStreetMap contributors';
  var osm = new L.TileLayer(osmUrl, {minZoom: 5, maxZoom: 30, attribution: osmAttrib});

  map = new L.map('map').setView([17.489225240202474, 78.436952456024116], 13);
  map.on('click', onMapLoad);

  // start the map in apun ka Hyderabad
  map.setView(new L.LatLng(17.40225, 78.440000000306651), 15);
  map.addLayer(osm);
}