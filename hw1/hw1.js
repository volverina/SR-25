import * as THREE from "three"; //import * as THREE from "https://unpkg.com/three@0.172.0/build/three.module.min.js";
import { MindARThree } from 'mindar-image-three';


document.addEventListener("DOMContentLoaded", () => {
	const mindarThree = new MindARThree({
		container: document.body,
		imageTargetSrc: "../assets/face_etc.mind",
		maxTrack: 3,
		//uiLoading: "no",
		//uiScanning: "no",
	});
	
        const {renderer, scene, camera} = mindarThree;
        const anchorShelf = mindarThree.addAnchor(1); // 0 - face.png, 1 - shelf.png, 2 - china.png, 3 - man.png

	const geometry = new THREE.BoxGeometry(1, 1, 1);
	const material = new THREE.MeshBasicMaterial({color: "#0000FF"});
	const cube = new THREE.Mesh(geometry, material);
	
	cube.position.set(0, 1, -10);
	cube.rotation.set(0, Math.PI/4, 0);
	
	anchorShelf.group.add(cube);

	const geometry_capsule = new THREE.CapsuleGeometry( 1, 1, 4, 8 ); 
	const material_capsule = new THREE.MeshBasicMaterial( {color: 0x00ff00} ); 
	const capsule = new THREE.Mesh( geometry_capsule, material_capsule ); 

	capsule.scale.set(0.25, 0.25, 0.25);
        const anchorChina = mindarThree.addAnchor(2); // 0 - face.png, 1 - shelf.png, 2 - china.png, 3 - man.png
	anchorChina.group.add(capsule);
	
	const geometry_circle = new THREE.CircleGeometry( 0.5, 32 ); 
	const material_circle = new THREE.MeshBasicMaterial( { color: 0xffff00 } ); 
	const circle = new THREE.Mesh( geometry_circle, material_circle ); 

	circle.position.set(-1, 0, 0);

        const anchorMAN = mindarThree.addAnchor(3); // 0 - face.png, 1 - shelf.png, 2 - china.png, 3 - man.png
	anchorMAN.group.add(circle);

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

