"use strict";

function UFOs(container){

	//scene elements, I wouldn't mess with these if you are trying to work with this
	var scene, camera, renderer, map;
	//Mess with these if you don't want a full screen visualization
	var WIDTH  = window.innerWidth;
	var HEIGHT = window.innerHeight;

	var MAXWIDTH = 928, MAXHEIGHT = 592;
	var speed = 50;
	//cant just use this.speed because of bind's use later on.
	this.setSpeed = function(spd){speed = spd;}
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

	var counter = 0;
	var ufo_geo1 = new THREE.TorusGeometry(17,3,40,50);
	var ufo_geo2 = new THREE.SphereGeometry(13,32,32);
	var ufo_material = new THREE.MeshBasicMaterial({color: 0x0099ff,opacity:.6});
	var ufo_material2 = new THREE.MeshBasicMaterial({color: 0x0000ff,opacity:.6});

	function addUFO(x,y){
		counter++;
      		var ufo = new THREE.Mesh(ufo_geo1,ufo_material);
		var sub_ufo = new THREE.Mesh(ufo_geo2,ufo_material2);
		ufo.add(sub_ufo);
      		ufo.castShadow = true;
      		ufo.receiveShadow = true;
		ufo.name = counter.toString();
		map.add(ufo);
		ufo.position.set(-928/2 +x,592/2 -y,400);
		loopWrapper(animateUFO.bind(ufo));
	}

	//Adds a ufo at a certain percentage of the way across the screen
	function addUFOPercent(x,y){
		addUFO(x*MAXWIDTH, y*MAXHEIGHT);
	}

	function loopWrapper(callback){
			if(callback()){
					setTimeout(function(){loopWrapper(callback);},Math.floor(20*((150-(speed))/150)));
			}
	}

	var diskGeo = new THREE.CircleGeometry(15,20,40,50);
	var diskMaterial = new THREE.MeshBasicMaterial({color: 0xff0000, transparent:true,opacity:.7});
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

	//cast stars

	function castBeam(){
				this.disk.position.z-=2;
				if(this.disk.position.z <= 3){
						var fun = remove.bind(this.ufo);
						setTimeout(function(){loopWrapper(fun);},Math.floor(200*(150-speed)/150));
						return false;
				}
				return true;
	}

	function remove(){
				this.position.z+=5;
				if(this.position.z >=500){
					map.remove(this);
					return false;
				}
				return true;
	}


	function resetStars(){
		//this clears nested children too, kind of a funky behavior but just had to deal with it.
		for(var i = 0; i < 10; i++){
			map.children.forEach(function(star){
				if(star.ival){
						clearInterval(star.ival);
				}
					map.remove(star);
			});
		}
	}
	this.resetStars = resetStars;

	function render(){
                renderer.render(scene, camera);
                requestAnimationFrame(render);
	}

	init(container);
	this.addUFO = addUFO;
	this.resize = resize;
	this.addUFOPercent = addUFOPercent;
	this.destroy = function(){
		renderer.domElement.parentNode.removeChild(renderer.domElement);
	}
	var mouseDown = false,mouseX,mouseY;
	// kept all of these at the end so they're out of the way.
	function onMouseMove(e) {

        	e.preventDefault();

        	var deltaX = e.clientX - mouseX, deltaY = e.clientY - mouseY;
       		mouseX = e.clientX;
        	mouseY = e.clientY;


        if (mouseDown) {
					rotateScene(deltaX,deltaY);
					moveScene(deltaX, deltaY);
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

	var ival;
  function addMouseHandler(canvas) {
				canvas.addEventListener("touchstart", function(e){
						var dx = e.touches[0].clientX;
						if(dx > window.innerWidth/2){
							dx = 5;
						}
						else{
							dx = -1
						}
						ival = setInterval(function(){rotateScene(dx,0)},20);
				}, true);
		    canvas.addEventListener("touchend", function(){
					clearInterval(ival);
				}, true);
				canvas.addEventListener('mousemove', function (e) {
		onMouseMove(e);
	    }, false);
	    canvas.addEventListener('mousedown', function (e) {
		onMouseDown(e);
	    }, false);
	    canvas.addEventListener('mouseup', function (e) {
		onMouseUp(e);
	    }, false);
	}

	function rotateScene(deltaX,deltaY){
			map.rotation.z-= deltaX/100;
	}
	function moveScene(deltaX, deltaY) {
		if(camera.position.z > 100 || deltaY > 0){
			camera.position.z += deltaY;
			camera.rotation.x-=deltaY/360;
		}
	}
}
