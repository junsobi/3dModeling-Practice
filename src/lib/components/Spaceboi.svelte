<script>
	import Phrases from './PHRASES';
	import { onMount } from 'svelte';
	import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
	import * as THREE from 'three';
	import { playing } from '$lib/store/store';
	let scene,
		camera,
		renderer,
		spaceboi,
		controls,
		loaderElement,
		speechBubbleTimeout,
		opacityTimeout;

	// scene은 3d 객체 빛을 담는 공간, 카메라는 환경을 어떻게볼것인지 정의 , renderer는 3d를 그리는역할, controls는 카메라 컨트롤
	$: {
		console.log($playing);
	}

	let isScaling = true;
	let scale = 0.01;

	function animate() {
		requestAnimationFrame(animate);

		spaceboi.rotation.y += $playing ? 0.001 : 0;

		if (spaceboi) {
			// spaceboi가 정의된 경우에만 회전

			if (isScaling) {
				// spaceboi가 아직 스케일링 중인 경우
				if (scale < 1) {
					scale += 0.01;
					spaceboi.scale.set(scale, scale, scale);
				} else {
					isScaling = false; // 스케일이 1 이상이면 더 이상 스케일링하지 않음
				}
			}
		}

		renderer.render(scene, camera);
	}
	onMount(() => {
		//dom이 완전히 로드된후에 three.js가 작동되도록 온마운트에 담는다
		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
		renderer = new THREE.WebGLRenderer({ antialias: true });
		//scene, camera, renderer를 초기화, perspectivecamera : 시야각, 화면비율, 근접클리핑평면, 원근클리핑평면
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(window.innerWidth, window.innerHeight);
		// 랜더링 사이즈
		controls = new OrbitControls(camera, renderer.domElement);
		controls.minPolarAngle = 0; // 카메라를 y축 밑으로 못가게함
		controls.maxPolarAngle = Math.PI / 2; // y축 위로 못움직이게함
		controls.minDistance = 5; // 카메라 최소 범위
		controls.maxDistance = 20; // 카메라 최대범위

		let raycaster = new THREE.Raycaster();
		let mouse = new THREE.Vector2();

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
		//로더는 gltf파일로 만들어진

		loader.load(
			'/3dModeling/scene.gltf', // GLTF 파일 위치
			(gltf) => {
				spaceboi = gltf.scene; // 로드한 모델을 spaceboi 변수에 저장

				scene.add(spaceboi); // 로드한 모델을 scene에 추가

				if ($playing) {
					animate();
				}
				loaderElement.style.opacity = '0';
			},
			(progress) => {
				const percentage = (progress.loaded / progress.total) * 100;
				loaderElement.style.width = `${percentage}%`;
			},
			(error) => console.error(error)
		);

		camera.position.set(4, 10, 5);
		camera.lookAt(0, 0, 0);

		function onDocumentMouseClick(event) {
			event.preventDefault();

			mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
			mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

			raycaster.setFromCamera(mouse, camera);
			let intersects = raycaster.intersectObjects(scene.children, true);
			console.log(intersects);
			if (intersects.length > 0) {
				for (let i = 0; i < Math.min(intersects.length, 2); i++) {
					let currentObject = intersects[i].object;

					if (
						currentObject.name !== 'Cube_Material001_0' &&
						currentObject.name !== 'waves_Material002_0'
					) {
						let newMaterial = new THREE.MeshPhongMaterial({ color: Math.random() * 0xffffff });
						currentObject.material = newMaterial;
						currentObject.material.color.set(Math.random() * 0xffffff);
					}

					if (currentObject.name === 'body_Material001_0') {
						// 머테리얼 색상 변경

						let worldPosition = new THREE.Vector3();
						currentObject.getWorldPosition(worldPosition);
						let screenPosition = worldPosition.project(camera);

						let speechBubble = document.getElementById('speech-bubble');
						speechBubble.style.left = `${((screenPosition.x + 1) / 2) * window.innerWidth}px`;
						speechBubble.style.top = `${(-(screenPosition.y - 0.8) / 2) * window.innerHeight}px`;

						let randomPhrase = Phrases[Math.floor(Math.random() * Phrases.length)];
						speechBubble.textContent = randomPhrase;

						speechBubble.style.display = 'block';
						clearTimeout(speechBubbleTimeout);
						clearTimeout(opacityTimeout);

						setTimeout(() => {
							speechBubble.style.opacity = '1';
						}, 0);

						opacityTimeout = setTimeout(() => {
							speechBubble.style.opacity = '0';

							speechBubbleTimeout = setTimeout(() => {
								speechBubble.style.display = 'none';
							}, 500);
						}, 4000);
					}
				}
			}
		}

		const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
		scene.add(ambientLight);
		window.addEventListener('click', onDocumentMouseClick, false);
		console.log($playing);

		// 로딩바가 사라질 때 이벤트 추가
		loaderElement.addEventListener('transitionend', () => {
			if (loaderElement.style.opacity === '0') {
				loaderElement.style.display = 'none';
			}
		});
	});
</script>

<div id="loader" bind:this={loaderElement}>loading...</div>
<div
	id="speech-bubble"
	style="opacity: 0; display: none; position: absolute; padding: 10px; background-color: white; border-radius: 5px; transition: opacity 0.5s; max-width: 600px;"
>
	Hello!
</div>

<style>
	#loader {
		width: 0;
		height: 20px;
		background-color: #023047;

		transition: width 0.5s, opacity 2s;
		opacity: 1;
	}
</style>
