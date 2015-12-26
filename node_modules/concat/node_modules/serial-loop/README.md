## serial-loop

Async serial loop. See also [parallel-loop](http://github.com/azer/parallel-loop)

## Install

```bash
$ npm install serial-loop
```

## Usage

```js
var loop = require('serial-loop')

loop(10, each, function (error) {
  console.log('done, error? ', error)
});

function each (next, i) {
  setTimeout(function () {
    console.log(i)
    next()
  }, 1000)
}
```

Will output:

```
0
1
2
3
3
4
5
6
7
8
9
end
```
