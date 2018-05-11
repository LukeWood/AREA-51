(function() {
  'use strict';

  var globals = typeof global === 'undefined' ? self : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = {}.hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    return aliases[name] ? expandAlias(aliases[name]) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (bundle && typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();

(function() {
var global = typeof window === 'undefined' ? this : window;
var __makeRelativeRequire = function(require, mappings, pref) {
  var none = {};
  var tryReq = function(name, pref) {
    var val;
    try {
      val = require(pref + '/node_modules/' + name);
      return val;
    } catch (e) {
      if (e.toString().indexOf('Cannot find module') === -1) {
        throw e;
      }

      if (pref.indexOf('node_modules') !== -1) {
        var s = pref.split('/');
        var i = s.lastIndexOf('node_modules');
        var newPref = s.slice(0, i).join('/');
        return tryReq(name, newPref);
      }
    }
    return none;
  };
  return function(name) {
    if (name in mappings) name = mappings[name];
    if (!name) return;
    if (name[0] !== '.' && pref) {
      var val = tryReq(name, pref);
      if (val !== none) return val;
    }
    return require(name);
  }
};
require.register("js/date_handling.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var days_in_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var num_months = days_in_month.length + 1;

function next_date(day, month, year) {
  day++;
  if (day > days_in_month[month - 1]) {
    month++;
    day = 1;
  }
  if (month > num_months) {
    year++;
    month = 1;
  }
  return { day: day, month: month, year: year };
}

var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function toTextDate(day, month, year) {
  return months[month - 1] + " " + day + ", " + year;
}

//19990101 -> January 1, 1999
function convertToDateString(date) {
  var month = parseInt(date.slice(-4).substring(0, 2));
  var day = date.slice(-2);
  var year = date.substring(0, 4);
  return toTextDate(day, month, year);
}

exports.next_date = next_date;
exports.convertToDateString = convertToDateString;
exports.toTextDate = toTextDate;
});

;require.register("js/date_handling.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var days_in_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var num_months = days_in_month.length + 1;

function next_date(day, month, year) {
  day++;
  if (day > days_in_month[month - 1]) {
    month++;
    day = 1;
  }
  if (month > num_months) {
    year++;
    month = 1;
  }
  return { day: day, month: month, year: year };
}

var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function toTextDate(day, month, year) {
  return months[month - 1] + " " + day + ", " + year;
}

//19990101 -> January 1, 1999
function convertToDateString(date) {
  var month = parseInt(date.slice(-4).substring(0, 2));
  var day = date.slice(-2);
  var year = date.substring(0, 4);
  return toTextDate(day, month, year);
}

exports.next_date = next_date;
exports.convertToDateString = convertToDateString;
exports.toTextDate = toTextDate;
});

;require.register("js/main.js", function(exports, require, module) {
'use strict';

var _date_handling = require('./date_handling');

var _ufos = require('./ufos');

var _timeline = require('./timeline');

//the ufo map itself
var map = new _ufos.UFO_Map(document);

var ufo_data_promise = fetch("combined/out.json").then(function (response) {
  return response.json();
});
var year_promise = fetch("combined/years.json").then(function (response) {
  return response.json();
});

Promise.all([ufo_data_promise, year_promise]).then(function (data) {
  return start(data[0], data[1]);
});

// These are magic numbers that correctly map to the us border on the image I used lol
function map_to_percentage_basis(x, y) {
  y = y + 60.5;
  y /= -145.68 + 60.5;
  x -= 26.45;
  x /= 60.55 - 28.5;
  return { x: x, y: y };
}

function add_ufos_for_year(data) {
  data.map(function (ufo_location) {
    var location = map_to_percentage_basis(ufo_location[2], ufo_location[3]);
    if (location.x < 1 && location.x > 0 && location.y < 1 && location.y > 0) {
      map.addUFOPercent(location.x, location.y);
    }
  });
}

function curry_update(ufo_data, years_available) {
  function curried_update(year_index) {
    if (year_index > years_available.length) {
      return;
    }
    var current_year = years_available[year_index];
    var data = ufo_data[current_year];
    if (data) {
      add_ufos_for_year(data);
    }
    (0, _timeline.set_date)(current_year);
    (0, _timeline.redraw_timeline)(year_index / years_available.length);
    setTimeout(function () {
      return curried_update(year_index + 1);
    }, 500);
  }
  return curried_update;
}

function start(ufo_data, years_available) {
  var update_function = curry_update(ufo_data, years_available);
  update_function(0);
}

window.addEventListener("resize", map.resize);
});

require.register("js/main.js", function(exports, require, module) {
'use strict';

var _date_handling = require('./date_handling');

var _ufos = require('./ufos');

var _timeline = require('./timeline');

//the ufo map itself
var map = new _ufos.UFO_Map(document);

var ufo_data_promise = fetch("combined/out.json").then(function (response) {
  return response.json();
});
var year_promise = fetch("combined/years.json").then(function (response) {
  return response.json();
});

Promise.all([ufo_data_promise, year_promise]).then(function (data) {
  return start(data[0], data[1]);
});

// These are magic numbers that correctly map to the us border on the image I used lol
function map_to_percentage_basis(x, y) {
  y = y + 60.5;
  y /= -145.68 + 60.5;
  x -= 26.45;
  x /= 60.55 - 28.5;
  return { x: x, y: y };
}

function add_ufos_for_year(data) {
  data.map(function (ufo_location) {
    var location = map_to_percentage_basis(ufo_location[2], ufo_location[3]);
    if (location.x < 1 && location.x > 0 && location.y < 1 && location.y > 0) {
      map.addUFOPercent(location.x, location.y);
    }
  });
}

function curry_update(ufo_data, years_available) {
  function curried_update(year_index) {
    if (year_index > years_available.length) {
      return;
    }
    var current_year = years_available[year_index];
    var data = ufo_data[current_year];
    if (data) {
      add_ufos_for_year(data);
    }
    (0, _timeline.set_date)(current_year);
    (0, _timeline.redraw_timeline)(year_index / years_available.length);
    setTimeout(function () {
      return curried_update(year_index + 1);
    }, 500);
  }
  return curried_update;
}

function start(ufo_data, years_available) {
  var update_function = curry_update(ufo_data, years_available);
  update_function(0);
}

window.addEventListener("resize", map.resize);
});

require.register("js/timeline.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.set_date = exports.redraw_timeline = undefined;

var _date_handling = require("./date_handling");

var timeline = document.getElementById("timeline");
var currentYear = document.getElementById("currentYear");
var ctx = timeline.getContext("2d");

function redraw_timeline(percent_done) {
  ctx.fillStyle = "#333333";
  ctx.fillRect(0, 0, timeline.width, timeline.height);
  ctx.fillStyle = "#0000FF";
  ctx.fillRect(0, 0, timeline.width * percent_done, timeline.height);
}

function set_date(date) {
  currentYear.innerHTML = (0, _date_handling.convertToDateString)(date);
}

exports.redraw_timeline = redraw_timeline;
exports.set_date = set_date;
});

;require.register("js/timeline.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.set_date = exports.redraw_timeline = undefined;

var _date_handling = require("./date_handling");

var timeline = document.getElementById("timeline");
var currentYear = document.getElementById("currentYear");
var ctx = timeline.getContext("2d");

function redraw_timeline(percent_done) {
  ctx.fillStyle = "#333333";
  ctx.fillRect(0, 0, timeline.width, timeline.height);
  ctx.fillStyle = "#0000FF";
  ctx.fillRect(0, 0, timeline.width * percent_done, timeline.height);
}

function set_date(date) {
  currentYear.innerHTML = (0, _date_handling.convertToDateString)(date);
}

exports.redraw_timeline = redraw_timeline;
exports.set_date = set_date;
});

;require.register("js/ufos.js", function(exports, require, module) {
"use strict";

//Options still needs to be implemented.

Object.defineProperty(exports, "__esModule", {
	value: true
});
function UFO_Map(container) {

	//scene elements, I wouldn't mess with these if you are trying to work with this
	var scene, camera, renderer, map;

	//Size parameters.
	var WIDTH = window.innerWidth,
	    HEIGHT = window.innerHeight,
	    MAXWIDTH = 928,
	    MAXHEIGHT = 592;

	var cancelled = false,
	    counter = 0;

	//UFO Geometries
	var ufo_geo1 = new THREE.TorusGeometry(17, 3, 40, 50),
	    ufo_geo2 = new THREE.SphereGeometry(14, 32, 32),
	    ufo_material = new THREE.MeshPhongMaterial({ color: 0xcccccc, reflectivity: .4 }),
	    ufo_material2 = new THREE.MeshPhongMaterial({ color: 0xcccccc, reflectivity: .4 });

	//These handle the discs that mark the sightings
	var diskGeo = new THREE.CircleGeometry(7, 40, 40, 40),
	    diskMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 1 });

	//cant just use this.speed because of the calls to bind later on.
	var speed = 50;
	this.setSpeed = function (spd) {
		speed = spd;
	};

	//SECTION INITIALIZATION
	function init(container) {
		scene = new THREE.Scene();
		initCamera();
		if (!window.renderer) initRenderer();
		renderer = window.renderer;
		initMap();
		renderer.domElement.className = "grabbable";
		container.body.appendChild(renderer.domElement);
		renderer.domElement.style.cursor = "grab";
		setTimeout(function () {
			addMouseHandler.call(renderer.domElement);
		}, 1000);
		render();
	}

	//fires whenever the window resizes to keep the map accurate
	function resize() {
		WIDTH = window.innerWidth;
		HEIGHT = window.innerHeight;
		camera.aspect = WIDTH / HEIGHT;
		camera.updateProjectionMatrix();
		renderer.setSize(WIDTH, HEIGHT);
	}

	function initCamera() {
		camera = new THREE.PerspectiveCamera(70, WIDTH / HEIGHT, 1, 4000);
		camera.position.set(0, -200, 600);
		camera.lookAt(scene.position);
	}

	//Prevents excessive WebGLRenderer instances
	function initRenderer() {

		renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setClearColor(0x000000);
		renderer.setPixelRatio(window.devicePixelRatio);

		renderer.setSize(WIDTH, HEIGHT);
		window.renderer = renderer;
	}

	function initMap() {
		var loader = new THREE.TextureLoader();

		var texture = loader.load("img/usa.jpg");
		var material = new THREE.MeshPhongMaterial({ map: texture });
		material.bumpMap = texture;
		material.bumpScale = 22;

		map = new THREE.Mesh(new THREE.CubeGeometry(MAXWIDTH, MAXHEIGHT, 2), material);
		var light = new THREE.DirectionalLight(0xffffff);
		light.position.set(1000, 1000, 1000);
		light.castShadow = true;
		map.receiveShadow = true;
		scene.add(light);
		scene.add(map);
	}
	// END INITIALIZATION

	function addUFO(x, y) {
		if (cancelled) {
			return;
		}
		counter++;
		var ufo = new THREE.Mesh(ufo_geo1, ufo_material);
		var sub_ufo = new THREE.Mesh(ufo_geo2, ufo_material2);
		ufo.add(sub_ufo);
		ufo.castShadow = true;
		ufo.receiveShadow = true;
		ufo.name = counter.toString();
		ufo.isUFO = true;
		map.add(ufo);
		ufo.position.set(-928 / 2 + x, 592 / 2 - y, 400);
		loopWrapper(animateUFO.bind(ufo));
	}
	//Adds a ufo at a certain percentage of the way across the screen
	function addUFOPercent(x, y) {
		addUFO(x * MAXWIDTH, y * MAXHEIGHT);
	}

	function addPoint(x, y) {
		var disk = new THREE.Mesh(diskGeo, diskMaterial.clone());
		disk.material.opacity = .1;
		map.add(disk);
		disk.position.set(-928 / 2 + x, 592 / 2 - y, 3);
	}
	function addPointPercent(x, y) {
		addPoint(x * MAXWIDTH, y * MAXHEIGHT);
	}

	//loops for animation until the function returns false.
	function loopWrapper(callback) {
		if (cancelled) {
			return;
		}
		if (callback()) {
			setTimeout(function () {
				loopWrapper(callback);
			}, Math.floor(20 * ((150 - speed) / 150)));
		}
	}

	//transitions a ufo in.
	function animateUFO() {
		this.position.z -= 3;

		if (this.position.z <= 130) {
			var disk = new THREE.Mesh(diskGeo, diskMaterial.clone());
			disk.position.copy(this.position);

			map.add(disk);
			var tempJson = {
				disk: disk,
				ufo: this,
				counter: 1000
			};

			loopWrapper(castBeam.bind(tempJson));
			return false;
		}
		return true;
	}

	//casts stars onto the map.
	function castBeam() {
		this.counter++;
		if (this.counter > 5) {
			var disk = new THREE.Mesh(diskGeo, diskMaterial);
			disk.position.copy(this.ufo.position);
			map.add(disk);
			loopWrapper(castDown.bind(disk));
			this.counter = 0;
		}

		this.disk.position.z -= 2;
		if (this.disk.position.z <= 3) {
			var fun = remove.bind(this.ufo);
			setTimeout(function () {
				loopWrapper(fun);
			}, Math.floor(200 * (150 - speed) / 150));
			loopWrapper(fadeOut.bind(this.disk));
			return false;
		}
		return true;
	}
	function castDown() {
		this.position.z -= 2;
		if (this.position.z <= 3) {
			map.remove(this);
			return false;
		}
		return true;
	}

	function fadeOut() {
		if (this.material.opacity <= .1) {
			//map.remove(this);
			return false;
		} else {
			this.material.opacity -= .001;
		}
		return true;
	}

	//fly away and remove.
	function remove() {
		this.position.z += 5;
		if (this.position.z >= 700) {
			map.remove(this);
			return false;
		}
		return true;
	}

	//This removes all children.
	function resetStars() {
		cancelled = true;
		for (var i = map.children.length; i >= 0; i--) {
			map.remove(map.children[i]);
		}
		setTimeout(function () {
			cancelled = false;
		}, Math.floor(40 * ((150 - speed) / 150)));
	}

	function render() {
		renderer.render(scene, camera);
		requestAnimationFrame(render);
	}

	//Mouse handlers
	//This section handles mouse events for rotation.  I kept the variables down here so that they are easier to keep track of.
	//This is all a closure, so these functions aren't available outside which is good.
	function addMouseHandler() {

		var mouseDown = false,
		    mouseX,
		    mouseY;
		function onMouseMove(e) {
			e.preventDefault();

			var deltaX = e.clientX - mouseX,
			    deltaY = e.clientY - mouseY;
			mouseX = e.clientX;
			mouseY = e.clientY;

			if (mouseDown) {
				rotateScene(deltaX);
				moveScene(deltaY);
			}
		}

		function onMouseUp(evt) {
			evt.preventDefault();
			mouseDown = false;
		}

		function onMouseDown(evt) {
			evt.preventDefault();
			mouseDown = true;
		}

		//Touch variables
		var touchX,
		    touchY,
		    touched = false,
		    touched_first = false;

		this.addEventListener("touchstart", function (e) {
			if (!touched_first) {
				setInterval(touchHandler, 20);
				touched_first = true;
			}
			touched = true;
			touchX = e.touches[0].clientX;
			touchY = e.touches[0].clientY;
			e.preventDefault();
		}, true);

		this.addEventListener("touchmove", function (e) {
			touchX = e.touches[0].clientX;
			touchY = e.touches[0].clientY;
			e.preventDefault();
		});

		this.addEventListener("touchend", function (e) {
			touched = false;
			e.preventDefault();
		}, true);

		function touchHandler() {
			if (touched) {
				rotateScene(5 * (touchX - WIDTH / 2) / (WIDTH / 2));
				moveScene(-5 * (touchY - HEIGHT / 2) / (HEIGHT / 2));
			}
		}

		this.addEventListener('mousemove', onMouseMove, false);
		this.addEventListener('mousedown', onMouseDown, false);
		this.addEventListener('mouseup', onMouseUp, false);
	}

	//This is outside of addMouseHandler because I want these to be publicly available for people to add custom controls if they so desire.
	function rotateScene(deltaX) {
		map.rotation.z -= deltaX / 100;
	}
	function moveScene(deltaY) {
		if ((camera.position.z > 300 || deltaY > 0) && (camera.position.z < 700 || deltaY < 0)) {
			camera.position.z += deltaY;
			camera.position.y += deltaY * 1.5;
			camera.rotation.x -= deltaY / 360;
		}
	}

	//Call init and define public functions.
	init(container);
	moveScene(-50);
	this.addUFO = addUFO.bind(this);
	this.addUFOPercent = addUFOPercent.bind(this);
	this.addPoint = addPoint.bind(this);
	this.addPointPercent = addPointPercent.bind(this);
	this.resize = resize.bind(this);
	this.resetStars = resetStars.bind(this);
	this.rotateScene = rotateScene.bind(this);
	this.moveScene = moveScene.bind(this);
	this.destroy = function () {
		renderer.domElement.parentNode.removeChild(renderer.domElement);
	};
}

exports.UFO_Map = UFO_Map;
});

;require.register("js/ufos.js", function(exports, require, module) {
"use strict";

//Options still needs to be implemented.

Object.defineProperty(exports, "__esModule", {
	value: true
});
function UFO_Map(container) {

	//scene elements, I wouldn't mess with these if you are trying to work with this
	var scene, camera, renderer, map;

	//Size parameters.
	var WIDTH = window.innerWidth,
	    HEIGHT = window.innerHeight,
	    MAXWIDTH = 928,
	    MAXHEIGHT = 592;

	var cancelled = false,
	    counter = 0;

	//UFO Geometries
	var ufo_geo1 = new THREE.TorusGeometry(17, 3, 40, 50),
	    ufo_geo2 = new THREE.SphereGeometry(14, 32, 32),
	    ufo_material = new THREE.MeshPhongMaterial({ color: 0xcccccc, reflectivity: .4 }),
	    ufo_material2 = new THREE.MeshPhongMaterial({ color: 0xcccccc, reflectivity: .4 });

	//These handle the discs that mark the sightings
	var diskGeo = new THREE.CircleGeometry(7, 40, 40, 40),
	    diskMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 1 });

	//cant just use this.speed because of the calls to bind later on.
	var speed = 50;
	this.setSpeed = function (spd) {
		speed = spd;
	};

	//SECTION INITIALIZATION
	function init(container) {
		scene = new THREE.Scene();
		initCamera();
		if (!window.renderer) initRenderer();
		renderer = window.renderer;
		initMap();
		renderer.domElement.className = "grabbable";
		container.body.appendChild(renderer.domElement);
		renderer.domElement.style.cursor = "grab";
		setTimeout(function () {
			addMouseHandler.call(renderer.domElement);
		}, 1000);
		render();
	}

	//fires whenever the window resizes to keep the map accurate
	function resize() {
		WIDTH = window.innerWidth;
		HEIGHT = window.innerHeight;
		camera.aspect = WIDTH / HEIGHT;
		camera.updateProjectionMatrix();
		renderer.setSize(WIDTH, HEIGHT);
	}

	function initCamera() {
		camera = new THREE.PerspectiveCamera(70, WIDTH / HEIGHT, 1, 4000);
		camera.position.set(0, -200, 600);
		camera.lookAt(scene.position);
	}

	//Prevents excessive WebGLRenderer instances
	function initRenderer() {

		renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setClearColor(0x000000);
		renderer.setPixelRatio(window.devicePixelRatio);

		renderer.setSize(WIDTH, HEIGHT);
		window.renderer = renderer;
	}

	function initMap() {
		var loader = new THREE.TextureLoader();

		var texture = loader.load("img/usa.jpg");
		var material = new THREE.MeshPhongMaterial({ map: texture });
		material.bumpMap = texture;
		material.bumpScale = 22;

		map = new THREE.Mesh(new THREE.CubeGeometry(MAXWIDTH, MAXHEIGHT, 2), material);
		var light = new THREE.DirectionalLight(0xffffff);
		light.position.set(1000, 1000, 1000);
		light.castShadow = true;
		map.receiveShadow = true;
		scene.add(light);
		scene.add(map);
	}
	// END INITIALIZATION

	function addUFO(x, y) {
		if (cancelled) {
			return;
		}
		counter++;
		var ufo = new THREE.Mesh(ufo_geo1, ufo_material);
		var sub_ufo = new THREE.Mesh(ufo_geo2, ufo_material2);
		ufo.add(sub_ufo);
		ufo.castShadow = true;
		ufo.receiveShadow = true;
		ufo.name = counter.toString();
		ufo.isUFO = true;
		map.add(ufo);
		ufo.position.set(-928 / 2 + x, 592 / 2 - y, 400);
		loopWrapper(animateUFO.bind(ufo));
	}
	//Adds a ufo at a certain percentage of the way across the screen
	function addUFOPercent(x, y) {
		addUFO(x * MAXWIDTH, y * MAXHEIGHT);
	}

	function addPoint(x, y) {
		var disk = new THREE.Mesh(diskGeo, diskMaterial.clone());
		disk.material.opacity = .1;
		map.add(disk);
		disk.position.set(-928 / 2 + x, 592 / 2 - y, 3);
	}
	function addPointPercent(x, y) {
		addPoint(x * MAXWIDTH, y * MAXHEIGHT);
	}

	//loops for animation until the function returns false.
	function loopWrapper(callback) {
		if (cancelled) {
			return;
		}
		if (callback()) {
			setTimeout(function () {
				loopWrapper(callback);
			}, Math.floor(20 * ((150 - speed) / 150)));
		}
	}

	//transitions a ufo in.
	function animateUFO() {
		this.position.z -= 3;

		if (this.position.z <= 130) {
			var disk = new THREE.Mesh(diskGeo, diskMaterial.clone());
			disk.position.copy(this.position);

			map.add(disk);
			var tempJson = {
				disk: disk,
				ufo: this,
				counter: 1000
			};

			loopWrapper(castBeam.bind(tempJson));
			return false;
		}
		return true;
	}

	//casts stars onto the map.
	function castBeam() {
		this.counter++;
		if (this.counter > 5) {
			var disk = new THREE.Mesh(diskGeo, diskMaterial);
			disk.position.copy(this.ufo.position);
			map.add(disk);
			loopWrapper(castDown.bind(disk));
			this.counter = 0;
		}

		this.disk.position.z -= 2;
		if (this.disk.position.z <= 3) {
			var fun = remove.bind(this.ufo);
			setTimeout(function () {
				loopWrapper(fun);
			}, Math.floor(200 * (150 - speed) / 150));
			loopWrapper(fadeOut.bind(this.disk));
			return false;
		}
		return true;
	}
	function castDown() {
		this.position.z -= 2;
		if (this.position.z <= 3) {
			map.remove(this);
			return false;
		}
		return true;
	}

	function fadeOut() {
		if (this.material.opacity <= .1) {
			//map.remove(this);
			return false;
		} else {
			this.material.opacity -= .001;
		}
		return true;
	}

	//fly away and remove.
	function remove() {
		this.position.z += 5;
		if (this.position.z >= 700) {
			map.remove(this);
			return false;
		}
		return true;
	}

	//This removes all children.
	function resetStars() {
		cancelled = true;
		for (var i = map.children.length; i >= 0; i--) {
			map.remove(map.children[i]);
		}
		setTimeout(function () {
			cancelled = false;
		}, Math.floor(40 * ((150 - speed) / 150)));
	}

	function render() {
		renderer.render(scene, camera);
		requestAnimationFrame(render);
	}

	//Mouse handlers
	//This section handles mouse events for rotation.  I kept the variables down here so that they are easier to keep track of.
	//This is all a closure, so these functions aren't available outside which is good.
	function addMouseHandler() {

		var mouseDown = false,
		    mouseX,
		    mouseY;
		function onMouseMove(e) {
			e.preventDefault();

			var deltaX = e.clientX - mouseX,
			    deltaY = e.clientY - mouseY;
			mouseX = e.clientX;
			mouseY = e.clientY;

			if (mouseDown) {
				rotateScene(deltaX);
				moveScene(deltaY);
			}
		}

		function onMouseUp(evt) {
			evt.preventDefault();
			mouseDown = false;
		}

		function onMouseDown(evt) {
			evt.preventDefault();
			mouseDown = true;
		}

		//Touch variables
		var touchX,
		    touchY,
		    touched = false,
		    touched_first = false;

		this.addEventListener("touchstart", function (e) {
			if (!touched_first) {
				setInterval(touchHandler, 20);
				touched_first = true;
			}
			touched = true;
			touchX = e.touches[0].clientX;
			touchY = e.touches[0].clientY;
			e.preventDefault();
		}, true);

		this.addEventListener("touchmove", function (e) {
			touchX = e.touches[0].clientX;
			touchY = e.touches[0].clientY;
			e.preventDefault();
		});

		this.addEventListener("touchend", function (e) {
			touched = false;
			e.preventDefault();
		}, true);

		function touchHandler() {
			if (touched) {
				rotateScene(5 * (touchX - WIDTH / 2) / (WIDTH / 2));
				moveScene(-5 * (touchY - HEIGHT / 2) / (HEIGHT / 2));
			}
		}

		this.addEventListener('mousemove', onMouseMove, false);
		this.addEventListener('mousedown', onMouseDown, false);
		this.addEventListener('mouseup', onMouseUp, false);
	}

	//This is outside of addMouseHandler because I want these to be publicly available for people to add custom controls if they so desire.
	function rotateScene(deltaX) {
		map.rotation.z -= deltaX / 100;
	}
	function moveScene(deltaY) {
		if ((camera.position.z > 300 || deltaY > 0) && (camera.position.z < 700 || deltaY < 0)) {
			camera.position.z += deltaY;
			camera.position.y += deltaY * 1.5;
			camera.rotation.x -= deltaY / 360;
		}
	}

	//Call init and define public functions.
	init(container);
	moveScene(-50);
	this.addUFO = addUFO.bind(this);
	this.addUFOPercent = addUFOPercent.bind(this);
	this.addPoint = addPoint.bind(this);
	this.addPointPercent = addPointPercent.bind(this);
	this.resize = resize.bind(this);
	this.resetStars = resetStars.bind(this);
	this.rotateScene = rotateScene.bind(this);
	this.moveScene = moveScene.bind(this);
	this.destroy = function () {
		renderer.domElement.parentNode.removeChild(renderer.domElement);
	};
}

exports.UFO_Map = UFO_Map;
});

;require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');

'use strict';

/* jshint ignore:start */
(function () {
  var WebSocket = window.WebSocket || window.MozWebSocket;
  var br = window.brunch = window.brunch || {};
  var ar = br['auto-reload'] = br['auto-reload'] || {};
  if (!WebSocket || ar.disabled) return;
  if (window._ar) return;
  window._ar = true;

  var cacheBuster = function cacheBuster(url) {
    var date = Math.round(Date.now() / 1000).toString();
    url = url.replace(/(\&|\\?)cacheBuster=\d*/, '');
    return url + (url.indexOf('?') >= 0 ? '&' : '?') + 'cacheBuster=' + date;
  };

  var browser = navigator.userAgent.toLowerCase();
  var forceRepaint = ar.forceRepaint || browser.indexOf('chrome') > -1;

  var reloaders = {
    page: function page() {
      window.location.reload(true);
    },

    stylesheet: function stylesheet() {
      [].slice.call(document.querySelectorAll('link[rel=stylesheet]')).filter(function (link) {
        var val = link.getAttribute('data-autoreload');
        return link.href && val != 'false';
      }).forEach(function (link) {
        link.href = cacheBuster(link.href);
      });

      // Hack to force page repaint after 25ms.
      if (forceRepaint) setTimeout(function () {
        document.body.offsetHeight;
      }, 25);
    },

    javascript: function javascript() {
      var scripts = [].slice.call(document.querySelectorAll('script'));
      var textScripts = scripts.map(function (script) {
        return script.text;
      }).filter(function (text) {
        return text.length > 0;
      });
      var srcScripts = scripts.filter(function (script) {
        return script.src;
      });

      var loaded = 0;
      var all = srcScripts.length;
      var onLoad = function onLoad() {
        loaded = loaded + 1;
        if (loaded === all) {
          textScripts.forEach(function (script) {
            eval(script);
          });
        }
      };

      srcScripts.forEach(function (script) {
        var src = script.src;
        script.remove();
        var newScript = document.createElement('script');
        newScript.src = cacheBuster(src);
        newScript.async = true;
        newScript.onload = onLoad;
        document.head.appendChild(newScript);
      });
    }
  };
  var port = ar.port || 9485;
  var host = br.server || window.location.hostname || 'localhost';

  var connect = function connect() {
    var connection = new WebSocket('ws://' + host + ':' + port);
    connection.onmessage = function (event) {
      if (ar.disabled) return;
      var message = event.data;
      var reloader = reloaders[message] || reloaders.page;
      reloader();
    };
    connection.onerror = function () {
      if (connection.readyState) connection.close();
    };
    connection.onclose = function () {
      window.setTimeout(connect, 1000);
    };
  };
  connect();
})();
/* jshint ignore:end */
;
//# sourceMappingURL=app.js.map