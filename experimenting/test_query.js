require([
  "esri/Map",
  "esri/views/SceneView",
  "esri/layers/FeatureLayer",
  "esri/layers/GraphicsLayer",
  "esri/widgets/Sketch",
], (Map, SceneView, FeatureLayer, GraphicsLayer, Sketch) => {
  
const view = new SceneView({
  container: "viewDiv",
  map: new Map({
    basemap: "osm",
    ground: "world-elevation",
}),

  viewingMode: "global",
  camera: {
    position: {
      x: 174.775103, //Wellington
      y: -41.288426,
      z: 200,
    },
  },
});

const colors = ["rgba(115, 0, 115, 0)", "#820082", "#910091", "#a000a0", "#af00af", "#c300c3", "#d700d7", "#eb00eb", "#ff00ff", "#ff58a0", "#ff896b", "#ffb935", "#ffea00"];

let renderer = {
  type: "heatmap",
  colorStops: [
    { color: colors[0], ratio: 0 },
    { color: colors[1], ratio: 0.083 },
    { color: colors[2], ratio: 0.166 },
    { color: colors[3], ratio: 0.249 },
    { color: colors[4], ratio: 0.332 },
    { color: colors[5], ratio: 0.415 },
    { color: colors[6], ratio: 0.498 },
    { color: colors[7], ratio: 0.581 },
    { color: colors[8], ratio: 0.664 },
    { color: colors[9], ratio: 0.747 },
    { color: colors[10], ratio: 0.83 },
    { color: colors[11], ratio: 0.913 },
    { color: colors[12], ratio: 1 }
  ],
  radius: 18,
  maxDensity: 0.04625,
  minDensity: 0
};

var serverlayer = new FeatureLayer({portalItem: {id: "3ca3220e1e894b8cb80c4dbab9ecbe7c"}})
const graphicsLayer = new GraphicsLayer();
view.map.add(graphicsLayer);

let features = [
  {
    geometry: {
      type: "point",
      x: 172.639847,
      y: -43.525650,
      z: 30,
    },
    attributes: {
      ObjectID: 1,
      grid_code: 2,
      pointid: 3,
    }
  },
 ];
var clientlayer =  new FeatureLayer({
  source: features,
  // portalItem: {id: "3ca3220e1e894b8cb80c4dbab9ecbe7c"},
  objectIdField: "OBJECTID",
  fields: [{
    name: "OBJECTID",
    type: "oid"
  },
  {
    name: "grid_code",
    type:"single"},
  {
    name: "pointid",
    type: "integer"
  }
],
elevationInfo: {
  mode: "on-the-ground",
  offset: 0,
},
renderer: renderer
});
view.map.add(clientlayer);

// view.on("click", function(event){
//     let query = serverlayer.createQuery();
//     query.geometry = view.toMap(event);  // the point location of the pointer
//     query.distance = 2;
//     query.units = "miles";
//     query.spatialRelationship = "intersects";  // this is the default
//     query.returnGeometry = true;

//     serverlayer.queryFeatures(query)
//       .then(function(response){
//         console.log("query complete")
//         console.log(response.features[0].attributes)
//         clientlayer.applyEdits({addFeatures:response.features});
//       });
//   });

function selectFeatures(geometry){
  let query = serverlayer.createQuery();
  query.geometry = geometry
  query.spatialRelationship = "intersects";  // this is the default
  query.returnGeometry = true;

  serverlayer.queryFeatures(query)
    .then(function(response){
      console.log("query complete")
      console.log(response.features[0].attributes)
      clientlayer.applyEdits({addFeatures:response.features});
    });

}



view.when(() => {
  const sketch = new Sketch({
    layer: graphicsLayer,
    view: view,
  });

  view.ui.add(sketch, "top-right");
  

// Listen to sketch widget's create event.
sketch.on("create", function(event) {
// check if the create event's state has changed to complete indicating
// the graphic create operation is completed.
if (event.state === "complete") {
  // remove the graphic from the layer. Sketch adds
  // the completed graphic to the layer by default.
  graphicsLayer.remove(event.graphic);

  // use the graphic.geometry to query features that intersect it
  selectFeatures(event.graphic.geometry);
}
});
});

});