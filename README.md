# BinarySpaceTree
Simple 2d binary space tree for Javascript

## Usage

```js
var tree = new Tree(width,height)

var node = {
  bounds: {
    minX: 0,
    minY: 0,
    maxX: 100,
    maxY: 100
  }
}

tree.insert(node)

tree.forEach({
  minX: 0,
  minY: 0,
  maxX: 100,
  maxY: 100
},(n)=>{
  console.log(n)
})
```
