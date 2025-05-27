import * as THREE from "three"; 
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";


document.addEventListener("DOMContentLoaded", () => {
	const initialize = async() => {
	
		const arButton = document.querySelector("#ar-button");
		
		const supported = navigator.xr && await navigator.xr.isSessionSupported("immersive-ar");
		
		if (!supported) {
			arButton.textContent = "WebXR не пiдтримується";
			arButton.disabled = true;
			return;
		}
		else
			console.log("WebXR пiдтримується");
			
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
		
		const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
		scene.add(light);


		renderer.xr.addEventListener("sessionstart", (e) => {
			console.log("Сесiю WebXR розпочато");
		});
		
		renderer.xr.addEventListener("sessionend", () => {
			console.log("Сесiю WebXR завершено");
		});
		
		let currentSession = null;
		
		const start = async() => {
			currentSession = await navigator.xr.requestSession("immersive-ar",
				{
					optionalFeatures: ["dom-overlay"],
					domOverlay: {root: document.body}
				}
			);
			console.log(currentSession);
			
			renderer.xr.enabled = true;
			renderer.xr.setReferenceSpaceType("local");
			await renderer.xr.setSession(currentSession);
			
			arButton.textContent = "Завершити сесію WebXR";
			
			renderer.setAnimationLoop(() => {
				if(renderer.xr.isPresenting)
					renderer.render(scene, camera);
			});
		}
		
		const end = async() => {
			currentSession.end();
			renderer.setAnimationLoop(null);
			renderer.clear();
			arButton.style.display = "none";
		}
		
		arButton.addEventListener("click", () => {
			if (!currentSession) {
				start();
			} else {
				end();
			}
		});
	
	}
	
	initialize();
});

