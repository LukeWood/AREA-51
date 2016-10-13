var map = new UFOs(document,"data/data.json");
var years = {};
var selector;
$.getJSON("ufos.json",function(data){
  selector = document.createElement("select");
  selector.innerHTML = "UFOs in Year: ";
  selector.style.position = "absolute";
  selector.style.top=5;
  selector.style.left=5;
  selector.style.width = "100px";
  function change(){
    map.destroy();
    map = new UFOs(document,"data/data.json");
    var year = this.getAttribute("value");

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
              y/=-145.68+81.5;
              x-=26.45;
              x/=60.55-28.5;
              if(x < 1 && x > 0 && y < 1 && y > 0){
              //console.log(x)

                map.addUFOPercent(x,y);
              }
            }
          }

  }

    data.forEach(function(ufo){
      var year = ufo[0].substring(0,6);
        if(year in years){
            years[year].push([ufo[2],ufo[3]]);
        }
        else{
          years[year] = [[ufo[2],ufo[3]]];
          var date = document.createElement("option");
          date.setAttribute("value", year);
          date.style.padding="20px";
          date.className = "year";
          date.innerHTML = year;
          date.onclick = change;
          selector.appendChild(date);
        }

    });
    selector.children[0].className = "year selected";
    document.body.appendChild(selector);
});
//bounds:-123.4,24.8,-65.9,48.5
$(window).resize(function(){
  map.resize();
});
