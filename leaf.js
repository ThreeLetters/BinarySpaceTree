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
  horizontal: class LeafHor {
    constructor(x,y,width,height) {
      this.isVert = 0;
      this.WIDTH = width;
      this.HEIGHT = height;
        this.X = x;
        this.Y = y;
      this.DIV = height >> 1; 
      this.TOP;
      this.BOTTOM;
      this.OBJ = [];
    }
    getChild(minx,miny,maxx,maxy) {
      if (miny > this.DIV) return this.BOTTOM;
      
      if (maxy < this.DIV) return this.TOP;
      
      return -1;
      
    }
      split() {
          this.TOP = new Leafs.vertical()
      }
    
  },
  vertical: class LeafVert {
    constructor(x,y,width,height) {
      this.isVert = 1;
      this.WIDTH = width;
      this.HEIGHT = height;
        this.X = x;
        this.Y = y;
      this.DIV = width >> 1;
      this.LEFT;
      this.RIGHT;
      this.OBJ = [];
    }
     getChild(minx,miny,maxx,maxy) {
      if (minx > this.DIV) return this.RIGHT;
      
      if (maxx < this.DIV) return this.LEFT;
      
      return -1;
      
    }
    
    
  }
}
