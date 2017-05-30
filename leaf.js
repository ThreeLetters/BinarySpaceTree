var Leafs = {
  vertical: class LeafVert {
    constructor(y) {
     this.isVert = 1;
     this.Y = y; 
    }
    
    
  },
  horizontal: class LeafHor {
    constructor(x) {
      this.isVert = 0;
      this.X = x;
    }
    
    
    
  }
}
