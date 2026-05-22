/**
 * Draws an arrow from (x1, y1) to (x2, y2) on the provided canvas context.
 *
 * Args:
 *   ctx (CanvasRenderingContext2D): The drawing context.
 *   x1 (number), y1 (number): Start coordinates in pixels.
 *   x2 (number), y2 (number): End coordinates (arrow tip) in pixels.
 *   color (string): CSS color used for stroke and fill.
 *
 * Returns:
 *   void
 */
export function drawArrow(ctx, x1,y1,x2,y2, color='#000'){
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x1,y1);
  ctx.lineTo(x2,y2);
  ctx.stroke();
  const angle = Math.atan2(y2-y1, x2-x1);
  const head = 8;
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - head * Math.cos(angle - Math.PI/6), y2 - head * Math.sin(angle - Math.PI/6));
  ctx.lineTo(x2 - head * Math.cos(angle + Math.PI/6), y2 - head * Math.sin(angle + Math.PI/6));
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/**
 * Draws a filled ball (circle) with a stroke on the provided canvas context.
 *
 * Args:
 *   ctx (CanvasRenderingContext2D): The drawing context.
 *   x (number), y (number): Center coordinates in pixels.
 *   r (number): Radius in pixels.
 *   color (string): Fill color.
 *
 * Returns:
 *   void
 */
export function drawBall(ctx, x,y,r,color='#0077cc'){
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x,y,r,0,Math.PI*2);
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#003d5c';
  ctx.stroke();
}
