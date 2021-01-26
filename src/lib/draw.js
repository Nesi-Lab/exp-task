import { settings } from '../config/main'
import { wrapText, textHeight, lineHeight, roundRect } from './taskUtils'
import { set } from 'lodash'

// Convention: each "coords" has x (left), y (top), dx, dy, unless stated otherwise

const drawButton = (ctx, coords, rounding, fillColor, fontSize, borderColor, fontColor, text) => {
    const buffer = 30
    const radius = rounding  // larger is more rounded question box
    const text_buffer = 10
    ctx.textBaseline = "top"
    ctx.textAlign = "left"
    ctx.fillStyle = settings.colors[fillColor]
    ctx.font = settings.fontSizes[fontSize] + settings.fontFace
    ctx.strokeStyle = settings.colors[borderColor]
    roundRect(ctx, coords.x, coords.y, coords.dx, coords.dy, radius, true, true)
    ctx.fillStyle = settings.colors[fontColor]
    ctx.fillText(text, coords.x + text_buffer, coords.y + text_buffer, coords.dx - 2 * text_buffer)
    return coords
}

const drawContinue = (ctx) => {
    const set = settings.continueButton
    const buffer = 30
    const continue_coords = {
        x: settings.canvasSize - buffer - set.width,
        y: settings.canvasSize - buffer - set.height,
        dx: set.width,
        dy: set.height
    }
    return drawButton(ctx, continue_coords, set.rounding, set.fillColor, set.fontSize, set.borderColor, set.fontColor, "Continue")
}

const drawPhotoUpload = (ctx) => {
    const set = settings.photoUpload
    const buffer = 10
    const end_of_text_y = wrapText(ctx, set.title, buffer, buffer, settings.canvasSize - 2 * buffer, settings.fontSizes[set.titleFontSize])
    const box_size = set.boxSize
    const box_coords = {
        x: buffer,
        y: end_of_text_y + buffer,
        dx: box_size,
        dy: box_size
    }
    ctx.strokeStyle = settings.colors[set.boxColor]
    ctx.strokeRect(box_coords.x, box_coords.y, box_coords.dx, box_coords.dy)
    
    const upload_coords = { 
        x: box_coords.x + (box_coords.dx - set.uploadButtonWidth) / 2,
        y: box_coords.y + box_coords.dy - settings.continueButton.height - 2 * buffer,
        dx: set.uploadButtonWidth,
        dy: settings.continueButton.height
    }
    drawButton(ctx, upload_coords, settings.continueButton.rounding, settings.continueButton.fillColor, settings.continueButton.fontSize, settings.continueButton.borderColor, settings.continueButton.fontColor, set.uploadButtonText)

    const end_of_text_y2 = wrapText(ctx, set.text1, box_coords.x + box_coords.dx + buffer * 3, box_coords.y, settings.canvasSize - (box_coords.x + box_coords.dx + buffer * 6), settings.fontSizes[set.fontSize])
    const end_of_text_y3 = wrapText(ctx, set.text2, box_coords.x + box_coords.dx + buffer * 3, end_of_text_y2 + buffer * 2, settings.canvasSize - (box_coords.x + box_coords.dx + buffer * 6), settings.fontSizes[set.fontSize])
    // const end_of_text_y4 = wrapText(ctx, set.prompt, box_coords.x, box_coords.y + box_coords.dy + buffer * 2, settings.canvasSize - 2 * buffer, settings.fontSizes[set.fontSize])

    const continue_coords = drawContinue(ctx)
    return {
        upload: upload_coords,
        continue: continue_coords,
        box: box_coords
    }
}

const drawSM = (ctx, socials) => {
    // half line between img and town
    const set = settings.pickSM
    const buffer = 10
    const end_of_text_y = wrapText(ctx, set.textTop, buffer, buffer, settings.canvasSize - 2 * buffer, settings.fontSizes[set.fontSize])
    const img_size = set.imgSize
    const box_size = set.checkBoxSize
    const all_box_coords = []
    socials.forEach(function (social, i) {
        const box_coords = {
            x: buffer,
            y: end_of_text_y + buffer * (i + 1) + img_size * i + (img_size - box_size) / 2,
            dx: box_size,
            dy: box_size
        }
        ctx.fillStyle = settings.colors[set.checkBoxColor]
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
    const last_box = all_box_coords[all_box_coords.length - 1]
    wrapText(ctx, set.textBottom, buffer, last_box.y + last_box.dy + 2 * buffer, settings.canvasSize - 2 * buffer, settings.fontSizes[set.fontSize], "light_red")
    const continue_coords = drawContinue(ctx)
    return {
        boxes: all_box_coords,
        continue: continue_coords
    }
}

const drawProcessSM = (ctx, socials) => {
    // half line between img and town
    const set = settings.searchSM
    const buffer = 30
    const offset = 30
    const txt = set.text
    const end_of_text_y = wrapText(ctx, txt, offset, offset, settings.canvasSize - 2 * buffer, settings.fontSizes[set.fontSize])
    const img_size = set.imgSize
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

const drawFriendsSM = (ctx, socials) => {
    // half line between img and town
    const set = settings.friendsSM
    const buffer = 30
    const offset = 30
    const img_size = set.imgSize
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
    // socials.forEach(function (social, i) {
    //     setTimeout(() => {
    //         drawCheck(ctx, all_img_coords[i], false)
    //     }, 0.01)
    // })
    ctx.beginPath()
    const continue_coords = drawContinue(ctx)
    return {
        boxes: all_img_coords,
        continue: continue_coords
    }
}

const drawCheck = (ctx, coords, is_already_checked) => {
    if (is_already_checked) {
        ctx.fillStyle = settings.colors[settings.pickSM.checkBoxColor]
        ctx.fillRect(coords.x, coords.y, coords.dx, coords.dy)
        return false
    } else {
        drawImg(ctx, settings.check, null, null, coords, false)
        return true
    }
}

const drawCaption = (ctx, person, img_coords) => {
    // half line between img and town
    const set = settings.caption
    const font_size = settings.fontSizes[set.fontSize]
    const town_y = img_coords.y + img_coords.dy + lineHeight(font_size) / 2
    const bio_y = wrapText(ctx, person.town + ", " + set.state, img_coords.x, town_y, img_coords.dx, font_size)
    const end_y = wrapText(ctx, person.bio, img_coords.x, bio_y, img_coords.dx, "italic " + font_size)
    return { x: img_coords.x, y: town_y, dx: img_coords.dx, dy: end_y - town_y }
}

const drawX = (ctx, img_coords) => {
    const set = settings.X
    console.assert(img_coords.dx === img_coords.dy)
    const shorten_x = img_coords.dx * 0.1
    const X_coords = {
        x: img_coords.x + shorten_x,
        y: img_coords.y + shorten_x,
        dx: img_coords.dx - 2 * shorten_x,
        dy: img_coords.dy - 2 * shorten_x
    }
    ctx.lineWidth = set.thickness
    ctx.strokeStyle = settings.colors[set.color]
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
    const set = settings.ratingBox
    const box_dx = (score === 0) ? 0.55 * img_coords.dx : 0.65 * img_coords.dx

    // box
    ctx.fillStyle = settings.colors[set.fillColor]
    ctx.strokeStyle = settings.colors[set.borderColor]
    ctx.lineWidth = 1
    const rel = (score === 0) ? { x: 0.23, y: 0.5, font: 0.6 } : { x: 0.175, y: 0.7, font: 0 }
    let font_size = settings.fontSizes[set.fontSize]
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
    ctx.fillStyle = settings.colors[set.fontColor]
    const padding = { x: 1.01, y: 1.03 }
    const text_coords = {
        x: box_coords.x * padding.x,
        y: box_coords.y * padding.y
    }
    const rating_string = set.ratingText + ": "
    ctx.fillText(rating_string, text_coords.x, text_coords.y)

    // box text number or "NO RATING PROVIDED"
    if (score === 0) {
        font_size = Math.floor(font_size * rel.font)
        ctx.font = font_size + settings.fontFace
        const fillTextMod = (text, line_num) => ctx.fillText(text, text_coords.x, text_coords.y + lineHeight(font_size) * line_num)
        fillTextMod("NO RATING", 1.5)
        fillTextMod("PROVIDED", 2.5)
    } else {
        ctx.fillStyle = settings.colors[settings.thumb["color" + score]]
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
            const set = settings.thumb
            ctx.fillStyle = (thumb_number === score) ?
                settings.colors[set["color" + score]] :
                settings.colors[set.fontColor]
            ctx.font = settings.fontSizes[set.fontSize] + settings.fontFace
            const rel = (thumb_number === 1 || thumb_number === 2) ? { x: 3, y: 6 } : { x: 3, y: 2 }
            const thumb_text_coords = {
                x: img_coords.x + (img_coords.dx / rel.x),
                y: img_coords.y + (img_coords.dy / rel.y)
            }
            ctx.fillText(thumb_number.toString(), thumb_text_coords.x, thumb_text_coords.y)
        }
    }
    return img_coords
}

const drawBackgroundBox = (ctx, x, y) => {
    const space = 30
    ctx.fillStyle = settings.colors[settings.bgBoxes.color]
    ctx.strokeStyle = settings.colors[settings.bgBoxes.color]
    const bgbox_coords = {
        x: x,
        y: y,
        dx: settings.canvasSize / 2 - space,
        dy: settings.canvasSize / 2 - space
    }
    roundRect(ctx, bgbox_coords.x, bgbox_coords.y, bgbox_coords.dx, bgbox_coords.dy, settings.bgBoxes.rounding, true, false)
    return bgbox_coords
}

const drawRater = (ctx, rater, is_interpretation_screen) => {
    const space = 30
    const set = settings.rater
    const img_size = set.imgSize
    let img_coords = {
        x: settings.canvasSize / 2 - img_size / 2,
        y: settings.canvasSize / 2 - img_size / 2,
        dx: img_size,
        dy: img_size
    }
    if (!(is_interpretation_screen)) {
        const bgbox_coords = drawBackgroundBox(ctx, 0, settings.canvasSize / 2 + space / 2)
        const x_offset = (bgbox_coords.dx - img_size) / 2
        img_coords = {
            x: x_offset,
            y: bgbox_coords.y + 10,
            // y: settings.canvasSize - img_size - lineHeight(settings.fontSizes[settings.caption.fontSize]) * 4,
            dx: img_size,
            dy: img_size
        }
        const new_img_coords = {
            x: bgbox_coords.x + 10,
            y: img_coords.y,
            dx: bgbox_coords.dx - 20,
            dy: img_coords.dy
        }
        drawCaption(ctx, rater, new_img_coords)
    }
    drawImg(ctx, rater.img, null, null, img_coords, true)
    // if (!(is_interpretation_screen)) {
    // }
    return img_coords
}

const drawRatee = (ctx, ratee, score) => {
    // score = is feedback screen ? 0-4 : null
    const space = 30
    const bgbox_coords = drawBackgroundBox(ctx, settings.canvasSize / 2 + space / 2, 0)
    const set = settings.ratee
    const img_size = set.imgSize
    const x_offset = (bgbox_coords.dx - img_size) / 2
    const img_coords = {
        x: bgbox_coords.x + x_offset,
        y: 10,
        dx: img_size,
        dy: img_size
    }
    drawImg(ctx, ratee.img, score, null, img_coords, true)
    const new_img_coords = {
        x: bgbox_coords.x + 10,
        y: img_coords.y,
        dx: bgbox_coords.dx - 20,
        dy: img_coords.dy
    }
    drawCaption(ctx, ratee, new_img_coords)
    return img_coords
}

const drawWatchingText = (ctx, x_start, x, y, n, is_participant_watching) => {
    const set = settings.watching
    const font_size = settings.fontSizes[set.fontSize]
    const font_color = settings.colors[set.fontColor]
    const font_color2 = settings.colors[set.fontColor2]
    ctx.font = font_size + settings.fontFace
    ctx.fillStyle = font_color
    ctx.textBaseline = "top"
    ctx.textAlign = "left"
    if (is_participant_watching) {
        ctx.font = font_size + 20 + settings.fontFace
        ctx.fillText("You & ", x, y)

        x += ctx.measureText("You & ").width
        ctx.fillText(n.toString(), x, y)

        ctx.font = font_size + settings.fontFace
        x = x_start
        y += lineHeight(font_size + 14)
        ctx.fillText("other people", x, y)

        ctx.fillStyle = font_color2
        y += lineHeight(font_size)
        ctx.fillText("are watching", x, y)
    } else {
        ctx.font = font_size + 20 + settings.fontFace
        ctx.fillText(n.toString().concat(" "), x, y)

        x += ctx.measureText(n.toString().concat(" ")).width
        ctx.fillText("people", x, y)

        ctx.fillStyle = font_color2
        ctx.font = font_size + settings.fontFace
        x = x_start
        y += lineHeight(font_size + 14)
        ctx.fillText("are watching", x, y)
    }
}

const drawWatching = (ctx, n, is_participant_watching, is_summary=false) => {
    const set = settings.watching
    const eye_size = set.imgSize
    if (!(is_summary)) {
        const bgbox_coords = drawBackgroundBox(ctx, 0, 0)
        const eye_coords = {
            x: (bgbox_coords.dx - eye_size) / 2,
            y: 30,
            dx: eye_size,
            dy: eye_size * 0.506956522
        }

        drawImg(ctx, settings.eye, null, null, eye_coords, false)

        // text of who's watching
        const x_start = eye_coords.x - 5
        let x = x_start
        let y = eye_coords.y + eye_coords.dy + 30
        drawWatchingText(ctx, x_start, x, y, n, is_participant_watching)
    } else {
        const eye_coords = {
            x: 50,
            y: 10,
            dx: eye_size,
            dy: eye_size * 0.506956522
        }

        drawImg(ctx, settings.eye, null, null, eye_coords, false)

        const x_start = eye_coords.x + eye_coords.dx + 30
        let x = x_start
        let y = 20
        drawWatchingText(ctx, x_start, x, y, n, is_participant_watching)
    }
}

const drawQuestion = (ctx, score) => {
    const space = 30
    const bgbox_coords = drawBackgroundBox(ctx, settings.canvasSize / 2 + space / 2, settings.canvasSize / 2 + space / 2)
    const set = settings.ratingQuestion
    const font_size = settings.fontSizes[set.fontSize]
    const thumb_size = settings.thumb.imgSize
    const padding = 7
    const radius = set.rounding  // larger is more rounded question box
    const txt = set.text

    const thumb_coords = {}
    // draw thumbs
    for (let i = 1; i <= 4; i++) {
        const thumb_img = (i === 1 || i === 2) ? settings.downThumb : settings.upThumb
        const y_shift = (i === 1 || i === 2) ? 0 : thumb_size / 3
        thumb_coords[i] = {
            x: settings.canvasSize - ((thumb_size + 2 * padding) * (5 - i)) - 12,
            y: settings.canvasSize - (thumb_size + 2 * padding) - y_shift - 28,
            dx: thumb_size,
            dy: thumb_size
        }
        drawImg(ctx, thumb_img, score, i, thumb_coords[i], false)
        if (score === i) {
            ctx.strokeStyle = settings.colors[settings.thumb.selectedBorderColor]
            ctx.lineWidth = settings.thumb.selectedBorderThickness
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
    ctx.fillStyle = settings.colors[set.fillColor]
    ctx.strokeStyle = settings.colors[set.fillColor]
    ctx.lineWidth = settings.thumb.selectedBorderThickness
    const rect_height = textHeight(ctx, txt, all_thumb_coords.dx - 2 * padding, font_size) + padding
    const question_box_coords = {
        x: all_thumb_coords.x + 10,
        y: all_thumb_coords.y - rect_height - padding * 5,
        dx: all_thumb_coords.dx - 20,
        dy: rect_height
    }
    roundRect(ctx, question_box_coords.x, question_box_coords.y, question_box_coords.dx, question_box_coords.dy, radius, true, true)
    wrapText(ctx, txt, question_box_coords.x + padding, question_box_coords.y + padding, question_box_coords.dx - 2 * padding, font_size)

    return {
        thumb_coords: thumb_coords, question_coords: {
            x: question_box_coords.x,
            y: question_box_coords.y,
            dx: (all_thumb_coords.x + all_thumb_coords.dx) - question_box_coords.x,
            dy: (all_thumb_coords.y + all_thumb_coords.dy) - question_box_coords.y
        }
    }
}

const drawInterpQuestion = (ctx, img_coords) => {
    const set = settings.interpQuestion
    const font_size = settings.fontSizes[set.fontSize]
    const txt = set.text
    const buffer = 0.05 * settings.canvasSize  // blank space around question
    const height = textHeight(ctx, txt, settings.canvasSize - 2 * buffer, font_size)
    wrapText(ctx, txt, buffer, img_coords.y - lineHeight(font_size) - height, settings.canvasSize - 2 * buffer, font_size)
}

const drawScale = (ctx, img_coords, hover, set) => {
    const font_size = settings.fontSizes[set.fontSize]
    const low_end = set.lowText
    const high_end = set.highText
    const button_radius = 0.05 * settings.canvasSize
    const num_buttons = set.numButtons
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
        ctx.fillStyle = (hover === i) ? settings.colors[set.hoverFillColor] : settings.colors[set.fillColor]
        ctx.strokeStyle = settings.colors[set.fontColor]
        ctx.arc(button_coords[i].x, button_coords[i].y, button_coords[i].r, 0, Math.PI * 2)
        ctx.fill()
        curr_x += space_between_buttons
    }

    // separate loop because couldn't figure out why some numbers weren't showing up if done in one pass
    for (let i = 1; i <= num_buttons; i++) {
        // write number
        ctx.font = font_size + settings.fontFace
        ctx.fillStyle = settings.colors[set.fontColor]
        ctx.textBaseline = "middle"
        ctx.textAlign = "center"
        ctx.fillText(i.toString(), button_coords[i].x, button_coords[i].y)
    }

    // labels
    ctx.font = settings.fontSizes[set.labelFontSize] + settings.fontFace
    ctx.fillStyle = settings.colors[set.labelFontColor]
    ctx.textBaseline = "top"
    ctx.textAlign = "center"
    ctx.fillText(low_end, button_coords[1].x, button_coords[1].y + button_coords[1].r * 2)
    ctx.fillText(high_end, button_coords[num_buttons].x, button_coords[num_buttons].y + button_coords[num_buttons].r * 2)

    return {
        button_coords: button_coords, scale_coords: {
            x: buffer - button_radius / 2,
            y: y_middle - button_radius / 2,
            dx: settings.canvasSize - buffer * 2 + button_radius,
            dy: button_radius
        }
    }
}

const drawInterpScale = (ctx, img_coords, hover) => {
    const set = settings.interpScale
    return drawScale(ctx, img_coords, hover, set)
}

const drawFeelingScale = (ctx, img_coords, hover) => {
    const set = settings.interpScale
    return drawScale(ctx, img_coords, hover, set)
}

const drawSummaryPeople = (ctx, people_lst, mean_score_lst, font_size, display_scores) => {
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
    if (display_scores) {
        for (let i = 0; i < people_lst.length; i++) {
            // write avg rating
            ctx.font = font_size + settings.fontFace;
            ctx.textBaseline = 'top';
            ctx.fillStyle = settings.colors["white"]
            ctx.textAlign = "center";
            ctx.fillText("Average Rating:", img_coords[i].x + img_coords[i].dx / 2, img_coords[i].y + img_coords[i].dy + lineHeight(font_size));

            ctx.font = (font_size + 6) + settings.fontFace;
            ctx.fillStyle = mean_score_lst[i] >= 2 ? settings.colors["green"] : settings.colors["red"]
            ctx.fillText(mean_score_lst[i], img_coords[i].x + img_coords[i].dx / 2, img_coords[i].y + img_coords[i].dy + lineHeight(font_size) * 2);

            // wrapText(ctx, "Average Rating: " + mean_score_lst[i], img_coords[i].x, img_coords[i].y + img_coords[i].dy + lineHeight(font_size), img_coords[i].dx, font_size)
        }
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
    drawFeelingScale,
    drawSummaryPeople,
    drawImg,
    drawPhotoUpload
}