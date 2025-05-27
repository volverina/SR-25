import * as THREE from "three"; 
import { ARButton } from 'three/addons/webxr/ARButton.js';
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";


document.addEventListener("DOMContentLoaded", () => {
	const initialize = async() => {
	
		const scene = new THREE.Scene();
		
		const camera = new THREE.PerspectiveCamera();

		const renderer = new THREE.WebGLRenderer({
			antialias: true, alpha: true
		});
	
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.setPixelRatio(window.devicePixelRatio);

		document.body.appendChild(renderer.domElement);
		
		const loader = new GLTFLoader();

		// Load a glTF resource
		loader.load(
			// resource URL
			'../assets/solar_system/space.gltf',
			// called when the resource is loaded
			function ( gltf ) {
				//gltf.scene.renderOrder = 1;
				// scale?
				// position?
				gltf.scene.position.set(0, 0, -0.3);
				// rotation?
				scene.add(gltf.scene);
			},
			// called while loading is progressing
			function ( xhr ) {
				console.log( ( xhr.loaded / xhr.total * 100 ) + "% of SS loaded" );
			},
			// called when loading has errors
			function ( error ) {
				console.log( 'An error happened (SS)' );
			}
		);
		
		/*
		const geometry = new THREE.BoxGeometry(0.06, 0.06, 0.06);
		const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
		const mesh = new THREE.Mesh(geometry, material);
		mesh.position.set(0, 0, -0.3);
		
		scene.add(mesh);
		*/

		const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
		scene.add(light);
		
		renderer.xr.enabled = true;
		
	
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

