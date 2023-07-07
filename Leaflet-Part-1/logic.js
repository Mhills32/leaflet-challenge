let map = L.map("map", {
    center: [39.8283, -98.5795],
    zoom: 5
  });
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
  
  let link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";
  
  function getMarkerColor(depth) {
    if (depth < 10) {
      return 'limegreen';
    } else if (depth < 30) {
      return 'yellow';
    } else if (depth < 50) {
      return 'orange';
    } else if (depth < 70) {
      return 'darkorange';
    } else if (depth < 90) {
      return 'red';
    } else {
      return 'darkred';
    }
  }
  
  let ranges = [
    { label: '-10 - 10', color: getMarkerColor(10) },
    { label: '10 - 30', color: getMarkerColor(20) },
    { label: '30 - 50', color: getMarkerColor(40) },
    { label: '50 - 70', color: getMarkerColor(60) },
    { label: '70 - 90', color: getMarkerColor(80) },
    { label: '90+', color: getMarkerColor(100) }
  ];
  
  d3.json(link)
  .then(data => {
    function getMarkerSize(magnitude) {
      return magnitude * 5; 
    }
  
    data.features.forEach(feature => {
      let magnitude = feature.properties.mag;
      let depth = feature.geometry.coordinates[2];
      let latitude = feature.geometry.coordinates[1];
      let longitude = feature.geometry.coordinates[0];
  
      let markerSize = getMarkerSize(magnitude);
      let markerColor = getMarkerColor(depth);
  
      let tooltipText = `<strong>Magnitude:</strong> ${magnitude}<br><strong>Location:</strong> ${latitude}, ${longitude}<br><strong>Depth:</strong> ${depth}`;
      let marker = L.circleMarker([latitude, longitude], {
        radius: markerSize,
        fillColor: markerColor,
        color: 'black',
        weight: 0.2,
        fillOpacity: 0.7
      }).bindTooltip(tooltipText);
  
      marker.addTo(map);
    });
  
    let legend = L.control({ position: 'bottomright' });
    legend.onAdd = function(map) {
      let div = L.DomUtil.create('div', 'legend');
  
      div.innerHTML = '<strong>Legend</strong><br>';
  
      ranges.forEach(range => {
        div.innerHTML += `
          <div>
            <span class="legend-color" style="background-color: ${range.color}"></span>
            <span class="legend-label">${range.label}</span>
          </div>
        `;
      });
  
      div.style.backgroundColor = 'white';
      div.style.padding = '10px';
      div.style.border = '1px solid black';
  
      return div;
    };
  
    legend.addTo(map);
  });
  



