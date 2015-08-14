![Stilt](https://raw.github.com/flovan/stilt/master/demo/img/stilt.gif)

#Stilt.js v2.0.0

A zero-dependency script to give elements the same height.  
1KB minified and gzipped.

[&rarr; Demo page &larr;](http://htmlpreview.github.io/?https://github.com/flovan/stilt/blob/master/demo/index.html) (best viewed in a resizable browser)

## Example

```javascript
// Make all `.column` elements the same size,
// starting when 650px is available
var syncedCols = new Stilt('#demo-1 .col', {
	minWidth: 650
}).sync();
```

## API

**`new Stilt([selector], [options])`**  

Collects elements based on the selector.

Available options (with their default values):
```javascript
{
  // Set a minimum breakpoint
  minWidth:       0,
  // Set a maximum breakpoint (null value means no maximum)
  maxWidth:       null,
  // The amount of delay to throttle the resizing with
  throttleDelay:  50,
  // Use a reference elements' height 
  referenceElm:   null
}
```

**`instance.sync()`**  

Synchronising the height of the elements that match the passed selector.

**`instance.release()`**  

Stops synchronising elements that match the passed selector.

## Browser support

IE 8+, Chrome 39+, Safari 8+, Opera 26+, FF 35+ 

> **Note:** Modern browser support will probably be better than listed above. If you tested an earlier version, feel free to send a PR with updated versions.

## TODO

- Fix the resize dispatching that happens when syncing (notice how the demo button doesn't work...).
- Try to find a way to support multiple breakpoints

## Changelog

* **2.0.0**
  * Change the API to allow multiple individual instances.

* **1.0.1**
  * Fixed a bug in `Stilt.release()`
  * Fixed a bug where syncing `.a-class-2` would overwrite `.a-class-1` (numbers were being stripped from the classname)

* **1.0.0**
  * Better IE support
  * Replaced unnessecairy custom event dispatching
  * Less harsh style clearing below breakpoint

* **0.1.0**  
  * Initial (beta) release.

* **0.0.1**  
  * First commit, WIP

[Gif source](http://faunasworld-moved.tumblr.com/post/23673524798)
