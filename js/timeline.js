const timeline = document.getElementById("timeline");
const ctx = timeline.getContext("2d");

function redraw_timeline(percent_done){
  ctx.fillStyle = "#333333";
  ctx.fillRect(0,0,timeline.width,timeline.height);
  ctx.fillStyle="#0000FF";
  ctx.fillRect(0,0,timeline.width*percent_done,timeline.height);
}

export {redraw_timeline}
