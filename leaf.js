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


var Leafs = {
  vertical: class LeafVert {
    constructor(y) {
     this.isVert = 1;
     this.Y = y; 
      this.TOP;
      this.BOTTOM;
      this.OBJ = [];
    }
    getChild(minx,miny,maxx,maxy) {
      if (miny > this.Y) return this.BOTTOM;
      
      if (maxy < this.Y) return this.TOP;
      
      return -1;
      
    }
    
  },
  horizontal: class LeafHor {
    constructor(x) {
      this.isVert = 0;
      this.X = x;
      this.LEFT;
      this.RIGHT;
      this.OBJ = [];
    }
     getChild(minx,miny,maxx,maxy) {
      if (minx > this.X) return this.RIGHT;
      
      if (maxx < this.X) return this.LEFT;
      
      return -1;
      
    }
    
    
  }
}
