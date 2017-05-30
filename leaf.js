var Leafs = {
  vertical: class LeafVert {
    constructor(y) {
     this.isVert = 1;
     this.Y = y; 
      this.TOP;
      this.BOTTOM;
      this.OBJ = [];
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
    
    
    
  }
}
