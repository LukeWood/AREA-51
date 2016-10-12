var map = new UFOs(document,"data/data.json");
var years = {}
var selector;
$.getJSON("ufos.json",function(data){
  selector = document.createElement("select");
  selector.style.position = "absolute";
  selector.style.top=0;
  selector.style.left=0;
  $(selector).change(function(){
      var year = selector.selectedIndex;
      year = selector.options[year].value;

      var data = years[year];
      console.log(data);
      if(data != undefined){
        var x = data[0];
        var y=  data[1];
        map.addUFOPercent((x+124.3)/(24.8+124.3),(y+65.9)/(48.5+65.9));
      }
  });
    data.forEach(function(ufo){
        years[ufo[0].toString()] = [ufo[2],ufo[3]];
        var date = document.createElement("option");
        date.setAttribute("value", ufo[0].toString());
        date.innerHTML = ufo[0].toString();
        selector.appendChild(date);
    })
    document.body.appendChild(selector);
});
//bounds:-123.4,24.8,-65.9,48.5
$(window).resize(function(){
  map.resize();
});
