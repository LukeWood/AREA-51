var map = new UFOs(document);
var years = {};
var year;
var year_max;
var year_min;
var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

var index = -1;
var year_span;

var last_added = 0;

//todo: implement this.
var existing_json;

$.getJSON("used_data/years.json",function(data){
    years = data;
    var year_max = parseInt(years[years.length-1]);
    year_min = parseInt(years[0]);
    year = years[0];
    year_span = year_max-year_min;
    document.getElementById("firstYear").innerHTML = months[parseInt(years[0].slice(-4).slice(-2))]+" " + years[0].slice(-2)+", " +years[0].substring(0,4);
    document.getElementById("lastYear").innerHTML = months[parseInt(years[years.length-1].slice(-4).slice(-2))]+" " + years[years.length-1].slice(-2)+", " +years[years.length-1].substring(0,4);
});
$("#cover").one("click",function(){
    update();
    $("#cover").hide();
});

function update(){
  year = parseInt(year)+1;
  year= year.toString();
  last_added++;
  updateTimeline();

  $.getJSON("used_data/"+year+".json",function(data){
      var tdata;
      var added = false
      for(var i = 0; i < data.length; i++)
      {
            added = true;
            last_added = 0;
            tdata = data[i];
            if(tdata != undefined){
              var x = tdata[2];
              var y=  tdata[3];
              var xi = x, yi = y;
              y +=81.5;
              y/=-145.68+81.5;
              x-=26.45;
              x/=60.55-28.5;
              if(x < 1 && x > 0 && y < 1 && y > 0){
                map.addUFOPercent(x,y);
          }
        }
      }

  });
  var time = 100-Math.pow(2,last_added);
  if(time < 0){
    time = 10;
  }
  setTimeout(update,time);
}

$(window).resize(function(){
  map.resize();
});
var timeline = document.getElementById("timeline");
var ctx = timeline.getContext("2d");
function updateTimeline(){
  ctx.fillStyle = "#FF0000";
  ctx.fillRect(0,0,timeline.width,timeline.height);
  ctx.fillStyle="#00FF00";
  ctx.fillRect(0,0,timeline.width*(parseInt(year)-year_min)/year_span,timeline.height);

}
