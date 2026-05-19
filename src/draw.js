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

export function drawBall(ctx, x,y,r,color='#0077cc'){
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x,y,r,0,Math.PI*2);
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#003d5c';
  ctx.stroke();
}
