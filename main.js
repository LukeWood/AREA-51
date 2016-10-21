//Main driver, don't import this if you're just working with the map.

//the ufo map itself
var map = new UFOs(document);

//things relating to time/years
var years, year, year_max, year_min, year_span;
var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

var update_lock = false;
//speed that we move through the date, keep track of last time we added something to reduce time between months to prevent large stale periodss
var speed = 0;
var last_added = 0;
var running = true;
var current_year = document.getElementById("currentYear");
var speed_controller = document.getElementById("slider");
var first_year = document.getElementById("firstYear");
var last_year = document.getElementById("lastYear");

var ready = false;
var avail_years = [];
//Converts a number to a date in words:
//19990101 -> January 1, 1999
function convertToDate(year_t){
        return months[parseInt(year_t.slice(-4).substring(0,2))-1]+" " + year_t.slice(-2)+", " +year_t.substring(0,4);
}

//Initialize our years object to the json my python script generated.  This way we don't send out ajax requests for nonexistent json later on.
$.getJSON("combined/out.json",function(data){
    years = data;
    $.getJSON("combined/years.json", function(data2){
      avail_years = data2;
      year_max = parseInt(avail_years[avail_years.length-1]);
      year_min = parseInt(avail_years[0]);
      year = avail_years[0];
      year_span = year_max-year_min;
      first_year.innerHTML = convertToDate(avail_years[0]);
      last_year.innerHTML = convertToDate(avail_years[avail_years.length-1]);
      ready = true;
    });
});

//Remove the cover to from index.html so they can see the visualization
$("#cover").mousedown(function(){
    if(ready){
    updateTimeline();
    $("#cover").fadeOut();
    setTimeout(update,500);
    $("#cover").unbind("mousedown");
    }
    else{
      $(window).load(function(){
        updateTimeline();
        $("#cover").fadeOut();
        setTimeout(update,500);
        $("#cover").unbind("mousedown");
      });
    }
});
//this increments an integer as if it is incrementing months in the year.
var days_in_month = [31,28,31,30,31,30,31,31,30,31,30,31];
function incrementYear(){
    var month = parseInt(year.slice(-4).substring(0,2));
    var day = parseInt(year.slice(-2));
    var tyear = parseInt(year.substring(0,4));
    day++;
    if(day>days_in_month[month-1]){
          month++;
          day=1;
    }
    if(month >= days_in_month.length){
        tyear++;
        month = 1;
    }
    month = month+"";
    if(month.length < 2){
      month="0"+month;
    }
    day = day+"";
    if(day.length <  2){
      day="0"+day;
    }
    year = tyear.toString()+month+day;
    if(parseInt(year) > year_max){
      year = avail_years[avail_years.length-1];
      running = false;
    }
}

function redoMap(){
    var  i=0;
    while(parseInt(avail_years[i]) < parseInt(year)){
        addYear(avail_years[i],true);
        i++;
    }
    running = true;
}

function addYear(year,justpoint){
  if(year in years){
      var data = years[year];
      var added = false
      for(var i = 0; i < data.length; i++){
        added = true;
        last_added = 0;
        var tdata = data[i];
        if(tdata != undefined){
          var x = tdata[2];
          var y=  tdata[3];
          var xi = x, yi = y;
          //These constants are determined by the bounding box of the United states.
          y +=81.5;
          y/=-145.68+81.5;
          x-=26.45;
          x/=60.55-28.5;
          if(x < 1 && x > 0 && y < 1 && y > 0){
            if(justpoint){
              map.addPointPercent(x,y);
            }
            else{
              map.addUFOPercent(x,y);
            }
          }
        }
      }
  }
}


//this happens on a timer based on the speed setting.  It also recalls itself recursively through setTimeout.
function update(){
  if(!running)
  {
    return;
  }
  if(update_lock){
      setTimeout(update,100);
      return;
  }
  incrementYear();
  last_added++;
  updateTimeline();
  current_year.innerHTML = convertToDate(year);

  var time = 1000-(speed*9)-Math.pow(3,last_added);
  if(time < 0){
    time = 10;
  }
  addYear(year);

  setTimeout(update,time);
}

$(window).resize(function(){
  map.resize();
});

$("#restart").mousedown(function(){
	year =avail_years[0];
  map.resetStars();
  if(!running){
      running = true;
      update();
  }
});

var timeline = document.getElementById("timeline");
var $_timeline = $(timeline);
var ctx = timeline.getContext("2d");

var percentDone;
var time_lock = false;

$_timeline.mousemove(function(e){
  if(timeline.mouse_down){
    var x = (e.pageX - $_timeline.offset().left)/$_timeline.width();
    year = avail_years[Math.floor(avail_years.length * x)];
    if(!(year)){
        year = avail_years[avail_years.length-1];
    }
    current_year.innerHTML = convertToDate(year);
    updateTimeline();
  }
});

$_timeline.mousedown(function(e){
  update_lock = true;
  var x = (e.pageX - $_timeline.offset().left)/$_timeline.width();
  year = avail_years[Math.floor(avail_years.length * x)];
  if(!(year)){
      year = avail_years[avail_years.length-1];
  }
  current_year.innerHTML = convertToDate(year);
  map.resetStars();
  redoMap();
  updateTimeline();
  timeline.mouse_down = true;
});

$_timeline.mouseup(function(e){
  update_lock = false;
  map.resetStars();
  timeline.mouse_down = false;
  redoMap();
  running = true;
});

$_timeline.mouseout(function(e){
    if(timeline.mouse_down){
        map.resetStars();
        redoMap();
        update_lock = false;
        timeline.mouse_down = false;
        running = true;
    }
});



function updateTimeline(){
  if(time_lock)
  {return;}
  time_lock = true;
  ctx.fillStyle = "#333333";
  ctx.fillRect(0,0,timeline.width,timeline.height);
  ctx.fillStyle="#0000FF";

  percentDone = avail_years.indexOf(year) > -1 ? avail_years.indexOf(year)/avail_years.length : percentDone;
  ctx.fillRect(0,0,timeline.width*percentDone,timeline.height);
  time_lock = false;
}
document.getElementById("slider").value = 50;

$('#slider').change(function(){
  speed = document.getElementById("slider").value;
  map.setSpeed(parseInt(speed));
});
