![Stilt](https://raw.github.com/flovan/stilt/feature-element-resize/demo/img/stilt.gif)

#Stilt.js v0.2.0

A vanilla script to make stuff the same height as other stuff.

## Example

````javascript
// Make all `.column` elements the same size,
// starting when 650px is available
Stilt.setMinimumWidth(650);
Stilt.sync('.column');
````

## API

**`Stilt.sync([selector])`**  

Collects elements based on the selector and makes them the same height. This relies on a resize triggered on the window.

**`Stilt.release([selector])`**  

Stops synchronising elements that match the passed selector.

**`Stilt.setMinimumWidth([value])`**  

In the age of responsive websites, breakpoints dictate whether or not 2 boxes appear besides or below one another. This function allows you to set the global minimum width at which synchronising is triggered.

## Browser support

IE 8+, Chrome 39+, Safari 8+, Opera 26+, FF 35+ 

> **Note:** Modern browser support will probably be better than listed above. If you tested an earlier version, feel free to send a PR with updated versions.

## TODO

* Figure out element resizing
* Make it possible to have multiple Stilt instances
* IE(6?)7 support

## Changelog

* **0.2.0**  
  * Better IE support
  * Replaced unnessecairy custom event dispatching

* **0.1.0**  
  * Initial (beta) release.

* **0.0.1**  
  * First commit, WIP

  Gif source: http://faunasworld-moved.tumblr.com/post/23673524798