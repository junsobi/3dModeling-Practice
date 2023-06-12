<script>
	import { onMount } from 'svelte';

	let buttonRendered = false;
	let visibilityState = 'offScreen';
	let buttonPosition = '0%';

	function toggleDiv() {
		switch (visibilityState) {
			case 'fullyVisible':
				visibilityState = 'partlyVisible';
				buttonPosition = '95%';
				break;
			case 'partlyVisible':
			case 'offScreen':
				visibilityState = 'fullyVisible';
				buttonPosition = '0%';
				break;
		}
	}

	onMount(() => {
		setTimeout(() => {
			toggleDiv();
			buttonRendered = true;
		}, 500);
	});
</script>

<div
	class={`fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center moveable ${
		visibilityState === 'fullyVisible'
			? ''
			: visibilityState === 'partlyVisible'
			? 'partlyVisible'
			: 'offScreen'
	}`}
>
	<slot />
	<!-- 자식 컴포넌트가 들어갈 위치 -->
</div>
{#if buttonRendered}
	<button
		class={`absolute text-4xl text-white z-10 buttonMoveable`}
		style={`left: ${buttonPosition}; transition: left 1s ease-in-out;
	top: 50%`}
		on:click={toggleDiv}
	>
		<img
			class="w-12 h-12"
			src={`images/${visibilityState === 'fullyVisible' ? 'right' : 'left'}-white.png`}
			alt="화살표"
		/>
	</button>
{/if}

<style>
	.moveable {
		transition: transform 1s ease-in-out;
	}
	.offScreen {
		transform: translateX(-100%);
	}
	.partlyVisible {
		transform: translateX(100%);
	}
</style>
