
require([
    "esri/WebScene",
    "esri/views/SceneView",
    "esri/layers/GraphicsLayer",
    "esri/widgets/Sketch/SketchViewModel",
    "esri/widgets/Slider",
    "esri/layers/support/FeatureFilter",
    "esri/geometry/geometryEngine",
    "esri/Graphic"
  ], (
    WebScene,
    SceneView,
    GraphicsLayer,
    SketchViewModel,
    Slider,
    FeatureFilter,
    geometryEngine,
    Graphic
  ) => {
    // Load webscene and display it in a SceneView
    const webscene = new WebScene({
      portalItem: {
        id: "c4503d5aea1144d7950e5300648828b0"
      }
    });

    // create the SceneView
    const view = new SceneView({
      container: "viewDiv",
      map: webscene
    });

    // add a GraphicsLayer for the sketches and the buffer
    const sketchLayer = new GraphicsLayer();
    view.map.add(sketchLayer);

    // create the layerView's to add the filter
    let sceneLayerView = null;
    let featureLayerView = null;
    view.map.load().then(() => {
      // loop through webmap's operational layers
      view.map.layers.forEach((layer, index) => {
        view
          .whenLayerView(layer)
          .then((layerView) => {
            if (layer.type === "feature") {
              featureLayerView = layerView;
            }
            if (layer.type === "scene") {
              sceneLayerView = layerView;
            }
          })
          .catch(console.error);
      });
    });

    // use SketchViewModel to draw polygons that are used as a filter
    let sketchGeometry = null;
    const sketchViewModel = new SketchViewModel({
      layer: sketchLayer,
      view: view,
      polygonSymbol: {
        type: "polygon-3d",
        symbolLayers: [
          {
            type: "fill",
            material: {
              color: [255, 255, 255, 0.8]
            },
            outline: {
              color: [211, 132, 80, 0.7],
              size: "10px"
            }
          }
        ]
      },
      defaultCreateOptions: { hasZ: false }
    });

    sketchViewModel.on(["create"], (event) => {
      // update the filter every time the user finishes drawing the filtergeometry
      if (event.state == "complete") {
        sketchGeometry = event.graphic.geometry;
        updateFilter();
      }
    });

    sketchViewModel.on(["update"], (event) => {
      const eventInfo = event.toolEventInfo;
      // update the filter every time the user moves the filtergeometry
      if (
        event.toolEventInfo &&
        event.toolEventInfo.type.includes("stop")
      ) {
        sketchGeometry = event.graphics[0].geometry;
        updateFilter();
      }
    });

    // select the layer to filter on
    let featureLayerViewFilterSelected = true;
    document
      .getElementById("featureLayerViewFilter")
      .addEventListener("change", (event) => {
        featureLayerViewFilterSelected = !!event.target.checked;
        updateFilter();
      });
    let sceneLayerViewFilterSelected = true;
    document
      .getElementById("sceneLayerViewFilter")
      .addEventListener("change", (event) => {
        sceneLayerViewFilterSelected = !!event.target.checked;
        updateFilter();
      });

    // draw geometry buttons - use the selected geometry to sktech
    document.getElementById("polygon-geometry-button").onclick =
      geometryButtonsClickHandler;
    function geometryButtonsClickHandler(event) {
      const geometryType = event.target.value;
      clearFilter();
      sketchViewModel.create(geometryType);
    }

    // get the selected spatialRelationship
    let selectedFilter = "contains";

    // remove the filter
    document
      .getElementById("clearFilter")
      .addEventListener("click", clearFilter);

    function clearFilter() {
      sketchGeometry = null;
      filterGeometry = null;
      sketchLayer.removeAll();
      bufferLayer.removeAll();
      sceneLayerView.filter = null;
      featureLayerView.filter = null;
    }

    // set the geometry filter on the visible FeatureLayerView
    function updateFilter() {
      updateFilterGeometry();
      const featureFilter = {
        // autocasts to FeatureFilter
        geometry: filterGeometry,
        spatialRelationship: selectedFilter
      };

      if (featureLayerView) {
        if (featureLayerViewFilterSelected) {
          featureLayerView.filter = featureFilter;
        } else {
          featureLayerView.filter = null;
        }
      }
      if (sceneLayerView) {
        if (sceneLayerViewFilterSelected) {
          sceneLayerView.filter = featureFilter;
        } else {
          sceneLayerView.filter = null;
        }
      }
    }

    // update the filter geometry depending on bufferSize
    let filterGeometry = null;
    function updateFilterGeometry() {
      // add a polygon graphic for the bufferSize
      if (sketchGeometry) {
        if (bufferSize > 0) {
          const bufferGeometry = geometryEngine.geodesicBuffer(
            sketchGeometry,
            bufferSize,
            "meters"
          );
          if (bufferLayer.graphics.length === 0) {
            bufferLayer.add(
              new Graphic({
                geometry: bufferGeometry,
                symbol: sketchViewModel.polygonSymbol
              })
            );
          } else {
            bufferLayer.graphics.getItemAt(0).geometry = bufferGeometry;
          }
          filterGeometry = bufferGeometry;
        } else {
          bufferLayer.removeAll();
          filterGeometry = sketchGeometry;
        }
      }
    }

    document.getElementById("infoDiv").style.display = "block";
  });