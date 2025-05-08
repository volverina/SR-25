import * as THREE from "three"; 
import { ARButton } from 'three/addons/webxr/ARButton.js';


document.addEventListener("DOMContentLoaded", () => {
	const initialize = async() => {
	
		const eventsDiv = document.querySelector("#events");
	
		const scene = new THREE.Scene();
		
		const camera = new THREE.PerspectiveCamera();

		const renderer = new THREE.WebGLRenderer({
			antialias: true, alpha: true
		});
	
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.setPixelRatio(window.devicePixelRatio);

		document.body.appendChild(renderer.domElement);
		
		const geometry = new THREE.BoxGeometry(0.06, 0.06, 0.06);
		const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
		const mesh = new THREE.Mesh(geometry, material);
		mesh.position.set(0, 0, -0.3);
		
		scene.add(mesh);

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
		
		controller.addEventListener("selectstart", () => {
			eventsDiv.prepend("Надійшла подія selectstart\n");
		});
		
		controller.addEventListener("selectend", () => {
			eventsDiv.prepend("Надійшла подія selectend\n");
		});
		
		controller.addEventListener("select", () => {
			eventsDiv.prepend("Надійшла подія select\n");
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

