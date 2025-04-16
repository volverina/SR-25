
export const loadAudio = (path) => {
	return new Promise((resolve, reject) => {
		const loader = new THREE.AudioLoader();
		loader.load(path, (buffer) => {
			resolve(buffer);
		});
	});
};
