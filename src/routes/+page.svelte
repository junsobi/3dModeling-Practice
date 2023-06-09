<script>
	import { onMount } from 'svelte';
	import * as THREE from 'three';

	let scene, camera, renderer;

	onMount(() => {
		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		renderer = new THREE.WebGLRenderer();

		// Renderer Size
		renderer.setSize(window.innerWidth, window.innerHeight);

		// Append Renderer to DOM
		document.body.appendChild(renderer.domElement);

		// Create Geometry
		const geometry = new THREE.BoxGeometry();

		// Create Material
		const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

		// Create Mesh
		const cube = new THREE.Mesh(geometry, material);

		// Add Mesh to Scene
		scene.add(cube);

		camera.position.z = 5;

		// Animation Loop
		function animate() {
			requestAnimationFrame(animate);

			cube.rotation.x += 0.01;
			cube.rotation.y += 0.01;

			renderer.render(scene, camera);
		}
		animate();
	});
</script>

<style>
	/* This is needed to display the canvas full size */
	body {
		margin: 0;
		overflow: hidden;
	}
</style>
