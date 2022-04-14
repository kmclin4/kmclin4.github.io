var map = L.map('map').setView([37, -97], 6);
var basemapUrl = 'https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}';
var basemap = L.tileLayer(basemapUrl).addTo(map);
var radarUrl = 'https://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi';
var radarDisplayOptions = {
  layers: 'nexrad-n0r-900913',
  format: 'image/png',
  transparent: true
};
var radar = L.tileLayer.wms(radarUrl, radarDisplayOptions).addTo(map);

var weatherAlertsUrl = 'https://api.weather.gov/alerts/active?region_type=land';
$.getJSON(weatherAlertsUrl, function(data) {
  L.geoJSON(data, {
    // Color all alert polygons orange, but color Severe polygons red
    style: function(feature){
      var alertColor = 'orange';
      if (feature.properties.severity === 'Severe') alertColor = 'red';
      if (feature.properties.severity === 'Extreme') alertColor = 'purple';
      if (feature.properties.severity === 'Minor') alertColor = 'yellow';
       if (feature.properties.event === 'Flood Warning') alertColor = 'blue';
       if (feature.properties.event === 'Flash Flood Warning') alertColor = 'navy';
      return { color: alertColor }
    },
    // Add a popup on each feature showing the NWS alert headline
    onEachFeature: function(feature, layer) {
      layer.bindPopup(feature.properties.headline);
    }
  }).addTo(map);
});
