import * as THREE from "three"; 
import { ARButton } from 'three/addons/webxr/ARButton.js';

function getRandomInt(max) {
  return Math.trunc(Math.random() * max);
}

document.addEventListener("DOMContentLoaded", () => {
	const initialize = async() => {
	
		const scene = new THREE.Scene();
		
		const camera = new THREE.PerspectiveCamera(70,
			window.innerWidth / window.innerHeight, 0.01, 6);

		const renderer = new THREE.WebGLRenderer({
			antialias: true, alpha: true
		});
	
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.setPixelRatio(window.devicePixelRatio);

		document.body.appendChild(renderer.domElement);
		
		const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
		scene.add(light);
		
		renderer.xr.enabled = true;
		
		renderer.xr.addEventListener("sessionstart", (e) => {
			console.log("Сесiю WebXR розпочато");
		});
		
		renderer.xr.addEventListener("sessionend", () => {
			console.log("Сесiю WebXR завершено");
		});

		const controller = renderer.xr.getController(0);
		
		scene.add(controller);
		
		/*
		controller.addEventListener("selectstart", () => {

		});
		
		controller.addEventListener("select", () => {

		});
		*/
		
		controller.addEventListener("selectend", () => {
			const choice = getRandomInt(3);
			let geometry = null;
			
			if (choice == 0 ) // сферу
				geometry = new THREE.SphereGeometry(0.03, 32, 16 ); 
			else if (choice == 1 )
				geometry = new THREE.BoxGeometry(0.06, 0.06, 0.06);
			else	// тор
				geometry = new THREE.TorusGeometry( 0.03, 0.006, 16, 100 ); 
			const material = new THREE.MeshBasicMaterial({color: getRandomInt(0xffffff)});
			const mesh = new THREE.Mesh(geometry, material);
			
			mesh.position.applyMatrix4(controller.matrixWorld);
			mesh.quaternion.setFromRotationMatrix(controller.matrixWorld);
			
			scene.add(mesh);
		});
		
		
		renderer.setAnimationLoop(() => {
			if(renderer.xr.isPresenting)
				renderer.render(scene, camera);
		});
		
		const arButton = ARButton.createButton(renderer, {
			optionalFeatures: ["dom-overlay"],
			domOverlay: {root: document.body}
		});
		
		document.body.appendChild(arButton);
		
	}
	
	initialize();
});

