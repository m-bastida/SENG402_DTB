/*
Test code for the Editor widget
Code based on example at https://developers.arcgis.com/javascript/latest/sample-code/widgets-editor-3d/ 
*/

require(["esri/layers/FeatureLayer", "esri/WebScene", "esri/views/SceneView", "esri/widgets/Editor"], (
    FeatureLayer,
    WebScene,
    SceneView,
    Editor
  ) => {
    // Create a map from the referenced webscene item id
    const webscene = new WebScene({
      portalItem: {
        // id: "206a6a13162c4d9a95ea6a87abad2437"
        id: "c4503d5aea1144d7950e5300648828b0"
      }
    });


    const view = new SceneView({
      container: "viewDiv",
      qualityProfile: "high",
      map: webscene
    });

    // view.when(() => {
    //     console.log("view when")
    //   view.popupEnabled = false; //disable popups
    //   // Create the Editor
    //   const editor = new Editor({
    //     view: view
    //   });
    //   // Add widget to top-right of the view
    //   view.ui.add(editor, "top-right");
    // });
  });