require([
  "esri/Map",
  "esri/views/SceneView",
  "esri/layers/FeatureLayer"
], (Map, SceneView, FeatureLayer) => {

  // setup scene view
const view = new SceneView({
  container: "viewDiv",
  map: new Map({
    basemap: "hybrid",
    ground: "world-elevation",
}),
  viewingMode: "global",
  extent: {
    xmax: -130,
    xmin: -100,
    ymax: 40,
    ymin: 20,
    spatialReference: {
        wkid: 4326,
    },
},
  camera: {
    position: {
      x: 172.639847, //Christchurch
      y: -43.527650,
      z: 48.61,
    },
    heading: 0,
    tilt: 85,
  },
});

// create feature location
  let features = [
    {
      geometry: {
        type: "point",
        // set position in front of camera
        x: 172.639847, 
        y: -43.525650,
        z: 20,
      },
      attributes: {
        ObjectID: 1,
      }
    },
   ];

  view.when()
    .then(createLayer)
    .then(addToView)
    .catch((e) => {
      console.error("Creating FeatureLayer failed", e);
    });

    

  //  Creates a client-side FeatureLayer from feature array
  function createLayer (){
    return new FeatureLayer({
      source: features,
      objectIdField: "OBJECTID",
      fields: [{
        name: "OBJECTID",
        type: "oid"
      }
    ],
      renderer: {
        type: "simple",
        symbol: {
          type: "point-3d",
          symbolLayers: [
            {
              type: "object",
              height: 30,
              resource: {
                href: "../models/flamingo.gltf" // use custom model
                // .glb file types work as well
              }
            }
          ]
        }
      }
    });
  }

  // Adds a given layer to the map in the view
  function addToView(layer){
    view.map.add(layer);
  }

});