![Stilt](https://raw.github.com/flovan/stilt/master/demo/img/stilt.gif)

#Stilt.js v1.0.1

A zero-dependency script to give elements the same height.  
<1KB minified and gzipped.

[&rarr; Demo page &larr;](http://htmlpreview.github.io/?https://github.com/flovan/stilt/blob/master/demo/index.html) (best viewed in a resizable browser)

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

## Changelog

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
