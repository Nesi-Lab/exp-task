// utilities specific to this app/task
import _ from 'lodash'

const getCircles = (width, height, start, stop, size) => {
  const center = size / 2
  const r = center * 0.85
	const n = stop - start + 1

  const slice = Math.PI / (n-1)

  let circles = _.range(start, stop + 1).map( (val) => {
    let theta = slice * val - Math.PI / 2
    let x = r * Math.sin(theta) + center
    let y = r * Math.cos(theta) + center
    return {n: val, x: x, y: y}
  })

  return circles
}

const isColliding = (x1, y1, r1, x2, y2, r2) => {
  let dx = x1 - x2;
  let dy = y1 - y2;
  let distance = Math.sqrt(dx * dx + dy * dy);

  if ( distance < (r1 + r2) ) {
    return true
  } else {
    return false
  }
}

const getCircle = (x, y, r, circles, circle_r) => {

  for(var i=0; i<circles.length; i++) {
    let c = circles[i]
    if ( isColliding(c.x, c.y, circle_r, x, y, r) ) {
      return c
    }
  }

  return null
}

const drawNumbers = (ctx, circles, radius, x, y, cursor_radius) => {
  ctx.font = radius * 0.8 + "px arial";
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";

	let hovered = getCircle(x, y, cursor_radius, circles, radius)

  circles.forEach( (circle) => {
    // draw circle
		if (circle === hovered) {
			ctx.fillStyle = "#778899" // medium grey
		} else {
    	ctx.fillStyle = "#D3D3D3"; // light grey
		}
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, radius, 0, 2 * Math.PI, true);
    ctx.fill();

    // draw text
    ctx.fillStyle = "#000000" // black
    ctx.fillText(circle.n.toString(), circle.x, circle.y + 3.5);
  })
}


export {
	getCircles,
	getCircle,
	drawNumbers
}
