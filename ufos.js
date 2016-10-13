"use strict";

function UFOs(container,data_url){

	//scene elements, I wouldn't mess with these if you are trying to work with this
	var scene, camera, renderer, cube;
	//Mess with these if you don't want a full screen visualization
	var WIDTH  = window.innerWidth;
	var HEIGHT = window.innerHeight;

	var MAXWIDTH = 928, MAXHEIGHT = 592;
	var jsonloader = new THREE.JSONLoader();
	//SECTION INITIALIZATION
	function init(container) {
		scene = new THREE.Scene();
		initCamera();
		initRenderer();
		initCube();
		container.body.appendChild(renderer.domElement);
		addMouseHandler(renderer.domElement);
		render();
	}
	function resize(){
		WIDTH  = window.innerWidth;
		HEIGHT = window.innerHeight
		renderer.setSize(WIDTH, HEIGHT);
	}
	function initCamera() {
		camera = new THREE.PerspectiveCamera(70, WIDTH / HEIGHT, 1, 10000);
		camera.position.set(0,-500,500);
		camera.lookAt(scene.position);
	}


	function initRenderer() {
		renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setSize(WIDTH, HEIGHT);
		window.renderer = renderer;
	}
	function initCube() {
                var loader = new THREE.TextureLoader();

                var texture = loader.load("usmap.gif");
		var material = new THREE.MeshPhongMaterial({map:texture});
		material.bumpMap =texture;

		material.bumpScale = 22;
		cube = new THREE.Mesh(new THREE.CubeGeometry(MAXWIDTH,MAXHEIGHT, 2), material);
		var light = new THREE.DirectionalLight( 0xffffff );
		light.position.set( 1, 1, 1).normalize();
		scene.add(light);
		scene.add(cube);
	}
	var ufos = [];
	var counter = 0;
      var ufo_geometry = new THREE.TorusGeometry(25,5,25,50);
      var ufo_material = new THREE.MeshBasicMaterial({
				color: 0xff0000
			});
	function addUFO(x,y){
			counter++;
                  var ufo = new THREE.Mesh(ufo_geometry,ufo_material);

			ufo.name = counter.toString();
			cube.add(ufo);
		  ufo.position.set(-928/2 +x,592/2 -y,50);
			ufos.push(ufo);
	}
	function addUFOPercent(x,y){
			addUFO(x*MAXWIDTH, y*MAXHEIGHT);
	}

	function clearUFOs()
	{
			ufos.forEach(function(ufo){
				scene.remove(ufo);
			});
	}

	//END INITIALIZATION

	function render(){
                renderer.render(scene, camera);
                requestAnimationFrame(render);
	}

	//Function Calls

	init(container);
	this.addUFO = addUFO;
	this.clearUFOs = clearUFOs;
	this.resize = resize;
	this.addUFOPercent = addUFOPercent;

	this.destroy = function(){
			renderer.domElement.parentNode.removeChild(renderer.domElement);
	}

	var mouseDown = false,mouseX,mouseY;
	// kept all of these at the end so they're out of the way.
	function onMouseMove(e) {

        e.preventDefault();

        var deltaX = e.clientX - mouseX,
            deltaY = e.clientY - mouseY;
        mouseX = e.clientX;
        mouseY = e.clientY;


        if (mouseDown) {
			rotateScene(deltaX,deltaY);
			moveScene(deltaX, deltaY);
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

    function addMouseHandler(canvas) {
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
		cube.rotation.z -= deltaX/100;
	}
    function moveScene(deltaX, deltaY) {
					camera.position.z += deltaY;
					camera.rotation.x-=deltaY/360;

	}
}
