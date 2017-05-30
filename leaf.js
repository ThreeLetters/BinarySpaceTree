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
