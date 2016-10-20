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
	var ufo_geo2 = new THREE.SphereGeometry(14,32,32);
	var ufo_material = new THREE.MeshPhongMaterial({color: 0xcccccc,reflectivity:.4});
	var ufo_material2 = new THREE.MeshPhongMaterial({color: 0xcccccc,reflectivity:.4});

	var ival;//interval val for touch listeners

	//These handle the stars
	var diskGeo = new THREE.CircleGeometry(7,40,40,40);
	var diskMaterial = new THREE.MeshBasicMaterial({color: 0xff0000, transparent:true,opacity:1});

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
		renderer.domElement.className = "grabbable";
		container.body.appendChild(renderer.domElement);
		renderer.domElement.style.cursor="grab";
		setTimeout(function(){addMouseHandler.call(renderer.domElement);},1000);
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
		camera.position.set(0,-200,600);
		camera.lookAt(scene.position);
	}

	//Prevents excessive WebGLRenderer instances
	function initRenderer() {

		renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setClearColor(0x000000);
		renderer.setPixelRatio( window.devicePixelRatio );

		renderer.setSize(WIDTH, HEIGHT);
		window.renderer = renderer;
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
		if(cancelled){
			return;
		}
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
				var disk = new THREE.Mesh(diskGeo,diskMaterial.clone());
				disk.position.copy(this.position);

				map.add(disk);
				var tempJson = {
						disk:disk,
						ufo:this,
						counter:1000
				};

				loopWrapper(castBeam.bind(tempJson));
				return false;
		}
		return true;
	}

	//casts stars onto the map.
	function castBeam(){
				this.counter++;
				if(this.counter > 5){
						var disk = new THREE.Mesh(diskGeo,diskMaterial);
						disk.position.copy(this.ufo.position);
						map.add(disk);
						loopWrapper(castDown.bind(disk));
						this.counter = 0;
				}

				this.disk.position.z-=2;
				if(this.disk.position.z <= 3){
						var fun = remove.bind(this.ufo);
						setTimeout(function(){loopWrapper(fun);},Math.floor(200*(150-speed)/150));
						loopWrapper(fadeOut.bind(this.disk));
						return false;
				}
				return true;
	}
	function castDown(){
			this.position.z-=2;
			if(this.position.z <=3){
				map.remove(this);
				return false;
			}
			return true;
	}

	function fadeOut(){

		if(this.material.opacity <= .01){
			map.remove(this);
			return false;
		}
		else{
			this.material.opacity-=.001;
		}
			return true;
	}

	//fly away and remove.
	function remove(){
				this.position.z+=5;
				if(this.position.z >=700){
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
		for(var i = map.children.length; i >= 0; i--){
			map.remove(map.children[i])
		}
		setTimeout(function(){cancelled = false;},Math.floor(40*((150-(speed))/150)));

	}

	function render(){
                renderer.render(scene, camera);
                requestAnimationFrame(render);
	}

	//Mouse handlers
	//This section handles mouse events for rotation.  I kept the variables down here so that they are easier to keep track of.
	//This is all a closure, so these functions aren't available outside which is good.
	function addMouseHandler() {

			var mouseDown = false,mouseX,mouseY;
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
				mouseDown = false;
			}

			function onMouseDown(evt){
				evt.preventDefault();
				mouseDown = true;
			}

			var touchX, touchY, touched = false,touched_first = false;

		this.addEventListener("touchstart", function(e){
			if(!touched_first){
				setInterval(touchHandler,20);
				touched_first = true;
			}
			touched = true;
			touchX= e.touches[0].clientX;
			touchY = e.touches[0].clientY;
			e.preventDefault();
		}, true);

		this.addEventListener("touchmove",function(e){
			touchX= e.touches[0].clientX;
			touchY = e.touches[0].clientY;
			e.preventDefault();
		});

		this.addEventListener("touchend", function(e){
			touched = false;
			e.preventDefault();
		}, true);

		function touchHandler(){
			if(touched){
				rotateScene(5 * (touchX - (WIDTH/2))/(WIDTH/2));
				moveScene(-5 * (touchY - HEIGHT/2)/(HEIGHT/2));
			}
		}

		//TODO implement zoom
		function wheelHandler(e){

		}
		
		this.addEventListener("wheel",wheelHandler,false);

		this.addEventListener('mousemove',onMouseMove,false);

		this.addEventListener('mousedown', onMouseDown,false);

		this.addEventListener('mouseup', onMouseUp,false);

	}

	//This is outside of addMouseHandler because I want these to be publicly available for people to add custom controls if they so desire.
	function rotateScene(deltaX){
			map.rotation.z-= deltaX/100;
	}
	function moveScene(deltaY) {
		if((camera.position.z > 300 || deltaY > 0) && (camera.position.z < 700 || deltaY < 0)){
			camera.position.z += deltaY;
			camera.position.y += deltaY*1.5;
			camera.rotation.x-=deltaY/360;
		}
	}


		//Call init and define public functions.
		init(container);
		moveScene(-50);
		this.addUFO = addUFO;
		this.resize = resize;
		this.addUFOPercent = addUFOPercent;
		this.resetStars = resetStars;
		this.rotateScene = rotateScene;
		this.moveScene = moveScene;
		this.destroy = function(){renderer.domElement.parentNode.removeChild(renderer.domElement);}
}
