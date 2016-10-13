var map = new UFOs(document);
var years = {};
var year;
var selector = document.createElement("h1");
selector.style.position="absolute";
selector.style.zIndex = 1000;
selector.style.color = "white";
selector.style.top=0;
selector.style.left=0;
document.body.appendChild(selector);

$.getJSON("used_data/years.json",function(data){
    years = data;
    year = years[0];
    selector.innerHTML = year;
    $.getJSON("used_data/"+year+".json",function(data){
        map.destroy();
        map = new UFOs(document);
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

            map.startAnimation();

    });
});

$(window).resize(function(){
  map.resize();
});
