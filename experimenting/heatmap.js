
require([
"esri/Map",
"esri/views/SceneView",
"esri/layers/IntegratedMeshLayer",
"esri/layers/FeatureLayer",
"esri/renderers/HeatmapRenderer",
"esri/widgets/Legend"
], (Map, SceneView, IntegratedMeshLayer, FeatureLayer, HeatmapRenderer, Legend) => {
/*****************************************************************
 * Create the mesh layer with the city
 *****************************************************************/
const meshLayer = new IntegratedMeshLayer({
    url: "https://tiles-eu1.arcgis.com/7cCya5lpv5CmFJHv/arcgis/rest/services/Munich_3D_Mesh_City_Mapper_2_SURE_43/SceneServer"
});

/*****************************************************************
 * Prepare the heatmap renderer and create the feature layer with incidents
 *****************************************************************/
const colorStops = [
    { ratio: 0 / 12, color: "rgba(25, 43, 51, 0.6)" },
    { ratio: 2 / 12, color: "rgba(30, 140, 160, 1)" },
    { ratio: 3 / 12, color: "rgba(58, 165, 140, 1)" },
    { ratio: 4 / 12, color: "rgba(64, 184, 156, 1)" },
    { ratio: 5 / 12, color: "rgba(68, 199, 168, 1)" },
    { ratio: 6 / 12, color: "rgba(73, 214, 181, 1)" },
    { ratio: 7 / 12, color: "rgba(78, 230, 194, 1)" },
    { ratio: 8 / 12, color: "rgba(83, 245, 207, 1)" },
    { ratio: 9 / 12, color: "rgba(85, 250, 211, 1)" },
    { ratio: 10 / 12, color: "rgba(102, 255, 219, 1)" },
    { ratio: 11 / 12, color: "rgba(121, 237, 210, 1)" },
    { ratio: 12 / 12, color: "rgba(158, 255, 233, 1)" }
];

const heatmapRenderer = new HeatmapRenderer({
    legendOptions: {
    minLabel: "Few",
    maxLabel: "Frequent"
    },
    colorStops: colorStops,
    referenceScale: null,
    maxDensity: 0.0035,
    radius: 35,
    minDensity: 0
});

const popupTemplate = {
    // autocasts as new PopupTemplate()
    title: "Traffic incident #{OBJECTID}",
    content: "<p> {UJAHR} / {UMONAT} </p>" // Show year and month
};

const incidentsLayer = new FeatureLayer({
    url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/TrafficAccidentsGermany2019/FeatureServer",
    popupTemplate: popupTemplate,
    opacity: 0.75,
    renderer: heatmapRenderer
});

/*****************************************************************
 * Create the scene view with layers
 *****************************************************************/
const view = new SceneView({
    container: "viewDiv",
    map: new Map({
    basemap: "satellite",
    ground: "world-elevation",
    layers: [meshLayer, incidentsLayer]
    }),
    camera: {
    position: {
        spatialReference: {
        latestWkid: 3857,
        wkid: 102100
        },
        x: 1290156.1245809086,
        y: 6126817.190737828,
        z: 2008.6368858749047
    },
    heading: 3.283715534412251,
    tilt: 37.05084328412177
    },
    qualityProfile: "high"
});

view.ui.add("toggleModeButton", "manual");

/*****************************************************************
 * Allow to toggle between fixed reference scale (where radius
 * remains constant in real world size) and visualization where
 * the radius remains constant in screen size (in points).
 *****************************************************************/

let fixToScale = false;

function toggleHeatmapMode() {
    if (fixToScale) {
    heatmapRenderer.referenceScale = view.scale;
    } else {
    heatmapRenderer.referenceScale = null;
    }
}

const promptText = {
    addStaticScale: "Static reference scale",
    removeScale: "Remove reference scale"
};

const toggleModeButton = document.getElementById("toggleModeButton");
toggleModeButton.innerHTML = promptText.addStaticScale;

toggleModeButton.addEventListener("click", () => {
    fixToScale = !fixToScale;
    if (fixToScale) {
    toggleHeatmapMode();
    toggleModeButton.innerHTML = promptText.removeScale;
    } else {
    toggleHeatmapMode();
    toggleModeButton.innerHTML = promptText.addStaticScale;
    }
});

/*****************************************************************
 * Add legend
 *****************************************************************/
const legend = new Legend({
    view: view,
    layerInfos: [
    {
        layer: incidentsLayer,
        title: "Number of traffic incidents"
    }
    ]
});

view.ui.add(legend, "bottom-left");
});