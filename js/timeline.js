import {convertToDateString} from './date_handling'

const timeline = document.getElementById("timeline");
const currentYear = document.getElementById("currentYear");
const ctx = timeline.getContext("2d");

function redraw_timeline(percent_done){
  ctx.fillStyle = "#333333";
  ctx.fillRect(0,0,timeline.width,timeline.height);
  ctx.fillStyle="#0000FF";
  ctx.fillRect(0,0,timeline.width*percent_done,timeline.height);
}

function set_date(date){
  currentYear.innerHTML = convertToDateString(date)
}

export {redraw_timeline, set_date}
