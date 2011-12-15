$(document).ready(function(){
	google.setOnLoadCallback(drawCharts);
  function drawCharts() {
    /* activity_chart  */
    var width = $("#activity_chart").width();
  	var activity_options = {
  		width: width, height: 100,
  		title: "dau: past 7 days",
  		legend: {position: 'none'},
  		chartArea: {width: '90%'}
  	};
  	
  	plotActivityChart = function(){
  	  var activity_data = new google.visualization.DataTable();
    	activity_data.addColumn('datetime', 'Date');
    	activity_data.addColumn('number', 'DAU');

      // get data from graphite, iterate, pass into data via addRow
      getData('stats.activity.daily.incremental_count', '10min', '-7d', false, 'addActivityData');
      addActivityData = function(d){
        d.datapoints.forEach(function(e){
          var datetime = new Date(e[1]*1000);
          activity_data.addRow([datetime,e[0]]);
        });
      	activity_chart.draw(activity_data, activity_options);
      };
  	};
  	
  	var activity_chart = new google.visualization.LineChart(document.getElementById('activity_chart'));

    // plot it once
  	plotActivityChart(); 
  	// and plot it once a minute thereafter
    setInterval(function(){
    	plotActivityChart();
    },60000);
    
    /* retention_chart  */
  	var retention_chart = new google.visualization.LineChart(document.getElementById('retention_chart'));
    var r_width = $("#retention_chart").width();
  	var retention_options = {
  		width: r_width, height: 100,
  		title: "retention: past 7 days",
  		legend: {position: 'none'},
  		chartArea: {width: '90%'},
  		lineWidth: 2,
  		fontSize: 14,
  		hAxis: {"textPosition": 'out'},
  		vAxis: {title:'%'}
  	};
  	
    plotRetentionChart = function(){
  	  var retention_data = new google.visualization.DataTable();
    	retention_data.addColumn('string', 'Date');
    	retention_data.addColumn('number', 'Retention');

      // get data from graphite, iterate, pass into data via addRow
      getData('stats.activity.retention.weekly', '1d', '-7d', false, 'addRetentionData');
      addRetentionData = function(d){
        d.datapoints.forEach(function(e){
          var datetime = new Date(e[1]*1000);
          var month = datetime.getMonth() + 1;
          var day = datetime.getDate();
          retention_data.addRow([month+"/"+day,e[0]]); 
        });
      	retention_chart.draw(retention_data, retention_options);
      };
  	};
    
    plotRetentionChart();
  }  
});