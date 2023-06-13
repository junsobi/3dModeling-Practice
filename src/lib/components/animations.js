// animations.js
export function animateCloseUp(object, scale, isScaling) {
	if (object && isScaling) {
		if (scale < 1) {
			scale += 0.01;
			object.scale.set(scale, scale, scale);
		} else {
			isScaling = false;
		}
	}
	return [scale, isScaling];
}

export function animateRocket(rocket, isMovingUp, initialYPosition, playing) {
	if (rocket) {
		isMovingUp =
			rocket.position.y >= initialYPosition + 100
				? false
				: rocket.position.y <= initialYPosition - 100
				? true
				: isMovingUp;
		rocket.position.y += isMovingUp ? (playing ? 3 : 0) : playing ? -3 : 0;

		rocket.rotation.y += playing ? 0.05 : 0;
	}

	return isMovingUp; // 변경된 isMovingUp을 반환
}

export function animateCircle(time, circleMesh, playing) {
	let position = circleMesh.geometry.attributes.position;
	for (let i = 0; i < position.count; i++) {
		let factor = i / position.count;
		let easingFactor = Math.sin(factor * Math.PI);
		let y = Math.sin(factor * 10 * Math.PI + time) * (playing ? 10 : 0) * easingFactor;
		position.setZ(i, y);
	}
	position.needsUpdate = true;
}

export function animateSpaceboi(spaceboi, playing) {
	if (spaceboi) {
		spaceboi.rotation.y += playing ? 0.001 : 0;
	}
}
