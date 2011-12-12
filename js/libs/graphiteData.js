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
  // data will update every second
  setInterval(function(){
    getData('stats.app.users.total_count', '10min', '-10min', false, 'renderUserCount');
    getData('stats.activity.daily.incremental_count', '11min', 'midnight+today', false, 'renderTodaysDAU');
    getData('stats.activity.daily.incremental_count', '10min', 'noon+yesterday', 'midnight+today', 'renderYesterdaysDAU');
    getData('stats.activity.weekly.total', '24h', '-7d', false, 'renderGrowthData');
    getData('stats.activity.retention.weekly', '1d', '-7d', false,'renderRetentionData');
  }, 3000);
});


/* callback functions run by getData() that render values */
var renderTodaysDAU = function(d){
  if (d.datapoints.length == 0 || escape(d.target) != escape('hitcount(stats.activity.daily.incremental_count, "11min")') ){ 
    $("#error").text("something is wrong with getting data, sorry dude.").show();
  }
  window.graphiteData.todays_dau = Math.ceil(d.datapoints[d.datapoints.length - 1][0]);
  $("#today_dau_data").text(graphiteData.todays_dau);  
};

var renderYesterdaysDAU = function(d){
  if (d.datapoints.length == 0 || escape(d.target) != escape('hitcount(stats.activity.daily.incremental_count, "10min")') ){ 
    $("#error").text("something is wrong with getting data, sorry dude.").show();
  }
  window.graphiteData.yesterdays_dau = Math.ceil(Math.max.apply(Math,d.datapoints.map(function(o){return o[0];}))) || "bad ubu";
  $("#yesterday_dau_data").text(graphiteData.yesterdays_dau);
};

var renderUserCount = function(d){
  if (d.datapoints.length == 0 || escape(d.target) != escape('hitcount(stats.app.users.total_count, "10min")') ){ 
    $("#error").text("something is wrong with getting data, sorry dude.").show();
  }
  window.graphiteData.total_users = d.datapoints[d.datapoints.length - 1][0];
  // fill in text on page
  $("#total_users").text("total users: " + graphiteData.total_users);
};

var renderGrowthData = function(d){
  if (d.datapoints.length == 0 || escape(d.target) != escape('hitcount(stats.activity.weekly.total, "24h")') ){ 
    $("#error").text("something is wrong with getting data, sorry dude.").show();
  }
  var thisWeek = d.datapoints[d.datapoints.length - 1][0] || 0;
  var lastWeek = d.datapoints[1][0] || null;
  var growth = (((thisWeek - lastWeek) / lastWeek )*100).toFixed(1);
  window.graphiteData.dau_growth = growth;
  $("#activity_growth").text(growth + " %");  
};

var renderRetentionData = function(d){
  if (d.datapoints.length == 0 || escape(d.target) != escape('hitcount(stats.activity.retention.weekly, "1d")') ){ 
    $("#error").text("something is wrong with getting data, sorry dude.").show();
  }
  window.graphiteData.retention = d.datapoints[0][0] || 0;
  $("#retention_value").text(window.graphiteData.retention + " %");
};

var getData = function(namespace, interval, from, until, callback){
  var url = "";
  if (until){
    url = "http://graphite.shelby.tv/render?target=hitcount(" + namespace + ",%22"+ interval+"%22)&from="+ from +"&until="
      + until +"&format=json&jsonp=" + callback;
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