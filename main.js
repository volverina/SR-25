import * as THREE from "three"; //import * as THREE from "https://unpkg.com/three@0.172.0/build/three.module.min.js";

document.addEventListener("DOMContentLoaded", () => {
	const scene = new THREE.Scene();
	
	const geometry = new THREE.BoxGeometry(1, 1, 1);
	const material = new THREE.MeshBasicMaterial({color: "#0000FF"});
	const cube = new THREE.Mesh(geometry, material);
	
	cube.position.set(0, 0, -2);
	cube.rotation.set(0, Math.PI/4, 0);
	
	scene.add(cube);
	
	const camera = new THREE.PerspectiveCamera();
	camera.position.set(1, 1, 5);
//	camera.rotation.set(0, Math.PI, 0);
	
	const renderer = new THREE.WebGLRenderer({alpha: true});
	renderer.setSize(500, 500);
	renderer.render(scene, camera);
	
	const video = document.createElement("video");
	
	navigator.mediaDevices.getUserMedia({video:true})
	.then((stream) => {
		video.srcObject = stream;
		video.play();
	});
	
	video.style.position = "absolute";
	video.style.width = renderer.domElement.width;
	video.style.height = renderer.domElement.height;
	renderer.domElement.style.position = "absolute";
	
	document.body.appendChild(video);	

	document.body.appendChild(renderer.domElement);
	

});

