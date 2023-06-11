<script>
	import { playing } from '$lib/store/store';
	let buttonImage;

	function togglePlaying() {
		$playing = !$playing;
		//전역스토어값을 불러올때는 $를붙인다
	}

	$: {
		buttonImage = $playing ? 'images/pause-button-white.png' : 'images/play-button-white.png';
	}

	//스벨트는 데이터가 변할때 변수적용을위해 $를 사용함
</script>

<button class="toggle-button" on:click|stopPropagation={togglePlaying}>
	<img src={buttonImage} alt="재생버튼" />
</button>

<style>
	.toggle-button {
		width: 40px;
		height: 40px;
		position: fixed;
		top: 5%;
		display: inline-block;
		background-color: transparent;
		border: none;
		cursor: pointer;
		z-index: 999;
	}

	.toggle-button img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
</style>
