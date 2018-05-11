import {convertToDateString} from './date_handling';
import {UFO_Map} from './ufos';
import {redraw_timeline} from './timeline';

//the ufo map itself
let map = new UFO_Map(document);

let ufo_data_promise = fetch("combined/out.json")
  .then(response => response.json())
let year_promise = fetch("combined/years.json")
  .then(response => response.json())

Promise.all([ufo_data_promise, year_promise])
  .then(data => start(data[0], data[1]))

// These are magic numbers that correctly map to the us border on the image I used lol
function map_to_percentage_basis(x, y) {
  y+=81.5;
  y/=-145.68+81.5;
  x-=26.45;
  x/=60.55-28.5;
  return {x: x, y: y}
}

function add_ufos_for_year(data) {
  data.map((ufo_location) => {
    let location = map_to_percentage_basis(ufo_location[2], ufo_location[3]);
    if(location.x < 1 && location.x > 0 && location.y < 1 && location.y > 0){
      map.addUFOPercent(location.x, location.y);
    }
  });
}

function curry_update(ufo_data, years_available) {

  function curried_update(year_index) {
    let current_year = years_available[year_index];
    let data = ufo_data[current_year]
    if(data) {
      add_ufos_for_year(data);
    }
    redraw_timeline(year_index/years_available.length);
    setTimeout(() => curried_update(year_index+1), 100);
  }

  return curried_update
}

function start(ufo_data, years_available) {
  document.getElementById("firstYear").innerHTML = convertToDateString(years_available[0]);
  document.getElementById("lastYear").innerHTML = convertToDateString(years_available[avail_years.length-1]);
  let update_function = curry_update(ufo_data, years_available);
  update_function(0);
}

window.addEventListener("resize", map.resize);
