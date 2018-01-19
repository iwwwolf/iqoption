$(function(){
	//- Load the Visualization API and the corechart package.
	google.charts.load('current', {'packages':['corechart']});

	//- Set a callback to run when the Google Visualization API is loaded.
	google.charts.setOnLoadCallback(drawChart);

	//- Callback that creates and populates a data table,
	//- instantiates the pie chart, passes in the data and
	//- draws it.
	function drawChart() {

		//- Create the data table.
		var data = new google.visualization.DataTable();
		var data = google.visualization.arrayToDataTable([
			['Week days', 'Exchange price', 'Mining price'],
			['Tues',  5, 6],
			['Wed',  7, 10],
			['Thurs',  14, 21],
			['Fri',  24, 43],
			['Sat',  38, 39],
			['Sun',  47, 52],
			['Sun',  62, 70]
		]);

		//- Set chart options
		var options = {
						vAxis: {title: 'OTN/USD'},
						hAxis: {title: 'EMISSION WEEK'},
						seriesType: 'line',
				      	series: {
				      		1: {type: 'bars'}
				      	},
				      	colors: ['#24367b', '#ff9b00'],
				      	backgroundColor: { fill:'transparent' }
					};

		//- Instantiate and draw our chart, passing in some options.
		var chart = new google.visualization.ComboChart(document.getElementById('chart_div'));
		chart.draw(data, options);
	}

	$(window).resize(function(){
		console.log('да всё норм')
		drawChart();
	});
});