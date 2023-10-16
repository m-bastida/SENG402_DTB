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

    
// create scene view
const view = new SceneView({
container: "viewDiv",
map: new Map({
    basemap: "gray-vector",
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


// create a graphics layer for the sketch widget
const graphicsLayer = new GraphicsLayer();
view.map.add(graphicsLayer);

// setup heatmap renderer
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

// create a feature map for initilalizing client layers
let features = [
    // needs one dummy point
    {
        geometry: {
        type: "point",
        x: 0,
        y: 0,
        z: 0,
        },
    }
];

// create a feature map with polygons for initialising building layer
let buildingfeatures = [
    // needs one dummy point
    {
        geometry: {
            type: "polygon",
            rings: [
                [0, 0], //Longitude, latitude
                [1, 1], //Longitude, latitude
                [1, 0], //Longitude, latitude
            ]
        },
        attributes:{"height": 5},
    }
];

// create client layer to store tree data
var treeclientlayer =  new FeatureLayer({
    source: features,
    objectIdField: "OBJECTID",
    fields: [{
        name: "OBJECTID",
        type: "oid"
    },
    {
        // include tree height field to render trees with correct size
        name: "Tree_H",
        type: "double"
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

// create 3d tree model symbol for rendering trees
var symbol = new WebStyleSymbol({
    styleName: "esriRealisticTreesStyle",
    name: "Other",
});

// fetch symbol and attach to renderer
symbol.fetchSymbol()
    .then(function(treeSymbol){
        var objectSymbolLayer = treeSymbol.symbolLayers.getItemAt(0);
        objectSymbolLayer.material = { color: "green" };
        var treerenderer = treeclientlayer.renderer.clone();
        treerenderer.symbol = treeSymbol;
        treeclientlayer.renderer = treerenderer;
    });

// create server layer to fetch tree data
var treeserverlayer = new FeatureLayer({portalItem: {id: "4bc8537233344d04b9c37041f7204049"}})

// create client layer to store heatmap data
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

// create server layer to fetch heatmap data
var heatserverlayer = new FeatureLayer({portalItem: {id: "3ca3220e1e894b8cb80c4dbab9ecbe7c"}})

// create a client layer to store updated building data
var buildingclientlayer =  new FeatureLayer({
    source: buildingfeatures,
    objectIdField: "OBJECTID",
    fields: [{
        name: "OBJECTID",
        type: "oid"
    }, {
        name: "height",
        type: "single"
    }
    ],
    renderer : {
        type: "simple", // autocasts as new UniqueValueRenderer()
        symbol: {
            type: "polygon-3d", // autocasts as new PolygonSymbol3D()
            symbolLayers: [
              {
                type: "extrude", // autocasts as new ExtrudeSymbol3DLayer()
                material: {
                  color: "FFFFFF"
                },
                edges: {
                  type: "solid",
                  color: "#999",
                  size: 0.5
                }
              }
            ]
          },
        visualVariables: [
          {
            type: "size",
            field: "height"
          }
        ]
      },
    elevationInfo: {
        mode: "on-the-ground",
        offset: 0,
    }
});

// create a display layer to show existing building data
var buildingdisplaylayer = new SceneLayer({portalItem: {id: "ca0470dbbddb4db28bad74ed39949e25"}})

// setup layer pairs
const heatLayers = {
    server: heatserverlayer,
    client: heatclientlayer,
}

const treeLayers = {
    server: treeserverlayer,
    client: treeclientlayer,
}

// add client layers to view
view.map.add(heatclientlayer);
view.map.add(treeclientlayer);
view.map.add(buildingclientlayer);
view.map.add(buildingdisplaylayer);

// NOTE: server layers are not added to the view, but are only used to query for data

// create sketch widget and add to veiw
view.when(() => {
    const sketch = new Sketch({
        layer: graphicsLayer,
        view: view,
    });

    view.ui.add(sketch, "top-right");
    // add event to fetch data with sketch geometries
    createSketchEvent(sketch, [heatLayers, treeLayers], graphicsLayer);
});

// create editor widget
const editor = new Editor({
    view: view,
    layerInfos: [{
        // set heat client layer to be not editable
        layer: heatclientlayer,
        enabled: false
    }]
});
// Add widget to top-right of the view
view.ui.add(editor, "top-right");
  
});