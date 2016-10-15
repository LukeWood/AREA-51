"use strict";

function UFOs(container){

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
		if(!window.renderer)
			initRenderer();
		renderer = window.renderer;
		initCube();
		container.body.appendChild(renderer.domElement);
		renderer.domElement.style.cursor="grab";
		addMouseHandler(renderer.domElement);
		render();
	}
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


	function initRenderer() {
		renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setSize(WIDTH, HEIGHT);
		window.renderer = renderer;
	}

	function initCube() {
    var loader = new THREE.TextureLoader();

    var texture = loader.load("img/usmap.gif");
		var material = new THREE.MeshPhongMaterial({map:texture});

		material.bumpMap =texture;

		material.bumpScale = 22;
		cube = new THREE.Mesh(new THREE.CubeGeometry(MAXWIDTH,MAXHEIGHT, 2), material);
		var light = new THREE.DirectionalLight( 0xffffff );
		light.position.set( 1000, 1000, 1000);
		light.castShadow = true;
		cube.receiveShadow = true;
		scene.add(light);
		scene.add(cube);
	}
	var counter = 0;
	var ufo_geo1 = new THREE.TorusGeometry(17,3,40,50);
	var ufo_geo2 = new THREE.SphereGeometry(13,32,32);	
	var ufo_material = new THREE.MeshBasicMaterial({color: 0xff0000,opacity:.6});
	var ufo_material2 = new THREE.MeshBasicMaterial({color: 0x0000ff,opacity:.6});
	/*var t_mesh = new THREE.Mesh(ufo_geo1,ufo_material);
	var t_mesh2 = new THREE.Mesh(ufo_geo2,ufo_material);

	t_mesh.updateMatrix();
	ufo_geometry.merge(t_mesh.geometry,t_mesh.matrix);
	t_mesh2.updateMatrix();
	ufo_geometry.merge(t_mesh2.geometry,t_mesh2.matrix);
*/
	function addUFO(x,y){
			counter++;
      var ufo = new THREE.Mesh(ufo_geo1,ufo_material);
	var sub_ufo = new THREE.Mesh(ufo_geo2,ufo_material2);
	ufo.add(sub_ufo);
      ufo.castShadow = true;
      ufo.receiveShadow = true;
			ufo.name = counter.toString();
			cube.add(ufo);
		  ufo.position.set(-928/2 +x,592/2 -y,400);
			animateUFO(ufo);
	}

	function animateUFO(ufo){
			ufo.ival = setInterval(function(){
				ufo.position.z-=3;
				if(ufo.position.z <=75)
				{
					clearInterval(ufo.ival);
					setTimeout(function(){remove(ufo);},300);
				}
			},20);
	}

	function addUFOPercent(x,y){
			addUFO(x*MAXWIDTH, y*MAXHEIGHT);
	}

	function remove(ufo){
			clearInterval(ufo.ival);
			ufo.ival2 = setInterval(function(){
					ufo.position.z+=5;
					if(ufo.position.z >=500){
						clearInterval(ufo.ival2);
						cube.remove(ufo);
					}
			},30);
	}

	//END INITIALIZATION

	function render(){
                renderer.render(scene, camera);
                requestAnimationFrame(render);
	}

	//Function Calls

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
				renderer.domElement.style.cursor = "grab";

        mouseDown = false;
    }
	function onMouseDown(evt){
		evt.preventDefault();
		renderer.domElement.style.cursor = "grabbing";
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
			cube.rotation.z-= deltaX/100;
	}
    function moveScene(deltaX, deltaY) {
			if(camera.position.z > 100 || deltaY > 0){
					camera.position.z += deltaY;
					camera.rotation.x-=deltaY/360;
				}
	}
}
