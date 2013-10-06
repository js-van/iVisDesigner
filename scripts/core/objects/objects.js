// iVisDesigner
// Author: Donghao Ren, PKUVIS, Peking University, 2013.04
// See LICENSE.txt for copyright information.

// scripts/objects/objects.js
// Objects in iVisDesigner.

(function() {

var Objects = { };

IV.objects = Objects;

// The base class for objects.
Objects.Object = function() {
    this.uuid = IV.generateUUID();
};
Objects.Object.prototype = {
    setName: function(name) {
        if(this.name != name) {
            this.name = name;
            IV.raiseObjectEvent(this, "p:name", name);
        }
    },
    can: function(cap) { return false; },
    get: function(context) { return null; },
    getStyle: function(context) { return this.get(context); },
    getPoint: function(context) { return this.get(context); },
    getNumber: function(context) { return this.get(context); },
    getPath: function() { return this.path; },
    getGuidePath: function() { return new IV.Path(""); },
    render: function() { },
    propertyUpdate: function() { },
    renderSelected: function() { },
    renderGuide: function() { },
    renderGuideSelected: function() { },
    select: function() { return null; },
    clone: function() {
        throw new Error("Clone not implemented: " + this.type);
    },
    serialize: function() {
        throw new Error("Serialize not implemented: " + this.type);
    },
    getPropertyContext: function() {
        var $this = this;
        return [
            {
                name: "Name",
                group: "Common",
                type: "plain-string",
                get: function() { return $this.name; },
                set: function(val) { return $this.setName(val); }
            }
        ];
    }
};

{{include: base.js}}
{{include: style.js}}
{{include: track.js}}
{{include: shapes.js}}
{{include: layout.js}}
{{include: map.js}}

})();