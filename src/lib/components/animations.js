export function animateCloseUp(object) {
	let scale = 0.01;
	let isScaling = true;

	if (object && isScaling) {
		if (scale < 1) {
			scale += 0.01;
			object.scale.set(scale, scale, scale);
		} else {
			isScaling = false;
		}
	}
}

export function animateRocket(object, initialYPosition, $playing) {
	if (object) {
		object.position.y +=
			object.position.y >= initialYPosition + 100 ? ($playing ? 0 : -3) : $playing ? 3 : 0;
		object.rotation.y += $playing ? 0.05 : 0;
	}
}

export function animateCircle(time, circleMesh, $playing) {
	let position = circleMesh.geometry.attributes.position;
	for (let i = 0; i < position.count; i++) {
		let factor = i / position.count;
		let easingFactor = Math.sin(factor * Math.PI);
		let y = Math.sin(factor * 10 * Math.PI + time) * ($playing ? 10 : 0) * easingFactor;
		position.setZ(i, y);
	}
	position.needsUpdate = true;
}

export function animateSpaceboi(spaceboi, $playing) {
	if (spaceboi) {
		spaceboi.rotation.y += $playing ? 0.001 : 0;
	}
}
