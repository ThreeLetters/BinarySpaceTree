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
    return !(bounds2.minX > bounds.maxX || bounds2.maxX < bounds.minX || bounds2.minY > bounds.maxY || bounds2.maxY < bounds.minX)
}

module.exports = {
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


    }
}