<script>
	import { onMount } from 'svelte';
	import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
	import * as THREE from 'three';

	let scene, camera, renderer, rocket, controls, loaderElement;
	let isMovingUp = true;
	let initialYPosition = 0;
	// scene은 3d 객체 빛을 담는 공간, 카메라는 환경을 어떻게볼것인지 정의 , renderer는 3d를 그리는역할

	onMount(() => {
		//dom이 완전히 로드된후에 three.js가 작동되도록 온마운트에 담는다
		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000);
		renderer = new THREE.WebGLRenderer({ antialias: true });
		//scene, camera, renderer를 초기화, perspectivecamera : 시야각, 화면비율, 근접클리핑평면, 원근클리핑평면
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(window.innerWidth, window.innerHeight);
		// 랜더링 사이즈

		controls = new OrbitControls(camera, renderer.domElement);
		controls.minPolarAngle = 0; // 카메라를 y축 밑으로 못가게함
		controls.maxPolarAngle = Math.PI / 2; // y축 위로 못움직이게함
		controls.minDistance = 100; // 카메라 최소 범위
		controls.maxDistance = 500; // 카메라 최대범위

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

				scene.add(rocket); // 로드한 모델을 scene에 추가
				loaderElement.style.opacity = '0';

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

		const circleGeometry = new THREE.CircleGeometry(500, 200); // 반지름과 세그먼트
		const color = new THREE.Color('#69b4ff');
		const circleMaterial = new THREE.MeshLambertMaterial({ color: color });

		const circleMesh = new THREE.Mesh(circleGeometry, circleMaterial);
		circleMesh.position.set(0, 0, -100);
		scene.add(circleMesh);

		let time = 0;
		function animate() {
			requestAnimationFrame(animate);
			time += 0.05;
			if (rocket) {
				isMovingUp =
					rocket.position.y >= initialYPosition + 100
						? false
						: rocket.position.y <= initialYPosition - 100
						? true
						: isMovingUp;
				rocket.position.y += isMovingUp ? 3 : -3;

				rocket.rotation.y += 0.05;
			}

			let position = circleMesh.geometry.attributes.position;

			for (let i = 0; i < position.count; i++) {
				let factor = i / position.count;
				let easingFactor = Math.sin(factor * Math.PI);
				let y = Math.sin(factor * 2 * Math.PI + time) * 7 * easingFactor;
				position.setZ(i, y);
			}
			position.needsUpdate = true;

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

<style>
	#loader {
		width: 0;
		height: 20px;
		background-color: #023047;

		transition: width 0.5s, opacity 2s;
		opacity: 1;
	}
</style>
