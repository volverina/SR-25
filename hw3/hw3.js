import * as THREE from "three"; 
import { MindARThree } from 'mindar-image-three';
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const loadVideo = (path) => {
	return new Promise((resolve, reject) => {
		const video = document.createElement("video");
		video.addEventListener("loadeddata", () => {
			video.setAttribute("playsinline", "");
			resolve(video);
		});
		video.src = path;
	});
}

document.addEventListener("DOMContentLoaded", () => {
	const start = async() => {

		const mindarThree = new MindARThree({
			container: document.body,
			imageTargetSrc: "../assets/cap_china.mind",
			maxTrack: 2,
			//uiLoading: "no",
			//uiScanning: "no",
		});
		
		const {renderer, scene, camera} = mindarThree;
		const anchorCap = mindarThree.addAnchor(0); // 0 - cap.png, 1 - china.png
		const anchorChina = mindarThree.addAnchor(1); 
		
		anchorChina.onTargetFound = () => {
			console.log("ціль China виявлена");
		}

		anchorChina.onTargetLost = () => {
			console.log("ціль China втрачена");
		}
		
		var light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
		scene.add(light);
		
		const modelloader = new GLTFLoader();
		
		let ship = false;
		
		// Load a glTF resource
		modelloader.load(
			'../assets/cruise_ship.glb',
			// called when the resource is loaded
			function ( model ) {
				ship = model.scene;
				//scene.add( model.scene );
				model.scene.scale.set(0.0001, 0.0001, 0.0001);
				model.scene.position.set(0, 1, 0);
				model.scene.rotation.set(0, Math.PI/2, 0);
				anchorChina.group.add( model.scene );
			},
			// called while loading is progressing
			function ( xhr ) {
				console.log( ( xhr.loaded / xhr.total * 100 ) + '% of model loaded' );

			},
			// called when loading has errors
			function ( error ) {

				console.log( 'An error happened while model loading' );

			}
		);

		//const video = await loadVideo("../assets/atlantic ocean.mp4");
		const video = document.getElementById( 'ocean' );

		const videotexture = new THREE.VideoTexture(video);

		const planematerial = new THREE.MeshBasicMaterial({
			//color: 0xffffff,
			map: videotexture
		});
		
		const planegeometry = new THREE.PlaneGeometry(16/9, 1); // 1679 / 946 = 1,774841438 = 16/9
		
		const plane = new THREE.Mesh(planegeometry, planematerial);
		
		anchorCap.group.add(plane);
		
		anchorCap.onTargetFound = () => {
			console.log("ціль Cap виявлена");
			video.play();
		}

		anchorCap.onTargetLost = () => {
			console.log("ціль Cap втрачена");
			video.pause();
		}
		
		

		let number = 0;
		
		document.body.addEventListener("click", (e) => {
			const mouseX = ( e.clientX / window.innerWidth ) * 2 - 1;
			const mouseY = - ( ( e.clientY / window.innerHeight ) * 2 - 1 );
			const mouse = new THREE.Vector2(mouseX, mouseY);
			
			console.log("ship", ship);
			
			const raycaster = new THREE.Raycaster();
			raycaster.setFromCamera(mouse, camera);
			
			const intersects=raycaster.intersectObjects(scene.children,true);
			
			if(intersects.length>0) {
				// обрати найближчий до позиції миші об’єкт
				let o = intersects[0].object;
				//console.log(intersects);
				//console.log("o start", o);
				
				// доки цей об’єкт не є кореневий
				//while(o.parent)
				// підіймаємось по ієрархії об’єктів Three.js вгору
				//	o = o.parent;
				//console.log("o end", o);
				// якщо це відслідковуваний об'єкт та ще й той, що треба
				//if(o === ship) {
				// виконуємо певну дію по даній події
				// тут буде опрацьовуватись подія
					number += Math.random() * (90-45) + 45;
					//console.log(number);
					ship.rotation.set(0, 0, number * Math.PI/180);
				//}
			}
		});

		await mindarThree.start();
		renderer.setAnimationLoop(() => {
			renderer.render(scene, camera);
		});
	}
	
	start();
});

