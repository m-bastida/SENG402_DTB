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
        id: "441087520a9145f581b17de393d3b04b"
      }
    });

    // Create a layer with visualVariables to use interactive handles for size and rotation
    const recreationLayer = new FeatureLayer({
      title: "Recreation",
      url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/EditableFeatures3D/FeatureServer/1",
      elevationInfo: {
        mode: "absolute-height"
      },
      renderer: {
        type: "unique-value", // autocasts as new UniqueValueRenderer()
        field: "TYPE",
        visualVariables: [
          {
            // size can be modified with the interactive handle
            type: "size",
            field: "SIZE",
            axis: "height",
            valueUnit: "meters"
          },
          {
            // rotation can be modified with the interactive handle
            type: "rotation",
            field: "ROTATION"
          }
        ],
        uniqueValueInfos: [
          {
            value: "1",
            label: "Slide",
            symbol: {
              type: "point-3d", // autocasts as new PointSymbol3D()
              symbolLayers: [
                {
                  type: "object",
                  resource: {
                    href: "https://static.arcgis.com/arcgis/styleItems/Recreation/gltf/resource/Slide.glb"
                  }
                }
              ],
              styleOrigin: {
                styleName: "EsriRecreationStyle",
                name: "Slide"
              }
            }
          },
          {
            value: "2",
            label: "Swing",
            symbol: {
              type: "point-3d", // autocasts as new PointSymbol3D()
              symbolLayers: [
                {
                  type: "object",
                  resource: {
                    href: "https://static.arcgis.com/arcgis/styleItems/Recreation/gltf/resource/Swing.glb"
                  }
                }
              ],
              styleOrigin: {
                styleName: "EsriRecreationStyle",
                name: "Swing"
              }
            }
          }
        ]
      }
    });

    webscene.add(recreationLayer);

    const view = new SceneView({
      container: "viewDiv",
      qualityProfile: "high",
      map: webscene
    });

    view.when(() => {
        console.log("view when")
      view.popupEnabled = false; //disable popups
      // Create the Editor
      const editor = new Editor({
        view: view
      });
      // Add widget to top-right of the view
      view.ui.add(editor, "top-right");
    });
  });