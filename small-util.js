SmallUtil = {}
SmallUtil.detail = {}

SmallUtil.tau = 6.283185307179586476925286766559
SmallUtil.phi = 0.6180339887498948482045868343656
SmallUtil.maxInt = 9007199254740991

SmallUtil.noop = function() {}

SmallUtil.detail.windowLoaded = false

window.addEventListener('load', function() {
	SmallUtil.detail.windowLoaded = true
})

SmallUtil.onWindowLoaded = function(cb) {
	if (SmallUtil.detail.windowLoaded) {
		cb()
	} else {
		window.addEventListener('load', cb)
	}
}

SmallUtil.assert = function(value, msg) {
	if (value) {return value}
	throw('assert failed: ' + (msg || '') + '\n' + (new Error()).stack)
}

SmallUtil.ifNull = function(a, b) {
	return a == null ? b : a
}

SmallUtil.isString = function(a) {return typeof a === 'string' || a instanceof String}
SmallUtil.isObject = function(a) {return a != null && typeof a === 'object'}
SmallUtil.isArray = function(a) {return Object.prototype.toString.call(a) === '[object Array]'}
SmallUtil.isNumber = function(a) {return typeof a === 'number'}
SmallUtil.isBoolean = function(a) {return typeof a === 'boolean'}
SmallUtil.isFunction = function(a) {return typeof a === 'function'}

SmallUtil.kv = function(obj, func) {
	for (var k in obj) {
		if (obj.hasOwnProperty(k)) {
			func(k, obj[k], obj)
		}
	}
}

SmallUtil.kvMap = function(obj, func) {
	var res = {}
	for (var k in obj) {
		if (obj.hasOwnProperty(k)) {
			res[k] = func(k, obj[k], obj)
		}
	}
	return res
}

SmallUtil.repeat = function(n, func) {
	for (var i = 0; i < n; ++i) {
		func(i)
	}
}

SmallUtil.generate = function(n, func) {
	var res = new Array(n)
	for (var i = 0; i < n; ++i) {
		res[i] = func(i)
	}
	return res
}

SmallUtil.assign = function(obj, /* otherObjects... */)  {
	for (var i = 1, len = arguments.length; i < len; ++i) {
		var otherObject = arguments[i]
		if (otherObject) {
			for (var k in otherObject) {
				if (otherObject.hasOwnProperty(k)) {
					obj[k] = otherObject[k]
				}
			}
		}
	}
	
	return obj
}

SmallUtil.assignIf = function(obj, /* otherObjects... */)  {
	for (var i = 1, len = arguments.length; i < len; ++i) {
		var otherObject = arguments[i]
		if (otherObject) {
			for (var k in otherObject) {
				if (otherObject.hasOwnProperty(k)) {
					if (obj[k] == null) {
						obj[k] = otherObject[k]
					}
				}
			}
		}
	}
	
	return obj
}

SmallUtil.extend = function(base, fields) {
	return SmallUtil.assign({}, base, fields)
}

SmallUtil.removeUnstable = function(arr, value) {
	var index = arr.indexOf(value)
	if (index < 0) {
		return false
	}
	SmallUtil.removeUnstableByIndex(arr, index)
	return true
}

SmallUtil.removeUnstableByIndex = function(arr, index) {
	var last = arr.pop()
	if (index < arr.length) {
		arr[index] = last
	}
}

SmallUtil.removeStable = function(arr, value) {
	var index = arr.indexOf(value)
	if (index < 0) {
		return false
	}
	SmallUtil.removeStableByIndex(arr, index)
	return true
}

SmallUtil.removeStableByIndex = function(arr, index) {
	arr.splice(index, 1)
}

// does not handle recursive references
SmallUtil.deepCopy = function(value) {
	if (SmallUtil.isArray(value)) {
		return value.map(SmallUtil.deepCopy)
	} else if (SmallUtil.isObject(value)) {
		return SmallUtil.kvMap(value, function(k, v) {
			return SmallUtil.deepCopy(v)
		})
	} else {
		return value
	}
}

SmallUtil.isInFullScreen = function(element) {
	element = element || document.body
	return (document.fullscreenElement && document.fullscreenElement !== null) ||
		(document.webkitFullscreenElement && document.webkitFullscreenElement !== null) ||
		(document.mozFullScreenElement && document.mozFullScreenElement !== null) ||
		(document.msFullscreenElement && document.msFullscreenElement !== null)
}

// https://stackoverflow.com/questions/36672561/how-to-exit-fullscreen-onclick-using-javascript
// https://stackoverflow.com/questions/1125084/how-to-make-the-window-full-screen-with-javascript-stretching-all-over-the-scre
SmallUtil.toggleFullscreen = function(element) {
	element = element || document.body
	
	var isInFullScreen = SmallUtil.isInFullScreen(element)

	if (!isInFullScreen) {
		if (element.requestFullscreen) {
			element.requestFullscreen()
		} else if (element.mozRequestFullScreen) {
			element.mozRequestFullScreen()
		} else if (element.webkitRequestFullScreen) {
			element.webkitRequestFullScreen()
		} else if (element.msRequestFullscreen) {
			element.msRequestFullscreen()
		} else if (typeof window.ActiveXObject !== 'undefined') { // Older IE
			var wscript = new ActiveXObject('WScript.Shell')
			
			if (wscript !== null) {
				wscript.SendKeys('{F11}')
			} else {
				return false
			}
		} else {
			return false
		}
	} else {
		if (document.exitFullscreen) {
			document.exitFullscreen()
		} else if (document.webkitExitFullscreen) {
			document.webkitExitFullscreen()
		} else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen()
		} else if (document.msExitFullscreen) {
			document.msExitFullscreen()
		} else if (typeof window.ActiveXObject !== 'undefined') { // Older IE
			var wscript = new ActiveXObject('WScript.Shell')
			
			if (wscript !== null) {
				wscript.SendKeys('{F11}')
			} else {
				return false
			}
		} else {
			return false
		}
	}
	
	return true
}

// https://github.com/kittykatattack/scaleToWindow
SmallUtil.scaleToWindow = function(canvas, backgroundColor) {
  var scaleX, scaleY, scale, center;

  //1. Scale the canvas to the correct size
  //Figure out the scale amount on each axis
  scaleX = window.innerWidth / canvas.offsetWidth;
  scaleY = window.innerHeight / canvas.offsetHeight;

  //Scale the canvas based on whichever value is less: `scaleX` or `scaleY`
  scale = Math.min(scaleX, scaleY);
  canvas.style.transformOrigin = "0 0";
  canvas.style.transform = "scale(" + scale + ")";

  //2. Center the canvas.
  //Decide whether to center the canvas vertically or horizontally.
  //Wide canvases should be centered vertically, and 
  //square or tall canvases should be centered horizontally
  if (canvas.offsetWidth > canvas.offsetHeight) {
    if (canvas.offsetWidth * scale < window.innerWidth) {
      center = "horizontally";
    } else {
      center = "vertically";
    }
  } else {
    if (canvas.offsetHeight * scale < window.innerHeight) {
      center = "vertically";
    } else {
      center = "horizontally";
    }
  }

  //Center horizontally (for square or tall canvases)
  var margin;
  if (center === "horizontally") {
    margin = (window.innerWidth - canvas.offsetWidth * scale) / 2;
    canvas.style.marginTop = 0 + "px";
    canvas.style.marginBottom = 0 + "px";
    canvas.style.marginLeft = margin + "px";
    canvas.style.marginRight = margin + "px";
  }

  //Center vertically (for wide canvases) 
  if (center === "vertically") {
    margin = (window.innerHeight - canvas.offsetHeight * scale) / 2;
    canvas.style.marginTop = margin + "px";
    canvas.style.marginBottom = margin + "px";
    canvas.style.marginLeft = 0 + "px";
    canvas.style.marginRight = 0 + "px";
  }

  //3. Remove any padding from the canvas  and body and set the canvas
  //display style to "block"
  canvas.style.paddingLeft = 0 + "px";
  canvas.style.paddingRight = 0 + "px";
  canvas.style.paddingTop = 0 + "px";
  canvas.style.paddingBottom = 0 + "px";
  canvas.style.display = "block";

  //4. Set the color of the HTML body background
  document.body.style.backgroundColor = backgroundColor;

  //Fix some quirkiness in scaling for Safari
  var ua = navigator.userAgent.toLowerCase();
  if (ua.indexOf("safari") != -1) {
    if (ua.indexOf("chrome") > -1) {
      // Chrome
    } else {
      // Safari
      //canvas.style.maxHeight = "100%";
      //canvas.style.minHeight = "100%";
    }
  }

  //5. Return the `scale` value. This is important, because you'll nee this value 
  //for correct hit testing between the pointer and sprites
  return scale;
}

SmallUtil.capitalize = function(str)  {
	return str.charAt(0).toUpperCase() + str.slice(1)
}

SmallUtil.uncapitalize = function(str)  {
	return str.charAt(0).toLowerCase() + str.slice(1)
}

SmallUtil.pluralize = function(str, count, pluralStr) {
	if (count === 1) {
		return str
	}
	if (pluralStr) {
		return pluralStr
	}
	return str + 's'
}

SmallUtil.vowels = {
	'a': true,
	'e': true,
	'i': true,
	'o': true,
	'u': true,
	'A': true,
	'E': true,
	'I': true,
	'O': true,
	'U': true
}

SmallUtil.startsWithVowel = function(str) {
	return SmallUtil.vowels[str.charAt(0)] === true
}

SmallUtil.addPlusSign = function(num) {
	num = Math.ceil(num)
	if (num > 0) {
		return '+' + num
	} else {
		return num.toString()
	}
}

SmallUtil.splitCamelCase = function(str) {
	var length = str.length,
		words = []	
	
	if (length === 0) {
		return words
	}
	
	var start = 0
	
	for (var i = 1; i < length; ++i) {
		var character = str.charAt(i)
		if (character === character.toUpperCase()) {
			words.push(str.substring(start, i))
			start = i
		}
	}
	
	words.push(str.substring(start, length))
	
	return words
}

SmallUtil.lexCompare = function(a, b) {
	var lenA = a.length,
		lenB = b.length,
		len = Math.min(lenA, lenB)
	for (var i = 0; i < len; ++i) {
		var va = a[i],
			vb = b[i]
		if (va < vb) {
			return -1
		} else if (va > vb) {
			return 1
		}
	}
	if (lenA < lenB) {
		return -1
	} else if (lenA > lenB) {
		return 1
	} else {
		return 0
	}
}

SmallUtil.getPath = function(object, path) {
	for (var i = 0, len = path.length; i < len; ++i) {
		var object = object[path[i]]
		if (object == null) {
			return null
		}
	}
	return object
}
