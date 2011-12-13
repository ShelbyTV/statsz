$(document).ready(function(){
  var today = new Date();
  var last_week = today - (1000*60*60*24*7);
  var start = new Date(last_week);
  start = start.yyyymmdd();
  var end = today.yyyymmdd();
  var url = "http://cobra.shelby.tv/v1/sessions/histogram?start="+start+"&end="+end;
  $("#session_historgram").width("100%").height("100%").attr("src", url);
});

/* date helper  */
Date.prototype.yyyymmdd = function() {
  var yyyy = this.getFullYear().toString();
   var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
   var dd  = this.getDate().toString();
   return yyyy + (mm[1]?mm:"0"+mm[0]) + (dd[1]?dd:"0"+dd[0]); // padding
};