jQuery(document).ready(function($){
	var curr = new Date();
	var lastOfMonth = getDayMonth(new Date(curr.getFullYear(),curr.getMonth()+1, 0));
	var firstOfMonth = getDayMonth(new Date(curr.getFullYear(),curr.getMonth(), 1));
	var first = curr.getDate() - curr.getDay() + 1;
	var last = first + 6;
	var lastDay_tuan = getDayMonth(new Date(curr.setDate(last)));
	//var firstDay_tuan = getDayMonth(new Date(curr.setDate(first)));
	/*************************************************************/
	var day_m = getMonday(new Date()).getDate();
	var month_m = getMonday(new Date()).getMonth() + 1;
	var year_m = getMonday(new Date()).getFullYear();
	if(day_m < 10){
		day_m = '0'+day_m;
	}
	if(year_m < 10){
		year_m = '0'+year_m;
	}
	var firstDay_tuan = day_m+'/'+month_m+'/'+year_m;
	//console.log();
	/*************************************************************/
	var current_day = getDayMonth();
	var filter_day = getUrlParameter('filter_day');
	if(typeof filter_day != 'undefined'){
		if(filter_day == 'homnay'){
			$('#hom-nay').addClass('active');
		}else if(filter_day == 'tuannay'){
			$('#tuan-nay').addClass('active');
		}else if(filter_day == 'thangnay'){
			$('#thang-nay').addClass('active');
		}else if(filter_day == 'quynay'){
			$('#quy-nay').addClass('active');
		}
	}
	function getQuarter(d) {
		d = d || new Date(); // If no date supplied, use today
		var q = [1,2,3,4];
		return q[Math.floor(d.getMonth() / 3)];
	}
	$(document).on('click', '#hom-nay', function(e){
		e.preventDefault();
		$('.form-item-month-to-date input.form-text').val(current_day);
		$('.form-item-month-end input.form-text').val(current_day);
		//Form search dat hang
		$('.don-hang-search-form .form-item-month-to-date input.form-text').val(current_day);
		$('.don-hang-search-form .form-item-month-end-date input.form-text').val(current_day);
		$('.don-hang-search-form .form-item-gt-month-to input.form-text').val(current_day);
		$('.don-hang-search-form .form-item-gt-month-end input.form-text').val(current_day);
		//End form search
		$('input[name="filter_day"]').val('homnay');
		$('#thuongdo-vidientu-search-form input.form-submit').click();
		$('.don-hang-search-form input.form-submit').click();
	});
	$(document).on('click', '#tuan-nay', function(e){
		e.preventDefault();
		$('.form-item-month-to-date input.form-text').val(firstDay_tuan);
		$('.form-item-month-end input.form-text').val(lastDay_tuan);
			//Form search dat hang
		$('.don-hang-search-form .form-item-month-to-date input.form-text').val(firstDay_tuan);
		$('.don-hang-search-form .form-item-month-end-date input.form-text').val(lastDay_tuan);
		$('.don-hang-search-form .form-item-gt-month-to input.form-text').val(firstDay_tuan);
		$('.don-hang-search-form .form-item-gt-month-end input.form-text').val(lastDay_tuan);
		$('input[name="filter_day"]').val('tuannay');
		$('#thuongdo-vidientu-search-form input.form-submit').click();
		$('.don-hang-search-form input.form-submit').click();
	});
	$(document).on('click', '#thang-nay', function(e){
		e.preventDefault();
		$('.form-item-month-to-date input.form-text').val(firstOfMonth);
		$('.form-item-month-end input.form-text').val(lastOfMonth);
			//Form search dat hang
		$('.don-hang-search-form .form-item-month-to-date input.form-text').val(firstOfMonth);
		$('.don-hang-search-form .form-item-month-end-date input.form-text').val(lastOfMonth);
		$('.don-hang-search-form .form-item-gt-month-to input.form-text').val(firstOfMonth);
		$('.don-hang-search-form .form-item-gt-month-end input.form-text').val(lastOfMonth);
		$('input[name="filter_day"]').val('thangnay');
		$('#thuongdo-vidientu-search-form input.form-submit').click();
		$('.don-hang-search-form input.form-submit').click();
	});
	$(document).on('click', '#quy-nay', function(e){
		e.preventDefault();
		var quy = getQuarter();
		if(quy == 1){
			firstOfQuy = '01/01/'+new Date().getFullYear();
			lastOfQuy = '31/03/'+new Date().getFullYear();
		}else if(quy == 2){
			firstOfQuy = '01/04/'+new Date().getFullYear();
			lastOfQuy = '30/06/'+new Date().getFullYear();
		}else if(quy == 3){
			firstOfQuy = '01/07/'+new Date().getFullYear();
			lastOfQuy = '30/09/'+new Date().getFullYear();
		}else if(quy == 4){
			firstOfQuy = '01/10/'+new Date().getFullYear();
			lastOfQuy = '31/12/'+new Date().getFullYear();
		}
		$('.don-hang-search-form .form-item-gt-month-to input.form-text').val(firstOfQuy);
		$('.don-hang-search-form .form-item-gt-month-end input.form-text').val(lastOfQuy);
		$('input[name="filter_day"]').val('quynay');
		$('#thuongdo-vidientu-search-form input.form-submit').click();
		$('.don-hang-search-form input.form-submit').click();
	});
	function getDayMonth(day){
		if(typeof day != 'undefined'){
			//var strDays = new Date(day);
			var strDays = day;
		}else{
			var strDays = new Date();
		}
			var date_day = strDays.getDate();
			var date_month = strDays.getMonth() + 1;
			var date_year = strDays.getFullYear();
		if(date_day < 10){
			date_day = '0'+date_day;
		}
		if(date_month < 10){
			date_month = '0'+date_month;
		}
		return date_day+'/'+date_month+'/'+date_year;
	}
	function getMonday(date) {
			var day = date.getDay() || 7;  
			if( day !== 1 ) 
					date.setHours(-24 * (day - 1)); 
			return date;
	}
});