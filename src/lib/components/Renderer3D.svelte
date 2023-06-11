<script>
	import { onMount } from 'svelte';
	import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
	import * as THREE from 'three';

	export let modelPath; // 모델 파일의 경로
	export let cameraSettings = {}; // 카메라 설정
	export let orbitSettings = {}; // 오빗 설정

	let scene, camera, renderer, model, controls, loaderElement;

	onMount(() => {
		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(
			cameraSettings.viewAngle || 75,
			window.innerWidth / window.innerHeight,
			0.1,
			1000
		);

		renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(window.innerWidth, window.innerHeight);

		controls = new OrbitControls(camera, renderer.domElement);
		controls.minPolarAngle = orbitSettings.minPolarAngle || 0;
		controls.maxPolarAngle = orbitSettings.maxPolarAngle || Math.PI / 2;
		controls.minDistance = orbitSettings.minDistance || 1;
		controls.maxDistance = orbitSettings.maxDistance || 1000;

		window.addEventListener(
			'resize',
			() => {
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize(window.innerWidth, window.innerHeight);
			},
			false
		);

		document.body.appendChild(renderer.domElement);

		const loader = new GLTFLoader();
		loader.load(
			modelPath,
			(gltf) => {
				model = gltf.scene;
				scene.add(model);
				loaderElement.style.opacity = '0';
			},
			undefined,
			(error) => console.error(error)
		);

		camera.position.set(0, 0, 5);

		function animate() {
			requestAnimationFrame(animate);
			renderer.render(scene, camera);
		}

		animate();
	});
</script>

<div id="loader" bind:this={loaderElement}>loading...</div>

<style>
	#loader {
		width: 0;
		height: 20px;
		background-color: #023047;

		transition: width 0.5s, opacity 2s;
		opacity: 1;
	}
</style>
