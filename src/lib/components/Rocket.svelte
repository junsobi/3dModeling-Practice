<script>
	import { onMount } from 'svelte';
	import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
	import * as THREE from 'three';
	import { playing } from '$lib/store/store';
	import { initScene } from './sceneInit.js';
	import { animateCloseUp, animateRocket, animateCircle } from './animations.js';

	let scene, camera, renderer, rocket, circleMesh, controls, loaderElement;
	// scene은 3d 객체 빛을 담는 공간, 카메라는 환경을 어떻게볼것인지 정의 , renderer는 3d를 그리는역할
	let isMovingUp = true;
	let initialYPosition = 0;
	let isScaling = true;
	let scale = 0.01;

	onMount(() => {
		({ scene, camera, renderer, controls } = initScene({
			navHeight: 30,
			minDistance: 100,
			maxDistance: 500,
			fov: 75
		}));
		//초기세팅관련된 파일
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
		// 랜더러를 돔에 올리는 기능(appendchild)

		const loader = new GLTFLoader();
		//로더는 gltf파일로 만들어진 로켓이다

		loader.load(
			'/3dModeling/rocket.gltf', // GLTF 파일 위치
			(gltf) => {
				rocket = gltf.scene; // 로드한 모델을 rocket 변수에 저장
				loaderElement.style.opacity = '0';
				scene.add(rocket); // 로드한 모델을 scene에 추가

				initialYPosition = rocket.position.y; // 초기 Y 위치 저장
			},
			(progress) => {
				const percentage = (progress.loaded / progress.total) * 100;
				loaderElement.style.width = `${percentage}%`;
			},
			(error) => console.error(error)
		);

		camera.position.set(4, 10, 350);

		const light = new THREE.PointLight(0xffffff, 1, 1000);
		light.position.set(0, 0, 500);
		scene.add(light);

		const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
		scene.add(ambientLight);

		const circleGeometry = new THREE.CircleGeometry(500, 100); // 반지름과 세그먼트
		const color = new THREE.Color('#69b4ff');
		const circleMaterial = new THREE.MeshLambertMaterial({ color: color });

		const circleMesh = new THREE.Mesh(circleGeometry, circleMaterial);
		circleMesh.position.set(0, 0, -100);
		scene.add(circleMesh);

		let time = 0;
		function animate() {
			requestAnimationFrame(animate);
			time += 0.05;
			isMovingUp = animateRocket(rocket, isMovingUp, initialYPosition, $playing);
			[scale, isScaling] = animateCloseUp(rocket, scale, isScaling);
			animateCircle(time, circleMesh, $playing);
			renderer.render(scene, camera);
		}
		animate();

		loaderElement.addEventListener('transitionend', () => {
			if (loaderElement.style.opacity === '0') {
				loaderElement.style.display = 'none';
			}
		});
	});
</script>

<div id="loader" bind:this={loaderElement}>loading...</div>
<canvas id="canvas" />

<style>
	#loader {
		width: 0;
		height: 20px;
		background-color: #023047;

		transition: width 0.5s, opacity 2s;
		opacity: 1;
	}
</style>
