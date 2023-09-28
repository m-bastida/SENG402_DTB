require([
  "esri/Map",
  "esri/views/SceneView",
  "esri/layers/SceneLayer",
], (Map, SceneView, SceneLayer) => {

    
    const renderer = {
      type: "simple", // autocasts as new SimpleRenderer()
      symbol: {
        type: "point-3d", // autocasts as new PointSymbol3D()
        symbolLayers: [
          {
            type: "icon", // autocasts as new IconSymbol3DLayer()
            size: 0.5,
            material: {
              color: [252, 250, 215]
            }
          }
        ]
      }
    };

    const tree_layer = new SceneLayer({
      portalItem: {
        id: "c4503d5aea1144d7950e5300648828b0"
      },
      popupEnabled: false,
      renderer: renderer
    });

    

  
const view = new SceneView({
  container: "viewDiv",
  map: new Map({
    layers : [tree_layer],
    basemap: "hybrid",
    ground: "world-elevation",
}),
  viewingMode: "global",
  camera: {
    position: {
      x: 174.775103, // Wellington
      y: -41.288426,
      z: 200,
    },
  },
});

});