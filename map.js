var map;
var layers = [];
var globalExtent;

var sourceMT = new ol.source.TileJSON({
	url: "https://api.maptiler.com/maps/streets/tiles.json?key=pnJx5OnjEpoxvTM2AEfW",
	tileSize: 512,
	crossOrigin: "anonymous",
});

layers.push(
	new ol.layer.Tile({
		source: sourceMT,
	})
);

function addMarker(name, lat, lon, link, icon, iconW, iconH, scale) {
	var newMarker = new ol.Feature({
		geometry: new ol.geom.Point(ol.proj.fromLonLat([lon, lat])),
		url: link,
		name: name,
		body: '<img class="popup-img" src="https://nadzory-archeologiczne.pl/wp-content/uploads/2014/03/Rzesz%C3%B3w-1024x493.jpg"/>\
 				<h2>Rzeszów</h2>\
 				<p>Rzeszów – miasto na prawach powiatu w południowo-wschodniej Polsce, stolica województwa podkarpackiego. Rzeszów jest centralnym miastem aglomeracji rzeszowskiej. Rzeszów zamieszkuje 198 476 mieszkańców</p>',
	});

	var newLayer = new ol.layer.Vector({
		source: new ol.source.Vector({
			features: [newMarker],
		}),
		style: new ol.style.Style({
			image: new ol.style.Icon({
				anchor: [0.5, iconH / 2.0],
				size: [iconW, iconH],
				scale: scale,
				anchorXUnits: "fraction",
				anchorYUnits: "pixels",
				src: icon,
			}),
		}),
	});

	layers.push(newLayer);
}

addMarker("Rzeszów", 50.0411703227233, 21.999037900442005, "https://pl.wikipedia.org/wiki/Rzeszów", "temp1-128.png", 128, 128, 0.35);
addMarker("Helsinki", 60.169902870391894, 24.93841256141857, "https://pl.wikipedia.org/wiki/Helsinki", "temp1-128.png", 128, 128, 0.35);
addMarker("Włochy", 41.90129557250165, 12.498313488475754, "", "temp1-128.png", 128, 128, 0.35);
addMarker("Turcja", 39.90909232831139, 32.86420888426394, "", "temp1-128.png", 128, 128, 0.35);
addMarker("Cypr", 35.191060886533336, 33.38489056428424, "", "temp1-128.png", 128, 128, 0.35);
addMarker("Hiszpania", 40.3966762615727, -3.7266583550201413, "", "temp1-128.png", 128, 128, 0.35);

// const rzeszow = new ol.Feature({
// 	geometry: new ol.geom.Point(ol.proj.fromLonLat([21.999037900442005, 50.0411703227233])),
// 	url: "https://pl.wikipedia.org/wiki/Rzeszów",
// 	name: "Rzeszów",
// 	body: '<img class="popup-img" src="https://nadzory-archeologiczne.pl/wp-content/uploads/2014/03/Rzesz%C3%B3w-1024x493.jpg"/>\
// 				<h2>Rzeszów</h2>\
// 				<p>Rzeszów – miasto na prawach powiatu w południowo-wschodniej Polsce, stolica województwa podkarpackiego. Rzeszów jest centralnym miastem aglomeracji rzeszowskiej. Rzeszów zamieszkuje 198 476 mieszkańców</p>',
// });

// const helsinki = new ol.Feature({
// 	geometry: new ol.geom.Point(ol.proj.fromLonLat([24.93841256141857, 60.169902870391894])),
// 	name: "Helsinki",
// 	body: '<img class="popup-img" src="http://t0.gstatic.com/licensed-image?q=tbn:ANd9GcRMojZ-2pgNVfAdGq73EfMDZDqL02fORmhyKAFUWQvL3GfyZg8pJgsj3p4ujHFyg132"/>\
// 				<h2>Helsinki</h2>\
// 				<p>Helsinki – stolica i największe miasto Finlandii oraz regionu Uusimaa. W skład aglomeracji wchodzą: Espoo, Vantaa i Kauniainen. Są głównym ośrodkiem przemysłu, kultury i administracji. Port nad Zatoką Fińską. Uniwersytet założony w 1828 roku. W aglomeracji znajduje się główny fiński port lotniczy Helsinki-Vantaa</p>',
// });

function createMap()
{
	map = new ol.Map({
		target: "map",
		layers: layers,
		view: new ol.View({
			center: ol.proj.transform([16, 55], "EPSG:4326", "EPSG:3857"),
			zoom: 16,
		}),
	});
}

function calculateGlobalExtent() {
	var tempView = new ol.View({
		center: ol.proj.transform([16, 55], "EPSG:4326", "EPSG:3857"),
		zoom: 16,
	});

	globalExtent = tempView.calculateExtent();

	for (let i = 1; i < layers.length; i++) {
		var layerExtent = layers[i].getSource().getExtent();
		globalExtent = new ol.extent.extend(globalExtent, layerExtent);
	}
}

function restrictAndFitView() {
	var paddingPercent = 0.125;
	map.getView().fit(globalExtent, { padding: [map.getSize()[0] * paddingPercent, map.getSize()[1] * paddingPercent, map.getSize()[0] * paddingPercent, map.getSize()[1] * paddingPercent] });

	var newExtent = map.getView().calculateExtent();

	map.setView(
		new ol.View({
			center: ol.proj.transform([16, 55], "EPSG:4326", "EPSG:3857"),
			zoom: 16,
			extent: newExtent
		})
	);

	paddingPercent = 0.05;
	map.getView().fit(globalExtent, { padding: [map.getSize()[0] * paddingPercent, map.getSize()[1] * paddingPercent, map.getSize()[0] * paddingPercent, map.getSize()[1] * paddingPercent] });
}

createMap();
calculateGlobalExtent();
restrictAndFitView();

var popup = new Popup();
map.addOverlay(popup);

map.on("click", function (e) {
	var clickedOnMarker = false;

	map.forEachFeatureAtPixel(e.pixel, function (feature, layer) {
		//console.log(layer);
		//var prettyCoord = ol.coordinate.toStringHDMS(ol.proj.transform(e.coordinate, "EPSG:3857", "EPSG:4326"), 2);
		window.open(feature.values_.url, "_blank").focus();
		//popup.show(e.coordinate, feature.values_.body);
		clickedOnMarker = true;
	});

	if (clickedOnMarker == false) popup.hide();
});

//console.log(map.getView().fit(layers[0].getExtent()));

// map.on("pointermove", function (e) {
// 	var pointerOverFeature = false;

// 	map.forEachFeatureAtPixel(e.pixel, function (feature, layer) {
// 		//console.log(layer);
// 		//layer.style_.image_.scale_ = 1.0;
// 		if (!popup.isOpened()) popup.show(e.coordinate, feature.values_.body);
// 		pointerOverFeature = true;
// 	});

// 	if (pointerOverFeature == false) popup.hide();
// });
