var map = new UFOs(document);
var years = {};
var year;
var selector = document.getElementById("labelheader");
var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

var index = -1;

var last_added = 0;
$.getJSON("used_data/years.json",function(data){
    years = data;
    setTimeout(update,3000);
});
function update(){
  index++;
  if(index > years.length -1){
    index = 0;
  }
  year = years[index];
  selector.innerHTML = "UFO sightings in "+months[parseInt(year.slice(-4).substring(0,2))]+ " "+year.slice(-2)+", " + year.substring(0,4);

  $.getJSON("used_data/"+year+".json",function(data){
      var tdata;
      for(var i = 0; i < data.length; i++)
      {
            tdata = data[i];
            if(tdata != undefined){
              var x = tdata[2];
              var y=  tdata[3];
              var xi = x, yi = y;
              //console.log(x);
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
}
$(window).resize(function(){
  map.resize();
});
