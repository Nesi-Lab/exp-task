// utilities specific to this app/task
// import _ from 'lodash'
// import { shuffleArray, deepCopy, randomTrue } from './utils'
// import { eventCodes, ratingSettings, imageSettings, settings } from '../config/main'
import { settings } from '../config/main'

const colors = {
	white: "#ffffff",
	black: "#000000",
	red: "#ff0000",
	green: "#2bb52b",
	grey: "#4a4a4a",
	light_grey: "#d3d3d3",
	light_blue: "#add8e6"
}

// initialize starting conditions for each trial within a block
// each repetition set is independently randomized then concatenated
// no more than 3 images from a set can repeat in a row
// const generateStartingOpts = (b) => {
// 	let startingOptions = []

// 	for (let i = 0; i < b.repeats_per_condition; i++) {
// 		let neutralImages = shuffleArray(deepCopy(b.images.neutral))
// 		let provokingImages = shuffleArray(deepCopy(b.images.provoking))

// 		while (neutralImages.length > 0 && provokingImages.length > 0) {
// 			if (neutralImages.length - provokingImages.length >= 3 ) {
// 				startingOptions.push(neutralImages.pop())
// 			} else if (provokingImages.length - neutralImages.length >= 3) {
// 				startingOptions.push(provokingImages.pop())
// 			} else if ( randomTrue() ) {
// 				startingOptions.push(neutralImages.pop())
// 			} else {
// 				startingOptions.push(provokingImages.pop())
// 			}
// 		}

// 		startingOptions.push(...neutralImages)
// 		startingOptions.push(...provokingImages)
// 	}

// 	return startingOptions
// }

// const getCircles = (start, stop, size) => {
// 	const center = size / 2
//   //   const r = center * 0.85
//   // 	const n = stop - start + 1
  
//   //   const slice = Math.PI / (n-1)
  
//   //   let circles = _.range(start, stop + 1).map( (val) => {
//   //     let theta = slice * val - Math.PI / 2
//   //     let x = r * Math.sin(theta) + center
//   //     let y = r * Math.cos(theta) + center
//   //     return {n: val, x: x, y: y}
//   //   })
  
// 	let circles = _.range(start, stop + 1).map( (val) => {
// 	  let x = 0.9 * center + 0.2 * center * val;  // offset + dist between values * value
// 	  let y = center * 1.7;
// 	  return {n: val, x: x, y: y}
// 	  })
  
// 	return circles;
//   }

// const isColliding = (x1, y1, r1, x2, y2) => {
//   let dx = x1 - x2;
//   let dy = y1 - y2;
//   let distance = Math.sqrt(dx * dx + dy * dy);

//   if ( distance < r1 ) {
//     return true
//   } else {
//     return false
//   }
// }

// const getCircle = (x, y, r, circles, circle_r) => {

//   for(var i=0; i<circles.length; i++) {
//     let c = circles[i]
//     if ( isColliding(c.x, c.y, circle_r, x, y, r) ) {
//       return c
//     }
//   }

//   return null
// }

// const drawNumbers = (ctx, circles, radius, x, y, cursor_radius, choice) => {
// 	ctx.font = radius * 0.8 + "px arial";
// 	ctx.textBaseline = "middle";
// 	ctx.textAlign = "center";
  
// 	  let hovered = getCircle(x, y, cursor_radius, circles, radius)
  
// 	circles.forEach( (circle) => {
// 	  // draw circle
// 		  if (circle === hovered || circle.n == choice) {
// 			  if (circle.n == 1 || circle.n == 2) {
// 				  ctx.fillStyle = "#D66D6D" // red
// 			  } else {
// 				  ctx.fillStyle = "#79D66D" // green
// 				  // ctx.fillStyle = "#778899" // medium grey
// 			  }
// 		  } else {
// 		  ctx.fillStyle = "#D3D3D3"; // light grey
// 		  }
// 	  ctx.beginPath();
// 	  ctx.arc(circle.x, circle.y, radius, 0, 2 * Math.PI, true);
// 	  ctx.fill();
  
// 	  // draw text
// 	  ctx.fillStyle = "#000000" // black
// 	  ctx.fillText(circle.n.toString(), circle.x, circle.y + 3.5);
// 	})
//   }

// const drawPrompt = (ctx, rt, size) => {
// 	// only draw if it's been 10 seconds
// 	if (rt < 10000) return

//   ctx.font = 20 + "px arial";
//   ctx.textBaseline = "middle";
//   ctx.textAlign = "center";

//   // draw text
//   ctx.fillStyle = "#ffffff" // white
//   ctx.fillText("Please select a rating", size / 2, size * .25);
// }

// const drawFixation = (ctx, size) => {
// 	ctx.fillStyle = "#ffffff";
// 	ctx.beginPath();
// 	ctx.arc(size/2, size/2, 7.5, 0, 2 * Math.PI, true);
// 	ctx.fill();
// }

// const drawCursor = (ctx, x, y, cursorSize) => {
// 	ctx.beginPath();
// 	ctx.moveTo(x, y - cursorSize);
// 	ctx.lineTo(x, y + cursorSize);

// 	ctx.moveTo(x - cursorSize,  y);
// 	ctx.lineTo(x + cursorSize,  y);

// 	// Line color
// 	ctx.lineWidth = 3;
// 	ctx.strokeStyle = '#a6a6a6';

// 	ctx.stroke();
// }

// const drawFace = (ctx, info, size, rater=false) => {
// 	const baseImage = new Image();
//     baseImage.src = info.img;
// 	var scaled = 0.3 * size;
// 	var x = size / 2 + scaled / 4
// 	var y = size / 2 - scaled
// 	if (rater) {
// 		var x = scaled / 4
// 		var y = size / 2 + scaled / 4
// 	}
// 	baseImage.onload = function () {
// 	// if(baseImage.complete){
// 		ctx.drawImage(baseImage, x, y, scaled, scaled);
// 		// ctx.fillStyle = "#ffffff" // white
// 		// ctx.font = 15 + "px arial";
// 		// ctx.textAlign = "left";
// 		wrapText(ctx, info.town + ", RI", x, y + scaled * 1.1, scaled, 15, "px arial")
// 		wrapText(ctx, "Bio: " + info.bio, x, y + scaled * 1.2, scaled, 15, "px arial")
// 		// ctx.fillText(info.town + ", RI", x, y + scaled * 1.1);
// 		// ctx.fillText("Bio: " + info.bio, x, y + scaled * 1.2);
		
// 	}
// 	// requestAnimationFrame(drawFace)
// }

// const drawQuestion = (ctx, size) => {

// 	ctx.font = 20 + "px arial";
// 	ctx.textBaseline = "middle";
// 	ctx.textAlign = "center";
  
// 	// draw text
// 	ctx.fillStyle = "#ffffff" // white
// 	ctx.fillText("How much would you like to", size * 0.7, size * 0.7);
// 	ctx.fillText("be friends with this person?", size * 0.7, size * 0.75);
// }
  
// const drawWatching = (ctx, size, n) => {

// 	let eye_coords = drawImg(ctx, ratingSettings.eye, size, 0.1, 0.1, 0.15)

// 	let font_size = 20
// 	let font_face = "px arial"
// 	// ctx.font = font_size + font_face;
// 	// ctx.textBaseline = "middle";
// 	// ctx.textAlign = "left";

// 	// draw text
// 	// ctx.fillStyle = "#ffffff" // white
// 	wrapText(ctx, n.toString().concat(" people are watching"), eye_coords.left_x, eye_coords.bottom_y + 10, eye_coords.right_x - eye_coords.left_x, font_size, font_face)
// 	// ctx.fillText(n.toString().concat(" people"), eye_coords.left_x, eye_coords.bottom_y + 10);
// 	// ctx.fillText(n.toString().concat("are watching"), eye_coords.left_x, eye_coords.bottom_y + 10 + font_size * 1.5);

// }

const TEXT_HEIGHT_MULTIPLE = 1.286

function wrapText(ctx, text, x, y, maxWidth, fontSize){
	var words = text.split(' ');
	var line = '';
	var lineHeight=fontSize*TEXT_HEIGHT_MULTIPLE; // a good approx for 10-18px sizes
  
	ctx.font = fontSize + settings.fontFace;
	ctx.textBaseline = 'top';
	ctx.fillStyle = colors.white
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

//   const drawImg = (ctx, info, rel_x, rel_y, scale=0.3, chosen_thumb=false, circle=true, draw_rej=null, number=null) => {
// 	const baseImage = new Image();
// 	baseImage.src = info;
// 	var scaled = scale * settings.canvasSize;
// 	const coords = {
// 		left_x: rel_x * settings.canvasSize,
// 		top_y: rel_y * settings.canvasSize,
// 		right_x: rel_x * settings.canvasSize + scaled,
// 		bottom_y: rel_y * settings.canvasSize + scaled
// 	}
// 	baseImage.onload = function () {
// 		// toggle shadow for chosen thumb
// 		if (circle) {
// 			ctx.save();
// 			// crop to circle 
// 			ctx.beginPath(); 
// 			ctx.arc(rel_x * settings.canvasSize + scaled / 2, rel_y * settings.canvasSize + scaled / 2, scaled / 2, 0, Math.PI * 2, false); //draw the circle
// 			ctx.clip(); //call the clip method so the next render is clipped in last path
// 			ctx.stroke();
// 			ctx.closePath();
// 		}

// 		// draw image
// 		ctx.drawImage(baseImage, rel_x * settings.canvasSize, rel_y * settings.canvasSize, scaled, scaled);
		
// 		if (circle) {
// 			ctx.restore();
// 		}

// 		if (chosen_thumb) {
// 			ctx.strokeStyle = colors.grey 
// 			ctx.lineWidth = 3
// 			const padding = 7
// 			ctx.strokeRect(rel_x * settings.canvasSize - padding, rel_y * settings.canvasSize - padding, scaled + 2 * padding, scaled + 2 * padding)
// 			// ctx.shadowOffsetX = scaled / 10;
// 			// ctx.shadowOffsetY = scaled / 10;
// 			// ctx.shadowColor = "#808080"; // gray
// 		} 

// 		// add X and rating if a bad rating
// 		if (draw_rej == 1 || draw_rej == 2) {
// 			// draw X
// 			const shorten_x = scaled * 0.1
// 			ctx.lineWidth = 15
// 			ctx.strokeStyle = colors.red
// 			ctx.beginPath()
// 			ctx.moveTo(coords.left_x + shorten_x, coords.top_y + shorten_x)
// 			ctx.lineTo(coords.right_x - shorten_x, coords.bottom_y - shorten_x)
// 			ctx.moveTo(coords.right_x - shorten_x, coords.top_y + shorten_x)
// 			ctx.lineTo(coords.left_x + shorten_x, coords.bottom_y - shorten_x)
// 			ctx.closePath()
// 			ctx.stroke()
// 		}

// 		if (draw_rej == 0 || draw_rej == 1 || draw_rej == 2 || draw_rej == 3 || draw_rej == 4) {
// 			// draw rating box
// 			ctx.fillStyle = colors.light_grey
// 			ctx.strokeStyle = colors.black
// 			ctx.lineWidth = 1
// 			const no_rating_font_ratio = 0.6
// 			const rating_box_rel_x = (draw_rej == 0) ? 0.23 : 0.175
// 			const rating_box_rel_y = (draw_rej == 0) ? 0.5 : 0.7
// 			const left_rating_box_x = coords.left_x + rating_box_rel_x * (coords.right_x - coords.left_x)
// 			const rating_box_dx = (coords.right_x - coords.left_x) * (1 - rating_box_rel_x * 2)
// 			const top_rating_box_y = coords.top_y + rating_box_rel_y * (coords.bottom_y - coords.top_y)
// 			const rating_box_dy = (draw_rej == 0) ? settings.xFontSize * 1.286 * (1 + no_rating_font_ratio * 2) : settings.xFontSize * 1.286
// 			ctx.fillRect(left_rating_box_x, top_rating_box_y, rating_box_dx, rating_box_dy)
// 			ctx.strokeRect(left_rating_box_x, top_rating_box_y, rating_box_dx, rating_box_dy)

// 			// add rating box text
// 			ctx.font = settings.xFontSize + settings.fontFace
// 			const rating_string = "Rating: "
// 			const left_padding_x = 1.01
// 			const top_padding_y = 1.03
// 			ctx.fillStyle = colors.black
// 			ctx.fillText(rating_string, left_rating_box_x * left_padding_x, top_rating_box_y * top_padding_y)
// 			if (draw_rej == 0) {
// 				ctx.font = Math.floor(settings.xFontSize * no_rating_font_ratio) + settings.fontFace
// 				ctx.fillStyle = colors.black
// 				const no_rating = "NO RATING"
// 				ctx.fillText(no_rating, left_rating_box_x * left_padding_x, top_rating_box_y * top_padding_y + settings.xFontSize * 1.286)
// 				ctx.fillText("PROVIDED", left_rating_box_x * left_padding_x, top_rating_box_y * top_padding_y + settings.xFontSize * (1 + no_rating_font_ratio) * 1.286)
// 			} else {
// 				ctx.fillStyle = (draw_rej == 1 || draw_rej == 2) ? colors.red : colors.green
// 				ctx.fillText(draw_rej.toString(), left_rating_box_x * left_padding_x + ctx.measureText(rating_string).width, top_rating_box_y * top_padding_y)
// 			}
// 		}
// 		if (number != null) {
// 			ctx.fillStyle = colors.black
// 			if (chosen_thumb) {
// 				if (number == 1 || number == 2) {
// 					ctx.fillStyle = colors.red
// 				} else {
// 					ctx.fillStyle = colors.green
// 				}
// 			}
// 			ctx.font = ctx.font = 28 + settings.fontFace;
// 			let num_x = coords.left_x + (coords.right_x - coords.left_x) / 3
// 			let num_y = coords.top_y + (coords.bottom_y - coords.top_y) / 2
// 			if (number == 1 || number == 2) {
// 				num_y -= (coords.right_x - coords.left_x) / 3
// 			}
// 			ctx.fillText(number.toString(), num_x, num_y)
// 		}
// 	}
// 	return coords
// }

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

// const drawWatching = (ctx, isWatchingTrial, n) => {
// 	const eye_coords = drawImg(ctx, settings.eye, 0, 0, 0.15, false, false, null)
// 	const lineHeight = settings.watchingFontSize * 1.286; // a good approx for 10-18px sizes
// 	ctx.font = settings.watchingFontSize + settings.fontFace;
// 	ctx.fillStyle = colors.light_blue
// 	ctx.textBaseline = 'top';
// 	ctx.textAlign = "left";
// 	const unbold = ctx.font 
// 	const bold = "bold ".concat(ctx.font)
// 	let x = 0
// 	let y = eye_coords.bottom_y + 10
// 	// let txt = n.toString().concat(" people are watching")
// 	if (isWatchingTrial) {
// 		ctx.font = bold
// 		ctx.fillText("You ", x, y)

// 		x += ctx.measureText("You ").width
// 		ctx.font = unbold 
// 		ctx.fillText("and ", x, y)

// 		x += ctx.measureText("and ").width
// 		ctx.font = bold 
// 		ctx.fillText(n.toString(), x, y)

// 		ctx.font = unbold 
// 		x = 0
// 		y += lineHeight 
// 		ctx.fillText("other people", x, y)

// 		ctx.fillStyle = colors.white
// 		y += lineHeight
// 		ctx.fillText("are watching", x, y)
// 		// txt = "You and ".concat(n.toString().concat(" other people are watching"))
// 	} else {
// 		ctx.font = bold 
// 		ctx.fillText(n.toString().concat(" "), x, y)

// 		x += ctx.measureText(n.toString().concat(" ")).width
// 		ctx.font = unbold 
// 		ctx.fillText("people", x, y)

// 		ctx.fillStyle = colors.white
// 		x = 0
// 		y += lineHeight
// 		ctx.fillText("are watching", x, y)
// 	}

// 	// wrapText(ctx, txt, 0, eye_coords.bottom_y + 10, (eye_coords.right_x - eye_coords.left_x) * 1.2, settings.watchingFontSize)
// }

// const drawQuestion = (ctx, choice=null) => {
// 	let scale = 0.1
// 	let top_of_thumbs_y = null
// 	let left_of_thumbs_x = null 
// 	let right_of_thumbs_x = null

// 	const all_thumb_coords = {}

// 	for (let i = 1; i <= 4; i++) {
// 		// draw thumb
// 		let thumb = settings.downThumb
// 		let shift_for_up_y = 0
// 		if (i >= 3) { 
// 			thumb = settings.upThumb 
// 			shift_for_up_y = scale / 3
// 		}
// 		const thumb_coords = drawImg(ctx, thumb, (1 - scale * 1.2 * (5 - i)), 1 - scale - shift_for_up_y - scale / 6, scale, i == choice, false, null, i)
// 		all_thumb_coords[i] = thumb_coords
// 		if (i == 1) { left_of_thumbs_x = thumb_coords.left_x}
// 		if (i == 4) { 
// 			right_of_thumbs_x = thumb_coords.right_x
// 			top_of_thumbs_y = thumb_coords.top_y
// 		}

// 		// add number on thumb
// 		// ctx.font = settings.bioFontSize * 2 + settings.fontFace;
// 		// ctx.textBaseline = 'top';
// 		// let color = "#ffffff" // white
// 		// if (i == choice) {
// 		// 	color = "#ff0000" // red
// 		// 	if (i >= 3) { color = "#00ff00" } // green
// 		// }
// 		// ctx.fillStyle = color
// 		// ctx.textAlign = "left";
// 		// ctx.fillText(i.toString(), thumb_coords.left_x + (thumb_coords.right_x - thumb_coords.left_x) / 2, thumb_coords.top_y + (thumb_coords.bottom_y - thumb_coords.top_y) / 2);
// 	}

// 	// question
// 	ctx.fillStyle = colors.grey
// 	const rect_height = settings.questionFontSize * 3
// 	const top_of_rect_y = top_of_thumbs_y - rect_height * 1.2
// 	roundRect(ctx, left_of_thumbs_x, top_of_rect_y, right_of_thumbs_x - left_of_thumbs_x, rect_height, 5, true, true)
// 	const txt = "How much would you like to be friends with this person?"
// 	const padding = 7
// 	wrapText(ctx, txt, left_of_thumbs_x + padding, top_of_rect_y + padding, right_of_thumbs_x - left_of_thumbs_x - 2 * padding, settings.questionFontSize)
// 	return all_thumb_coords
// }

// const drawRater = (ctx, rater, interpretation=false) => {
// 	const scale = 0.2

// 	if (interpretation) {
// 		drawImg(ctx, rater.img, 0.5, 0.5, scale)
// 	} else {

// 		const rel_x = 0

// 		// bio
// 		const bio_height = textHeight(ctx, "Bio: " + rater.bio, scale * settings.canvasSize, settings.bioFontSize)
// 		let curr_top_y = settings.canvasSize - bio_height
// 		wrapText(ctx, "Bio: " + rater.bio, rel_x * settings.canvasSize, curr_top_y, scale * settings.canvasSize, settings.bioFontSize)
		
// 		// town
// 		const space_between_bio_and_town = 0
// 		const town_height = textHeight(ctx, rater.town + ", RI", scale * settings.canvasSize, settings.bioFontSize)
// 		curr_top_y -= (space_between_bio_and_town + town_height)
// 		wrapText(ctx, rater.town + ", RI", rel_x * settings.canvasSize, curr_top_y, scale * settings.canvasSize, settings.bioFontSize)

// 		// person
// 		const space_between_town_and_img = textHeight(ctx, " ", scale * settings.canvasSize, settings.bioFontSize) / 2
// 		curr_top_y -= (space_between_town_and_img + scale * settings.canvasSize)
// 		const rel_y = curr_top_y / settings.canvasSize
// 		drawImg(ctx, rater.img, rel_x, rel_y, scale, false)
// 	}
// } 

// const drawRatee = (ctx, ratee, choice = null) => {
// 	const rel_y = 0
// 	const scale = 0.3
// 	const rel_x = 1 - scale

// 	const face_coords = drawImg(ctx, ratee.img, rel_x, rel_y, scale, false, true, choice)
// 	const space_between_img_and_town = textHeight(ctx, " ", scale * settings.canvasSize, settings.bioFontSize) / 2
// 	const bottom_of_town_y = wrapText(ctx, ratee.town + ", RI", face_coords.left_x, face_coords.bottom_y + space_between_img_and_town, face_coords.right_x - face_coords.left_x, settings.bioFontSize)
// 	wrapText(ctx, "Bio: " + ratee.bio, face_coords.left_x, bottom_of_town_y, face_coords.right_x - face_coords.left_x, settings.bioFontSize)
// }

// export {
// 	generateStartingOpts,
// 	getCircles,
// 	getCircle,
// 	drawNumbers,
// 	drawPrompt,
// 	drawFixation,
// 	drawCursor,
// 	drawFace,
// 	drawQuestion,
// 	drawWatching,
// 	drawImg
// }

export {
	wrapText, 
	textHeight,
	lineHeight,
	roundRect
}