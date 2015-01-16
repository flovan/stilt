#Stilt.js v0.1.0

A vanilla scripts to make stuff the same height as other stuff.

## Example

````javascript
// Make all .column elements the same size,
// starting when 650px is available
Stilt.setMinimumWidth(650);
Stilt.sync('.column');
````

## API

###`Stilt.sync([selector])`
Collects elements based on the selector and makes them the same height. This relies on a resize triggered on the window.

###`Stilt.release([selector])`
Stops synchronising elements that match the passed selector.

###`Stilt.setMinimumWidth([value])`
In the age of responsive websites, breakpoints dictate wether or not 2 boxes appear besides or below one another. This function allows you to set the global minimum width at which synchronising is triggered.

## TODO

* Cross-browser tests
* Figure out element resizing
* Make it possible to have multiple Stilt instances

## Changelog

### 0.1.0

Initial (beta) release.

### 0.0.1

First commit, WIP