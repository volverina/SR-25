import * as THREE from 'three';
import { MindARThree } from 'mindar-face-three';
import * as faceapi from 'face-api';


document.addEventListener("DOMContentLoaded", () => {
  const start = async() => {
    // 1. Set up MindAR
    const mindarThree = new MindARThree({
      container: document.body,
      //uiLoading: "no", uiScanning: "no", uiError: "no",
    });
    const {renderer, scene, camera} = mindarThree;
    
    const stopButton = document.getElementById('stop');
    
    // 2. Add result display
    const result = document.getElementById("result");
    result.style.position = "absolute";
    result.style.top = "0";
    result.style.left = "0";
    result.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    result.style.color = "white";
    result.style.padding = "10px";
    result.style.fontSize = "14px";
    result.style.fontFamily = "monospace";
    result.style.maxWidth = "100%";
    result.style.maxHeight = "100%";
    result.style.overflow = "auto";

    // model load
    URL = "https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.15/model/";
    await faceapi.nets.ssdMobilenetv1.loadFromUri(URL);
    await faceapi.nets.faceLandmark68Net.loadFromUri(URL);
    await faceapi.nets.ageGenderNet.loadFromUri(URL);

    result.innerHTML = "Our model loaded";
    
    // 4. Start MindAR
    await mindarThree.start();
    let isStop = false;

    stopButton.addEventListener('click', () => {
    	mindarThree.stop();
    	isStop = true;
    	renderer.setAnimationLoop( null );
    	result.innerHTML = "";
    });


    // 5. Process video frames
    const video = mindarThree.video;
    const SKIP = 5; // Process every 20th frame for better performance
    let count = 1;
    
    console.log(faceapi.nets);
    
    // Animation loop
    renderer.setAnimationLoop(async () => {
    	if(isStop)
    		renderer.setAnimationLoop( null );
    
      if (count % SKIP === 0) {
      		//get prediction
      		const detectionsWithAgeAndGender = await faceapi.detectAllFaces(video).withFaceLandmarks().withAgeAndGender();
      		//console.log(detectionsWithAgeAndGender);
                //const prediction = await model.predict(video);
                const age = Math.round(detectionsWithAgeAndGender[0].age);
                const gender = detectionsWithAgeAndGender[0].gender;
                const gprob = Math.round(100*detectionsWithAgeAndGender[0].genderProbability);
                
                //visualise prediction
                result.innerHTML = "Вік - " + age + "<br>" +
                			"Стать - " + ((gender == "male") ? "чоловіча" : "жіноча") + "<br>" +
                			"Імовірність статі - " + gprob + "<br>";
                
      }
      count++;
      renderer.render(scene, camera);
    });
  };
  
  start();
});

