## parallel-loop

Async parallel loop. See also: [limited-parallel-loop](http://github.com/azer/limited-parallel-loop) [serial-loop](http://github.com/azer/serial-loop)

## Install

```bash
$ npm install parallel-loop
```

## Usage

```js
loop = require('parallel-loop')

loop(10, each, function () {
  console.log('end')
})

function each (done, i) {
  setTimeout(function () {
    console.log(i)
    done()
  }, Math.floor(Math.random() * 500))
})
```

Will output:

```
3
9
2
5
7
4
1
8
6
end
```
