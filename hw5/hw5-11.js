import * as THREE from "three"; 
import { MindARThree } from 'mindar-face-three';
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";


const capture = (mindarThree) => {
	const {video, renderer, scene, camera} = mindarThree;
	
	const renderCanvas = renderer.domElement;
	
	const canvas = document.createElement('canvas');
	const context = canvas.getContext("2d");
	
	/*
	context.font = "20px Georgia";
	// Create gradient
	const gradient = context.createLinearGradient(0, 0, 150, 0);
	gradient.addColorStop("0", "magenta");
	gradient.addColorStop("0.5", "blue");
	gradient.addColorStop("1.0", "red");

	const d = new Date();

	// Fill with gradient
	context.fillStyle = gradient;
	context.fillText(""+d.getTime(), 10, 50);	
	*/

	canvas.width = renderCanvas.width;
	canvas.height = renderCanvas.height;
	
	const sx = (video.clientWidth - renderCanvas.clientWidth) / 2 * video.videoWidth / video.clientWidth;
	const sy = (video.clientHeight - renderCanvas.clientHeight) / 2 * video.videoHeight / video.clientHeight;
	const sw = video.videoWidth - sx * 2;
	const sh = video.videoHeight - sy * 2;
	
	context.drawImage(video, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
	
	renderer.preserveDrawingBuffer = true;
	renderer.render(scene, camera);

	context.drawImage(renderCanvas, 0, 0, canvas.width, canvas.height);

	renderer.preserveDrawingBuffer = false;
	
	const dataURL = canvas.toDataURL("image/png");
	//console.log(dataURL);
	const link = document.createElement("a");
	link.download = "photo.png";
	link.href = dataURL;
	link.click();
}


document.addEventListener("DOMContentLoaded", () => {

	const start = async() => {

		const mindarThree = new MindARThree({
			container: document.body,
		});
		
		const {renderer, scene, camera} = mindarThree;

		const anchor = mindarThree.addAnchor(10);
		
		const loader = new GLTFLoader();

		const light1 = new THREE.AmbientLight( 0xffffff, 1.5 ); // soft white light
		scene.add( light1 );
		
		var light2 = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
		scene.add(light2);
		
		// Load a glTF resource
		loader.load(
			// resource URL
			'../assets/luffy_hat.glb',
			// called when the resource is loaded
			function ( gltf ) {
				anchor.group.add(gltf.scene);
				gltf.scene.renderOrder = 1;
				// scale?
				// position?
				// rotation?
			},
			// called while loading is progressing
			function ( xhr ) {
				console.log( ( xhr.loaded / xhr.total * 100 ) + "% of Luffy's hat loaded" );
			},
			// called when loading has errors
			function ( error ) {
				console.log( 'An error happened (Luffy\'s hat)' );
			}
		);
		
		loader.load(
			// resource URL
			'../assets/head-occluder-1-8ns1sijd87.glb',
			// called when the resource is loaded
			function ( model ) {
				anchor.group.add(model.scene);
				model.scene.scale.set(0.9, 0.9, 0.85);
				model.scene.position.set(0, -0.35, -0.1);
				const occluderMaterial = new THREE.MeshBasicMaterial({colorWrite: false});
				model.scene.renderOrder = 0;
				model.scene.traverse((o) => {
					if (o.isMesh) {
						o.material = occluderMaterial;
					}
				});

				// obj.scene.scale?
				// obj.scene.position?
				// rotation?
			},
			// called while loading is progressing
			function ( xhr ) {
				console.log( ( xhr.loaded / xhr.total * 100 ) + '% of head loaded' );
			},
			// called when loading has errors
			function ( error ) {
				console.log( 'An error happened (head)' );
			}
		);
		
		const faceMesh = mindarThree.addFaceMesh();
		//faceMesh.material.wireframe = true;
		scene.add(faceMesh);
		
		faceMesh.material.map = new THREE.TextureLoader().load('../assets/moustache1.png' ); 
		faceMesh.material.transparent = true;
		faceMesh.material.needsUpdate = true;
		

		await mindarThree.start();
		
		document.querySelector("#switch").addEventListener("click", () => {
			mindarThree.switchCamera();
		});
		
		document.querySelector("#capture").addEventListener("click", () => {
			capture(mindarThree);
		});
		
		// Отримуємо елемент відео
		const video = mindarThree.video;

		//video.style.visibility = 'hidden';

	
		renderer.setAnimationLoop(() => {
			renderer.render(scene, camera);
		});
	}


	start(); // Запускаємо AR
});

