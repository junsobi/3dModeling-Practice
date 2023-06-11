<script>
	import FullScreenWrapper from '$lib/components/FullScreenWrapper.svelte';
	import Spaceboi from '$lib/components/Spaceboi.svelte';
	import Nav from '$lib/components/nav.svelte';
	import '../app.css';
	import ToggleButton from '../lib/components/ToggleButton.svelte';

	const instructions = [
		{ imageSrc: 'images/left-click-white.png', text: '별과 소년을 눌러보세요' },
		{ imageSrc: 'images/scroll-white.png', text: '스크롤하여 확대/축소해보세요' },
		{ imageSrc: 'images/left-click-white.png', text: '(+ctrl)드래그하여 탐구하세요' },
		{ imageSrc: 'images/pause-button-white.png', text: '좌상단에 일시정지가 있어요' }
	];
</script>

<Nav />
<Spaceboi />
<ToggleButton />
<FullScreenWrapper>
	<div class="flex flex-col gap-10">
		<p class="text-3xl text-gray-50 z-10">Welcome To Universe</p>
		<p class="text-xl text-gray-50 z-10">당신만의 우주로 만들어주세요</p>
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
