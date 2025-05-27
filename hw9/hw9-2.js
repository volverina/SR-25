import * as THREE from "three"; 
import { ARButton } from 'three/addons/webxr/ARButton.js';
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";


function getRandomInt(max) {
  return Math.trunc(Math.random() * max);
}


// https://chatgpt.com/share/68259f29-f2c4-8000-9340-917a2835279c
function deep_copy(model) {
    const clone = model.clone(true); // клонування з дітьми

    clone.traverse((node) => {
        // Клонування геометрії
        if (node.geometry) {
            node.geometry = node.geometry.clone();
        }

        // Клонування матеріалу
        if (node.material) {
            if (Array.isArray(node.material)) {
                node.material = node.material.map(mat => mat.clone());
            } else {
                node.material = node.material.clone();
            }

            // Клонування текстур (опціонально)
            if (node.material.map) {
                node.material.map = node.material.map.clone();
                node.material.map.needsUpdate = true;
            }
        }
    });

    return clone;
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
		
		const loader = new GLTFLoader();
		
		let model1 = null, model2 = null, model3 = null;
			
		// Load a glTF resource
		loader.load(
			// resource URL
			'../assets/cruise_ship.glb',
			// called when the resource is loaded
			function ( gltf ) {
				//gltf.scene.renderOrder = 1;
				// scale?
				// position?
				gltf.scene.scale.set(0.0001, 0.0001, 0.0001);
				//gltf.scene.position.set(0, 0, -0.3);
				// rotation?
				//scene.add(gltf.scene);
				model1 = gltf.scene;
			},
			// called while loading is progressing
			function ( xhr ) {
				console.log( ( xhr.loaded / xhr.total * 100 ) + "% of m1 loaded" );
			},
			// called when loading has errors
			function ( error ) {
				console.log( 'An error happened (m1)' );
			}
		);
		
		loader.load(
			// resource URL
			'../assets/luffy_hat.glb',
			// called when the resource is loaded
			function ( gltf ) {
				//gltf.scene.renderOrder = 1;
				// scale?
				// position?
				gltf.scene.scale.set(0.0001, 0.0001, 0.0001);
				//gltf.scene.position.set(0, 0, -0.3);
				// rotation?
				//scene.add(gltf.scene);
				model2 = gltf.scene;
			},
			// called while loading is progressing
			function ( xhr ) {
				console.log( ( xhr.loaded / xhr.total * 100 ) + "% of m2 loaded" );
			},
			// called when loading has errors
			function ( error ) {
				console.log( 'An error happened (m2)' );
			}
		);
		

		loader.load(
			// resource URL
			'../assets/phoenix_bird.glb',
			// called when the resource is loaded
			function ( gltf ) {
				//gltf.scene.renderOrder = 1;
				// scale?
				// position?
				gltf.scene.scale.set(0.005, 0.005, 0.005);
				//gltf.scene.position.set(0, 0, -0.3);
				// rotation?
				//scene.add(gltf.scene);
				model3 = gltf.scene;
			},
			// called while loading is progressing
			function ( xhr ) {
				console.log( ( xhr.loaded / xhr.total * 100 ) + "% of m3 loaded" );
			},
			// called when loading has errors
			function ( error ) {
				console.log( 'An error happened (m3)' );
			}
		);
		



		
		controller.addEventListener("selectend", () => {
			const choice = getRandomInt(3);
			let model;
			
			if (choice == 0 ) 
				model = model1;
			else if (choice == 1 )
				model = model2;
			else	
				model = model3;
			const mesh = deep_copy(model);
			
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

