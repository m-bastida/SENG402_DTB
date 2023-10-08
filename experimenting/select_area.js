/**
 * Given an area and a pair of server and client layers, queries the server layer
 * for features within the area and saves them to the client layer
 * 
 * @param {Geomettry} geometry defines the area being queried
 * @param {map} layerGroup defines the server and client layers used
 */
function selectFeatures(geometry, layerGroup){
let query = layerGroup.server.createQuery();
query.geometry = geometry
query.spatialRelationship = "intersects";  // this is the default
query.returnGeometry = true;

layerGroup.server.queryFeatures(query)
    .then(function(response){
    console.log("query complete")
    console.log(response.features[0].attributes)
    layerGroup.client.applyEdits({addFeatures:response.features});
    });
}
    
/**
 * Adds an event to a sketch layer that updates the view with features
 * when an area is selected
 * 
 * @param {Sketch} sketch a sketch widget object
 * @param {array[map]} layerGroups an array of maps that store server and client layer pairs
 * @param {GraphicsLayer} graphicsLayer the graphics layer the sketch is attached to
 */
function createSketchEvent(sketch, layerGroups, graphicsLayer){
  sketch.on("create", function(event) {
    // check if the create event's state has changed to complete indicating
    // the graphic create operation is completed.
    if (event.state === "complete" && event.graphic.geometry.type === "polygon") {
      // remove the graphic from the layer. Sketch adds
      // the completed graphic to the layer by default.
      graphicsLayer.remove(event.graphic);

      layerGroups.forEach(layerGroup => {
        // use the graphic.geometry to query features that intersect it
        selectFeatures(event.graphic.geometry, layerGroup);
      });
  
    }
  });
}

export { createSketchEvent }