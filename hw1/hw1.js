import * as THREE from "three"; //import * as THREE from "https://unpkg.com/three@0.172.0/build/three.module.min.js";
import { MindARThree } from 'mindar-image-three';


document.addEventListener("DOMContentLoaded", () => {
	const mindarThree = new MindARThree({
		container: document.body,
		imageTargetSrc: "../assets/targets.mind",
		maxTrack: 3,
		//uiLoading: "no",
		//uiScanning: "no",
	});
	
        const {renderer, scene, camera} = mindarThree;
        const anchor = mindarThree.addAnchor(2); // 0 - marker_real_dark.png, 1 - marker_real_light.png, 2 - midokalm.png

	const geometry = new THREE.BoxGeometry(1, 1, 1);
	const material = new THREE.MeshBasicMaterial({color: "#0000FF"});
	const cube = new THREE.Mesh(geometry, material);
	
	cube.position.set(0, 1, -10);
	cube.rotation.set(0, Math.PI/4, 0);
	
	anchor.group.add(cube);

	const geometry_capsule = new THREE.CapsuleGeometry( 1, 1, 4, 8 ); 
	const material_capsule = new THREE.MeshBasicMaterial( {color: 0x00ff00} ); 
	const capsule = new THREE.Mesh( geometry_capsule, material_capsule ); 

	capsule.scale.set(0.25, 0.25, 0.25);
	anchor.group.add(capsule);
	
	const geometry_circle = new THREE.CircleGeometry( 0.5, 32 ); 
	const material_circle = new THREE.MeshBasicMaterial( { color: 0xffff00 } ); 
	const circle = new THREE.Mesh( geometry_circle, material_circle ); 

	circle.position.set(-1, 0, 0);

	anchor.group.add(circle);

	const start = async() => {
		await mindarThree.start();
		renderer.setAnimationLoop(() => {
			renderer.render(scene, camera);
		});
	}
	
	start();

/*
	
	camera.position.set(1, 1, 5);
//	camera.rotation.set(0, Math.PI, 0);
*/
});

