$(() => {

	let winWidth = $(window).width();
	let winHeight = $(window).height();
	let video = $('#video');


	// График

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
		var chart = new google.visualization.ComboChart(document.getElementById('chart-div'));
		chart.draw(data, options);
	}


	// появление панели управления видео 
	if(winWidth < 768) {
		video.attr('controls', 'controls');
	}

	video.on('mouseenter', () =>  {
		winWidth = $(window).width();
		if(winWidth >= 768) {
			$(this).attr('controls', 'controls');
		}
	})
	.on('mouseleave',() => {
		if(winWidth >= 768) {
			$(this).removeAttr('controls');
		}
	});

	let firstForm = $('.head-block .form-get');
	let formTop = firstForm.offset().top;
	let formPosition = formTop + firstForm.height();
	let footerFormTop = $('.footer .form-get').offset().top;

	$(window).resize(() => {
		//перерисовать график
		drawChart();

		if($(window).width() < 768) {
			video.attr('controls', 'controls');
		} else {
			video.removeAttr('controls');
		}

		winHeight = $(window).height();
		formPosition = $('.form-get').offset().top + $('.form-get').height();
		footerFormTop = $('.footer .form-get').offset().top;
	});

	// появление блока с ценой

	let winScroll;
	let priceBlock = $('#priceBlock');
	let footer = $('.footer');

	$(window).on('scroll', () => {
		winScroll = $(window).scrollTop();

		if (winScroll < formPosition || (winScroll + winHeight) > footerFormTop) {
			priceBlock.fadeOut();
		} else if (winScroll > formPosition) {
			priceBlock.fadeIn();
		} 
	});

	// переход от блока с ценой к верхней форме

	$('#startBtn').on('click', (e) => {
		e.preventDefault();
		$('html, body').animate({scrollTop: formTop - 100}, 400, ()=> {
			firstForm.find('._email').focus();
		});
	});

	// скроллинг страницы к началу

	$('.footer__arrow').on('click', (e) => {
		e.preventDefault();
		$('html, body').animate({scrollTop: 0}, 400);
	});

	$.getJSON( 'js/errors.json', function( data ) {

		let formGetArr = document.querySelectorAll('.form-get__form');

		//тексты ошибок
		let emptyField = data.emptyField;
		let emailFormat = data.emailFormat;

		$.each( formGetArr, function( index, item ) {
			$(item).validate({
				rules: {
					email: {
						required: true,
						email: true
					},
					password: {
						required: true
					}
				},
				messages: {
					email: {
						required: emptyField,
						email: emailFormat
					},
					password: {
						required: emptyField
					}
				}
				// submitHandler: function(form) {
				// 	form.submit();
				// }
			});
		});
	  

	});

	
	
});