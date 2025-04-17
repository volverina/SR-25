import * as THREE from "three"; 
import { MindARThree } from 'mindar-face-three';

document.addEventListener("DOMContentLoaded", () => {

	const start = async() => {

		const mindarThree = new MindARThree({
			container: document.body,
		});
		
		const {renderer, scene, camera} = mindarThree;

		const anchor = mindarThree.addAnchor(10);

		//anchor.group.add(new THREE.Mesh( geometry, material ));
		
		//var loader = new THREE.TextureLoader();
		

		await mindarThree.start();
	
		renderer.setAnimationLoop(() => {
			renderer.render(scene, camera);
		});
	}

	start(); // Запускаємо AR
});

