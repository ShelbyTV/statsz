$(document).ready(function(){
	google.setOnLoadCallback(drawCharts);
  function drawCharts() {
    /* activity_chart  */
  	var activity_data = new google.visualization.DataTable();
  	activity_data.addColumn('string', 'Date');
  	activity_data.addColumn('number', 'DAU');
  	var activity_options = {
  		width: '100%', height: 100,
  		title: "dau: past 7 days",
  		legend: {position: 'none'},
  		chartArea: {width: '90%'}
  	};
  	
  	var activity_chart = new google.visualization.LineChart(document.getElementById('activity_chart'));

    // get data from graphite, iterate, pass into data via addRow
    getData('stats.activity.daily', '10min', '-7d', false, 'addActivityData');
    addActivityData = function(d){
      d.datapoints.forEach(function(e){
        activity_data.addRow([Date(e[1]),e[0]]); // dividing by 6 because of interval of 60 min above (data passed to graphite every 10min)
      });
    	activity_chart.draw(activity_data, activity_options);
    };
    
    /* retention_chart  */
  	var retention_data = new google.visualization.DataTable();
  	//data.addColumn('string', 'Date');
  	retention_data.addColumn('number', 'DAU');
  	var retention_options = {
  		width: '100%', height: 100,
  		title: "retention: past 7 days",
  		legend: {position: 'none'},
  		chartArea: {width: '90%'}
  	};
  	
  	var retention_chart = new google.visualization.LineChart(document.getElementById('retention_chart'));

    // get data from graphite, iterate, pass into data via addRow
    getData('stats.activity.daily', '60min', '-7d', false, 'addRetentionData');
    addRetentionData = function(d){
      d.datapoints.forEach(function(e){
        retention_data.addRow([e[0]/6]); // dividing by 6 because of interval of 60 min above (data passed to graphite every 10min)
      });
    	retention_chart.draw(activity_data, retention_options);
    };
    
    
    
  }  
});