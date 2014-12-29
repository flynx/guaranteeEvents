guaranteeEvents
===============

This module exports a single function that when passed an event(s) and an
[EventEmitter](http://nodejs.org/api/events.html#events_class_events_eventemitter)
compatible object will register a couple of handlers that
will provide the following functionality:

* Cache event data for each event of the given type that gets emitted.

* Call new handlers of the specified event with each of the prior event
data sets in order of event occurrence.

This is useful for modules like [glob](https://github.com/isaacs/node-glob) 
that use the [EventEmitter](http://nodejs.org/api/events.html#events_class_events_eventemitter) 
model to pass data to the user (see examples below).

This is similar to how state change handlers work in 
[jQuery.Deferred](http://api.jquery.com/category/deferred-object/) or in
[Promise](https://promisesaplus.com/) objects.



Install
-------

```
$ npm install guarantee-events
```



Basic Examples
-------------

A synthetic example illustrating the basic functionality:
```javascript

var emitter = new (require('events').EventEmitter)
var guaranteeEvents = require('guarantee-events')

guaranteeEvents('event', emitter)

// emit some events...
emitter.emit('event', 'some data')

emitter.emit('event', 'some', 'more', 'data')


// Here the handler will be called for each event it missed...
emitter.on('event', function(){ console.log([].slice.apply(argumnts).join(' ')) })


emitter.emit('event', 'some data')

```

A real-life use-case:
```javascript
var glob = require('glob')
var guaranteeEvents = require('guarantee-events')


// build a glob object with cached 'match' and 'end' events...
var results = guaranteeEvents('match end', glob('**/*js'))


// Do stuff for some time...


// This will not miss a single result, regardless of how long it 
// took to do stuff...
results.on('match', function(path){ console.log('found: '+path) })


```
