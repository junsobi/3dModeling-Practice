<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	const links = [
		{ label: 'Spaceboi', url: '/' },
		{ label: 'Rocket', url: '/rocket' },
		{ label: 'login', url: '/login' }
	];

	let isMobile = false;

	function handleResize() {
		isMobile = window.innerWidth <= 600;
	}

	onMount(() => {
		window.addEventListener('resize', handleResize);
		handleResize(); // 초기 로드 시에도 체크
	});
</script>

<div class="h-16 bg-gray-900 text-white" style="height: 30px; background-color: #111827;">
	<div class="px-4 flex items-center gap-10">
		{#each links as link}
			<div>
				<button on:click={() => goto(link.url)} class:text-xl={!isMobile ? 'text-2xl' : ''}
					>{link.label}</button
				>
			</div>
		{/each}
	</div>
</div>
