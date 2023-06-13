<script>
	import FullScreenWrapper from '$lib/components/FullScreenWrapper.svelte';
	import Rocket from '$lib/components/Rocket.svelte';
	import Nav from '$lib/components/Nav.svelte';
	import '../../app.css';
	import ToggleButton from '../../lib/components/ToggleButton.svelte';

	const instructions = [
		{ complete: true, text: '모델을 어떻게든 출력' },
		{ complete: true, text: '적당한 위치에 Camera세팅' },
		{ complete: true, text: '로켓 돌려보기' },
		{ complete: true, text: '로켓 위아래로 움직이기' },
		{ complete: true, text: '구만들어서 돌리기' },
		{ complete: true, text: '일시정지 기능구현' },
		{ complete: false, text: '속도바 기능 구현' }
	];
</script>

<Nav />
<ToggleButton />
<Rocket />
<FullScreenWrapper>
	<div class="flex flex-col gap-10">
		<p class="text-3xl text-gray-50 z-10">첫번째 프로젝트!</p>

		<div class="flex flex-col gap-10">
			{#each instructions as { complete, text }, index}
				<li class="flex items-center gap-2">
					<span class="text-xs text-gray-50 z-10">{index + 1}. </span>
					<span class="text-xs text-gray-50 z-10"> {text}</span>
					{#if complete}
						<span class="text-green-500 z-10">✅</span>
					{/if}
				</li>
			{/each}
		</div>
	</div>
</FullScreenWrapper>
