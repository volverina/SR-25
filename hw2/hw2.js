import * as THREE from "three"; //import * as THREE from "https://unpkg.com/three@0.172.0/build/three.module.min.js";
import { MindARThree } from 'mindar-image-three';
//"three/addons/": "https://unpkg.com/three@0.161.0/examples/jsm/",
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
//import { GLTFLoader } from "https://unpkg.com/three@0.161.0/examples/jsm/loaders/GLTFLoader.js";
//import {loadAudio} from "../lib/loader.js";



document.addEventListener("DOMContentLoaded", () => {
	const mindarThree = new MindARThree({
		container: document.getElementById("place"), //document.querySelector("#places"),
		imageTargetSrc: "../assets/face_etc.mind",
		maxTrack: 3,
		//uiLoading: "no",
		//uiScanning: "no",
	});
	
        const {renderer, scene, camera} = mindarThree;
        const anchorShelf = mindarThree.addAnchor(1); // 0 - face.png, 1 - shelf.png, 2 - china.png, 3 - man.png
        const anchorChina = mindarThree.addAnchor(2); // 0 - face.png, 1 - shelf.png, 2 - china.png, 3 - man.png
        const anchorMAN = mindarThree.addAnchor(0); // 0 - face.png, 1 - shelf.png, 2 - china.png, 3 - man.png
        
        let anchorShelfvisible = false, anchorChinavisible = false,  anchorMANvisible = false;
        
        anchorShelf.onTargetFound = () => {
		console.log("ціль Shelf виявлена");
		anchorShelfvisible = true;
	}

	anchorShelf.onTargetLost = () => {
		console.log("ціль Shelf втрачена");
		anchorShelfvisible = false;
	}

	const listener = new THREE.AudioListener();
	camera.add(listener);
	
	/*
	// instantiate audio object
	const pianoSound = new THREE.Audio( listener );
	// add the audio object to the scene
	scene.add( pianoSound );
	*/
	const pianoSound = new THREE.PositionalAudio(listener);
	// add the audio object to the scene
	anchorChina.group.add( pianoSound );
	
	pianoSound.setRefDistance(100);
	
	listener.setMasterVolume( 2.0 * listener.getMasterVolume() );
	
	//let piano = false;
        
       	const audioloader = new THREE.AudioLoader();
	audioloader.load(
		// resource URL
		"https://ia800606.us.archive.org/23/items/lp_piano-roll-rockn-roll_j-lawrence-cook/disc1/01.01.%20Rock%20Around%20The%20Clock.mp3",

		// onLoad callback
		function ( sound ) {
			//piano = sound;
			// set the audio object buffer to the loaded object
			pianoSound.setBuffer(sound);
			pianoSound.setLoop(true);
			//pianoSound.setLoopStart(47000);
			pianoSound.offset = 47;
			// play the audio
			//piano.play();
		},

		// onProgress callback
		function ( xhr ) {
			console.log( (xhr.loaded / xhr.total * 100) + '% audio loaded' );
		},

		// onError callback
		function ( err ) {
			console.log( 'An audio load error happened' );
		}
	);
	
        
        anchorChina.onTargetFound = () => {
		console.log("ціль China виявлена");
		anchorChinavisible = true;
//		if(piano)
		pianoSound.play();
	}

	anchorChina.onTargetLost = () => {
		console.log("ціль China втрачена");
		anchorChinavisible = false;
//		if(piano)
		pianoSound.pause();
	}
        
        anchorMAN.onTargetFound = () => {
		console.log("ціль MAN виявлена");
		anchorMANvisible = true;
	}

	anchorMAN.onTargetLost = () => {
		console.log("ціль MAN втрачена");
		anchorMANvisible = false;
	}
	
        var light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
	scene.add(light);
        
        var loader = new THREE.TextureLoader();
        const image1 = loader.load("../assets/china.png");
        const image2 = loader.load("../assets/face.jpeg");
        const image3 = loader.load("../assets/man.png");
        
        let mixer = false;
        
        const modelloader = new GLTFLoader();
        //...
        // Load a glTF resource
	modelloader.load(
		// resource URL
		'../assets/phoenix_bird.glb',
		//"../assets/raccoon/scene.gltf",
		// called when the resource is loaded
		function ( model ) {

			//scene.add( model.scene );
			model.scene.scale.set(0.005, 0.005, 0.005);
			model.scene.position.set(0, 0, 0);
			//anchorShelf.group.add( model.scene );
			anchorChina.group.add( model.scene );
			
			mixer = new THREE.AnimationMixer(model.scene);
			console.log(mixer);

			//model.scene; // THREE.Group
			//model.scenes; // Array<THREE.Group>
			//model.cameras; // Array<THREE.Camera>
			//model.asset; // Object
			console.log(model);
			//model.animations; // Array<THREE.AnimationClip>
			if(model.animations.length != 0) {
				console.log("animated model");
				const action = mixer.clipAction(model.animations[0]);
				action.play();
			}

		},
		// called while loading is progressing
		function ( xhr ) {

			console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

		},
		// called when loading has errors
		function ( error ) {

			console.log( 'An error happened' );

		}
	);

	const geometry = new THREE.BoxGeometry(1, 1, 1);
	const material = new THREE.MeshBasicMaterial({color: "#0000FF", map: image1});
	const cube = new THREE.Mesh(geometry, material);
	
	cube.position.set(0, 1, -10);
	cube.rotation.set(0, Math.PI/4, 0);
	
	anchorShelf.group.add(cube);

	const geometry_capsule = new THREE.CapsuleGeometry( 1, 1, 4, 8 ); 
	const material_capsule = new THREE.MeshBasicMaterial( {color: 0x00ff00, map: image2} ); 
	const capsule = new THREE.Mesh( geometry_capsule, material_capsule ); 

	capsule.scale.set(0.25, 0.25, 0.25);
	anchorChina.group.add(capsule);
	
	const geometry_circle = new THREE.CircleGeometry( 0.5, 32 ); 
	const material_circle = new THREE.MeshBasicMaterial( { color: 0xffff00, map: image3 } ); 
	const circle = new THREE.Mesh( geometry_circle, material_circle ); 

	circle.position.set(-1, 0, 0);

	anchorMAN.group.add(circle);
	
	let phi = 0;
	
	const clock = new THREE.Clock();
	

	const start = async() => {
		await mindarThree.start();
		renderer.setAnimationLoop(() => {
			if(anchorChinavisible) {
				const delta = clock.getDelta();
				if(mixer)
					mixer.update(delta);
			}
			if(anchorChinavisible && anchorShelfvisible)
				;
			else
				if(anchorShelfvisible) {
					cube.rotation.set(phi, Math.PI/4+phi/3, phi/2);
					phi = phi + 3*Math.PI/180;
				}
			renderer.render(scene, camera);
		});
	}
	
	start();

/*
	
	camera.position.set(1, 1, 5);
//	camera.rotation.set(0, Math.PI, 0);
*/
});

