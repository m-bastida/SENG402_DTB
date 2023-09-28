require([
  "esri/Map",
  "esri/views/SceneView",
  "esri/layers/FeatureLayer",
  "esri/symbols/WebStyleSymbol"
], (Map, SceneView, FeatureLayer, WebStyleSymbol) => {
  
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



  //  Creates a client-side FeatureLayer from an array of graphics
  function createLayer (){
    var layer =  new FeatureLayer({
      //4bc8537233344d04b9c37041f7204049
      portalItem: {
        id: "4bc8537233344d04b9c37041f7204049"
      },
      // url: "https://services.arcgis.com/hLRlshaEMEYQG5A8/arcgis/rest/services/Trees_SENG_Canopy/FeatureServer",
      objectIdField: "OBJECTID",
      fields: [{
        name: "OBJECTID",
        type: "oid"
      }
    ],
    renderer : {
      type: "simple", // autocasts as new SimpleRenderer()
      // symbol: {
      //   type: "web-style", // autocasts as new WebStyleSymbol()
      //   styleName: "esriRealisticTreesStyle",
      //   name: "Other",
      // },
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

      layer.when(() => {
        view.extent = layer.fullExtent;
        console.log(layer.spacialReference)
      })
      return layer
  }
  //  Creates a client-side FeatureLayer from an array of graphics
  // function createLayer2 (){
  //   var layer =  new FeatureLayer({
  //     //4bc8537233344d04b9c37041f7204049
  //     portalItem: {
  //       id: "3ca3220e1e894b8cb80c4dbab9ecbe7c"
  //     },
  //     // url: "https://services.arcgis.com/hLRlshaEMEYQG5A8/arcgis/rest/services/Trees_SENG_Canopy/FeatureServer",
  //     objectIdField: "OBJECTID",
  //     fields: [{
  //       name: "OBJECTID",
  //       type: "oid"
  //     }
  //   ],
  //   renderer : {
  //     type: "simple", // autocasts as new SimpleRenderer()
  //     // symbol: {
  //     //   type: "web-style", // autocasts as new WebStyleSymbol()
  //     //   styleName: "esriRealisticTreesStyle",
  //     //   name: "Other",
  //     // },
  //   },
  //   elevationInfo: {
  //     mode: "on-the-ground",
  //     offset: 0,
  //   }
    // });

  //     layer.when(() => {
  //       view.extent = layer.fullExtent;
  //       console.log(layer.spacialReference)
  //     })
  //     return layer
  // }



  // Adds a given layer to the map in the view
  function addToView(layer){
    console.log(layer)
    view.map.add(layer);
  }

  view.when()
    .then(createLayer)
    .then(addToView)
    // .then(createLayer2)
    // .then(addToView)
    .then(() => {console.log("done.")})
    .catch((e) => {
      console.error("Creating FeatureLayer failed", e);
    });

});