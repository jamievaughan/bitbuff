# bitbuff
A binary buffer for storing and manipulating bits

# Installation
```
npm i --save bitbuff
```

```
npm i bitbuff -g
```

# Examples
```javascript
var buffer = new BitBuffer(10 * 8); // 10 bytes

// Write the value 14 to the first 4 bits
buffer.write(14, 4);

// Set the value starting at bit 5 consuming a furthur 8 bits
buffer.set(252, 5, 8);

// Skip a few bits
buffer.skip(3);

// Seek to a bit position
buffer.seek(0);

// Read 4 bits from the buffer
var value1 = buffer.read(4); // value 14

// Read bits at an offset
var value2 = buffer.get(4, 8); // value 252

// Reset the position
buffer.reset();

// Clear the backing buffer with a zero pass
buffer.clear();
```

Or can be chained together

```javascript
var buffer = new BitBuffer(5 * 8); // 5 bytes

buffer
  .write(3, 2)
  .write(12, 5)
  .write(222, 8)
  .skip(3);
  
var value1 = buffer
  .seek(7)
  .read(8) // value 222
```
