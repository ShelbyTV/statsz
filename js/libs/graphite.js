/* actually funning functions here  */
$(document).ready(function(){
  window.graphiteData = {
    total_users: 0,
    todays_dau: 0,
    yesterdays_dau: 0,
    todays_deu: 0,
    yesterdays_deu: 0,
    dau_growth: 0,
    deu_growth: 0,
    retention: 0,
    session_length: 0
  };
  
  requestLatestData('stats.app.users.total_count', '10min', '-1h', false, 'renderDailyData');
  requestLatestData('stats.activity.daily', '10min', '-2d', false, 'renderDailyData');
  requestLatestData('stats.activity.weekly.total', '23h', '-2d', false, 'renderWeeklyData');
  requestLatestData('stats.activity.retention.weekly', '1d', '-7d', false,'renderWeeklyData');
});

var renderDailyData = function(d){
  var target = escape(d.target);
  switch (target){
    case escape('hitcount(stats.activity.daily, "10min")'):
      // just the last value
      window.graphiteData.todays_dau = Math.ceil(d.datapoints[d.datapoints.length - 1][0]);
      // the max
      window.graphiteData.yesterdays_dau = Math.ceil(Math.max.apply(Math,d.datapoints.map(function(o){return o[0];}))) || "bad ubu";
      $("#todays_dau").append(graphiteData.todays_dau);
      $("#yesterdays_dau").append(graphiteData.yesterdays_dau);
      break;
    case escape('hitcount(stats.app.users.total_count, "10min")'):
      window.graphiteData.total_users = d.datapoints[d.datapoints.length - 1][0];
      $("#total_users").prepend(graphiteData.total_users);
      break;
    default:
      console.log("sorry, something bad happened, very bad.");
  }
};

var renderWeeklyData = function(d){
  console.log(d.datapoints);
  var target = escape(d.target);
  switch (target){
    case escape('hitcount(stats.activity.weekly.total, "23h")'):
      var thisWeek = d.datapoints[d.datapoints.length - 1][0] || 0;
      var lastWeek = d.datapoints[1][0] || 0;
      console.log(lastWeek, thisWeek);
      var growth = (((thisWeek - lastWeek) / lastWeek )*100).toFixed(1);
      window.graphiteData.dau_growth = growth;
      $("#activity_growth").append(growth + " %");
      break;
    case escape('hitcount(stats.activity.retention.weekly, "1d")'):
      window.graphiteData.retention = d.datapoints[0][0] || 0;
      $("#retention_value").append(window.graphiteData.retention + " %");
      break;
    default:
      console.log("sorry, something bad happened, very bad.");
  }
};

var requestLatestData = function(namespace, interval, from, til, callback){
  var url = "";
  if (til){
    url = "http://graphite.shelby.tv/render?target=hitcount(" + namespace + ",%22"+ interval+"%22)&from="+ from +"&until="
      + til +"&format=json&jsonp=" + callback;
  }
  else {
    url = "http://graphite.shelby.tv/render?target=hitcount(" + namespace + ",%22"+ interval+"%22)&from="+ from +"&format=json&jsonp=" + callback;
  }
  
  $(document).ready(function(){
    $.ajax({url: url, dataType:"jsonp"});
  });
};

/* date helper  */
Date.prototype.yyyymmdd = function() {
  var yyyy = this.getFullYear().toString();
   var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
   var dd  = this.getDate().toString();
   return yyyy + (mm[1]?mm:"0"+mm[0]) + (dd[1]?dd:"0"+dd[0]); // padding
};