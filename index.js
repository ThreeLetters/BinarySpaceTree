"use strict"
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
var Leafs = require('./leaf.js')

module.exports = class Tree {
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
            while (true) {
                var child = current.getChild(minx, miny, maxx, maxy);
                if (child == -1 || !child) {
                    return current.forEach(call);
                } else {
                    child.OBJ.forEach(call);
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
                    if (!child.OBJ.every(call)) return false;
                    current = child;
                }
            }

        }
        forEachPrecise(bounds, call) {
            this.ROOT.forEachPrecise(bounds, call)
        }