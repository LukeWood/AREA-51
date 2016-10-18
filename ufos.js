"use strict";

//Options still needs to be implemented.
function UFOs(container, options){

	//scene elements, I wouldn't mess with these if you are trying to work with this
	var scene, camera, renderer, map;
	//Mess with these if you don't want a full screen visualization
	var WIDTH  = window.innerWidth;
	var HEIGHT = window.innerHeight;
	//These are the map dimensions
	var MAXWIDTH = 928, MAXHEIGHT = 592;
	var cancelled = false;
	//Variables required to create UFOs
	var counter = 0;
	var ufo_geo1 = new THREE.TorusGeometry(17,3,40,50);
	var ufo_geo2 = new THREE.SphereGeometry(13,32,32);
	var ufo_material = new THREE.MeshBasicMaterial({color: 0x888888,opacity:.6});
	var ufo_material2 = new THREE.MeshBasicMaterial({color: 0x555555,opacity:.6});

	var ival;//interval val for touch listeners

	//These handle the stars
	var diskGeo = new THREE.CircleGeometry(10,40,40,40);
	var diskMaterial = new THREE.MeshBasicMaterial({color: 0xff0000, transparent:true,opacity:.7});

	//cant just use this.speed because of the calls to bind later on.
	var speed = 50;
	this.setSpeed = function(spd){speed = spd;};

	//SECTION INITIALIZATION
	function init(container) {
		scene = new THREE.Scene();
		initCamera();
		if(!window.renderer)
			initRenderer();
		renderer = window.renderer;
		initMap();
		//initBackground();
		container.body.appendChild(renderer.domElement);
		renderer.domElement.style.cursor="grab";
		addMouseHandler(renderer.domElement);
		render();
	}

	//fires whenever the window resizes to keep the map accurate
	function resize(){
		WIDTH  = window.innerWidth;
		HEIGHT = window.innerHeight
		camera.aspect = WIDTH/HEIGHT;
		camera.updateProjectionMatrix();
		renderer.setSize(WIDTH, HEIGHT);
	}

	function initCamera() {
		camera = new THREE.PerspectiveCamera(70, WIDTH / HEIGHT, 1, 4000);
		camera.position.set(0,-500,500);
		camera.lookAt(scene.position);
	}

	//Prevents excessive WebGLRenderer instances
	function initRenderer() {
		renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setClearColor(0x000000);
		//renderer.shadowMap.enabled = true;
		//renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		renderer.setSize(WIDTH, HEIGHT);
		window.renderer = renderer;
	}

	function initBackground(){
		var loader = new THREE.TextureLoader();

		var texture = loader.load("img/space.jpg");
		var material = new THREE.MeshBasicMaterial({map:texture});
		material.side = THREE.BackSide;
		var mesh = new THREE.Mesh(new THREE.SphereGeometry(700,32,32), material);
		scene.add(mesh);
	}

	function initMap() {
		var loader = new THREE.TextureLoader();

		var texture = loader.load("img/usa.jpg");
		var material = new THREE.MeshPhongMaterial({map:texture});
		material.bumpMap =texture;
		material.bumpScale = 22;

		map = new THREE.Mesh(new THREE.CubeGeometry(MAXWIDTH,MAXHEIGHT, 2), material);
		var light = new THREE.DirectionalLight( 0xffffff );
		light.position.set( 1000, 1000, 1000);
		light.castShadow = true;
		map.receiveShadow = true;
		scene.add(light);
		scene.add(map);
	}
	// END INITIALIZATION

	function addUFO(x,y){
		counter++;
      		var ufo = new THREE.Mesh(ufo_geo1,ufo_material);
		var sub_ufo = new THREE.Mesh(ufo_geo2,ufo_material2);
		ufo.add(sub_ufo);
      		ufo.castShadow = true;
      		ufo.receiveShadow = true;
		ufo.name = counter.toString();
		ufo.isUFO = true;
		map.add(ufo);
		ufo.position.set(-928/2 +x,592/2 -y,400);
		loopWrapper(animateUFO.bind(ufo));
	}

	//Adds a ufo at a certain percentage of the way across the screen
	function addUFOPercent(x,y){
		addUFO(x*MAXWIDTH, y*MAXHEIGHT);
	}

	//loops for animation until the function returns false.
	function loopWrapper(callback){
			if(cancelled){
					return;
			}
			if(callback()){
					setTimeout(function(){loopWrapper(callback);},Math.floor(20*((150-(speed))/150)));
			}
	}

	//transitions a ufo in.
	function animateUFO(){
		this.position.z-=3;

		if(this.position.z<=130){
				var disk = new THREE.Mesh(diskGeo,diskMaterial);
				disk.position.copy(this.position);

				map.add(disk);
				var tempJson = {
						disk:disk,
						ufo:this
				};
				loopWrapper(castBeam.bind(tempJson));
				return false;
		}
		return true;
	}

	//casts stars onto the map.
	function castBeam(){
				this.disk.position.z-=2;
				if(this.disk.position.z <= 3){
						var fun = remove.bind(this.ufo);
						setTimeout(function(){loopWrapper(fun);},Math.floor(200*(150-speed)/150));
						return false;
				}
				return true;
	}

	//fly away and remove.
	function remove(){
				this.position.z+=5;
				if(this.position.z >=500){
					map.remove(this);
					return false;
				}
				return true;
	}

	//This removes all children.
	function resetStars(){
		//this clears nested children too, kind of a funky behavior but just had to deal with it.
		//Threejs struggles with removing objects.  Sometimes you have to try a few times to get it to work.
		//This probably has to do with the fact that these objects still exist in the event loop due to my animation implementation.
		cancelled = true;
		for(var i = 0; i < 10; i++){
			map.children.forEach(function(star){
				if(star.ival){
						clearInterval(star.ival);
				}
					map.remove(star);
			});
		}
		setTimeout(function(){cancelled = false},500);
	}

	function render(){
                renderer.render(scene, camera);
                requestAnimationFrame(render);
	}

	//Call init and define public functions.
	init(container);

	this.addUFO = addUFO;
	this.resize = resize;
	this.addUFOPercent = addUFOPercent;
	this.resetStars = resetStars;
	this.destroy = function(){renderer.domElement.parentNode.removeChild(renderer.domElement);}

	//Mouse handlers
	//This section handles mouse events for rotation.  I kept the variables down here so that they are easier to keep track of.

	var mouseDown = false,mouseX,mouseY;
	// kept all of these at the end so they're out of the way.
	function onMouseMove(e) {
	  e.preventDefault();

	  var deltaX = e.clientX - mouseX, deltaY = e.clientY - mouseY;
	  mouseX = e.clientX;
	  mouseY = e.clientY;


	  if (mouseDown) {
			rotateScene(deltaX);
			moveScene(deltaY);
	    }
	}

	function onMouseUp(evt) {
				evt.preventDefault();
				renderer.domElement.style.cursor = "grab";
				mouseDown = false;
	}

		function onMouseDown(evt){
				evt.preventDefault();
				renderer.domElement.style.cursor = "grabbing";
				mouseDown = true;
		}

	  function addMouseHandler(canvas) {
				canvas.addEventListener("touchstart", function(e){
						var dx = e.touches[0].clientX;
						if(dx > window.innerWidth/2){
							dx = 5;
						}
						else{
							dx = -5;
						}
						ival = setInterval(function(){rotateScene(dx,0)},20);
						e.preventDefault();
				}, true);

				canvas.addEventListener("touchmove",function(e){
						e.preventDefault();
				});

			  canvas.addEventListener("touchend", function(e){
						clearInterval(ival);
						e.preventDefault();
				}, true);

				canvas.addEventListener('mousemove',onMouseMove,false);

		    canvas.addEventListener('mousedown', onMouseDown,false);

		    canvas.addEventListener('mouseup', onMouseUp,false);

		}
		function rotateScene(deltaX){
				map.rotation.z-= deltaX/100;
		}
		function moveScene(deltaY) {
				if(camera.position.z > 100 || deltaY > 0){
					camera.position.z += deltaY;
					camera.rotation.x-=deltaY/360;
				}
		}
}
