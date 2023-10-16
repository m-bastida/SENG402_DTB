require(["esri/layers/FeatureLayer", "esri/WebScene", "esri/views/SceneView", "esri/widgets/Editor"], (
    FeatureLayer,
    WebScene,
    SceneView,
    Editor
  ) => {
    // Create a map from the referenced webscene item id
    const webscene = new WebScene({
      portalItem: {
        id: "1eacaab86df24d2bb9484b24142f3fbe"
      }
    });


    const view = new SceneView({
      container: "viewDiv",
      qualityProfile: "high",
      map: webscene
    });

  });