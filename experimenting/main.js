import {createSketchEvent} from "./select_area.js";

require([
    "esri/Map",
    "esri/views/SceneView",
    "esri/layers/FeatureLayer",
    "esri/layers/GraphicsLayer",
    "esri/layers/SceneLayer",
    "esri/widgets/Sketch",
    "esri/symbols/WebStyleSymbol",
    "esri/widgets/Editor"
  ], (Map, SceneView, FeatureLayer, GraphicsLayer, SceneLayer, Sketch, WebStyleSymbol, Editor) => {

    
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


const graphicsLayer = new GraphicsLayer();
view.map.add(graphicsLayer);

const colors = ["rgba(115, 0, 115, 0)", "#820082", "#910091", "#a000a0", "#af00af", "#c300c3", "#d700d7", "#eb00eb", "#ff00ff", "#ff58a0", "#ff896b", "#ffb935", "#ffea00"];

let renderer = {
type: "heatmap",
field: "grid_code",
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

let features = [
{
    geometry: {
    type: "point",
    x: 172.639847,
    y: -43.525650,
    z: 30,
    },
    // attributes: {
    // ObjectID: 1,
    // grid_code: 2,
    // pointid: 3,
    // }
},
];


var treeclientlayer =  new FeatureLayer({
    source: features,
    // portalItem: {
    //   id: "4bc8537233344d04b9c37041f7204049"
    // },
    objectIdField: "OBJECTID",
    fields: [{
        name: "OBJECTID",
        type: "oid"
    }
    ],
    renderer : {
        type: "simple", // autocasts as new SimpleRenderer()
        // visualVariables: [
        //     {
        //     type: "size",
        //     axis: "height",
        //     field: "Tree_H", // tree height
        //     valueUnit: "meters"
        //     },
        // ]
    },
    elevationInfo: {
        mode: "on-the-ground",
        offset: 0,
    }
});

var buildingclientlayer =  new SceneLayer({
    //7f38536f8a6f46319279941690e30c78
    //2ec1ba6849ec45c09b0b97fde15bc2e5
    portalItem:{id: "7f38536f8a6f46319279941690e30c78"},
    // source: features,
    // objectIdField: "OBJECTID",
    // fields: [{
    //     name: "OBJECTID",
    //     type: "oid"
    // }
    // ],
    // renderer : {
    //     type: "simple", // autocasts as new UniqueValueRenderer()
    //     defaultSymbol: getSymbol("#FFFFFF"),
    //     defaultLabel: "Other",
    //     field: "TYPE",
    //     visualVariables: [
    //       {
    //         type: "size",
    //         field: "HEIGHT"
    //       }
    //     ]
    //   },
    // renderer : {
    //     type: "simple",
    //     symbol : {
    //         type: "polygon-3d",  // autocasts as new PolygonSymbol3D()
    //         symbolLayers: [{
    //           type: "extrude",   // autocasts as new ExtrudeSymbol3DLayer()
    //           size: 1000,        // Height of the extrusion in meters
    //           material: { color: "blue" }
    //         }]
    //       }
    // },
    // elevationInfo: {
    //     mode: "on-the-ground",
    //     offset: 0,
    // }
});

var heatclientlayer =  new FeatureLayer({
source: features,
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

var heatserverlayer = new FeatureLayer({portalItem: {id: "3ca3220e1e894b8cb80c4dbab9ecbe7c"}})
var buildingserverlayer = new FeatureLayer({portalItem: {id: "2ec1ba6849ec45c09b0b97fde15bc2e5"}})

const heatLayers = {
    server: heatserverlayer,
    client: heatclientlayer,
}
const buildingLayers = {
    server: buildingserverlayer,
    client: buildingclientlayer,
}


var symbol = new WebStyleSymbol({
    styleName: "esriRealisticTreesStyle",
    name: "Other",
});

symbol.fetchSymbol()
.then(function(treeSymbol){
    var objectSymbolLayer = treeSymbol.symbolLayers.getItemAt(0);
    objectSymbolLayer.material = { color: "green" };
    var treerenderer = treeclientlayer.renderer.clone();
    treerenderer.symbol = treeSymbol;
    treeclientlayer.renderer = treerenderer;
    console.log("symbol loaded");
});
var treeserverlayer = new FeatureLayer({portalItem: {id: "4bc8537233344d04b9c37041f7204049"}})

const treeLayers = {
    server: treeserverlayer,
    client: treeclientlayer,
}

view.map.add(heatclientlayer);
view.map.add(treeclientlayer);
view.map.add(buildingclientlayer);


view.when(() => {
const sketch = new Sketch({
    layer: graphicsLayer,
    view: view,
});

view.ui.add(sketch, "top-right");
createSketchEvent(sketch, [heatLayers, treeLayers, buildingLayers], graphicsLayer);
});

const editor = new Editor({
    view: view,
    layerInfos: [{
        layer: heatclientlayer,
        enabled: false
    }]
  });
  // Add widget to top-right of the view
  view.ui.add(editor, "top-right");
  
});