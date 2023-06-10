<script>
	import FullScreenWrapper from '$lib/components/FullScreenWrapper.svelte';
	import Rocket from '$lib/components/Rocket.svelte';
	import Nav from '$lib/components/nav.svelte';
	import '../../app.css';

	const instructions = [
		{ imageSrc: 'images/scroll-white.png', text: '스크롤하여 확대/축소해보세요' },
		{ imageSrc: 'images/left-click-white.png', text: '(+ctrl)드래그하여 탐구하세요' }
	];
</script>

<Nav />
<Rocket />
<FullScreenWrapper>
	<div class="flex flex-col gap-10">
		<p class="text-3xl text-gray-50 z-10">반가워요!</p>
		<p class="text-2xl text-gray-50 z-10">3D 프로젝트입니다.</p>
		<div class="flex flex-col gap-10">
			{#each instructions as { imageSrc, text }}
				<div class="flex items-center">
					<img class="w-12 h-12" src={imageSrc} alt="이미지" />
					<div class="text-xs text-gray-50 z-10">{text}</div>
				</div>
			{/each}
		</div>
	</div>
</FullScreenWrapper>
