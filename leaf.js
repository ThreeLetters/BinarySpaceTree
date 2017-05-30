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
        if (this.OBJ.length > MAXOBJ) {
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

var Leafs = {
    horizontal: class LeafHor {
        constructor(x, y, width, height, lvl) {
            this.isVert = 0;
            this.LVL = lvl;
            this.WIDTH = width;
            this.HEIGHT = height;
            this.X = x;
            this.Y = y;
            this.DIV = y + (height >> 1);
            this.TOP;
            this.BOTTOM;
            this.OBJ = [];
            this.insert = insert;
        }
        getChild(minx, miny, maxx, maxy) {
            if (miny > this.DIV) return this.BOTTOM;

            if (maxy < this.DIV) return this.TOP;

            return -1;

        }
        split() {
            this.TOP = new Leafs.vertical(this.X, this.Y, this.WIDTH, this.HEIGHT >> 1, this.LVL + 1);
            this.BOTTOM = new Leafs.vertical(this.X, this.DIV, this.WIDTH, this.HEIGHT >> 1, this.LVL + 1);
            this.OBJ.forEach((obj) => {
                insert(obj, this);
            })


        }

    },
    vertical: class LeafVert {
        constructor(x, y, width, height, lvl) {
            this.isVert = 1;
            this.LVL = lvl;
            this.WIDTH = width;
            this.HEIGHT = height;
            this.X = x;
            this.Y = y;
            this.DIV = x + (width >> 1);
            this.LEFT;
            this.RIGHT;
            this.OBJ = [];
            this.insert = insert;
        }
        getChild(minx, miny, maxx, maxy) {
            if (minx > this.DIV) return this.RIGHT;

            if (maxx < this.DIV) return this.LEFT;

            return -1;

        }
        split() {
            this.LEFT = new Leafs.horizontal(this.X, this.Y, this.WIDTH >> 1, this.HEIGHT, this.LVL + 1);
            this.RIGHT = new Leafs.horizontal(this.DIV, this.Y, this.WIDTH >> 1, this.HEIGHT, this.LVL + 1);
            this.OBJ.forEach((obj) => {
                insert(obj, this);
            })
        }


    }
}