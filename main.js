var map = new UFOs(document,"data/data.json");
var years = {};
var selector;
$.getJSON("ufos.json",function(data){
  selector = document.createElement("select");
  selector.style.position = "absolute";
  selector.style.top=0;
  selector.style.left=0;
  $(selector).change(function(){
    map.clear();
      var year = selector.selectedIndex;
      year = selector.options[year].value;

      var data = years[year];
      for(var i = 0; i < data.length; i++)
      {
        tdata = data[i];
        if(tdata != undefined){
          var x = tdata[0];
          var y=  tdata[1];
          var xi = x, yi = y;
          //console.log(x);
          y +=81.5;
          y/=-124.92+81.5;
          x-=26.45;
          x/=60.55-28.5;
          if(x < 1 && x > 0 && y < 1 && y > 0){
          //console.log(x)
            map.addUFOPercent(x,y);
          }
          else{
              if(x < 0){
                console.log("X < 1 : ",xi);
              }
          }
        }
      }

  });
    data.forEach(function(ufo){
      var year = ufo[0].substring(0,6);
        if(year in years){
            years[year].push([ufo[2],ufo[3]]);
        }else{
          years[year] = [[ufo[2],ufo[3]]];
          var date = document.createElement("option");
          date.setAttribute("value", year);
          date.innerHTML = year;
          selector.appendChild(date);
        }

    })
    document.body.appendChild(selector);
});
//bounds:-123.4,24.8,-65.9,48.5
$(window).resize(function(){
  map.resize();
});
