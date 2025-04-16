import * as THREE from "three"; 
import { MindARThree } from 'mindar-face-three';

document.addEventListener("DOMContentLoaded", () => {
	const start = async() => {

		const mindarThree = new MindARThree({
			container: document.body,
			//uiLoading: "no",
			//uiScanning: "no",
		});
		
		const {renderer, scene, camera} = mindarThree;
		
		var loader = new THREE.TextureLoader();
		
		
		let anchors = [];

		const geometry = new THREE.SphereGeometry( 0.5/50, 32, 16 ); 
		
		for(let i=0; i<468; i++) {
			const anchor = mindarThree.addAnchor(i);
			if(i!=1) {
				const material = new THREE.MeshBasicMaterial( { color: Math.trunc(Math.random()*0xffffff) } ); 
				anchor.group.add(new THREE.Mesh( geometry, material ));
			}
			else {
				const planegeometry = new THREE.PlaneGeometry(204/314.0, 1); // 204:314
				const material = new THREE.MeshBasicMaterial({
					color: 0xffffff,
					map: loader.load("../assets/face2.png")
				});
				const scaler = 1.3;
				const my_face = new THREE.Mesh( planegeometry, material );
				my_face.scale.set(scaler, scaler, scaler);
				my_face.position.set(0, 0.1, 0);
				anchor.group.add(my_face);
			}
			anchors.push(anchor);
		}
		
		//console.log(anchors);

		await mindarThree.start();
		
		// Отримуємо елемент відео
		const video = mindarThree.video;

		video.style.visibility = 'hidden';
	
		renderer.setAnimationLoop(() => {
			renderer.render(scene, camera);
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

