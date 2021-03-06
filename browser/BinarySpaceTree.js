"use strict";
/*
BinarySpaceTree - Simple Binary Space Tree in JavaScript
    Copyright (C) 2017 Andrew S
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published
    by the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.
    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

var MAX = 20;
var MAXOBJ = 4;

var insert = function (obj, leaf) {
    var minx = obj.bounds.minX,
        miny = obj.bounds.minY,
        maxx = obj.bounds.maxX,
        maxy = obj.bounds.maxY;

    var insertTo = leaf.getChild(minx, miny, maxx, maxy);

    if (insertTo === -1 || leaf.LVL > MAX) { // doesnt fit or reached max
        leaf.OBJ.push(obj)
        obj._LEAF = leaf;
        return leaf;
    }

    if (!insertTo) {
        if (leaf.OBJ.length > MAXOBJ) {
            leaf.split();
            return insert(obj, leaf);
        } else {
            leaf.OBJ.push(obj);
            obj._LEAF = leaf;
            return leaf;
        }
    }
    return insert(obj, insertTo);
}

var forEachPrecise = function (bounds, leaf, call) {
    if (!checkIntersect(bounds, leaf.bounds)) {
        return;
    }
    leaf.OBJ.forEach(call);
    if (leaf.LEFT) {
        forEachPrecise(bounds, leaf.LEFT, call);
        forEachPrecise(bounds, leaf.RIGHT, call);
    } else if (leaf.TOP) {
        forEachPrecise(bounds, leaf.TOP, call);
        forEachPrecise(bounds, leaf.BOTTOM, call);
    }


}
var everyPrecise = function (bounds, leaf, call) {
    if (!checkIntersect(bounds, leaf.bounds)) {
        return;
    }
    if (!leaf.OBJ.every(call)) return false;
    if (leaf.LEFT) {
        if (!everyPrecise(bounds, leaf.LEFT, call)) return false;
        return everyPrecise(bounds, leaf.RIGHT, call)
    } else if (leaf.TOP) {
        if (!everyPrecise(bounds, leaf.TOP, call)) return false;
        return everyPrecise(bounds, leaf.BOTTOM, call);
    }
    return true;

}
var checkIntersect = function (bounds, bounds2) {
    return !(bounds.minX > bounds2.maxX || bounds.maxX < bounds2.minX || bounds.minY > bounds2.maxY || bounds.maxY < bounds2.minY)
}

var Leafs = {
    horizontal: class LeafHor {
        constructor(x, y, width, height, lvl, parent) {
            this.isVert = 0;
            this.LVL = lvl;
            this.WIDTH = width;
            this.HEIGHT = height;
            this.X = x;
            this.Y = y;
            this.DIV = y + (height >> 1);
            this.PARENT = parent;
            this.TOP;
            this.BOTTOM;
            this.OBJ = [];
            this.insert = insert;
            this.forEachPrecise = forEachPrecise;
            this.bounds = {
                minX: x,
                minY: y,
                maxX: x + width,
                maxY: y + height
            }
            this.everyPrecise = everyPrecise;
        }
        getChild(minx, miny, maxx, maxy) {

            if (miny > this.DIV) return this.BOTTOM;

            if (maxy < this.DIV) return this.TOP;

            return -1;

        }
        split() {
            this.TOP = new Leafs.vertical(this.X, this.Y, this.WIDTH, this.HEIGHT >> 1, this.LVL + 1, this);
            this.BOTTOM = new Leafs.vertical(this.X, this.DIV, this.WIDTH, this.HEIGHT >> 1, this.LVL + 1, this);
            var len = this.OBJ.length
            this.OBJ.forEach((obj) => {
                insert(obj, this);
            })
            this.OBJ = this.OBJ.slice(len)


        }
        forEach(call) {
            this.OBJ.forEach(call)

            if (this.TOP) {
                this.TOP.forEach(call)
                this.BOTTOM.forEach(call)
            }
        }
        every(call) {
            if (!this.OBJ.every(call)) return false;

            if (this.TOP) {
                return this.TOP.forEach(call) &&
                    this.BOTTOM.forEach(call)
            }
            return true;
        }

    },
    vertical: class LeafVert {
        constructor(x, y, width, height, lvl, parent) {
            this.isVert = 1;
            this.LVL = lvl;
            this.WIDTH = width;
            this.HEIGHT = height;
            this.X = x;
            this.Y = y;
            this.DIV = x + (width >> 1);
            this.PARENT = parent;
            this.LEFT;
            this.RIGHT;
            this.OBJ = [];
            this.insert = insert;
            this.forEachPrecise = forEachPrecise;
            this.bounds = {
                minX: x,
                minY: y,
                maxX: x + width,
                maxY: y + height
            }
            this.everyPrecise = everyPrecise;
        }
        getChild(minx, miny, maxx, maxy) {
            if (minx > this.DIV) return this.RIGHT;

            if (maxx < this.DIV) return this.LEFT;

            return -1;

        }
        split() {
            this.LEFT = new Leafs.horizontal(this.X, this.Y, this.WIDTH >> 1, this.HEIGHT, this.LVL + 1, this);
            this.RIGHT = new Leafs.horizontal(this.DIV, this.Y, this.WIDTH >> 1, this.HEIGHT, this.LVL + 1, this);
            var len = this.OBJ.length;
            this.OBJ.forEach((obj) => {
                insert(obj, this);
            })
            this.OBJ = this.OBJ.slice(len)
        }
        forEach(call) {
            this.OBJ.forEach(call)

            if (this.LEFT) {
                this.LEFT.forEach(call)
                this.RIGHT.forEach(call)
            }
        }
        every(call) {
            if (!this.OBJ.every(call)) return false;

            if (this.LEFT) {
                return this.LEFT.forEach(call) &&
                    this.RIGHT.forEach(call)
            }
            return true;
        }


    }
}
class Tree {
    constructor(width, height, maxObj, maxLvL) {
        this.WIDTH = width;
        this.HEIGHT = height;
        this.MAXOBJ = maxObj || 4;
        this.MAXLVL = maxLvL || 20;
        this.ROOT = new Leafs.vertical(0, 0, width, height, 0)
    }
    insert(obj) {
        if (obj._LEAF) {
            throw "ERR: OBJ already in a LEAF.";
        }
        return this.ROOT.insert(obj, this.ROOT);
    }
    delete(obj) {
        if (!obj._LEAF) throw "ERR: OBJ is not in a LEAF";
        var index = obj._LEAF.OBJ.indexOf(obj);
        obj._LEAF.OBJ.splice(index, 1);
        obj._LEAF = null;
    }
    forEach(bounds, call) {
        var current = this.ROOT;
        var minx = bounds.minX,
            miny = bounds.minY,
            maxx = bounds.maxX,
            maxy = bounds.maxY;
        var i = 0;
        while (true) {
            i++;
            var child = current.getChild(minx, miny, maxx, maxy);

            if (child == -1 || !child) {

                return current.forEach(call);
            } else {
                current.OBJ.forEach(call);
                current = child;
            }
        }


    }
    every(bounds, call) {
        var current = this.ROOT;
        var minx = bounds.minX,
            miny = bounds.minY,
            maxx = bounds.maxX,
            maxy = bounds.maxY;
        while (true) {
            var child = current.getChild(minx, miny, maxx, maxy);
            if (child == -1 || !child) {
                return current.every(call);
            } else {
                if (!current.OBJ.every(call)) return false;
                current = child;
            }
        }

    }
    forEachPrecise(bounds, call) {
        this.ROOT.forEachPrecise(bounds, this.ROOT, call)
    }
}