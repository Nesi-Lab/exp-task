import { settings } from '../config/main'
import { wrapText, textHeight, lineHeight, roundRect } from './taskUtils'

// Convention: each "coords" has x (left), y (top), dx, dy, unless stated otherwise

const COLORS = {
	white: "#ffffff",
	black: "#000000",
	red: "#ff0000",
	green: "#2bb52b",
	grey: "#4a4a4a",
	light_grey: "#d3d3d3",
	light_blue: "#add8e6"
}

const drawContinue = (ctx, font_size) => {
    const continue_height = 45
    const continue_width = 125
    const buffer = 30 
    const radius = 5  // larger is more rounded question box
    const text_buffer = 10
    const continue_coords = {
        x: settings.canvasSize - buffer - continue_width,
        y: settings.canvasSize - buffer - continue_height,
        dx: continue_width,
        dy: continue_height
    }
    ctx.textBaseline = "top"
    ctx.textAlign = "left"
    ctx.fillStyle = COLORS.light_grey
    ctx.font = font_size + settings.fontFace
    ctx.strokeStyle = COLORS.grey
    roundRect(ctx, continue_coords.x, continue_coords.y, continue_coords.dx, continue_coords.dy, radius, true, true)
    ctx.fillStyle = COLORS.black
    ctx.fillText("Continue", continue_coords.x + text_buffer, continue_coords.y + text_buffer, continue_coords.dx - 2 * text_buffer)
    return continue_coords
}

const drawSM = (ctx, socials, font_size) => {
    // half line between img and town
    const buffer = 30
    const txt = "Please check any social media sites you use. Connect will search your contacts to see if anyone you know is participating..."
    const end_of_text_y = wrapText(ctx, txt, buffer, buffer, settings.canvasSize - 2 * buffer, font_size)
    const img_size = 80
    const box_size = 60
    const all_box_coords = []
    socials.forEach(function (social, i) {
        const box_coords = {
            x: buffer,
            y: end_of_text_y + buffer * (i + 1) + img_size * i + (img_size-box_size) / 2,
            dx: box_size,
            dy: box_size
        }
        ctx.fillStyle = COLORS.white
        ctx.fillRect(box_coords.x, box_coords.y, box_coords.dx, box_coords.dy)
        all_box_coords.push(box_coords)
        const img_coords = {
            x: buffer * 2 + box_size,
            y: end_of_text_y + buffer * (i + 1) + img_size * i,
            dx: img_size,
            dy: img_size
        }
        drawImg(ctx, settings.socials[social], null, null, img_coords, false)
    })
    const continue_coords = drawContinue(ctx, font_size)
    return {
        boxes: all_box_coords,
        continue: continue_coords
    }
}

const drawProcessSM = (ctx, socials, font_size) => {
    // half line between img and town
    const buffer = 30
    const offset = 30
    const txt = "Searching your contacts..."
    const end_of_text_y = wrapText(ctx, txt, offset, offset, settings.canvasSize - 2 * buffer, font_size)
    const img_size = 80  
    const all_img_coords = []
    socials.forEach(function (social, i) {
        const img_coords = {
            x: offset + buffer * i + img_size * i,
            y: end_of_text_y + offset,
            dx: img_size,
            dy: img_size
        }
        drawImg(ctx, settings.socials[social], null, null, img_coords, false)
        all_img_coords.push(img_coords)
    })
    return all_img_coords
}

const drawFriendsSM = (ctx, socials, font_size) => {
    // half line between img and town
    const buffer = 30
    const offset = 30
    const img_size = 80  
    const all_img_coords = []
    socials.forEach(function (social, i) {
        const img_coords = {
            x: offset + buffer * i + img_size * i,
            y: offset,
            dx: img_size,
            dy: img_size
        }
        drawImg(ctx, settings.socials[social], null, null, img_coords, false)
        all_img_coords.push(img_coords)
    })
    socials.forEach(function (social, i) {
        drawCheck(ctx, all_img_coords[i], false)
    })
    const continue_coords = drawContinue(ctx, font_size)
    return {
        boxes: all_img_coords,
        continue: continue_coords
    }
}

const drawCheck = (ctx, coords, is_already_checked) => {
    if (is_already_checked) {
        ctx.fillStyle = COLORS.white
        ctx.fillRect(coords.x, coords.y, coords.dx, coords.dy)
        return false
    } else {
        drawImg(ctx, settings.check, null, null, coords, false)
        return true
    }
}

const drawCaption = (ctx, person, img_coords, font_size) => {
    // half line between img and town
    const wrapTextMod = (text, y) => wrapText(ctx, text, img_coords.x, y, img_coords.dx, font_size)
    const town_y = img_coords.y + img_coords.dy + lineHeight(font_size) / 2
    const bio_y = wrapTextMod(person.town + ", RI", town_y)
    const end_y = wrapTextMod("Bio: " + person.bio, bio_y)
    return {x: img_coords.x, y: town_y, dx: img_coords.dx, dy: end_y - town_y}
}

const drawX = (ctx, img_coords) => {
    console.assert(img_coords.dx === img_coords.dy)
    const shorten_x = img_coords.dx * 0.1
    const X_coords = {
        x: img_coords.x + shorten_x, 
        y: img_coords.y + shorten_x, 
        dx: img_coords.dx - 2 * shorten_x, 
        dy: img_coords.dy - 2 * shorten_x
    }
    ctx.lineWidth = 15
    ctx.strokeStyle = COLORS.red
    ctx.beginPath()
    ctx.moveTo(X_coords.x, X_coords.y)
    ctx.lineTo(X_coords.x + X_coords.dx, X_coords.y + X_coords.dy)
    ctx.moveTo(X_coords.x + X_coords.dx, X_coords.y)
    ctx.lineTo(X_coords.x, X_coords.y + X_coords.dy)
    ctx.closePath()
    ctx.stroke()
    return X_coords
}

const drawBox = (ctx, score, img_coords) => {
    // font sizes need to be manually adjusted to look good
    const box_dx = 0.65 * img_coords.dx

    // box
    ctx.fillStyle = COLORS.light_grey
    ctx.strokeStyle = COLORS.black
    ctx.lineWidth = 1
    const rel = (score === 0) ? {x: 0.23, y: 0.5, font: 0.6} : {x: 0.175, y: 0.7, font: 0}
    let font_size = 28
    const box_coords = {
        x: img_coords.x + (rel.x * img_coords.dx),
        y: img_coords.y + (rel.y * img_coords.dy),
        dx: box_dx,
        dy: lineHeight(font_size) * (1 + (rel.font * 2))
    }
    ctx.fillRect(box_coords.x, box_coords.y, box_coords.dx, box_coords.dy)
    ctx.strokeRect(box_coords.x, box_coords.y, box_coords.dx, box_coords.dy)

    // box text "Rating: "
    ctx.font = font_size + settings.fontFace
    ctx.fillStyle = COLORS.black
    const padding = {x: 1.01, y: 1.03}
    const text_coords = {
        x: box_coords.x * padding.x,
        y: box_coords.y * padding.y
    }
    const rating_string = "Rating: "
    ctx.fillText(rating_string, text_coords.x, text_coords.y)

    // box text number or "NO RATING PROVIDED"
    if (score === 0) {
        font_size = Math.floor(font_size * rel.font)
        ctx.font = font_size + settings.fontFace
        const fillTextMod = (text, line_num) => ctx.fillText(text, text_coords.x, text_coords.y + lineHeight(font_size) * line_num)
        fillTextMod("NO RATING", 1.5)
        fillTextMod("PROVIDED", 2.5)
    } else {
        ctx.fillStyle = (score === 1 || score === 2) ? COLORS.red : COLORS.green
        ctx.fillText(score.toString(), text_coords.x + ctx.measureText(rating_string).width, text_coords.y)
    }

    return box_coords
}

const drawImg = (ctx, img, score, thumb_number, img_coords, is_circle_cropped) => {
    // score = is feedback screen for ratee ? 0-4 : null
    // thumb_number = is a thumb ? 1-4 : null
    // is_circle_cropped = are we drawing a face?

    // need to draw anything going on top of the image in the onload function (X, rating box, thumb numbers)
    
    const baseImage = new Image()
    baseImage.src = img
    baseImage.onload = function () {
        // if we're drawing someone's face, not just the eye/thumbs
        if (is_circle_cropped) {
			ctx.save();
            ctx.beginPath(); 
            console.assert(img_coords.dx === img_coords.dy)
            const half_img_size = img_coords.dx / 2
			ctx.arc(img_coords.x + half_img_size, img_coords.y + half_img_size, half_img_size, 0, Math.PI * 2, false)
			ctx.clip(); //call the clip method so the next render is clipped in last path
			ctx.stroke();
            ctx.closePath();
        }
        
        // draw image
        ctx.drawImage(baseImage, img_coords.x, img_coords.y, img_coords.dx, img_coords.dy)

        if (is_circle_cropped) { ctx.restore() }

        // if we're drawing the feedback screen ratee
        if (thumb_number === null && (score === 1 || score === 2)) { drawX(ctx, img_coords) }
        if (thumb_number === null && (score === 0 || score === 1 || score === 2 || score === 3 || score === 4)) {
            drawBox(ctx, score, img_coords)
        }

        // if we're drawing the thumbs
        // font size needs to be manually adjusted to look good
        if (thumb_number === 1 || thumb_number === 2 || thumb_number === 3 || thumb_number === 4) {
            ctx.fillStyle = (thumb_number === score) ?
                            ((score === 1 || score === 2) ? COLORS.red : COLORS.green) :
                            COLORS.black
            ctx.font = 28 + settings.fontFace
            const rel = (thumb_number === 1 || thumb_number === 2) ? {x: 3, y: 6} : {x: 3, y: 2}
            const thumb_text_coords = {
                x: img_coords.x + (img_coords.dx / rel.x),
                y: img_coords.y + (img_coords.dy / rel.y)
            }
			ctx.fillText(thumb_number.toString(), thumb_text_coords.x, thumb_text_coords.y)
        } 
    }
    return img_coords
}

const drawRater = (ctx, rater, font_size, is_interpretation_screen) => {
    const img_size = 0.3 * settings.canvasSize
    const img_coords = (is_interpretation_screen) ? 
                        {
                            x: settings.canvasSize / 2 - img_size / 2,
                            y: settings.canvasSize / 2 - img_size / 2,
                            dx: img_size,
                            dy: img_size
                        } :
                        {
                            x: 0,
                            y: settings.canvasSize - img_size - lineHeight(font_size) * 4,
                            dx: img_size,
                            dy: img_size
                        }
    drawImg(ctx, rater.img, null, null, img_coords, true)
    if (!(is_interpretation_screen)) {
        drawCaption(ctx, rater, img_coords, font_size)
    }
    return img_coords
}

const drawRatee = (ctx, ratee, score, font_size) => {
    // score = is feedback screen ? 0-4 : null
    const img_size = 0.3 * settings.canvasSize
    const img_coords = {
        x: settings.canvasSize - img_size,
        y: 0,
        dx: img_size,
        dy: img_size
    }
    drawImg(ctx, ratee.img, score, null, img_coords, true)
    drawCaption(ctx, ratee, img_coords, font_size)
    return img_coords
}

const drawWatching = (ctx, n, font_size, is_participant_watching) => {
    const eye_size = 0.15 * settings.canvasSize
    const eye_coords = {
        x: 0,
        y: 0,
        dx: eye_size,
        dy: eye_size
    }

    drawImg(ctx, settings.eye, null, null, eye_coords, false)
    
    // text of who's watching
    ctx.font = font_size + settings.fontFace
    ctx.fillStyle = COLORS.light_blue
    ctx.textBaseline = "top"
    ctx.textAlign = "left"
    const bold = "bold ".concat(ctx.font)
    const unbold = ctx.font
    let x = 0
    let y = eye_coords.y + eye_coords.dy + lineHeight(font_size) / 2
    if (is_participant_watching) {
        ctx.font = bold
		ctx.fillText("You ", x, y)

		x += ctx.measureText("You ").width
		ctx.font = unbold 
		ctx.fillText("and ", x, y)

		x += ctx.measureText("and ").width
		ctx.font = bold 
		ctx.fillText(n.toString(), x, y)

		ctx.font = unbold 
		x = 0
		y += lineHeight(font_size)
		ctx.fillText("other people", x, y)

		ctx.fillStyle = COLORS.white
		y += lineHeight(font_size)
		ctx.fillText("are watching", x, y)
    } else {
        ctx.font = bold 
		ctx.fillText(n.toString().concat(" "), x, y)

		x += ctx.measureText(n.toString().concat(" ")).width
		ctx.font = unbold 
		ctx.fillText("people", x, y)

		ctx.fillStyle = COLORS.white
		x = 0
		y += lineHeight(font_size)
		ctx.fillText("are watching", x, y)
    }
}

const drawQuestion = (ctx, score, font_size) => {
    const thumb_size = 0.1 * settings.canvasSize
    const padding = 7
    const radius = 5  // larger is more rounded question box
    const txt = "How much would you like to be friends with this person?"
    
    const thumb_coords = {}
    // draw thumbs
    for (let i = 1; i <= 4; i++) {
        const thumb_img = (i === 1 || i === 2) ? settings.downThumb : settings.upThumb
        const y_shift = (i === 1 || i === 2) ? 0 : thumb_size / 3
        thumb_coords[i] = {
            x: settings.canvasSize - ((thumb_size + 2 * padding) * (5 - i)),
            y: settings.canvasSize - (thumb_size + 2 * padding) - y_shift,
            dx: thumb_size,
            dy: thumb_size 
        }
        drawImg(ctx, thumb_img, score, i, thumb_coords[i], false)
        if (score === i) {
            ctx.strokeStyle = COLORS.grey 
            ctx.lineWidth = 3
            ctx.strokeRect(thumb_coords[i].x - padding, thumb_coords[i].y - padding, thumb_coords[i].dx + 2 * padding, thumb_coords[i].dy + 2 * padding)
        }
    }
    const all_thumb_coords = {
        x: thumb_coords[1].x,
        y: thumb_coords[4].y,  // 3 and 4 are a little bit higher than 1 and 2
        dx: (thumb_coords[4].x + thumb_coords[4].dx) - thumb_coords[1].x,
        dy: (thumb_coords[1].y + thumb_coords[1].dy) - thumb_coords[4].y
    }

    // draw question
    ctx.fillStyle = COLORS.grey
    const rect_height = textHeight(ctx, txt, all_thumb_coords.dx - 2 * padding, font_size) + padding 
    const question_box_coords = {
        x: all_thumb_coords.x,
        y: all_thumb_coords.y - rect_height - padding * 2,
        dx: all_thumb_coords.dx,
        dy: rect_height
    }
    roundRect(ctx, question_box_coords.x, question_box_coords.y, question_box_coords.dx, question_box_coords.dy, radius, true, true)
    wrapText(ctx, txt, question_box_coords.x + padding, question_box_coords.y + padding, question_box_coords.dx - 2 * padding, font_size)
    
    return {thumb_coords: thumb_coords, question_coords: {
        x: question_box_coords.x,
        y: question_box_coords.y,
        dx: (all_thumb_coords.x + all_thumb_coords.dx) - question_box_coords.x,
        dy: (all_thumb_coords.y + all_thumb_coords.dy) - question_box_coords.y
    }}
}

const drawInterpQuestion = (ctx, img_coords, font_size) => {
    const txt = "How much does this person want to be friends with you?"
    const buffer = 0.05 * settings.canvasSize  // blank space around question
    const height = textHeight(ctx, txt, settings.canvasSize - 2 * buffer, font_size)
    wrapText(ctx, txt, buffer, img_coords.y - lineHeight(font_size) - height, settings.canvasSize - 2 * buffer, font_size)
}

const drawInterpScale = (ctx, img_coords, hover, font_size) => {
    const low_end = "Not at all"
    const high_end = "A lot"
    const button_radius = 0.05 * settings.canvasSize
    const num_buttons = 7
    const buffer = 0.1 * settings.canvasSize  // blank space on left of first button or right of last
    
    const y_middle = img_coords.y + img_coords.dy + button_radius * 2 // y value for middle of each button
    const space_between_buttons = (settings.canvasSize - buffer * 2) / (num_buttons - 1)
    const button_coords = {}  // unlike everywhere else, x and y are centers not top left
    let curr_x = buffer
    for (let i = 1; i <= num_buttons; i++) {
        button_coords[i] = {
            x: curr_x,
            y: y_middle,
            r: button_radius
        } 
        
        // draw circle
        ctx.fillStyle = (hover === i) ? COLORS.grey : COLORS.light_grey
        ctx.strokeStyle = COLORS.black
        ctx.arc(button_coords[i].x, button_coords[i].y, button_coords[i].r, 0, Math.PI * 2)
        ctx.fill()
        curr_x += space_between_buttons
    }

    // separate loop because couldn't figure out why some numbers weren't showing up if done in one pass
    for (let i = 1; i <= num_buttons; i++) {
        // write number
        ctx.font = font_size + settings.fontFace
        ctx.fillStyle = COLORS.black
        ctx.textBaseline = "middle"
        ctx.textAlign = "center"
        ctx.fillText(i.toString(), button_coords[i].x, button_coords[i].y)
    }

    // labels
    ctx.font = Math.floor(font_size * 0.75) + settings.fontFace
    ctx.fillStyle = COLORS.white
    ctx.textBaseline = "top"
    ctx.textAlign = "center"
    ctx.fillText(low_end, button_coords[1].x, button_coords[1].y + button_coords[1].r * 2)
    ctx.fillText(high_end, button_coords[num_buttons].x, button_coords[num_buttons].y + button_coords[num_buttons].r * 2)

    return {button_coords: button_coords, scale_coords: {
        x: buffer - button_radius / 2,
        y: y_middle - button_radius / 2,
        dx: settings.canvasSize - buffer * 2 + button_radius,
        dy: button_radius
    }}
}

const drawSummaryPeople = (ctx, people_lst, mean_score_lst, font_size) => {
    const img_size = 0.25 * settings.canvasSize
    const buffer = 0 * settings.canvasSize  // blank space on left of first button or right of last
    const y = 0.45 * settings.canvasSize

    const space_between_people = (settings.canvasSize - buffer * 2 - img_size * people_lst.length) / people_lst.length
    let curr_x = buffer
    let img_coords = []
    for (let i = 0; i < people_lst.length; i++) {
        img_coords.push({
            x: curr_x,
            y: y,
            dx: img_size,
            dy: img_size
        })
        drawImg(ctx, people_lst[i].img, null, null, img_coords[i], true)
        curr_x += (space_between_people + img_size)
    }

    // for (let i = 0; i < people_lst.length; i++) {
    //     // write avg rating
    //     if (i === 1) { continue }
    //     const keyword = (score_lst[i] === 3 || score_lst[i] === 4) ? "accepted you" : ((score_lst[i] === 1 || score_lst[i] === 2) ? "rejected you" : "did not score you")
    //     wrapText(ctx, "This person " + keyword, img_coords[i].x, img_coords[i].y - 2.5 * lineHeight(font_size), img_coords[i].dx, font_size)
    // }

    for (let i = 0; i < people_lst.length; i++) {
        // write avg rating
        ctx.font = font_size + settings.fontFace;
        ctx.textBaseline = 'top';
        ctx.fillStyle = COLORS.white
        ctx.textAlign = "center";
        ctx.fillText("Average Rating:", img_coords[i].x + img_coords[i].dx / 2, img_coords[i].y + img_coords[i].dy + lineHeight(font_size));
        
        ctx.font = (font_size + 6) + settings.fontFace;
        ctx.fillStyle = mean_score_lst[i] >= 2.5 ? COLORS.green : COLORS.red 
        ctx.fillText(mean_score_lst[i], img_coords[i].x + img_coords[i].dx / 2, img_coords[i].y + img_coords[i].dy + lineHeight(font_size) * 2);

        // wrapText(ctx, "Average Rating: " + mean_score_lst[i], img_coords[i].x, img_coords[i].y + img_coords[i].dy + lineHeight(font_size), img_coords[i].dx, font_size)
    }
}

export {
    drawSM,
    drawProcessSM,
    drawFriendsSM,
    drawCheck,
	drawWatching, 
	drawQuestion,
	drawRater,
    drawRatee,
    drawInterpQuestion,
    drawInterpScale,
    drawSummaryPeople
}