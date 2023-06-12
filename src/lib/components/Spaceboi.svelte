<script>
	import Phrases from './PHRASES';
	import { onMount } from 'svelte';
	import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
	import * as THREE from 'three';
	import { playing } from '$lib/store/store';
	import { initScene } from './sceneInit.js';

	let scene,
		camera,
		renderer,
		spaceboi,
		controls,
		loaderElement,
		speechBubbleTimeout,
		opacityTimeout;

	// scene은 3d 객체 빛을 담는 공간, 카메라는 환경을 어떻게볼것인지 정의 , renderer는 3d를 그리는역할, controls는 카메라 컨트롤

	let isScaling = true;
	let scale = 0.01;

	function animateCloseUp() {
		if (spaceboi && isScaling) {
			// spaecboi 아직 스케일링 중인 경우
			if (scale < 1) {
				scale += 0.01;
				spaceboi.scale.set(scale, scale, scale);
			} else {
				isScaling = false; // 스케일이 1 이상이면 더 이상 스케일링하지 않음
			}
		}
	}

	function animateSpaceboi() {
		if (spaceboi) {
			spaceboi.rotation.y += $playing ? 0.001 : 0;
		}
	}

	onMount(() => {
		({ scene, camera, renderer, controls } = initScene({
			navHeight: 30,
			minDistance: 5,
			maxDistance: 20,
			fov: 50
		}));

		let raycaster = new THREE.Raycaster();
		let mouse = new THREE.Vector2();

		window.addEventListener(
			'resize',
			() => {
				const navHeight = 30;
				camera.aspect = window.innerWidth / (window.innerHeight - navHeight);
				camera.updateProjectionMatrix();

				renderer.setSize(window.innerWidth, window.innerHeight - navHeight);
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

		function animate() {
			requestAnimationFrame(animate);
			animateSpaceboi();
			animateCloseUp();
			renderer.render(scene, camera);
		}
		animate();
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
