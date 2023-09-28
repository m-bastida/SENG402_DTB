require([
"esri/Map",
"esri/views/SceneView",
"esri/layers/GraphicsLayer",
"esri/rest/query",
"esri/rest/support/Query"
], function (Map, SceneView, GraphicsLayer, query, Query) {
// URL to feature service containing points representing the 50
// most prominent peaks in the U.S.
const peaksUrl =
    "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Prominent_Peaks_US/FeatureServer/0";

// Define the popup content for each result
const popupTemplate = {
    // autocasts as new PopupTemplate()
    title: "{MTN_PEAK}, {STATE}",
    fieldInfos: [
    {
        fieldName: "ELEV_ft",
        label: "Elevation (feet)",
        format: {
        places: 0,
        digitSeperator: true
        }
    },
    {
        fieldName: "ELEV_m",
        label: "Elevation (meters)",
        format: {
        places: 0,
        digitSeperator: true
        }
    },
    {
        fieldName: "PROMINENCE_ft",
        label: "Prominence (feet)",
        format: {
        places: 0,
        digitSeperator: true
        }
    },
    {
        fieldName: "PROMINENCE_m",
        label: "Prominence (meters)",
        format: {
        places: 0,
        digitSeperator: true
        }
    },
    {
        fieldName: "ISOLATION_mi",
        label: "Isolation (miles)",
        format: {
        places: 0,
        digitSeperator: true
        }
    },
    {
        fieldName: "ISOLATION_km",
        label: "Isolation (km)",
        format: {
        places: 0,
        digitSeperator: true
        }
    }
    ],
    content:
    "<b><a href='https://en.wikipedia.org/wiki/Topographic_prominence'>Prominence:</a>" +
    "</b> {PROMINENCE_ft} ft ({PROMINENCE_m} m)" +
    "<br><b>Prominence Rank:</b> {RANK}" +
    "<br><b>Elevation:</b> {ELEV_ft} ft ({ELEV_m} m)" +
    "<br><b><a href='https://en.wikipedia.org/wiki/Topographic_isolation'>Isolation:</a>" +
    "</b> {ISOLATION_mi} mi ({ISOLATION_km} km)"
};

const mtnSymbol = {
    type: "point-3d", // autocasts as new PointSymbol3D()
    symbolLayers: [
    {
        type: "object", // autocasts as new ObjectSymbol3DLayer()
        resource: {
        primitive: "cone"
        }
    }
    ]
};

// Create graphics layer and symbol to use for displaying the results of query
const resultsLayer = new GraphicsLayer();

/******************************************************************
 * Set the query parameters to always return geometry and all fields.
 * Returning geometry allows us to display results on the map/view
 ******************************************************************/
const params = new Query({
    returnGeometry: true,
    outFields: ["*"]
});

const map = new Map({
    basemap: "osm",
    layers: [resultsLayer] // add graphics layer to the map
});

const view = new SceneView({
    map: map,
    container: "viewDiv",
    center: [-100, 38],
    zoom: 4,
    popup: {
    dockEnabled: true,
    dockOptions: {
        position: "top-right",
        breakpoint: false
    }
    }
});

// Call doQuery() each time the button is clicked
view.when(function () {
    view.ui.add("optionsDiv", "bottom-right");
    document.getElementById("doBtn").addEventListener("click", doQuery);
});

const attributeName = document.getElementById("attSelect");
const expressionSign = document.getElementById("signSelect");
const value = document.getElementById("valSelect");

// Executes each time the button is clicked
function doQuery() {
    // Clear the results from a previous query
    resultsLayer.removeAll();
    /*********************************************
     *
     * Set the where clause for the query. This can be any valid SQL expression.
     * In this case the inputs from the three drop down menus are used to build
     * the query. For example, if "Elevation", "is greater than", and "10,000 ft"
     * are selected, then the following SQL where clause is built here:
     *
     * params.where = "ELEV_ft > 10000";
     *
     * ELEV_ft is the field name for Elevation and is assigned to the value of the
     * select option in the HTML below. Other operators such as AND, OR, LIKE, etc
     * may also be used here.
     *
     **********************************************/
    params.where = attributeName.value + expressionSign.value + value.value;

    // executes the query and calls getResults() once the promise is resolved
    // promiseRejected() is called if the promise is rejected
    query.executeQueryJSON(peaksUrl, params).then(getResults).catch(promiseRejected);
}

// Called each time the promise is resolved
function getResults(response) {
    // Loop through each of the results and assign a symbol and PopupTemplate
    // to each so they may be visualized on the map
    const peakResults = response.features.map(function (feature) {
    // Sets the symbol of each resulting feature to a cone with a
    // fixed color and width. The height is based on the mountain's elevation
    feature.symbol = {
        type: "point-3d", // autocasts as new PointSymbol3D()
        symbolLayers: [
        {
            type: "object", // autocasts as new ObjectSymbol3DLayer()
            material: {
            color: "green"
            },
            resource: {
            primitive: "cone"
            },
            width: 100000,
            height: feature.attributes.ELEV_m * 100
        }
        ]
    };

    feature.popupTemplate = popupTemplate;
    return feature;
    });

    resultsLayer.addMany(peakResults);

    // animate to the results after they are added to the map
    view
    .goTo(peakResults)
    .then(function () {
        view.openPopup({
        features: peakResults,
        featureMenuOpen: true,
        updateLocationEnabled: true
        });
    })
    .catch(function (error) {
        if (error.name != "AbortError") {
        console.error(error);
        }
    });

    // print the number of results returned to the user
    document.getElementById("printResults").innerHTML = peakResults.length + " results found!";
}

// Called each time the promise is rejected
function promiseRejected(error) {
    console.error("Promise rejected: ", error.message);
}
});