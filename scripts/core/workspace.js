//. iVisDesigner - File: scripts/core/workspace.js
//. Copyright 2013-2014 Donghao Ren
//. University of California, Santa Barbara, Peking University
//. See LICENSE.md for more information.

// The more general visualization workspace class.
IV.VisualizationWorkspace = function() {
    this.uuid = IV.generateUUID();
    // All objects of the visualization, ordered in an array.
    this.canvases = [];
    this.objects = [];
    // Selected objects.
    IV.EventSource.call(this);
};

IV.serializer.registerObjectType("VisualizationWorkspace", IV.VisualizationWorkspace);
IV.implement(IV.EventSource, IV.VisualizationWorkspace);

// Serialization support.
IV.VisualizationWorkspace.prototype.serializeFields = function() {
    return [ "canvases", "objects", "uuid" ];
};

IV.VisualizationWorkspace.prototype.postDeserialize = function() {
    IV.EventSource.call(this);
};

// Canvas management.
IV.VisualizationWorkspace.prototype.addCanvas = function(info) {
    // info = {
    //    name: "Canvas Name"
    //    visualization: <IV.Visualization object>
    //    pose: <some structure for the canvas location in the sphere>
    // }
    this.canvases.push(info);
};

IV.VisualizationWorkspace.prototype.getCanvas = function(name) {
};

IV.VisualizationWorkspace.prototype.removeCanvas = function(name) {
};

IV.VisualizationWorkspace.prototype.validate = function(data) {
    this.canvases.forEach(function(canvas) {
        canvas.visualization.validate(data);
    });
};