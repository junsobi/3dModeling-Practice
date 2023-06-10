<script>
	import { onMount } from 'svelte';
	import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
	import * as THREE from 'three';

	let scene, camera, renderer, rocket;
	// scene은 3d 객체 빛을 담는 공간, 카메라는 환경을 어떻게볼것인지 정의 , renderer는 3d를 그리는역할

	onMount(() => {
		//dom이 완전히 로드된후에 three.js가 작동되도록 온마운트에 담는다
		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		renderer = new THREE.WebGLRenderer();
		//scene, camera, renderer를 초기화, perspectivecamera : 시야각, 화면비율, 근접클리핑평면, 원근클리핑평면

		renderer.setSize(window.innerWidth, window.innerHeight);
		// 랜더링 사이즈

		document.body.appendChild(renderer.domElement);
		// 랜더러를 돔에 올리는 기능(appendchild)

		const loader = new GLTFLoader();
		//로더는 gltf파일로 만들어진 로켓이다

		loader.load(
			'/3dModeling/rocket.gltf', // GLTF 파일 위치
			(gltf) => {
				rocket = gltf.scene; // 로드한 모델을 rocket 변수에 저장
				scene.add(rocket); // 로드한 모델을 scene에 추가
			},
			undefined,
			(error) => console.error(error)
		);

		camera.position.z = 300;

		const light = new THREE.PointLight(0xffffff, 1, 0);
		light.position.set(50, 50, 50);
		scene.add(light);

		const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
		scene.add(ambientLight);

		function animate() {
			requestAnimationFrame(animate);

			if (rocket) {
				// rocket이 정의된 경우에만 회전
				// rocket.rotation.x += 0.01;
				rocket.rotation.y += 0.1;
			}

			renderer.render(scene, camera);
		}
		animate();
	});
</script>
