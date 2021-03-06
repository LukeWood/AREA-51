const days_in_month = [31,28,31,30,31,30,31,31,30,31,30,31];
const num_months = days_in_month.length+1;

function next_date(day, month, year) {
  day++;
  if(day > days_in_month[month-1]) {
    month++;
    day=1;
  }
  if(month > num_months) {
    year++;
    month=1;
  }
  return {day, month, year}
}

const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function toTextDate(day, month, year) {
  return `${months[month-1]} ${day}, ${year}`;
}

//19990101 -> January 1, 1999
function convertToDateString(date){
  let month = parseInt(date.slice(-4).substring(0,2))
  let day = date.slice(-2);
  let year = date.substring(0,4);
  return toTextDate(day, month, year)
}

export {next_date, convertToDateString, toTextDate}
