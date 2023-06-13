import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function initScene({ minDistance = 100, maxDistance = 500, fov = 100 }) {
	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(
		fov,
		//시야각
		window.innerWidth / window.innerHeight,
		0.1,
		1000
	);
	let renderer = new THREE.WebGLRenderer({
		canvas: document.querySelector('#canvas'),
		antialias: true
	});

	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);

	const controls = new OrbitControls(camera, renderer.domElement);
	controls.minPolarAngle = 0;
	controls.maxPolarAngle = Math.PI / 2;
	controls.minDistance = minDistance;
	controls.maxDistance = maxDistance;

	return { scene, camera, renderer, controls };
}
