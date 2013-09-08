// iVisDesigner
// Author: Donghao Ren, PKUVIS, Peking University, 2013.04
// See LICENSE.txt for copyright information.

// scripts/objects/shapes.js
// Define objects for various shapes.

Objects.Shape = IV.extend(Objects.Object,function(info) {
    this.path = info.path;
    if(info.style)
        this.style = info.style;
    else
        this.style = new Objects.PathStyle();
}, {
    render: function(g, data) {
        var $this = this;
        $this.path.enumerate(data, function(context) {
            $this.shapePaths(context, function(path) {
                $this.style.renderPath(context, g, path);
            });
        });
    },
    renderSelected: function(g, data) {
        var $this = this;
        $this.path.enumerate(data, function(context) {
            $this.shapePaths(context, function(path) {
                $this.style.renderSelection(context, g, path);
            });
        });
    }
});

Objects.Circle = IV.extend(Objects.Shape, function(info) {
    Objects.Shape.call(this, info);
    this.type = "Circle";
    // Center.
    this.center = info.center ? info.center : new Objects.Plain(new IV.Vector(0, 0));
    this.radius = info.radius ? info.radius : new Objects.Plain(2);
}, {
    shapePaths: function(context, cb) {
        cb([
            "C", this.center.getPoint(context), this.radius.get(context)
        ]);
    },
    can: function(cap) {
        if(cap == "get-point") return true;
    },
    get: function(context) {
        return this.center.getPoint(context);
    },
    select: function(pt, data, action) {
        var rslt = null;
        var $this = this;
        this.path.enumerate(data, function(context) {
            var c = $this.center.getPoint(context);
            var radius = $this.radius.get(context);
            var d = Math.abs(pt.distance(c) - radius);
            if(d <= 4.0 / pt.view_scale) {
                if(!rslt || rslt.distance > d) {
                    rslt = { distance: d };
                    if(action == "move") {
                        if($this.center.type == "Plain") {
                            rslt.original = $this.center.obj;
                            rslt.onMove = function(p0, p1) {
                                $this.center.obj = rslt.original.sub(p0).add(p1);
                                return { trigger_render: "main" };
                            };
                        }
                        if($this.center.type == "PointOffset") {
                            rslt.original = $this.center.offset;
                            rslt.onMove = function(p0, p1) {
                                $this.center.offset = rslt.original.sub(p0).add(p1);
                                return { trigger_render: "main" };
                            };
                        }
                    }
                }
            }
        });
        return rslt;
    }
});

Objects.Line = IV.extend(Objects.Shape, function(info) {
    Objects.Shape.call(this, info);
    this.type = "Line";
    this.point1 = info.point1;
    this.point2 = info.point2;
}, {
    shapePaths: function(context, cb) {
        cb([
            "M", this.point1.getPoint(context),
            "L", this.point2.getPoint(context)
        ]);
    },
    select: function(pt, data, action) {
        var rslt = null;
        var $this = this;
        this.path.enumerate(data, function(context) {
            var p1 = $this.point1.getPoint(context);
            var p2 = $this.point2.getPoint(context);
            var d = IV.pointLineSegmentDistance(pt, p1, p2);
            if(d <= 4.0 / pt.view_scale) {
                if(!rslt || rslt.distance > d)
                    rslt = { distance: d };
            }
        });
        return rslt;
    }
});


Objects.LineThrough = IV.extend(Objects.Shape, function(info) {
    Objects.Shape.call(this, info);
    this.points = info.points;
    this.type = "LineThrough";
}, {
    shapePaths: function(context, cb) {
        var $this = this;
        var line = [];
        $this.points.getPath().enumerate(context.val(), function(ctx) {
            if(line.length == 0) {
                line.push("M");
            } else {
                line.push("L");
            }
            line.push($this.points.getPoint(ctx));
        });
        cb(line);
    },
    select: function(pt, data, action) {
        var rslt = null;
        var $this = this;
        $this.path.enumerate(data, function(fctx) {
            var pts = [];
            $this.points.getPath().enumerate(fctx.val(), function(context) {
                pts.push($this.points.getPoint(context));
            });
            for(var i = 0; i < pts.length - 1; i++) {
                var d = IV.pointLineSegmentDistance(pt, pts[i], pts[i + 1]);
                if(d <= 4.0 / pt.view_scale) {
                    if(!rslt || rslt.distance > d)
                        rslt = { distance: d };
                }
            }
        });
        return rslt;
    }
});
