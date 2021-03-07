import * as THREE from 'three';

export function makeTextSprite(message, parameters) {
	if (parameters === undefined) parameters = {};
	
	let fontface = parameters.hasOwnProperty("fontface") ? 
		parameters["fontface"] : "Roboto";
	
	let fontsize = parameters.hasOwnProperty("fontSize") ? 
		parameters["fontSize"] : 32;
	
	let borderThickness = parameters.hasOwnProperty("borderThickness") ? 
		parameters["borderThickness"] : 4;
	
	let borderColor = parameters.hasOwnProperty("borderColor") ?
		parameters["borderColor"] : { r:0, g:0, b:0, a:0 };
	
	let backgroundColor = parameters.hasOwnProperty("backgroundColor") ?
		parameters["backgroundColor"] : { r:255, g:255, b:255, a:1.0 };
		

	let canvas = document.createElement('canvas');
	let context = canvas.getContext('2d');
	context.font = "Bold " + fontsize + "px " + fontface;

	// get size data (height depends only on font size)
	let metrics = context.measureText(message);
	let textWidth = metrics.width;
	
	// background color
	context.fillStyle   = "rgba(" + backgroundColor.r + "," + backgroundColor.g + ","
								  + backgroundColor.b + "," + backgroundColor.a + ")";
	// border color
	context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + ","
								  + borderColor.b + "," + borderColor.a + ")";

	context.lineWidth = borderThickness;
	// roundRect(context, borderThickness/2, borderThickness/2, textWidth + borderThickness, fontsize * 1.4 + borderThickness, 6);
	// 1.4 is extra height factor for text below baseline: g,j,p,q.
	
	// text color
	context.fillStyle = "rgba(255, 255, 255, 1.0)";

	context.fillText(message, borderThickness, fontsize + borderThickness);
	
	// canvas contents will be used for a texture
	let texture = new THREE.Texture(canvas) 
	texture.needsUpdate = true;

	let spriteMaterial = new THREE.SpriteMaterial( 
        { map: texture, useScreenCoordinates: false }
    );
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.center.set(0.5, 0.5);
    sprite.scale.set(100,50,1.0);
    
	return sprite;	
}
