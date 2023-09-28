require([
    "esri/Map",
    "esri/views/SceneView",
    "esri/layers/FeatureLayer",
    "esri/symbols/WebStyleSymbol"
  ], (Map, SceneView, FeatureLayer, WebStyleSymbol) => {

function createView(layer) {
    
    const view = new SceneView({
        container: "viewDiv",
        map: new Map({
        basemap: "osm",
        ground: "world-elevation",
    }),
        viewingMode: "global",
        layers: [layer]
    });
    return view

}
  
  
const view = new SceneView({
    container: "viewDiv",
    map: new Map({
    basemap: "osm",
    ground: "world-elevation",
}),
    viewingMode: "global",
});
  
    //  Creates a client-side FeatureLayer from an array of graphics
    async function createLayer (){
      var layer = new FeatureLayer({
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
    }
  
    // Adds a given layer to the map in the view
    function addToView(layer){
      console.log(layer)
      view.map.add(layer);
    }
  

    view.when()
    .then(() => {
        var layer = createLayer()
        layer.when(() => {
            createView(layer) 
        })
    })
    .then(() => {console.log("done.")})
    .catch((e) => {
      console.error("Creating FeatureLayer failed", e);
    });
  
  });