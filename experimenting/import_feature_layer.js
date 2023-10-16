require([
  "esri/Map",
  "esri/views/SceneView",
  "esri/layers/FeatureLayer",
  "esri/symbols/WebStyleSymbol"
], (Map, SceneView, FeatureLayer, WebStyleSymbol) => {
  
  // setup scene view
const view = new SceneView({
  container: "viewDiv",
  map: new Map({
    basemap: "osm", // open street map
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


// create tree layer
  function createLayer (){
    var layer =  new FeatureLayer({
      portalItem: {
        id: "4bc8537233344d04b9c37041f7204049" // tree SENG centroid layer
      },
      objectIdField: "OBJECTID",
      fields: [{
        name: "OBJECTID",
        type: "oid"
      }
    ],
    renderer : {
      type: "simple", // autocasts as new SimpleRenderer()
      visualVariables: [
        {
          type: "size",
          axis: "height",
          field: "Tree_H", // tree height
          valueUnit: "meters"
        },
      ]
    },
    elevationInfo: {
      mode: "on-the-ground",
      offset: 0,
    }
    });

    // set tree symbol
    var symbol = new WebStyleSymbol({
      styleName: "esriRealisticTreesStyle",
      name: "Other",
    });

    symbol.fetchSymbol()
      .then(function(treeSymbol){
        var objectSymbolLayer = treeSymbol.symbolLayers.getItemAt(0);
        objectSymbolLayer.material = { color: "green" };
        var renderer = layer.renderer.clone();
        renderer.symbol = treeSymbol;
        layer.renderer = renderer;
      });

      return layer
  }


  // Adds a given layer to the map in the view
  function addToView(layer){
    console.log(layer)
    view.map.add(layer);
  }

  view.when()
    .then(createLayer)
    .then(addToView)
    .catch((e) => {
      console.error("Creating FeatureLayer failed", e);
    });

});