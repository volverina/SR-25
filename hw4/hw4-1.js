import * as THREE from "three"; 
import { MindARThree } from 'mindar-image-three';
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';

document.addEventListener("DOMContentLoaded", () => {
	const start = async() => {

		const mindarThree = new MindARThree({
			container: document.body,
			imageTargetSrc: "../assets/mid_kvad.mind",
			maxTrack: 2,
			//uiLoading: "no",
			//uiScanning: "no",
		});
		
		const {cssRenderer, renderer, cssScene, scene, camera} = mindarThree;

		const anchor1 = mindarThree.addCSSAnchor(0); // 0 - midokalm.png, 1 - kvad.png

		const anchor2 = mindarThree.addAnchor(1); 
		
		anchor2.onTargetFound = () => {
			console.log("ціль 2 виявлена");
		}

		anchor2.onTargetLost = () => {
			console.log("ціль 2 втрачена");
		}
		
		const ar_div = document.getElementById("ar-div");
		
		//console.log(ar_div);
		var player = new Vimeo.Player(ar_div);

		anchor1.onTargetFound = () => {
			console.log("ціль 1 виявлена");
			player.play();//.catch(() => {});;
		}

		anchor1.onTargetLost = () => {
			console.log("ціль 1 втрачена");
			player.pause();
		}
		
		player.on("play", () => {
			video.setCurrentTime(0);
		});
		
		const obj = new CSS3DObject(ar_div);
		anchor1.group.add(obj);
		
		const planematerial2 = new THREE.MeshBasicMaterial({
			color: 0xffffff,
		});
		
		const planegeometry2 = new THREE.PlaneGeometry(16/9, 1); // 1679 / 946 = 1,774841438 = 16/9
		
		const plane2 = new THREE.Mesh(planegeometry2, planematerial2);

		anchor2.group.add(plane2);

		await mindarThree.start();
		renderer.setAnimationLoop(() => {
			renderer.render(scene, camera);
			cssRenderer.render(cssScene, camera);
		});
	}

        const startButton = document.getElementById('startButton');
        const startButtonContainer = document.getElementById('start-button-container');
	
	startButton.addEventListener('click', () => {
       		 startButtonContainer.style.display = 'none'; // Ховаємо кнопку
       		 start(); // Запускаємо AR
	});
	//start();
});

