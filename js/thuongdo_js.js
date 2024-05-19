var $$ = jQuery.noConflict(true);
var getUrlParameter = function getUrlParameter(sParam) {
        	var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        			sURLVariables = sPageURL.split('&'),
        			sParameterName,
        			i;
        	for (i = 0; i < sURLVariables.length; i++) {
        			sParameterName = sURLVariables[i].split('=');
        			if (sParameterName[0] === sParam) {
        					return sParameterName[1] === undefined ? true : sParameterName[1];
        			}
	}};
function getDayCurrentEn(){
	var date_now = new Date();
	var date_day = date_now.getDate();
	var date_month = date_now.getMonth() + 1;
	var date_year = date_now.getFullYear();
	if(date_day < 10){
		date_day = '0'+date_day;
	}
	if(date_month < 10){
		date_month = '0'+date_month;
	}
	return date_year+'-'+date_month+'-'+date_day;
}
function addDay(date, add){
	var add = add || 5;
	var someDate = new Date(date);
	someDate.setDate(someDate.getDate() + add);
	var dateFormated = someDate.toISOString().substr(0,10);
	return dateFormated;
}
function compare_date(date1, date2){
	if(+ new Date(date1) >= + new Date(date2)){
		return true;
	}else{
		return false;
	}
}
$$(document).ready(function($){
			var at = [
				'bottom left', 'bottom right', 'bottom center',
				'top left', 'top right', 'top center'
			];
			$('.khieunai-hover-qtip').each(function(){
				$(this).qtip({
                 content: {
                     text: $(this).find('.tooltip-table'),
    								 title: {
    									attr: 'alt',
    									text: $(this).closest('td').siblings('td').find('.ten-loai-khieu-nai'),
    									button: true
    								 }
                 },
				 style: {classes: "custom_qtip qtip-red qtip-shadow"},
					show: {solo: true},
				 hide: {
						event: false
				},
				position: {
					at: 'right center',
					my: 'left top',
				}
         });
			});
		//Html5 uploader
		$(document).on("click", ".html5_upload", function(){
		//$(".html5_upload").click(function (){
			$("#hdFileCmtUpload").click();
			$("#hdFileCmtUpload").unbind();
			$("#hdFileCmtUpload").html5Uploader({
				name: "foo",
				postUrl: "/manager/html5/upload",
				onClientLoadStart: function(){
					console.log("Server started upload...")
					$(".html5_upload").addClass("loading")
				},
				onSuccess: function(data){
					//console.log(data.currentTarget.response);
                    setTimeout(function() {
                        if(data) {
                            var dataJson = JSON.parse(data.currentTarget.response);
        					var dataFid = dataJson.fid;
        					get_arr_fid(dataJson);
        					get_img_ul();
                        }
    					$(".html5_upload").removeClass("loading")    
                    }, 1000);
                    
				}
			});
		});
		function get_arr_fid(new_value){
			var fid = $(".form-item-fids textarea").val();
			var arr_fid = [];
			if(fid.length){
				//Co gia tri
				//fid = JSON.parse(fid);
				arr_fid = JSON.parse(fid);
				//arr_fid = fid.split(",");
			}
			arr_fid.push(new_value);//Them gia tri vao mang
			$(".form-item-fids textarea").val(JSON.stringify(arr_fid));
		}
		function get_img_ul(){
			if($(".form-item-fids").length){
				var fid = $(".form-item-fids textarea").val();
				var arr_fid = [];
				var output = "";
				if(fid.length){
					arr_fid = JSON.parse(fid);
					arr_fid.forEach( (val, i) => {
						output += '<li class="html5_uploaded">\
							<span class="show-img"><a href="https://www.thuongdo.com/sites/default/files/2020/'+val.picture+'" target="_blank"> <img src="https://www.thuongdo.com/sites/default/files/2020/'+val.picture+'" width="100" /></a></span>\
							<span class="del-img" title="Xóa" data-fid="'+val.fid+'"><i class="fa fa-close"></i></span>\
						</li>';
					});
					//console.log(output);
					$(".resImg li.html5_uploaded").remove();
					$(".resImg").prepend(output);
				}
			}
		}
		get_img_ul();
		//Xoa file
		$(document).on("click", ".del-img", function(){
			var fid = $(this).data("fid");
			var $this = $(this);
			$.ajax({
				url: "/manager/html5/delete/upload",
				type: "POST",
				data: {
					fid: fid
				},
				success: function(data){
					if(data == 1){
						//Xoa thanh cong
						$this.closest("li").remove();
						var output = "";
						arr_fid = JSON.parse($(".form-item-fids textarea").val());
						var newArr = arr_fid.filter(function(el){
							return el.fid != fid;
						});
						if(newArr.length){
							$(".form-item-fids textarea").val(JSON.stringify(newArr));
						}else{
							$(".form-item-fids textarea").val(JSON.stringify(newArr));
						}
					}
				}
			});
		})
		//End html5 uploader
		 $('.add-kien-hang-khac').click(function(){
			if($(this).hasClass('closed')){
				$(this).next().slideDown(500);
				$(this).removeClass('closed').addClass('opened');
				$(this).html('- THÊM KIỆN HÀNG KHÁC');
			}else if($(this).hasClass('opened')){
				$(this).next().slideUp(500);
				$(this).removeClass('opened').addClass('closed');
				$(this).html('+ THÊM KIỆN HÀNG KHÁC');
			}
		 });
		 $('.kienhang-select-all').click(function(e){
			e.preventDefault();
			if($(this).hasClass('selected')){
				//Bỏ chọn tất cả
				$('.kienhang-cangiao input.form-checkbox').attr('checked', false);
				$(this).html('<i class="fa fa-square-o"></i> Chọn tất cả');
				$(this).removeClass('selected');
			}else{
				//Chọn tất cả
				$('.kienhang-cangiao input.form-checkbox').attr('checked', 1);
				$(this).html('<i class="fa fa-check-square-o"></i> Bỏ Chọn tất cả');
				$(this).addClass('selected');
			}
		 });
		//Update link san pham
		$('.edit-link').change(function(){
			var link_sp = $(this).val();
			var pid_sp = $(this).data('id');
			$.ajax({
				url: '/update/link-sanpham',
				type: 'POST',
				data:{
					link_sp: link_sp,
					pid_sp: pid_sp
				},
				success: function(data){
					if(data == 1){
						alert("Cập nhật link sản phẩm thành công !");
						window.location.reload(true);
					}
				}
			});
		});
		//End Update link san pham
		$(document).on('click', '#set-default', function(e){
		e.preventDefault();
		$('#ajax_loader').show();
		$this = $(this);
		$.ajax({
			url: '/update-default-diachi',
			type: 'POST',
			data:{
				did: $(this).data('did')
			},
			success: function(data){
				console.log(data);
				$('#ajax_loader').hide();
				if(data != -1){
					$this.parent().append('<span class="label-bs label-bs-success">Mặc định</span>');
					$this.remove();
					alert("Đặt địa chỉ mặc định thành công !");
					window.location.reload(true);
				}else{
					alert('Có lỗi xảy ra! Bạn vui lòng thử lại sau.');
				}
			}
		});
	});
	$(document).on('click', '#set-default-truso', function(e){
		e.preventDefault();
		$('#ajax_loader').show();
		$this = $(this);
		$.ajax({
			url: '/update/truso/default',
			type: 'POST',
			data:{
				truso_id: $(this).data('id')
			},
			success: function(data){
				console.log(data);
				$('#ajax_loader').hide();
				if(data != -1){
					alert("Đặt trụ sở mặc định thành công !");
				}else{
					alert('Có lỗi xảy ra! Bạn vui lòng thử lại sau.');
				}
				window.location.reload(true);
			}
		});
	});
	if($('.flatpickr').length){
		$('.flatpickr').flatpickr({
				enableTime: true,
				'locale': 'vn',
				dateFormat: 'd-m-Y H:i'
		});
	}
	if($('.select2-select').length){
		$('.select2-select').select2({
			language: 'vi'
		});
	}
	if($('.info-muahang-2017').length && $('.info-muahang-2017 .form-item-dongbo').length){
		$('.info-muahang-2017 .ttcn-wrap-title').append($('.info-muahang-2017 .form-item-dongbo'));
	}
	$('.wrap-nganhang input.form-checkbox').change(function(){
		var id = $(this).data('id');
		$('.wrap-nganhang input.form-checkbox').each(function(){
			if($(this).data('id') != id){
				$(this).prop('checked', false);
			}
		});
	});
	//Collapse
	$('.td-accordion-title').click(function(){
		var clicking = $(this).data('nid');
		$('.td-accordion-title').each(function(){
			var nid = $(this).data('nid');
			if(clicking != nid){
				$(this).removeClass('collapsed').addClass('collapsed');
				$(this).next().hide();
			}else{
				$(this).next().slideToggle(500);
				$(this).toggleClass('collapsed');
			}
		});
	});
	//Change avatar
	$(".btn-hd-upload").change(function(e){
        var base_url = '/';
	    console.log('change');
        $("#upload-avatar").ajaxSubmit({
            url: '/avatar-save',
            type: 'post',
            dataType: 'json',
            beforeSend: function(){

            },
            success : function(data) {
                if(data.picture) {
                    $("span.avatar img").attr('src','https://thuongdo.com/sites/default/files/pictures/'+data.picture);    
                }
            }
        });
    });
	//Validate File upload
	$(document).on('click', '.bc-cong-viec', function(e){
		e.preventDefault();
		$('#ajax_loader').show();
		var id = $(this).data('id');
		$.ajax({
			url: $(this).attr('href'),
			type: 'POST',
			data: {
				id: id
			},
			success: function(data){
				$('#ajax_loader').hide();
				if(data == -1){
					//Error
					var html = '<a class="uk-modal-close uk-close"></a> <div class="uk-alert uk-alert-danger">Có lỗi xảy ra !</div>';
				}else{
					var html = '<a class="uk-modal-close uk-close"></a>'+data;
				}
				$('#my_modal').addClass('modal-small');
				$('#my_modal .uk-modal-dialog').empty().append(html);
				var modal = UIkit.modal("#my_modal",{bgclose: false}).show();
			}
		});
	});
	//Chosen
	if($('.chosen-select').length){
		$('.chosen-select').chosen();
	}
	if($('.don-hang-search-form #edit-cate-id').length){
		//$('.don-hang-search-form #edit-cate-id').chosen();
	}
	$("#edit-tinh-id").chosen().change(function(){
		$('#ajax_loader').show();
		$.ajax({
			url: '/get-district',
			type: 'POST',
			data: {
				parent: $(this).val()
			},
			success: function(data){
				$('#ajax_loader').hide();
				if(data != -1){					
					$('#edit-quan-id').empty().append(data);
					$('#edit-quan-id').trigger('chosen:updated');
				}else{
					$('#edit-quan-id').empty().append(data);
					$('#edit-quan-id').trigger('chosen:updated');
					console.log('Có lỗi xảy ra! Bạn vui lòng thử lại.');
				}
			},
			complete: function(){
				$('#ajax_loader').hide();
			}
		});
	});
	if($('.city-ajax').length && $('.quan-ajax').length){
		$('.city-ajax').chosen();
		$('.quan-ajax').chosen();
		$(".city-ajax").chosen().change(function(){
			$('#ajax_loader').show();
			$.ajax({
				url: '/get-district',
				type: 'POST',
				data: {
					parent: $(this).val()
				},
				success: function(data){
					$('#ajax_loader').hide();
					if(data != -1){
						console.log(data);
						$('.quan-ajax').empty().append(data);
						$('.quan-ajax').trigger('chosen:updated');
					}else{
						$('.quan-ajax').empty().append(data);
						$('.quan-ajax').trigger('chosen:updated');
						console.log('Có lỗi xảy ra! Bạn vui lòng thử lại.');
					}
				},
				complete: function(){
					$('#ajax_loader').hide();
				}
			});
		});
	}
	//Show popup đã lâu không truy cập
	var show_happy = false;
	var day_current_en = getDayCurrentEn();
	if(typeof Storage !== "undefined"){
		if(localStorage.getItem('day-login') === null){
			show_happy = true;
			localStorage.setItem('day-login', day_current_en);
		}else{
			var date_last_login = localStorage.getItem('day-login');
			var date_last_login_5_day = addDay(date_last_login);
			//So sánh ngày date_last_login_5_day với ngày hiện tại, nếu nhỏ hơn thì hiện popup
			if(compare_date(day_current_en, date_last_login_5_day) == true){
				show_happy = true;
				localStorage.setItem('day-login', day_current_en);
			}else{
				localStorage.setItem('day-login', day_current_en);
			}
		}
	}
	if($('.flip-down').length){
		if(show_happy == true){
			$('.flip-down').css({'opacity': '1', 'top': '29px', 'display': 'block'});
		}else{
			$('.flip-down').removeAttr('style');
		}
	}
	$('.close-flip-down').click(function(e){
		e.preventDefault();
		$('.flip-down').removeAttr('style');
	});
	//End Show popup đã lâu không truy cập
	$('.box-support-chiase .support-header .support-search i').click(function(){
		$('.eco-wrap').slideToggle(500);
	});
	$('.eco').click(function(e){
		e.preventDefault();
		var val_old = $('.support-search input').val();
		$('.support-search input').val(val_old +" "+$(this).data('syntax'));
		$('.eco-wrap').slideUp(500);
	});
	$('.change-per-view').click(function(e){
		e.preventDefault();
		$('#ajax_loader').show();
		$.ajax({
			url: '/change-chiase',
			type: 'POST',
			data: {
				type_chiase: $(this).attr('data-type'),
				id: $(this).attr('data-id')
			},
			success: function(data){
				$('#ajax_loader').hide();
					if(data == 1){
						var html = '<a class="uk-modal-close uk-close"></a> <div class="uk-alert uk-alert-success"> <i class="fa fa-check-square"></i> Cập nhật thành công !</div>';
					}else{
						var html = '<a class="uk-modal-close uk-close"></a> <div class="uk-alert uk-alert-danger"><i class="fa fa-warning"></i> Có lỗi xảy ra, bạn vui lòng thử lại sau !</div>';
					}
					$('#my_modal').addClass('modal-small');
					$('#my_modal .uk-modal-dialog').empty().append(html);
					var modal = UIkit.modal("#my_modal").show();
					window.location.reload(true);
			},
			complete: function(){
				$('#ajax_loader').hide();
			}
		});
	});
	$('.delete-chiase').click(function(e){
		e.preventDefault();
		if(confirm("Bạn có chắc chắn muốn xóa không?")){
			$('#ajax_loader').show();
			$.ajax({
				url: '/xoachiase',
				type: 'POST',
				data:{
					id: $(this).attr('data-id')
				},
				success: function(data){
					$('#ajax_loader').hide();
					if(data == 1){
						var html = '<a class="uk-modal-close uk-close"></a> <div class="uk-alert uk-alert-success"> <i class="fa fa-check-square"></i> Xóa thành công !</div>';
					}else{
						var html = '<a class="uk-modal-close uk-close"></a> <div class="uk-alert uk-alert-danger"><i class="fa fa-warning"></i> Có lỗi xảy ra, bạn vui lòng thử lại sau !</div>';
					}
					$('#my_modal').addClass('modal-small');
					$('#my_modal .uk-modal-dialog').empty().append(html);
					var modal = UIkit.modal("#my_modal").show();
					window.location.reload(true);
				}, 
				complete: function(){
					$('#ajax_loader').hide();
				}
			});
		}
	});
	function ecomotion(){
		//Ecomotion
		var opt = {
			handle: '#etoggle',
			dir: '/sites/all/modules/developer/thuongdo_export/js/emotions/',
			label_on: 'On Emotions',
			label_off: 'Off Emotions',
			style: 'background: #eee',
			css: 'class2'
		}
		if($('.emotion').length){
			$('.emotion').emotions(opt);
		}
		if($('.chiase-block .phanhoi-content').length){
			$('.chiase-block .phanhoi-content').emotions(opt);
		}
	}
	ecomotion();
	//End
	$('#chiase').submit(function(e){
		e.preventDefault();
		var postData = $(this).serializeArray();
		$('.box-support-chiase .list-qa').addClass('uk-hidden');
		$('.b-loading').removeClass('uk-hidden');
		$.ajax({
			url: '/save-chiase',
			data: postData,
			type: 'POST',
			success: function(data){
				$('.box-support-chiase .list-qa').removeClass('uk-hidden');
				$('.b-loading').addClass('uk-hidden');
				$('.support-search input').val('');
				if(data != ""){
					$('.box-support-chiase .list-qa').empty().html(data);
					ecomotion();
				}
			},
			complete: function(){
				$('.box-support-chiase .list-qa').removeClass('uk-hidden');
				$('.b-loading').addClass('uk-hidden');
			}
		});
	});
	$('.chiase-camxuc').click(function(e){
		e.preventDefault();
		$('.box-support-chiase').slideDown(500);
		$('#txt-message').remove();
		if($.trim($('.box-support-chiase .list-qa').html()) == ""){
			$('.box-support-chiase .list-qa').addClass('uk-hidden');
			$.ajax({
				url: '/show-chiase',
				type: 'POST',
				success: function(data){
					$('.box-support-chiase .list-qa').removeClass('uk-hidden');
					$('.b-loading').addClass('uk-hidden');
					if(data != ""){
						$('.box-support-chiase .list-qa').empty().html(data);
						ecomotion();
					}
				},
				complete: function(){
					$('.box-support-chiase .list-qa').removeClass('uk-hidden');
					$('.b-loading').addClass('uk-hidden');
				}
			});
		}
		$(this).addClass('disabled');
	});
	$('.chiase-down').click(function(e){
		e.preventDefault();
		$('#txt-message').remove();
		$('.box-support-chiase').slideUp(500);
		$('.chiase-camxuc').removeClass('disabled');
	});
	if($('.search-full-title').length){
		$('.search-full-title').click(function(){
			$(this).next().slideToggle(500);
		});
	}
	if($('.check').length){
		$('.check input').iCheck({
			checkboxClass: 'icheckbox_square-blue',
			radioClass: 'iradio_square-blue',
			increaseArea: '20%' // optional
		});
	}
	if($('.check-icheck').length){
		$('.check-icheck').iCheck({
			checkboxClass: 'icheckbox_square-blue',
			radioClass: 'iradio_square-blue',
			//radioClass: 'iradio_flat-blue',
			increaseArea: '20%' // optional
		});
	}
	if($('.gop-y-add-form').length){
			$('.gop-y-add-form select').barrating({
				theme: 'fontawesome-stars'
			});
		}
	//Ajax CSKH
	$('.views-cskh').click(function(e){
		e.preventDefault();
		$('#ajax_loader').show();
		var kid = $(this).attr('kid');
		$.ajax({
			url: $(this).attr('href'),
			type: 'POST',
			data:{
				kid: kid
			},
			success: function(data){
				$('#ajax_loader').hide();
				if(data != ""){
					var html = '<a class="uk-modal-close uk-close"></a>'+data;
				}else{
					var html = '<a class="uk-modal-close uk-close"></a> <div class="uk-alert uk-alert-danger">Có lỗi xảy ra !</div>';
				}
				$('#my_modal').addClass('modal-small');
				$('#my_modal .uk-modal-dialog').empty().append(html);
				var modal = UIkit.modal("#my_modal").show();
			},
			complete: function(){
				$('#ajax_loader').hide();
			}
		});
	});
	$(document).on('submit', '#frmCSKH', function(e){
		e.preventDefault();
		$('#ajax_loader').show();
		var kid = $(this).find('#kid').val();
		var content = $(this).find('#content').val();
		$.ajax({
			url: '/add/cskh/submit',
			type: 'POST',
			data:{
				kid: kid,
				content: content
			},
			success: function(data){
				$('#ajax_loader').hide();
				if(data == 1){
					var html = '<a class="uk-modal-close uk-close"></a> <div class="uk-alert uk-alert-success"> <i class="fa fa-check-square"></i> Thêm mới thành công !</div>';
					//window.location.reload(true);
				}else{
					var html = '<a class="uk-modal-close uk-close"></a> <div class="uk-alert uk-alert-danger"><i class="fa fa-warning"></i> Có lỗi xảy ra, bạn vui lòng thử lại sau !</div>';
				}
				$('#my_modal').addClass('modal-small');
				$('#my_modal .uk-modal-dialog').empty().append(html);
				var modal = UIkit.modal("#my_modal").show();
				window.location.reload(true);
			},
			complete: function(){
				$('#ajax_loader').hide();
			}
		});
	});
	$('.add-cskh').click(function(e){
		e.preventDefault();
		$('#ajax_loader').show();
		var kid = $(this).attr('kid');
		$.ajax({
			url: $(this).attr('href'),
			type: 'POST',
			data:{
				kid: kid
			},
			success: function(data){
				$('#ajax_loader').hide();
				if(data != ""){
					var html = '<a class="uk-modal-close uk-close"></a>'+data;
				}else{
					var html = '<a class="uk-modal-close uk-close"></a> <div class="uk-alert uk-alert-danger">Có lỗi xảy ra !</div>';
				}
				$('#my_modal').addClass('modal-small');
				$('#my_modal .uk-modal-dialog').empty().append(html);
				var modal = UIkit.modal("#my_modal").show();
			},
			complete: function(){
				$('#ajax_loader').hide();
			}
		});
	});
	//Ajax xem chi tiet gop y
	$('.view-detail').click(function(e){
		e.preventDefault();
		$('#ajax_loader').show();
		$.ajax({
			url: $(this).attr('href'),
			type: 'POST',
			data:{
				id: $(this).attr('data-id')
			},
			success: function(data){
				$('#ajax_loader').hide();
				if(data != ""){
					var html = '<a class="uk-modal-close uk-close"></a>'+data;
				}else{
					var html = '<a class="uk-modal-close uk-close"></a> <div class="uk-alert uk-alert-danger">Có lỗi xảy ra !</div>';
				}
				$('#my_modal').addClass('modal-small');
				$('#my_modal .uk-modal-dialog').empty().append(html);
				var modal = UIkit.modal("#my_modal").show();
			},
			complete: function(){
				$('#ajax_loader').hide();
			}
		});
	});
	//Ajax change status
	$('.gopy-change').change(function(){
		$('#ajax_loader').show();
		var id = $(this).attr('data-change');
		$.ajax({
			url: '/change/gopy',
			data:{
				id: id,
				status: $(this).val()
			},
			type: 'POST',
			success: function(data){
				$('#ajax_loader').hide();
				if(data == 1){
					var html = '<a class="uk-modal-close uk-close"></a> <div class="uk-alert uk-alert-success"> <i class="fa fa-check-square"></i> Cập nhật trạng thái thành công !</div>';
					//window.location.reload(true);
				}else{
					var html = '<a class="uk-modal-close uk-close"></a> <div class="uk-alert uk-alert-danger"><i class="fa fa-warning"></i> Có lỗi xảy ra, bạn vui lòng thử lại sau !</div>';
				}
				$('#my_modal').addClass('modal-small');
				$('#my_modal .uk-modal-dialog').empty().append(html);
				var modal = UIkit.modal("#my_modal").show();
				window.location.reload(true);
			},
			complete: function(){
				$('#ajax_loader').hide();
			}
		});
	});
	//Ajax thêm danh mục kiện hàng
	$(document).on('click', '.themdanhmuc', function(e){
		e.preventDefault();
		$('#ajax_loader').show();
		//var id = $(this).data('id');
		$.ajax({
			url: '/kien-hang-danh-muc/ajax',
			success: function(data){
				$('#ajax_loader').hide();
				if(data != ""){
					var html = '<a class="uk-modal-close uk-close"></a>'+data;
				}else{
					html = '<a class="uk-modal-close uk-close"></a> <div class="uk-alert uk-alert-danger"><i class="fa fa-warning"></i> Có lỗi xảy ra, bạn vui lòng thử lại sau !</div>';
				}
				$('#my_modal').addClass('modal-small');
				$('#my_modal .uk-modal-dialog').empty().append(html);
				var modal = UIkit.modal("#my_modal").show();
			},
			complete: function(){
				$('#ajax_loader').hide();
			}
		});
	});
	$(document).on('submit', '#frmDanhmuc', function(e){
		e.preventDefault();
		$.ajax({
			url: '/kien-hang-danh-muc/save',
			data: {
				danhmuc: $('#danhmuckienhang').val()
			},
			type: 'POST',
			success: function(data){
				console.log(data);
				if(data > 0){
					var html = '<a class="uk-modal-close uk-close"></a> <div class="uk-alert uk-alert-success"> <i class="fa fa-check-square"></i> Thêm mới danh mục thành công !</div>';
				}else{
					var html = '<a class="uk-modal-close uk-close"></a> <div class="uk-alert uk-alert-danger"><i class="fa fa-warning"></i> Có lỗi xảy ra, bạn vui lòng thử lại sau !</div>';
				}
				$('#my_modal').addClass('modal-small');
				$('#my_modal .uk-modal-dialog').empty().append(html);
				var modal = UIkit.modal("#my_modal").show();
				window.location.reload(true);
			}
		});
	});
	//Ajax hủy kiện hàng
	$('.btn-huy-kienhang').click(function(e){
		e.preventDefault();
		$('#ajax_loader').show();
		var id = $(this).data('id');
		$.ajax({
			url: $(this).attr('href'),
			data:{
				kien_hang_id: id
			},
			success: function(data){
				$('#ajax_loader').hide();
				if(data != ""){
					var html = '<a class="uk-modal-close uk-close"></a>'+data;
				}else{
					html = '<a class="uk-modal-close uk-close"></a> <div class="uk-alert uk-alert-danger"><i class="fa fa-warning"></i> Có lỗi xảy ra, bạn vui lòng thử lại sau !</div>';
				}
				$('#my_modal').addClass('modal-small');
				$('#my_modal .uk-modal-dialog').empty().append(html);
				var modal = UIkit.modal("#my_modal").show();
			},
			complete: function(){
				$('#ajax_loader').hide();
			}
		});
	});
	$(document).on('change', '#huykienhang-lydo', function(){
		if($(this).val() == 8){
			//Ly do khac
			$('.lydokhac').fadeIn(500);
			$('.lydokhac textarea').attr('required', true);
		}else{
			$('.lydokhac').fadeOut(500);
			$('.lydokhac textarea').val('');
			$('.lydokhac textarea').removeAttr('required');
		}
	});
	$(document).on('submit', 'form.changekienhang', function(e){
		e.preventDefault();
		$('#ajax_loader').show();
		$.ajax({
			url: '/save-huykienhang',
			data:{
				lydo: $('#huykienhang-lydo').val(),
				lydokhac: $('textarea').val(),
				kienhang_id: $('#kienhangid').val(),
                fids: $("textarea#edit-fids").val()
			},
			type: 'POST',
			success: function(data){
				$('#ajax_loader').hide();
				console.log(data);
				if(data == 1){
					var html = '<a class="uk-modal-close uk-close"></a> <div class="uk-alert uk-alert-success"> <i class="fa fa-check-square"></i> Hủy kiện hàng thành công !</div>';
				}else if(data == -1){
					var html = '<a class="uk-modal-close uk-close"></a> <div class="uk-alert uk-alert-danger"><i class="fa fa-warning"></i> Có lỗi xảy ra, bạn vui lòng thử lại sau !</div>';
				}
				$('#my_modal').addClass('modal-small');
				$('#my_modal .uk-modal-dialog').empty().append(html);
				var modal = UIkit.modal("#my_modal").show();
				window.location.reload(true);
			},
			complete: function(){
				$('#ajax_loader').hide();
			}
		});
	});
	//Popup
	$('.suport-button').click(function(){
		$('.box-support').slideDown();
		$('.suport-button').addClass('suport-button-active disabled');
        $('#ajax_loader').show();
        $.ajax({
           type: 'POST',
           url: '/manager/link-popup',
           data: {
            
           },
           success: function(data) {
              if(data) {
                $('.box-support ul.list-qa').empty().html(data);
              }
           },
           complete: function() {
             $('#ajax_loader').hide();
           } 
        });
	});
	$('.support-header i').click(function(){
		$('.box-support').slideUp();
		$('.suport-button').removeClass('disabled');
	});

	//Captcha
	$('.captcha .form-item-captcha-response input.form-text').attr('placeholder', ' Nhập mã số...');
	$(window).load(function(){
		if($.trim($('#chartContainer').html()) == ""){
			$('#chartContainer').hide();
		}
	});
	$(document).on('click', '.view-detail-kien-hang-product', function(){
		$(this).siblings('ul').slideToggle();

	});
	//Ajax kiện hàng
	$('.khieunai-special').change(function(){
		var status = $(this).val();
		var id = $(this).attr('data-id');
		$.ajax({
            url: '/khieunai-change-status',
            data: {'khieunai_id':id,'status': status},
            type: 'POST',
            success: function(data){
                $(".loadding-popup .mask").hide();
                $(".process-layout").hide();
                if(data == 1) {
                    alert('Bạn đã cập nhật thành công trạng thái khiếu nại !');
                }else if(data == 2) {
                    alert('Có lỗi xảy ra, bạn vui lòng thử lại sau !');
                }
                window.location.reload(true);
                return false;
            },
            error: function(jqXHR, textStatus, errorThrown){
    
            }       
        });
	});
	$(document).on('click', 'a.view-kien-hang-popup',function(e){
		e.preventDefault();
		$('#ajax_loader').show();
		var sid = $(this).data('id');
		$.ajax({
			url: $(this).attr('href'),
			type: 'GET',
			data:{
				sid: sid
			},
			success: function(data){
				$('#ajax_loader').hide();
				var html = '<a class="uk-modal-close uk-close"></a>'+data;
				$('#my_modal .uk-modal-dialog').empty().append(html);
				$("#my_modal").removeClass('modal-small');
				var modal = UIkit.modal("#my_modal").show();
			},
			complete: function(){
				$('#ajax_loader').hide();
			}
		});
	});
	$(document).on('click', '.tinnoibo', function(e){
		e.preventDefault();
		$('#ajax_loader').show();
		$.ajax({
			url: $(this).attr('href'),
			success: function(data){
				$('#ajax_loader').hide();
				var content = '<div class="bai-viet-detail"><h1 class="title">'+$(data).find('.title').html()+'</h1><div class="noi-dung">'+$(data).find('.noi-dung').html()+'</div></div>';
				var html = '<a class="uk-modal-close uk-close"></a>'+content;
				$('#my_modal .uk-modal-dialog').empty().append(html);
				$("#my_modal").removeClass('modal-small');
				var modal = UIkit.modal("#my_modal").show();
			}
		});
	});
	$('#a-more').click(function(e){
		e.preventDefault();
		$(this).parent().siblings('table').slideToggle(500);
	});
	//Đặt hàng - disable nút đặt hàng khi click
	$('#baiviet-dat-hang-online-form').submit(function(){
		$(this).find('input.form-submit').attr('disabled', true);
	});
	//Rút tiền
	if($('.view-ruttien.view-display-id-page_1 .view-filters').length){
		$('.view-ruttien.view-display-id-page_1 .view-filters').after('<div class="tvh-config"><select id="change-tinhtrang" class="form-select"><option value="none">Chọn tình trạng</option><option value="0">Chưa xử lý</option><option value="1">Đã chuyển</option></select><a href="#" class="btn-config button">Tìm kiếm</a></div>');
	}
	var status = getUrlParameter('status');
	var tab_khachhang = getUrlParameter('tab');
	if(typeof tab_khachhang != 'undefined'){
		if(tab_khachhang == "khachhang"){
			$('.uk-tab li').removeClass('uk-active');
			$('#thong-tin-khach-hang li').removeClass('uk-active');
			$('.uk-tab li:nth-child(2)').addClass('uk-active');
			$('#thong-tin-khach-hang li:nth-child(2)').addClass('uk-active');
		}
		if(tab_khachhang == "lichsucs"){
			$('.uk-tab li').removeClass('uk-active');
			$('#thong-tin-khach-hang li').removeClass('uk-active');
			$('.uk-tab li:nth-child(3)').addClass('uk-active');
			$('#thong-tin-khach-hang li:nth-child(3)').addClass('uk-active');
		}
		if(tab_khachhang == "detailkh"){
			$('.uk-tab li').removeClass('uk-active');
			$('#thong-tin-khach-hang li').removeClass('uk-active');
			$('.uk-tab li:nth-child(1)').addClass('uk-active');
			$('#thong-tin-khach-hang li:nth-child(1)').addClass('uk-active');
		}
	}
	if(typeof status != 'undefined'){
		if($('.view-ruttien.view-display-id-page_1 .view-filters').length){
			if(status != ""){
				$('#change-tinhtrang').val(status);
			}else{
				$('#change-tinhtrang').val('none');
			}
		}
	}
	$(document).on('change', '#change-tinhtrang', function(){
		var selected = $(this).val();
		if(selected != 'none'){
			$('#views-exposed-form-ruttien-page-1 input.form-text').val(selected);
		}else{
			$('#views-exposed-form-ruttien-page-1 input.form-text').val('');
		}
		$('#views-exposed-form-ruttien-page-1 input.form-submit').click();
	});
	$(document).on('click', 'a.btn-config', function(e){
		e.preventDefault();
		var t_select = $('#change-tinhtrang').val();
		if(t_select != 'none'){
			$('#views-exposed-form-ruttien-page-1 input.form-text').val(t_select);
		}else{
			$('#views-exposed-form-ruttien-page-1 input.form-text').val('');
		}
		$('#views-exposed-form-ruttien-page-1 input.form-submit').click();
	});
	//Ký gửi kiện hàng
	/*$('.yeucaukhac .form-item:first-child input').change(function(){
		//console.log(22222222);
		if($(this).is(':checked')){
			$(this).closest('td').siblings().find('.soluongsp').removeClass('hidden').attr('required', true);
			//$(this).closest('.item-not-hidden').siblings().find('.soluongsp').removeClass('hidden').attr('required', true);
		}else{
			$(this).closest('td').siblings().find('.soluongsp').addClass('hidden').removeAttr('required');
			//$(this).closest('.item-not-hidden').siblings().find('.soluongsp').addClass('hidden').attr('required', true);
		}

	});*/
	$('.yeucaukhac .form-item:last-child input').change(function(){
	    
		if($(this).is(':checked')){
			$(this).closest('td').siblings().find('.giatrihanghoa').removeClass('hidden').attr('required', true);
		}else{
			$(this).closest('td').siblings().find('.giatrihanghoa').removeAttr('required');
		}
	});
	$('.yeucaukhac .form-item:first-child input').trigger('change');
	$('.yeucaukhac .form-item:last-child input').trigger('change');
	//Thêm mới sản phẩm
	$('.tvh-themmoi').click(function(e){
		e.preventDefault();
		var hidden = $(this).attr('data-hide');
		$('#thuongdo-export-guiyeucau table tbody tr.hidden-'+hidden).removeClass('hidden');
		$(this).attr('data-hide', (parseInt(hidden) + 1));
		changeStt();
	});
	//Xóa sản phẩm
	$('.recycle').click(function(e){
		e.preventDefault();
		$(this).closest('tr').find('input.form-text').val('');
		$(this).closest('tr').addClass('hidden');
		changeStt();
	});
	function changeStt(){
		var i = 1;
		$('#thuongdo-export-guiyeucau table tbody tr').each(function(){
			if(!$(this).hasClass('hidden')){
				$(this).find('.stt').html(i);
				i++;
			}
		});
	}
	$('#thuongdo-export-guiyeucau table tbody tr').each(function(){
		if($(this).find('.item-ma-van-don').val().length > 0){
			$(this).removeClass('hidden');
		}
	});
	var link_cur = $('tr.hidden-0'); var kygui = false;
	$('.img-upload').click(function(e){
		e.preventDefault();
		kygui = true;
		link_cur = $(this).closest('tr');
		$('.btn-upload').click();
	});
	var link_cur_dathang = $('tr.hidden-0'); var dathang = false;
	$('.img-upload-dathang').click(function(e){
		e.stopPropagation();
		e.preventDefault();
		//alert(1);
		dathang = true;
		link_cur_dathang = $(this).closest('tr');
		$('.btn-upload').trigger('click');
	});
	//Khiếu nại
	$('.open-modal-img').click(function(e){
		e.preventDefault();
		UIkit.modal("#img-modal-"+$(this).data('id')).show();
	});
	$('.edit-image-link').click(function(e){
		e.preventDefault();
		UIkit.modal("#img-modal-admin-"+$(this).data('pid')).show();
	});
	$('.edit-image-link-user-dh').click(function(e){
		e.preventDefault();
		UIkit.modal("#img-modal-user-dh-"+$(this).data('pid')).show();
	});
	$('.edit-image-link-user').click(function(e){
		e.preventDefault();
		UIkit.modal("#img-modal-admin-"+$(this).data('parent')+"-"+$(this).data('child')).show();
	});
	$('.uk-upload-user').click(function(e){
		e.preventDefault();
		if($(this).siblings('input').val().length == 0){
			alert("Bạn chưa nhập link hình ảnh?");
		}else{
			//alert(2);
			var id_parent = $(this).data('parent');//alicdn
			var id_child = $(this).data('child');//alicdn
			var input_val = $(this).siblings('input').val();
			if(input_val.indexOf('alicdn') != -1){
				$('#ajax_loader').show();
				$.ajax({
					url: '/update/img-sanpham-user',
					type: 'POST',
					data:{
						id_parent: id_parent,
						id_child: id_child,
						img_sp: input_val
					},
					success: function(data){
						$('#ajax_loader').hide();
						window.location.reload(true);
					}
				});
				UIkit.modal("#img-modal-"+pid).hide();
			}else{
				alert("Link ảnh sản phẩm không hợp lệ !");
			}
		}
	});
	//Sửa ảnh sản phẩm upload
	$('.uk-upload-admin').click(function(e){
		e.preventDefault();
		if($(this).siblings('input').val().length == 0){
			alert("Bạn chưa nhập link hình ảnh?");
		}else{
			//alert(2);
			var pid = $(this).data('pid');//alicdn
			var input_val = $(this).siblings('input').val();
			if(input_val.indexOf('alicdn') != -1){
				$('#ajax_loader').show();
				$.ajax({
					url: '/update/img-sanpham',
					type: 'POST',
					data:{
						pid_sp: pid,
						img_sp: input_val
					},
					success: function(data){
						$('#ajax_loader').hide();
						window.location.reload(true);
					}
				});
				UIkit.modal("#img-modal-"+pid).hide();
			}else{
				alert("Link ảnh sản phẩm không hợp lệ !");
			}
		}
	});
	//Khach hang sua san pham
	$('.uk-upload-user-dh').click(function(e){
		e.preventDefault();
		if($(this).siblings('input').val().length == 0){
			alert("Bạn chưa nhập link hình ảnh?");
		}else{
			//alert(2);
			var pid = $(this).data('pid');//alicdn
			var input_val = $(this).siblings('input').val();
			if(input_val.indexOf('alicdn') != -1){
				$('#ajax_loader').show();
				$.ajax({
					url: '/update/img-sanpham-user-dh',
					type: 'POST',
					data:{
						pid_sp: pid,
						img_sp: input_val
					},
					success: function(data){
						$('#ajax_loader').hide();
						window.location.reload(true);
					}
				});
				UIkit.modal("#img-modal-user-dh-"+pid).hide();
			}else{
				alert("Link ảnh sản phẩm không hợp lệ !");
			}
		}
	});
	$('.uk-upload').click(function(e){
		e.preventDefault();
		if($(this).siblings('input').val().length == 0){
			alert("Bạn chưa nhập link hình ảnh?");
		}else{
			//alert(2);
			var data_id = $(this).siblings('input').data('i');
			$('.img-upload-dathang-'+data_id).attr('src', $(this).siblings('input').val());
			$('.product-image-'+data_id).val($(this).siblings('input').val());
			UIkit.modal("#img-modal-"+data_id).hide();
		}
	});
	var khieunai = false; var link_input = '';
	$(document).on('click', '.upload-anh', function(e){
		e.preventDefault();
		khieunai = true;
		link_input = '.upload-anh-'+($(this).attr('data-file-img-fid'));
		$('.btn-upload').click();
	});
	var upload_edit_img = false; var data_edit_img = "";
	$(document).on('click', '.edit-image-upload', function(e){
		e.preventDefault();
		upload_edit_img = true;
		data_edit_img = $(this).data('pid');
		$('.btn-upload').click();
	});
	var upload_edit_img_user_dh = false; var data_edit_img_user_dh = "";
	$(document).on('click', '.edit-image-upload-user-dh', function(e){
		e.preventDefault();
		upload_edit_img_user_dh = true;
		data_edit_img_user_dh = $(this).data('pid');
		$('.btn-upload').click();
	});
	//Update link san pham
	$('.edit-link-cart').change(function(){
		var link_sp = $(this).val();
		var id_parent = $(this).data('parent');
		$('#ajax_loader').show();
		$.ajax({
			url: '/update/link-sanpham-user',
			type: 'POST',
			data:{
				link_sp: link_sp,
				id_parent: id_parent
			},
			success: function(data){
				$('#ajax_loader').hide();
				window.location.reload(true);
			}
		});
	});
	var upload_edit_img_user = false; var data_edit_img_user_parent = ""; var data_edit_img_user_child = "";
	$(document).on('click', '.edit-image-upload-user', function(e){
		e.preventDefault();
		upload_edit_img_user = true;
		data_edit_img_user_parent = $(this).data('parent');
		data_edit_img_user_child = $(this).data('child');
		$('.btn-upload').click();
	});
	$('.btn-upload').change(function(e){
			 var base_url = '/';
			 $('.upload-avatar').ajaxSubmit({
					url: '/avatar-save',
					type: 'post',
					dataType: 'json',
					beforeSend: function(){
					},
					success : function(data) {
						console.log(data);
						if(data.picture){
							if(kygui == true){
								link_cur.find('.hinh-anh img').attr('src', '/sites/default/files/pictures/'+data.picture);
								link_cur.find('.hinh-anh input.image_link').val(data.fid);
							}else if(dathang == true){
								link_cur_dathang.find('.hinh-anh img').attr('src', '/sites/default/files/pictures/'+data.picture);
								link_cur_dathang.find('.hinh-anh input.image_link').val(data.fid);
							}else if(khieunai == true){
								$(link_input).siblings().find('img').attr('src', '/sites/default/files/pictures/'+data.picture);
								$(link_input).val(data.fid);
							}else if(upload_edit_img == true){
								if(data_edit_img !== ""){
									//Ajax change image-
									$.ajax({
										url: '/update/img-sanpham',
										type: 'POST',
										data:{
											img_sp: 'https://www.thuongdo.com/sites/default/files/pictures/'+data.picture,
											pid_sp: data_edit_img
										},
										success: function(data){
											window.location.reload(true);
										}
									});
								}
							}else if(upload_edit_img_user_dh == true){
								//console.log(data);
								if(data_edit_img_user_dh !== ""){
									//Ajax change image-
									$.ajax({
										url: '/update/img-sanpham-user-dh',
										type: 'POST',
										data:{
											img_sp: 'https://www.thuongdo.com/sites/default/files/pictures/'+data.picture,
											pid_sp: data_edit_img_user_dh
										},
										success: function(data){
											window.location.reload(true);
										}
									});
								}
							}else if(upload_edit_img_user == true){
								if(data_edit_img_user_parent !== "" && data_edit_img_user_child !== ""){
									//Ajax change image-
									$.ajax({
										url: '/update/img-sanpham-user',
										type: 'POST',
										data:{
											img_sp: 'https://www.thuongdo.com/sites/default/files/pictures/'+data.picture,
											id_parent: data_edit_img_user_parent,
											id_child: data_edit_img_user_child
										},
										success: function(data){
											window.location.reload(true);
										}
									});
								}
							}
						}else{
							if(data == -1){
								alert('Chỉ được upload file ảnh !');
							}else if(data == -2){
								alert('Dung lượng của ảnh không được quá 2MB !');
							}
						}
					}
			});
		});
	$$('#baiviet-dat-hang-online-form table tbody tr td:first-child').wrapInner('<span class="stt"></span>');
	$('.menu-info-left h3').click(function(){
		if($('a',this).hasClass('fa-angle-down')){
			$('a',this).removeClass('fa-angle-down').addClass('fa-angle-right');
		}else if($('a',this).hasClass('fa-angle-right')){
			$('a',this).removeClass('fa-angle-right').addClass('fa-angle-down');
		}
		$(this).next().slideToggle(500);
	});
	function active_menu(element, addClass, li_add, toogle_h3){
		var li_add = li_add || false;
		var toogle_h3 = toogle_h3 || false;
		var path_url = window.location.href;
		var base_url = window.location.origin;
		var url_search = window.location.search.replace('?', '');
		var url_not_search = base_url+window.location.pathname;
		var i = 1;
		$(element).each(function(){
    		var href = base_url+$(this).attr('href');
    		var url_href = base_url+getLocation(href).pathname;
    		var url_search_href = getLocation(href).search.replace('?', '');
    		if(href == path_url){
    			if(li_add == false){
    				$(this).addClass(addClass);
    				if(toogle_h3 == true){
    					$(this).closest('ul').prev('h3').siblings('h3').click();
    				}
    			}else{
    				$(this).closest('li').addClass(addClass);
    			}
    		}
    		i++;
	   });
	}
	function getLocation(href) {
			var match = href.match(/^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)([\/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/);
			return match && {
					href: href,
					protocol: match[1],
					host: match[2],
					hostname: match[3],
					port: match[4],
					pathname: match[5],
					search: match[6],
					hash: match[7]
			}
	}
	active_menu('.menu-info-left ul li a', 'kh-active', false, true);
	active_menu('ul.mobi-tt li a', 'mb-active', true);
});
