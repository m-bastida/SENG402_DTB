require([
  "esri/Map",
  "esri/views/SceneView",
  "esri/layers/FeatureLayer",
], (Map, SceneView, FeatureLayer) => {
  
const view = new SceneView({
  container: "viewDiv",
  map: new Map({
    basemap: "hybrid",
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

  //  Creates a client-side FeatureLayer from an array of graphics
  function createLayer (){
    return new FeatureLayer({
      url: "https://services.arcgis.com/hLRlshaEMEYQG5A8/arcgis/rest/services/Trees_SENG_Canopy/FeatureServer",
      objectIdField: "OBJECTID",
      fields: [{
        name: "OBJECTID",
        type: "oid"
      }
    ]
    });
  }

  // Adds a given layer to the map in the view
  function addToView(layer){
    view.map.add(layer);
  }

  view.when()
    .then(createLayer)
    .then(addToView)
    .then(() => {console.log("done.")})
    .catch((e) => {
      console.error("Creating FeatureLayer failed", e);
    });

});