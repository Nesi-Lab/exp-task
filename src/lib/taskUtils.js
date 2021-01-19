
import { settings } from '../config/main'

const TEXT_HEIGHT_MULTIPLE = 1.286

function wrapText(ctx, text, x, y, maxWidth, fontSize, fillStyle="white"){
	var words = text.split(' ');
	var line = '';
	var lineHeight=fontSize*TEXT_HEIGHT_MULTIPLE; // a good approx for 10-18px sizes
  
	ctx.font = fontSize + settings.fontFace;
	ctx.textBaseline = 'top';
	ctx.fillStyle = settings.colors[fillStyle]
	ctx.textAlign = "left";
  
	for(var n = 0; n < words.length; n++) {
	  var testLine = line + words[n] + ' ';
	  var metrics = ctx.measureText(testLine);
	  var testWidth = metrics.width;
	  if(testWidth > maxWidth) {
		ctx.fillText(line, x, y);
		if(n<words.length){
			line = words[n] + ' ';
			y += lineHeight;
		}
	  }
	  else {
		line = testLine;
	  }
	}
	ctx.fillText(line, x, y);
	y += lineHeight
	return y
  }

function textHeight(ctx, text, maxWidth, fontSize) {
	var y = 0
	var words = text.split(' ');
	var line = '';
	var lineHeight=fontSize*TEXT_HEIGHT_MULTIPLE; // a good approx for 10-18px sizes
  
	ctx.font = fontSize + settings.fontFace;
	ctx.textBaseline = 'top';
	ctx.textAlign = "left";
  
	for(var n = 0; n < words.length; n++) {
	  var testLine = line + words[n] + ' ';
	  var metrics = ctx.measureText(testLine);
	  var testWidth = metrics.width;
	  if(testWidth > maxWidth) {
		if(n<words.length){
			line = words[n] + ' ';
			y += lineHeight;
		}
	  }
	  else {
		line = testLine;
	  }
	}
	y += lineHeight
	return y
}

function lineHeight(font_size) { return font_size * TEXT_HEIGHT_MULTIPLE }

const roundRect = (ctx, x, y, width, height, radius, fill, stroke) => {
	radius = {tl: radius, tr: radius, br: radius, bl: radius}
	ctx.beginPath();
	ctx.moveTo(x + radius.tl, y);
	ctx.lineTo(x + width - radius.tr, y);
	ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
	ctx.lineTo(x + width, y + height - radius.br);
	ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
	ctx.lineTo(x + radius.bl, y + height);
	ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
	ctx.lineTo(x, y + radius.tl);
	ctx.quadraticCurveTo(x, y, x + radius.tl, y);
	ctx.closePath();
	if (fill) {
	  ctx.fill();
	}
	if (stroke) {
	  ctx.stroke();
	}
  
  }

export {
	wrapText, 
	textHeight,
	lineHeight,
	roundRect
}