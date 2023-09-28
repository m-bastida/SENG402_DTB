
require(["esri/Map", "esri/views/SceneView", "esri/layers/SceneLayer", "esri/layers/FeatureLayer"], (
    Map,
    SceneView,
    SceneLayer,
    FeatureLayer
  ) => {
    // setup the renderer with color visual variable
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

    // Create SceneLayer from a Scene Service URL
    const sceneLayer = new SceneLayer({
        portalItem: {
          id: "1b80895e989f485dbfb5770de8cd1d2b"
        },
      renderer: renderer, // Set the renderer to sceneLayer
      popupTemplate: { title: "{name}"},
      copyright: `Data from <a href="http://www.geonames.org/">GeoNames</a>`
    });

    const countries = new FeatureLayer({
      url:
        "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/World_Countries_(Generalized)/FeatureServer",
      renderer: {
        type: "simple",
        symbol: {
          type: "polygon-3d", // autocasts as new PolygonSymbol3D()
          symbolLayers: [
            {
              type: "fill", // autocasts as new FillSymbol3DLayer()
              material: {
                color: [0, 0, 0, 0.6]
              },
              outline: {
                color: [0, 0, 0, 0]
              }
            }
          ]
        }
      }
    });

    // Create Map
    const map = new Map({
      layers: [countries, sceneLayer],
      ground: {
        surfaceColor: "#0b0d2e"
      }
    });

    // Create the SceneView
    const view = new SceneView({
      container: "viewDiv",
      map: map,
      environment: {
        atmosphereEnabled: false
      }
    });
  });