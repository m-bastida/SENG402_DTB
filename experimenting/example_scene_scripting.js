
require([
  "esri/Map",
  "esri/views/SceneView",
  "esri/geometry/Extent",
], (
  Map,
  SceneView,
  Extent,
) => {

// Create a Map instance
const myMap = new Map({
    basemap: "hybrid",
    ground: "world-elevation",
});

// The clipping extent for the scene (in WGS84)
const mapExtent = new Extent({
    xmax: -130,
    xmin: -100,
    ymax: 40,
    ymin: 20,
    spatialReference: {
        wkid: 4326,
    },
});

// Create a MapView instance (for 2D viewing) and reference the map instance
//  -43.525650, and the longitude is 172.639847
const view = new SceneView({
    container: "viewDiv",
    map: myMap,
    viewingMode: "global",
    clippingArea: mapExtent,
    extent: mapExtent,
    camera: {
      position: {
        x: 172.639847,
        y: -43.525650,
        z: 48.61,
      },
      heading: 516,
      tilt: 85,
    },
});

const symbol = {
  type: "point-3d",
  symbolLayers: [
    {
      type: "object",
      height: 10,
      resource: {
        href: "../../models/flamingo.glb"
      }
    }
  ]
};



})