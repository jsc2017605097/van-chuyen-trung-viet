(function($) {
  var $ = jQuery;	
	//Thông báo mobile
	$('.header-seach .icon-search-all-product').click(function(e){
		e.preventDefault();
		$('.form-search-product-all-header').addClass('search-open');
	});
	$('.form-search-product-all-header .form-search-product-all-header-close').click(function(e){
		e.preventDefault();
		if($('.form-search-product-all-header').hasClass('search-open')){
			$('.form-search-product-all-header').removeClass('search-open')
		}
	});
    
    $("img.lazy").lazyload({
      effect : "fadeIn"
    });
    
    $("form.tim-kiem-add-form input.form-submit").click(function() {
       var keyword = $("form.tim-kiem-add-form input.keyword").val();
       if(keyword == '') {
          keyword = $(".apps form.tim-kiem-add-form input.keyword").val();
       }
       var action = $("form.tim-kiem-add-form").attr('data-url');
       var website = $("form.tim-kiem-add-form .form-item-category select").val();
       if(action != 'tim-kiem-san-pham') {
             window.location.replace('/tim-kiem-san-pham?keyword='+keyword+'&website='+website);
       } else {
             $("#ajax_loader").show();
             $.ajax({
                  type: 'POST',
                  url: '/tim-kiem-san-pham/ket-qua',
                  data: {
                     keyword:keyword,
                     page_current: 1,
                     website:website
                  },
                  dataType: 'json',
                  success: function(data) {
                     if(parseInt(website) == 2 || parseInt(website) == 3) {
                        if(data.numid) {
                            ecommerce_api_tim_kiem_san_pham_chi_tiet(data.numid);
                        } else {
                            if(parseInt(data.list.code) == 200) {
                                if(typeof data.list.data.resultList) {
                                    var data_product_list = '';
                                    $.each(data.list.data.resultList, function(index, item) {
                                        var price = '';
                                        if(item.promotionPrice != undefined || item.promotionPrice != '') {
                                            var price_exchange = (item.promotionPrice / 100) * data.exchange;
                                            price = '<span class="price-promotion">'+number_format(price_exchange,0,'',',')+'đ</span> \
                                                     <span class="price-other"><b>¥'+(item.promotionPrice / 100)+'</b> / <span class="price-sale">¥'+(item.price / 100)+'</span></span>';
                                        } else {
                                            price = '<span class="price-promotion">¥'+(item.price / 100)+'</span>';
                                        }
                                        delivery_fee = '<span class="delivery-fee"> \
                                                            <img src="/sites/all/themes/giaodiennguoidung/images/truct-free-ship-icon.png" /> \
                                                            <b>Freeship</b> \
                                                        </span>';
                                        if(parseFloat(item.delivery_fee) > 0) {
                                            delivery_fee = '<span class="delivery-fee"> \
                                                                <img src="/sites/all/themes/giaodiennguoidung/images/truct-free-ship-icon.png" /> \
                                                                <b>¥'+item.delivery_fee+'</b> \
                                                             </span>';
                                        }
                                        image = item.picUrl;
                                        image = image.replace('g.search.alicdn.com','img.alicdn.com');
                                        image = image.replace('g.search1.alicdn.com','img.alicdn.com');
                                        image = image.replace('g.search2.alicdn.com','img.alicdn.com');
                                        
                                        var itemUrl = item.itemUrl;
                                        
                                        var websource = '<span></span>';
                                        if(parseInt(item.sourceFrom) == 1) {
                                             websource = '<span></span>';
                                        }
                                        
                                        data_product_list += '<li> \
                                                                <a href="javascript:void(0);" data-url="'+itemUrl+'" onclick="ecommerce_api_tim_kiem_san_pham_chi_tiet('+item.itemId+');" data-numid="'+item.itemId+'" class="image buy-now-'+item.itemId+'" > \
                                                                    <img data-original="'+image+'" src="'+image+'" /> \
                                                                    '+delivery_fee+' \
                                                                </a>\
                                                                <a href="javascript:void(0);" data-url="'+itemUrl+'" onclick="ecommerce_api_tim_kiem_san_pham_chi_tiet('+item.itemId+');" data-numid="'+item.itemId+'" class="title buy-now-'+item.itemId+'" data-pid="'+item.itemId+'">'+item.title+'</a>\
                                                                <div class="p-item-bottom"> \
                                                                    <div class="p-item-bottom-left"> \
                                                                        '+price+' \
                                                                    </div> \
                                                                    <div class="p-item-bottom-right"> \
                                                                        <span><b>'+item.salesVolume+'</b> đã bán</span> \
                                                                    </div> \
                                                                </div> \
                                                                <div class="p-action-footer"> \
                                                                    <a href="'+itemUrl+'" class="view-more" target="_blank">Xem chi tiết</a> \
                                                                    <a href="javascript:void(0);" data-url="'+itemUrl+'" onclick="ecommerce_api_tim_kiem_san_pham_chi_tiet('+item.itemId+');" data-numid="'+item.itemId+'" class="buy-now buy-now-'+item.itemId+'">Đặt hàng</a> \
                                                                </div>\
                                                              </li>';
                                    });
                                    $(".ket-qua-tim-kiem-san-pham-block .content-product").empty().html('<ul>'+data_product_list+'</ul>');
                                    
                                    $("img.lazy").lazyload({
                                       effect : "fadeIn"
                                    });
                                    
                                    if(typeof data.list.data.totalResults) {
                                        var pages_max = parseInt(data.list.data.totalResults) / 40;
                                        var pager_ins = '';
                                        var page_current = parseInt(data.pager_current);
                                        var page_first = 1;
                                        if(page_current - 4 < 1) {
                                            page_first = 1;
                                        } else {
                                            page_first = page_current - 4;
                                        }
                                        var pager_next = page_current + 4;
                                        for(var i = page_first; i < pager_next ; i++) {
                                            var selected_pager = parseInt(data.pager_current) == i ? 'page-current' : '';
                                            pager_ins += '<a href="javascript:void(0);" onclick="ecommerce_api_tim_kiem_san_pham_by_pager(/'+keyword+'/,'+i+');" class="item '+selected_pager+'">'+i+'</a>';
                                        }
                                        $(".ket-qua-tim-kiem-san-pham-block .pager").empty().html(pager_ins);
                                        
                                        $(".search-result-total").empty().html('Có <b>'+number_format(data.list.data.totalResults,0,'',',')+'</b> sản phẩm được tìm thấy');
                                        
                                    }
                                    
                                }
                            } else {
                                alert(data.list.data.error);
                            }   
                        } 
                     } else if (parseInt(website) == 1) {
                        if(typeof data.list.data.data) {
                            var data_product_list = '';
                            $.each(data.list.data.data, function(index, item) {
                                var price = '';
                                if(typeof item.priceInfo.price) {
                                    var price_exchange = item.priceInfo.price * data.exchange;
                                    price = '<span class="price-promotion">'+number_format(price_exchange,0,'',',')+'đ</span> \
                                             <span class="price-sale"><b>¥'+item.priceInfo.price+'</b></span>';
                                }
                                data_product_list += '<li> \
                                                        <a href="javascript:void(0);" onclick="ecommerce_api_tim_kiem_1688_san_pham_chi_tiet('+item.offerId+');" data-numid="'+item.offerId+'" class="image buy-now-'+item.offerId+'" > \
                                                            <img data-original="'+item.imageUrl+'" src="'+item.imageUrl+'" /> \
                                                        </a>\
                                                        <a href="javascript:void(0);" onclick="ecommerce_api_tim_kiem_1688_san_pham_chi_tiet('+item.offerId+');" data-numid="'+item.offerId+'" class="title buy-now-'+item.offerId+'" data-pid="'+item.offerId+'">'+item.subject+'</a>\
                                                        <div class="p-item-bottom"> \
                                                            <div class="p-item-bottom-left"> \
                                                                '+price+' \
                                                            </div> \
                                                            <div class="p-item-bottom-right"> \
                                                                <span class="month-sold"><b>'+item.monthSold+'</b> đã bán/tháng</span>\
                                                                <span class="repurchase-rate"><b>'+item.repurchaseRate+'</b> mua lại</span>\
                                                            </div> \
                                                        </div> \
                                                        <div class="p-action-footer"> \
                                                            <a href="javascript:void(0);" class="view-more" target="_blank">Xem chi tiết</a> \
                                                            <a href="javascript:void(0);" onclick="ecommerce_api_tim_kiem_1688_san_pham_chi_tiet('+item.offerId+');" data-numid="'+item.offerId+'" class="buy-now buy-now-'+item.offerId+'">Đặt hàng</a> \
                                                        </div>\
                                                      </li>';
                            });
                            
                            $(".ket-qua-tim-kiem-san-pham-block .content-product").empty().html('<ul>'+data_product_list+'</ul>');
                            
                            $("img.lazy").lazyload({
                               effect : "fadeIn"
                            });
                            
                            if(typeof data.list.data.totalRecords) {
                                var pages_max = data.list.data.totalRecords / data.list.data.pageSize;
                                var pager_ins = '';
                                var page_current = parseInt(data.pager_current);
                                var page_first = 1;
                                if(page_current - 4 < 1) {
                                    page_first = 1;
                                } else {
                                    page_first = page_current - 4;
                                }
                                var pager_next = page_current + 4;
                                for(var i = page_first; i < pager_next ; i++) {
                                    var selected_pager = parseInt(data.pager_current) == i ? 'page-current' : '';
                                    pager_ins += '<a href="javascript:void(0);" onclick="ecommerce_api_tim_kiem_san_pham_by_pager(/'+keyword+'/,'+i+');" class="item '+selected_pager+'">'+i+'</a>';
                                }
                                $(".ket-qua-tim-kiem-san-pham-block .pager").empty().html(pager_ins);
                            }
                        }
                     }
                  },
                  complete: function() {
                    $("#ajax_loader").hide(); 
                  }
            }); 
       }
    });
    
    $("form.dang-ky-san-sale-add-form button").click(function() {
       var fullname = $("form.dang-ky-san-sale-add-form input.fullname").val();
       var phone = $("form.dang-ky-san-sale-add-form input.phone").val();
       var content = $("form.dang-ky-san-sale-add-form textarea.content").val();
       if(fullname == '') {
          alert('Vui lòng nhập họ và tên');
          return false;
       }
       if(phone == '') {
          alert('Vui lòng nhập số điện thoại');
          return false;
       }
       if(validatePhone("sale-phone")) {
        
       } else {
          alert('Số điện thoại không hợp lệ');
          return false;
       }
       if(content == '') {
          alert('Vui lòng nội dung');
          return false;
       }
       $("#ajax_loader").show();
       $.ajax({
          type: 'POST',
          url: '/newsletter/sale-save',
          data: {
            fullname:fullname,
            phone:phone,
            content:content
          },
          dataType: 'json',
          success: function(data) {
            if(parseInt(data.status) == 1) {
                alert(data.msg);
                setTimeout(function() {
                    window.location.reload(true);
                }, 1000);
            } else {
                alert(data.msg);
            }
          },
          complete: function() {
            $("#ajax_loader").hide();     
          }
       });
       return false; 
    });
    
    khach_hang_sale_timecountdown('sale-timecountdown',$("#sale-timecountdown").attr('data-date'));
    
	$('a.noti-bell').click(function(e){
		e.preventDefault();
		var flag_active = false;
		$('.notify-sidebar li a').each(function(){
			if($(this).hasClass('active')){
				flag_active = true;
			}
		});
		if(flag_active == false){
			$(".panel-notify .notify-body ul.notify-sidebar li.first a").trigger('click');
		}
		if($(this).next().css('display') == 'none'){
			$(this).next().show();
		}else{
			$(this).next().hide();
		}
	});
    $('#article-home-item').owlCarousel({
        loop:true,
        margin:10,
        nav:true,
        items : 1,
        autoPlay: 3000,
        responsive:{
            0:{
                items:1
            },
            600:{
                items:1
            },
            1000:{
                items:1
            }
        }
    });
	$(".panel-notify .notify-body ul.notify-sidebar li a").click(function(e) {
		e.preventDefault();
		var id_link = $(this).attr('href');
		if(id_link == '#td-thongbao' && !$(this).hasClass('active')){
			ajax_thongbao();
		}else if(id_link == '#td-taichinh' && !$(this).hasClass('active')){
			ajax_thongbao_taichinh();
		}else if(id_link == '#td-kienhang' && !$(this).hasClass('active')){
			ajax_thongbao_kienhang();
		}else if(id_link == '#td-yeucau' && !$(this).hasClass('active')){
			ajax_thongbao_khieunai();
		}
		$(".panel-notify .notify-body ul.notify-sidebar li a").removeClass('active');
		$(this).addClass('active');
		$(".panel-notify .notify-header").html('');
		$(".panel-notify .notify-header").html($(this).attr('data-title'));
		$('.td-notify').hide();
		$(id_link).show();
	});
	/* $(document).click(function(e){
		var panel_notify = $('.panel-notify');
		if (panel_notify.is(':visible') && !panel_notify.is(e.target) && panel_notify.has(e.target).length === 0 && !$('a.noti-bell').is(e.target)){
      panel_notify.hide();
      return false;
    }
	}); */
	function ajax_thongbao(){
			$.ajax({
				url: '/update/tinthongbao/xem',
				type: 'POST',
				dataType: 'json',
				success: function(data){
					 //console.log(data);
					if(data){
						//if(isEmpty(data.total) == false){
							$('.tb-thongbao .uk-badge-abs').text(data.total);
							$('.thong-tin .name b').text(data.total_thongbao);
						//}
					}
				},
				error: function(){
					//alert("Có lỗi xảy ra !");
				}
			});
		}
		//ajax_thongbao();
		function ajax_thongbao_khieunai(){
			$.ajax({
				url: '/update/khieunai/xem',
				type: 'POST',
				dataType: 'json',
				success: function(data){
					if(data){
						$('.tb-khieunai .uk-badge-abs').text(data.total);
						$('.thong-tin .name b').text(data.total_thongbao);
					}
				},
				error: function(){
					alert("Có lỗi xảy ra !");
				}
			});
		}
		function ajax_thongbao_kienhang(){
			$.ajax({
				url: '/update/kienhang/xem',
				type: 'POST',
				dataType: 'json',
				success: function(data){
					if(data){
						$('.tb-kienhang .uk-badge-abs').text(data.total);
						$('.thong-tin .name b').text(data.total_thongbao);
					}
				},
				error: function(){
					alert("Có lỗi xảy ra !");
				}
			});
		}
		function ajax_thongbao_taichinh(){
			$.ajax({
				url: '/update/taichinh/xem',
				type: 'POST',
				dataType: 'json',
				success: function(data){
					if(data){
						$('.tb-taichinh .uk-badge-abs').text(data.total);
						$('.thong-tin .name b').text(data.total_thongbao);
					}
				},
				error: function(){
					alert("Có lỗi xảy ra !");
				}
			});
		}
    var getDecimal = 2;
    var getvMax = '999999.99';
    var getOption = $.parseJSON('{"mDec":  ' + getDecimal + ',"vMax": ' + getvMax + '}');
    $("input.auto").autoNumeric('init', getOption);
    
    var getDecimal = 0;
    var getvMax = '99999999999';
    var getOption = $.parseJSON('{"mDec":  ' + getDecimal + ',"vMax": ' + getvMax + '}');
    $("input.auto-vnd").autoNumeric('init', getOption);
    
    $(".kien-hang-item .form-checkboxes input").each(function() {
        var parentId = $(this).attr('data-parent-id');
        if($(this).is(':checked')) {
            if($(this).val() == 3) {
               // Kiem hang
               $(".kien-hang-item-"+parentId+ " .form-item-list-kiem-hang").removeClass('hidden');
            }
            if($(this).val() == 4) {
               // Bao hiem
               $(".kien-hang-item-"+parentId+ " .form-item-list-gia-tri").removeClass('hidden');
            }
        }
    });
    
    // Don ky gui QC
    $(".kien-hang-item .form-checkboxes input").click(function() {
       var parentId = $(this).attr('data-parent-id');
       if($(this).is(':checked')) {
         if($(this).val() == 3) {
            // Kiem hang
            $(".kien-hang-item-"+parentId+ " .form-item-list-kiem-hang").removeClass('hidden');
         }
         if($(this).val() == 4) {
            // Bao hiem
            $(".kien-hang-item-"+parentId+ " .form-item-list-gia-tri").removeClass('hidden');
         }
       } else {
         if($(this).val() == 3) {
            // Kiem hang
            if($(".kien-hang-item-"+parentId+ " .form-item-list-kiem-hang").hasClass('hidden') === false) {
                $(".kien-hang-item-"+parentId+ " .form-item-list-kiem-hang").addClass('hidden');    
            }
         }
         if($(this).val() == 4) {
            // Bao hiem
            if($(".kien-hang-item-"+parentId+ " .form-item-list-gia-tri").hasClass('hidden') === false) {
                $(".kien-hang-item-"+parentId+ " .form-item-list-gia-tri").addClass('hidden');    
            }
         } 
       }
        
    });
    
    // change
	$(".kien-hang-history-status a.view-detail-kien-hang-product").click(function(e) {
        $(this).parent().children('table').slideToggle();
    });
	//Thu gọn, mở rộng đặt hàng
	$('.panel-title').click(function(e){
		e.preventDefault();
		if($(this).find('i').hasClass('uk-icon-long-arrow-right')){
			$(this).find('a.thugon').html('<i class="uk-icon-long-arrow-left"></i> Mở rộng');
			$(this).find('a.thugon').attr('title','Mở rộng');
		}else{
			$(this).find('a.thugon').html('<i class="uk-icon-long-arrow-right"></i> Thu gọn');
			$(this).find('a.thugon').attr('title','Thu gọn');
		}
		$(this).next().slideToggle();
	});
	function chang_stt(){
		var i = 1;
		$('#don-hang-dat-hang-online-add-form .panel-title').each(function(){
			if(!$(this).hasClass('item-is-hidden')){
				$(this).find('.uk-badge-info strong').html(i);
				i++;
			}
		});
	}
	chang_stt();
	$('.xoa-item').click(function(e){
		e.preventDefault();
		if(confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')){
			$(this).closest('.panel-title').addClass('item-is-hidden');
			$(this).closest('.panel-title').siblings('.wrap-toggle').children().addClass('item-is-hidden');
			$(this).closest('.panel-title').siblings('.wrap-toggle').find('input.form-text').val('');
			$(this).closest('.panel-title').siblings('.wrap-toggle').find('textarea').val('');
			chang_stt();
		}
	});
  $("select.the-tich").change(function() {
		_id = $(this).attr('data');
		_type = $(this).val();
		_qty = $("#edit-sanpham-item-"+_id+"-qty").val();
		_total = 0;
		_the_tich = $("#edit-sanpham-item-"+_id+"-thetich-detail").val();
		if(_type == 1) {
			_total = _qty * 50000;
		}else if(_type == 2) {
			_total = _the_tich * 35000;
		}else if(_type == 3) {
			_total = _the_tich * 2300000;
		}
		$("#edit-sanpham-item-"+_id+"-phivevietname").val(number_format(_total,0,'',','));
		_price = number_format($("#edit-sanpham-item-"+_id+"-price").val(),0,',','');
		// Thanh tien
        _tigia = $("span.ti-gia").html();
		_thanhtien = parseInt(_price) * _qty * parseInt(_tigia) + parseInt(_total);
		$("#edit-sanpham-item-"+_id+"-tongtien").val(number_format(_thanhtien,0,'',','));
		_total = 0;
		for(i = 1; i <= 20; i++) {
			_thanhtinh = number_format($("#edit-sanpham-item-"+i+"-tongtien").val(),0,',','');
			_total += parseInt(_thanhtinh);
		}
		$("p.total span").html(number_format(_total,0,'',','));
	});
  var min = "-95%",max = "0px";	
	$(".icon-click").click(function(){
		if($('.menu-mobi').hasClass('menu-show')){
			$(".menu-mobi").animate({ left: '0px' });
			$('.menu-mobi').removeClass('menu-show');
			$('.menu-mobi').addClass('menu-hide');
			$(this).children('img').attr('src','/sites/all/themes/giaodienmobile/images/menu-icon-close.png');
		}else if($('.menu-mobi').hasClass('menu-hide')){
			$('.menu-mobi').removeClass('menu-hide');
			$('.menu-mobi').addClass('menu-show');
			$(".menu-mobi").animate({ left: '-95%' });
			$(this).children('img').attr('src','/sites/all/themes/giaodienmobile/images/menu-icon-open.png');
		}
	});
	// Menu Bar QC
	$("a.menu-bar").click(function() {
		if($('.menu-bar-item').hasClass('menu-show')){
			$(".menu-bar-item").animate({ left: '0px' });
			$('.menu-bar-item').removeClass('menu-show');
			$('.menu-bar-item').addClass('menu-hidden');
		}else if($('.menu-bar-item').hasClass('menu-hidden')){
			$('.menu-bar-item').removeClass('menu-hidden');
			$('.menu-bar-item').addClass('menu-show');
			$(".menu-bar-item").animate({ left: '-100%' });
		}
	});
	
	$(".search-text span").click(function() {
       $(".search-text ul.search-hover").show();
       $(".olay-css").show();
    });
    $(".search-text ul.search-hover li").click(function() {
        _src = $(this).children('img').attr('src');
        $(".search-text img.active-seleted").attr('src',_src);
        $(".search-text ul.search-hover").hide();
				console.log($(this).attr('data-id'));
        $(".search-text .form-item-category select").val($(this).attr('data-id'));
        $('.olay-css').hide();
    });
    $(".olay-css").click(function() {
       if($(this).css('display') == 'block') {
          $(".search-text ul.search-hover").hide();
          $(this).hide();
       } 
    });
	$('button#datcoc100').click(function(e){
		e.preventDefault();
		if(confirm('Bạn có chắc chắn muốn đặt hàng ?')) {
		    $("#ajax_loader").show();
			$.ajax({
					url: '/don-hang-xac-nhan-dat-coc',
					data: {'orderid':$(this).data('id')},
					type: 'POST',
					success: function(data){
							 window.location.reload(true);
					},
					error: function(jqXHR, textStatus, errorThrown){
							
					},
                    complete: function() {
                        $("#ajax_loader").hide();
                    }       
			});
		}
	});
	$('button#datcoc90').click(function(e){
		e.preventDefault();
		if(confirm('Bạn có chắc chắn muốn đặt hàng ?')) {
		    $("#ajax_loader").show();
			$.ajax({
					url: '/don-hang-dat-coc-xac-nhan',
					data: {'orderid':$(this).data('id')},
					type: 'POST',
					success: function(data){
							 window.location.reload(true);
					},
					error: function(jqXHR, textStatus, errorThrown){
							
					},
                    complete: function() {
                        $("#ajax_loader").hide();
                    }       
			});
		}
	});
  // SHOW ROW DAT HANG
  $("span.close-item-row").click(function() {    
    $(this).parents('.item-open-row').removeClass('item-open-row');
  });
  // DAT HANG 
  $(".table-bottom a.them-moi").click(function() {
    _count = $(this).attr('data');
    $(".item-not-hidden-"+_count).removeClass('item-is-hidden');
    _row_Close = parseInt(_count) - 1;
    //$(".item-hidden-row-"+_row_Close).addClass('item-open-row');
    $(".item-hidden-row-"+_row_Close+" .panel-title").trigger('click');
    $(".table-bottom a.them-moi").attr('data', parseInt(_count) + 1);
		chang_stt();
  });
	$('.page-don-hang h1.title-page').append('<a href="#" class="search-toggle uk-float-right"><i class="fa fa-search"></i></a>');
  $(document).delegate('.search-toggle', 'click', function(e){
		e.preventDefault();
		$(this).parent().next('.don-hang-da-dat-search-form').slideToggle();
		$(this).parent().next().find('.don-hang-da-dat-search-form').slideToggle();
	});
	$('.search-toggle').trigger('click');
  $(".item-dropdown .item-parent").click(function() {
    var $display = $(this).next().css( "display" );
    $(".item-dropdown .sub-menumobile").hide();
    if($display == 'none'){
      $(this).next().slideDown();
    }
  });
   // Add kiện hàng quảng châu
	$("a.add-kien-hang-qc").click(function() {
		countTotal = $(this).attr('data-count');
		$("form.kien-hang-qc-add-form .kien-hang-item-"+countTotal+" .form-content").addClass('hidden');
		$("form.kien-hang-qc-add-form .kien-hang-item-"+countTotal).addClass('close-current');
		$("form.kien-hang-qc-add-form .kien-hang-item-"+(parseInt(countTotal) + 1)).removeClass('hidden');
		$("form.kien-hang-qc-add-form .kien-hang-item-"+(parseInt(countTotal) + 1)).addClass('active');
		$("a.add-kien-hang-qc").attr('data-count', (parseInt(countTotal) + 1));
	});
	$("form.kien-hang-qc-add-form .kien-hang-item h3").click(function() {
		$("form.kien-hang-qc-add-form .kien-hang-item .form-content").addClass('hidden');
		$(this).parent().children('.form-content').removeClass('hidden');
	});
	// Thêm mới khách hàng
	$(document).on('click','a.kien-hang-qc-add-customer', function(e) {
		e.preventDefault();
		data = '<form class="qc-customer-add-form">\
				  <h3>Thêm mới khách hàng</h3>\
                  <div class="form-item form-full">\
                     <input type="text" class="fullname" placeholder="Họ và tên" />\
                  </div>\
                  <div class="form-item form-full">\
                     <input type="text" placeholder="Số điện thoại" class="phone" />\
                  </div>\
                  <div class="form-item last" style="display:none;">\
                     <input type="text" placeholder="Email(Không bắt buộc)" class="email" />\
                  </div>\
                  <button class="btn-submit">Thêm mới</button>\
				  <span class="message"></span>\
               </form>';
		var html = '<a class="uk-modal-close uk-close"></a>'+data;
		$('#my_modal .uk-modal-dialog').empty().append(html);
		$("#my_modal").removeClass('modal-small');
		var modal = UIkit.modal("#my_modal").show();
		
		$(document).on('click','form.qc-customer-add-form button', function(e) {
			var fullname = $("form.qc-customer-add-form input.fullname").val();
			if(fullname == '') {
				$("form.qc-customer-add-form span.message").removeClass('error').addClass('error');
				$("form.qc-customer-add-form span.message").empty().html('Vui lòng nhập Họ và tên');
				return false;
			}
			var phone = $("form.qc-customer-add-form input.phone").val();
			if(phone == '') {
				$("form.qc-customer-add-form span.message").removeClass('error').addClass('error');
				$("form.qc-customer-add-form span.message").empty().html('Vui lòng nhập Số điện thoại');
				return false;
			}
			var email = $("form.qc-customer-add-form input.email").val();
			$.ajax({
				type: 'POST',
				url: '/quang-chau/khach-hang/build-form-save',
				data: {
					phone: phone,
					email:email,
					fullname:fullname
				},
				dataType: 'JSON',
				success: function(data) {
					if(parseInt(data.status) == 0) {
						$("form.qc-customer-add-form span.message").removeClass('error').addClass('error');
						$("form.qc-customer-add-form span.message").empty().html(data.message);
					}else {
						$("form.kien-hang-qc-add-form .kien-hang-item .form-item-customer input.form-text").empty().val(data.phone);
						var modal = UIkit.modal("#my_modal").hide();
					}
				},
				complete: function() {
					
				}
			});
			return false;
		});
		
	});
	// Thêm mới đối tác
	$(document).on('click','a.kien-hang-qc-add-doi-tac', function(e) {
		e.preventDefault();
		data = '<form class="qc-customer-add-form qc-doi-tac-add-form">\
				  <h3>Thêm mới đối tác</h3>\
                  <div class="form-item form-full">\
                     <input type="text" class="fullname" placeholder="Họ và tên" />\
                  </div>\
                  <div class="form-item form-full">\
                     <input type="text" placeholder="Số điện thoại" class="phone" />\
                  </div>\
                  <div class="form-item last" style="display:none;">\
                     <input type="text" placeholder="Email (Không bắt buộc)" class="email" />\
                  </div>\
                  <button class="btn-submit btn-doi-tac-submit">Thêm mới</button>\
				  <span class="message"></span>\
               </form>';
		var html = '<a class="uk-modal-close uk-close"></a>'+data;
		$('#my_modal .uk-modal-dialog').empty().append(html);
		$("#my_modal").removeClass('modal-small');
		var modal = UIkit.modal("#my_modal").show();
		
		$(document).on('click','button.btn-doi-tac-submit', function(e) {
			e.preventDefault();
			var fullname = $("form.qc-doi-tac-add-form input.fullname").val();
			if(fullname == '') {
				$("form.qc-doi-tac-add-form span.message").removeClass('error').addClass('error');
				$("form.qc-doi-tac-add-form span.message").empty().html('Vui lòng nhập Họ và tên');
				return false;
			}
			var phone = $("form.qc-doi-tac-add-form input.phone").val();
			if(phone == '') {
				$("form.qc-doi-tac-add-form span.message").removeClass('error').addClass('error');
				$("form.qc-doi-tac-add-form span.message").empty().html('Vui lòng nhập Số điện thoại');
				return false;
			}
			var email = $("form.qc-doi-tac-add-form input.email").val();
			$.ajax({
				type: 'POST',
				url: '/quang-chau/doi-tac-process-save',
				data : {
					fullname: fullname,
					phone: phone,
					email: email
				},
				dataType: 'JSON',
				success: function(data) {
					if(parseInt(data.status) == 0) {
						$("form.qc-customer-add-form span.message").removeClass('error').addClass('error');
						$("form.qc-customer-add-form span.message").empty().html(data.message);
					}else {
						$("form.kien-hang-qc-add-form .kien-hang-item .form-item-doi-tac input.form-text").empty().val(data.phone);
						var modal = UIkit.modal("#my_modal").hide();
					}
				},
				complete: function() {
					
				}
			});
		});
	});
	// Menu
	$("ul.mobi-tt li a.parent").click(function() {
		if($(this).hasClass('menu-hide') === true) {
			$(this).parent().children("ul").slideDown();	
		}else {
			$(this).parent().children("ul").slideUp();
		}	
	});
    
    // Windown scroll
    $(window).scroll(function() {
    	if ($(this).scrollTop() > 100) {
    		$('header.item-block').addClass('scroll');
    	} else {
    		$('header.item-block').removeClass('scroll');
    	}
    });
    
    setTimeout(function () {
 	    $("#slidelogan").show();
 	    $("#slogan").typed({
 	        strings: [
                "Tìm kiếm bằng Tiếng Việt.", 
                "Đặt hàng nhanh chóng.", 
                "Quản lý mọi giao dịch và lộ trình.", 
                "Cung cấp dịch vụ gia tăng.", 
                "Chính sách khách hàng thân thiết.", 
            ],
 	        typeSpeed: 70,
 	        loop: true,
 	        backDelay: 2000,
 	        contentType: 'html'
 	    });
 	}, 1000);
    
    $("form.ky-gui-hang-qc-search-form a.btn-search").click(function() {
       $("form.ky-gui-hang-qc-search-form").submit(); 
    });
    
    // Checked kien hang qc
    $(document).delegate('input.kcheck-all', 'change', function(e){
        var checked = this.checked;
        $("table.table-doi-tac-list tr td input.ckb").prop('checked', checked);
        if(checked == true) {
            var status = $("form.ky-gui-hang-qc-search-form .form-item select").val();
            if(status == 15) {
                if($("button.btn-qc-change-status").css('display') == 'none') {
                    $("button.btn-qc-change-status").show();
                }
            }
        } else {
            $("button.btn-qc-change-status").hide();
        }
    });
    
    $(document).delegate('table.table-doi-tac-list tr td input.ckb', 'change', function(e){
        var status = $("form.ky-gui-hang-qc-search-form .form-item select").val();
        if(status == 15) {
            if($("input.kcheck-all").is(":checked")) {
                if($("table.table-doi-tac-list tr td input.ckb:checked").length == 0) {
                    if($("button.btn-qc-change-status").css('display') != 'none') {
                        $("button.btn-qc-change-status").hide();
                    }       
                }
                $("input.kcheck-all").prop('checked', false);
            } else {
                var checked = this.checked;
                if(checked == true) {
                    if($("button.btn-qc-change-status").css('display') == 'none') {
                        $("button.btn-qc-change-status").show();
                    }
                } else {
                    if($("table.table-doi-tac-list tr td input.ckb:checked").length == 0) {
                        if($("button.btn-qc-change-status").css('display') != 'none') {
                            $("button.btn-qc-change-status").hide();
                        }       
                    }
                }
            }
        }
    });
    
})(jQuery);
function don_hang_ky_gui_qc_change_status() {
    var data = [];
    if($("table.table-doi-tac-list tr td input.ckb:checked").length > 0) {
        $("table.table-doi-tac-list tr td input.ckb:checked").each(function() {
           data.push($(this).val());                
        });
    }
    $("#ajax_loader").show();
    $.ajax({
       type: 'POST',
       url: '/quang-chau/kien-hang-change-status',
       data: {
          value: JSON.stringify(data),
          dau_gui: $("form.ky-gui-hang-qc-search-form .form-item-dau-gui select").val()
       },
       dataType: 'JSON',
       success: function(data) {
          window.location.reload(true);
       },
       complete: function() {
          $("#ajax_loader").hide();
       }
    });
}
function number_format(number, decimals, dec_point, thousands_sep) {
  number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
  var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
    s = '',
    toFixedFix = function(n, prec) {
      var k = Math.pow(10, prec);
      return '' + (Math.round(n * k) / k)
        .toFixed(prec);
    };
  // Fix for IE parseFloat(0.55).toFixed(0) = 0;
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n))
    .split('.');
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || '')
    .length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1)
      .join('0');
  }
  return s.join(dec);
}
function don_hang_update_qty(id) {
	var $ = jQuery;
	_type = $("#edit-sanpham-item-"+id+"-thetich--2").val();
	_qty = $("#edit-sanpham-item-"+id+"-qty--2").val();
	_total = 0;
	_the_tich = $("#edit-sanpham-item-"+id+"-thetich-detail--2").val();
	if(_type == 1) {
		_total = _qty * 50000;
	}else if(_type == 2) {
		_total = _the_tich * 35000;
	}else if(_type == 3) {
		_total = _the_tich * 2300000;
	}
	$("#edit-sanpham-item-"+id+"-phivevietname--2").val(number_format(_total,0,'',','));
	_price = number_format($("#edit-sanpham-item-"+id+"-price--2").val(),0,',','');
	// Thanh tien
    _tigia = $("span.ti-gia").html();
	_thanhtien =  parseInt(_price) * _qty * parseInt(_tigia) + parseInt(_total);
	$("#edit-sanpham-item-"+id+"-tongtien--2").val(number_format(_thanhtien,0,'',','));
	_total = 0;
	for(i = 1; i <= 20; i++) {
		_thanhtinh = number_format($("#edit-sanpham-item-"+i+"-tongtien--2").val(),0,',','');
		_total += parseInt(_thanhtinh);
	}
	$("p.total span").html(number_format(_total,0,'',','));
}
function don_hang_gio_hang_cart_update(id, id_current, id_children,shop_id,stt) {
    var $ = jQuery;
    if($("input.qty-item-"+id).val() < 1) {
        return false;
    }
    _chinaUnit = $("span.china-unit-"+id).attr('data');
    _vndUnit = $("span.vnd-unit-"+id).attr('data');
    _qty = $("input.qty-item-"+id).val().replace(',','');
    _totalVndUnit = _vndUnit * _qty;
    _totalChinaUnit = _chinaUnit * _qty;
    $("span.vnd-unit-total-"+id+" b").html(number_format(_totalVndUnit,0,'',','));
    $("span.china-unit-total-"+id+" b").html(_totalChinaUnit.toFixed(1));
    _productCount = $(".tong-tien-tam-tinh").attr('data-product-count');
    _total_dat_hang = 0;
    _totalQty = 0;
    for(i = 1; i <= parseInt(_productCount); i++) { 
      _total_dat_hang += parseInt($("span.vnd-unit-"+i).attr('data')) * parseInt($("input.qty-item-"+i).val().replace(',',''));
      _totalQty += parseInt($("input.qty-item-"+i).val().replace(',',''));
    }
    $(".tong-tien-tam-tinh p.tong-tien-hang span b").html(number_format(_total_dat_hang,0,'',','));
    _total = _total_dat_hang + parseInt($(".tong-tien-tam-tinh p.phi-dat-hang span b").attr('data-price'));
    $(".tong-tien-tam-tinh p.tong-tien span b").html(number_format(_total,0,'',','));
    $("p.phi-kiem-dem").attr('data-product-total', _totalQty);
    _kiem_dem = 0;
    $('.info .form-item-yeu-cau-khac input').each(function(){
        if($(this).is(':checked')) {
            if($(this).val() == 1) {
                _kiem_dem = 1;
            }
        }
    });
	var kiem_dem_update = 0;
	if($('.gio-hang-kiem-hang-'+stt).is(':checked')){
		kiem_dem_update = 1;
	}
    $("#loading").show();
    $.ajax({
        url: '/don-hang-san-pham-update',
        data: {'key':id_current,'key_children':id_children,'qty':_qty,'total':_total_dat_hang,'kiem_dem': _kiem_dem,'totalQty':_totalQty,'shop_id': shop_id, kiem_dem_update: kiem_dem_update},
        type: 'POST',
        success: function(data){
            $("#loading").hide(); 
            if(data.phi_giao_dich) {
                // Tong shop
                $(".shop-tong-stt-"+stt+" ul li.thanh-tien b.value").html('');
                $(".shop-tong-stt-"+stt+" ul li.thanh-tien b.value").html(number_format(data.tien_hang,0,'',','));
                $(".shop-tong-stt-"+stt+" ul li.phi-tam-tinh b.value").html('');
                $(".shop-tong-stt-"+stt+' ul li.phi-tam-tinh b.value').html(number_format(data.phi_tam_tinh,0,'',','));
                $(".shop-tong-stt-"+stt+" ul li.tong-tien-theo-shop b.value").html('');
                $(".shop-tong-stt-"+stt+" ul li.tong-tien-theo-shop b.value").html(number_format(data.tong_tien_shop,0,'',','));
                $(".shop-tong-stt-"+stt+" ul li.phi-tam-tinh p.kiem-dem b").html(number_format(data.shop_phi_kiem_dem,0,'',','));
                $(".shop-tong-stt-"+stt+" ul li.phi-tam-tinh p.phi-dat-hang b").html(number_format(data.shop_phi_dat_hang,0,'',','));
                // Tong
                $("p.phi-dat-hang span b").html(number_format(data.phi_giao_dich,0,'',','));
                $("p.phi-kiem-dem b").html(number_format(data.phi_kiem_dem,0,'',','));
                _total = _total_dat_hang + data.phi_giao_dich + data.phi_kiem_dem;
                $(".tong-tien-tam-tinh p.tong-tien span b").html(number_format(_total,0,'',','));
            }
        },
        error: function(jqXHR, textStatus, errorThrown){
            window.location.reload(true);
            return false;
        }       
    });
}
function don_hang_shop_cart_phi_kiem_dem(shop_id,stt) {
    var $ = jQuery;
    var doTrue = false;
    if($("input.gio-hang-kiem-hang-"+stt).is(":checked")) {
       doTrue = true; 
    }
    $.ajax({
        url: '/gio-hang-update-kiem-dem',
        data: {'shop_id':shop_id,'stt': stt,'dotrue': doTrue},
        type: 'POST',
        success: function(data){
             $(".shop-tong-stt-"+stt+" ul li.phi-tam-tinh b.value").html('');
             $(".shop-tong-stt-"+stt+' ul li.phi-tam-tinh b.value').html(number_format(data.phi_tam_tinh,0,'',','));
             $(".shop-tong-stt-"+stt+" ul li.tong-tien-theo-shop b.value").html('');
             $(".shop-tong-stt-"+stt+" ul li.tong-tien-theo-shop b.value").html(number_format(data.tong_tien_shop,0,'',','));
             $(".shop-tong-stt-"+stt+" ul li.phi-tam-tinh p.kiem-dem b").html(number_format(data.phi_kiem_dem,0,'',','));
			 $("p.phi-kiem-dem b").html(number_format(data.total_phi_kiem_dem,0,'',','));
        },
        error: function(jqXHR, textStatus, errorThrown){
 
        }       
    });
}
function don_hang_shop_edit_phi_kiem_dem(shop_id, stt, order_id) {
    var $ = jQuery;
    var doTrue = false;
    if($("input.gio-hang-kiem-hang-"+stt).is(":checked")) {
       doTrue = true; 
    }
    $.ajax({
        url: '/don-hang-update-kiem-dem',
        data: {'shop_id':shop_id,'dotrue': doTrue,'order_id': order_id},
        type: 'POST',
        success: function(data){
             $(".shop-tong-stt-"+stt+" ul li.phi-tam-tinh b.value").html('');
             $(".shop-tong-stt-"+stt+' ul li.phi-tam-tinh b.value').html(number_format(data.phi_tam_tinh,0,'',','));
             $(".shop-tong-stt-"+stt+" ul li.tong-tien-theo-shop b.value").html('');
             $(".shop-tong-stt-"+stt+" ul li.tong-tien-theo-shop b.value").html(number_format(data.tong_tien_shop,0,'',','));
             $(".shop-tong-stt-"+stt+" ul li.phi-tam-tinh p.kiem-dem b").html(number_format(data.phi_kiem_dem,0,'',','));
             // Tong don hang
             $("p.tong-tien-hang b").html(number_format(data.tong_tien_hang,0,'',','));
             $("p.phi-dat-hang b").html(number_format(data.tong_phi_dat_hang,0,'',','));
             $("p.phi-kiem-dem b").html(number_format(data.tong_phi_kiem_dem,0,'',','));
             $("p.phi-chiet-khau b").html(number_format(data.phi_chiet_khau,0,'',','));
             $("p.tong-tien b").html(number_format(data.tong_tien,0,'',','));
        },
        error: function(jqXHR, textStatus, errorThrown){

        }       
    });
}
function don_hang_cart_update_order(stt, key, pid, id_current) {
    var $ = jQuery;
    if($("form.don-hang-gio-hang-add-form table tbody tr td textarea#edit-shop-cart-item-"+key+"-item-"+stt+"-ghi-chu").val() == '') {
        return false;
    }
    $("#loading").show();
    $.ajax({
        url: '/san-pham-cart-update-order',
        data: {
            'stt':stt,
            'pid' : pid,
            'id_current': id_current,
            'ghi_chu' : $("form.don-hang-gio-hang-add-form table tbody tr td textarea#edit-shop-cart-item-"+key+"-item-"+stt+"-ghi-chu").val()
        },
        type: 'POST',
        success: function(data){
             $("#loading").hide();
        },
        error: function(jqXHR, textStatus, errorThrown){
            
        }       
    });
}
function gio_hang_shop_cart_delete(shop_id) {
    var $ = jQuery;
    if(confirm('Bạn có chắc chắn muốn xóa nhà cung cấp này ?')) {
        $("#loading").show();
        $.ajax({
            url: '/shop-cart-delete',
            data: {'shop_id':shop_id},
            type: 'POST',
            success: function(data){
                 $("#loading").hide();
                 window.location.reload(true);
            },
            error: function(jqXHR, textStatus, errorThrown){

            }       
        });
    }
}
var $ = jQuery;
function don_hang_shop_change(shop_id) {
    
}
function don_hang_ky_gui_qc_delete(stt) {
	$("form.kien-hang-qc-add-form .kien-hang-item-"+stt+"").addClass('hidden');
	$("form.kien-hang-qc-add-form .kien-hang-item-"+stt+" select").val('');
	$("form.kien-hang-qc-add-form .kien-hang-item-"+stt+" input").val('');
	var dataArray = [];
	for(i = 1; i <= 7; i++) {
		dataArray.push({qty: $("form.kien-hang-qc-add-form .form-item-kien-hang-"+i+"-so-luong input").val(), 
					    don_vi_tinh: $("form.kien-hang-qc-add-form .form-item-kien-hang-"+i+"-don-vi-tinh select").val(),
						dau_nhan: $("form.kien-hang-qc-add-form .form-item-kien-hang-"+i+"-dau-nhan select").val()});
	}
	$.ajax({
		type: 'POST',
		url: '/don-hang-kien-hang-quang-chau-update-item',
		data: {'data' : JSON.stringify(dataArray)},
		dataType: 'JSON',
		success: function(data) {
			$("ul.total-money li.count b").empty().html(data.count);
			$("ul.total-money li.total b").empty().html(data.total);
		},
		complete: function() {
			
		}
	});
}
function don_hang_kien_hang_quang_chau_change(stt) {
	if($("form.kien-hang-qc-add-form .form-item-kien-hang-"+stt+"-nganh-hang select").val() == '') {
		$($("form.kien-hang-qc-add-form .form-item-kien-hang-"+stt+"-nganh-hang select")).attr('data-uk-tooltip','{pos: left}');
		$($("form.kien-hang-qc-add-form .form-item-kien-hang-"+stt+"-nganh-hang select")).attr('title','Vui lòng chọn Loại hàng hóa');
		UIkit.tooltip($("form.kien-hang-qc-add-form .form-item-kien-hang-"+stt+"-nganh-hang select")).show();
		return false;
	}
	var dataArray = [];
	for(i = 1; i <= 7; i++) {
		dataArray.push({qty: $("form.kien-hang-qc-add-form .form-item-kien-hang-"+i+"-so-luong input").val(), 
					    don_vi_tinh: $("form.kien-hang-qc-add-form .form-item-kien-hang-"+i+"-don-vi-tinh select").val(),
						dau_nhan: $("form.kien-hang-qc-add-form .form-item-kien-hang-"+i+"-dau-nhan select").val()});
	}
	$.ajax({
		type: 'POST',
		url: '/don-hang-kien-hang-quang-chau-update-item',
		data: {'data' : JSON.stringify(dataArray)},
		dataType: 'JSON',
		success: function(data) {
			$("ul.total-money li.count b").empty().html(data.count);
			$("ul.total-money li.total b").empty().html(data.total);
		},
		complete: function() {
			
		}
	});
}
function kien_hang_yeu_cau_shipping(kien_hang_id) {
    $.ajax({
        url: '/shipping-temp-cart',
        data: {
            'kien-hang-id': kien_hang_id,
            'status': $("a.yeu-cau-ship-kien-hang-"+kien_hang_id).attr('data-status')
        },
        type: 'POST',
        success: function(data){
             if(parseInt(data.total) > 0) {
                $(".kien-hang-list-item").append('<a class="shipping-address-request-cart" onclick="don_hang_yeu_cau_ship();" href="javascript:void(0);"><b>'+data.total+' kiện hàng</b><br/>Gửi yêu cầu giao hàng</a>');   
             }else {
                $(".kien-hang-list-item .shipping-address-request-cart").remove();
             }
             if(parseInt(data.status) == 1) {
                $("a.yeu-cau-ship-kien-hang-"+kien_hang_id).html('<i class="fa fa-check-circle" aria-hidden="true"></i> Đã chọn yêu cầu giao hàng');
                $("a.yeu-cau-ship-kien-hang-"+kien_hang_id).addClass('blue');
                $("a.yeu-cau-ship-kien-hang-"+kien_hang_id).attr('data-status', 1);    
             }else {
                $("a.yeu-cau-ship-kien-hang-"+kien_hang_id).html('<i class="fa fa-check-circle" aria-hidden="true"></i> Chọn yêu cầu giao hàng');
                $("a.yeu-cau-ship-kien-hang-"+kien_hang_id).removeClass('blue');
                $("a.yeu-cau-ship-kien-hang-"+kien_hang_id).attr('data-status', 0);   
             }
        },
        error: function(jqXHR, textStatus, errorThrown){
            
        }       
    });
}
function don_hang_yeu_cau_ship() {
    $("#ajax_loader").show();
    $.ajax({
        type: 'POST',
        url: '/kien-hang/yeu-cau-ship-process-popup',
        data: {
            kien_hang: 1       
        },
        dataType: 'HTML',
        success: function(data) {
           if(data) {
              $("#my_modal").removeClass('not-padding').addClass('not-padding');
              var html = '<a class="uk-modal-close uk-close"></a>'+data;
              $('#my_modal .uk-modal-dialog').empty().append(html);
              var modal = UIkit.modal("#my_modal").show();
              
              $(".don-vi-van-chuyen span").click(function() {
                 $(".don-vi-van-chuyen span").removeClass('selected');
                 $(this).addClass('selected'); 
              });
              $(".don-vi-van-chuyen table tr td input").bind('click', function(e){
                  if($(this).is(':checked')) {
                      $('span.full-item').removeClass('selected');
                      $("span.doi-vi-van-chuyen-item-"+$(this).data('parent')).removeClass('selected').addClass('selected');  
                      $(".don-vi-van-chuyen table tr td input").prop("checked",false);
                      $(this).attr("checked", true);               
                  }
              });
              $("span.full-item").bind('click', function(e){
                  if(parseInt($(this).data('item')) == 1000 || parseInt($(this).data('item')) == 1001 || parseInt($(this).data('item')) == 1002) {
                      $(this).removeClass('selected');
                      return false;
                  }else {
                      $(".don-vi-van-chuyen table tr td input").prop("checked",false);
                  }
              });
              // hinh thuc thanh toan
              $(".hinh-thuc-thanh-toan span").click(function() {
                 $(".hinh-thuc-thanh-toan span").removeClass('selected');
                 $(this).addClass('selected'); 
              });
              
              $('.gui-yeu-cau-update').click(function(e){
            	var uid = $(this).data('uid'); 
                addressSelect = 0;
                donviSeleted = 0;
                htSeleted = 0;
                var address = '';
                var don_vi = '';
                var hinh_thuc = '';
            		var time_delevery = $('.flatpickr').val();
            		if(!time_delevery.length){    
            			 $(".message-status-error").html('Vui lòng chọn thời gian mong muốn nhận hàng !');
            			 $('.flatpickr').css('border', '1px solid red');
                         return false;
            		}
                $(".dia-chi-giao-hang-inner ul li.selected").each(function() {
                    addressSelect++;
                    address = $(this).attr('data-item');
                });
                $(".dia-chi-giao-hang-inner .don-vi-van-chuyen span.selected").each(function() {
                    donviSeleted++;
                    don_vi = $(this).attr('data-item');
                });
                $(".dia-chi-giao-hang-inner .hinh-thuc-thanh-toan span.selected").each(function() {
                    htSeleted++;
                    hinh_thuc = $(this).attr('data-item');
                });
                if(addressSelect == 0 && addressSelect == '') {
                    $('.flatpickr').removeAttr('style');
                    $(".message-status-error").html('Vui lòng chọn địa chỉ giao hàng');
                    return false;
                }
                if(donviSeleted == 0 && donviSeleted == '') {
                    $(".message-status-error").html('Vui lòng chọn đơn vị vận chuyển');
                    return false;
                }
                if(htSeleted == 0 && htSeleted == '') {
                    $(".message-status-error").html('Vui lòng chọn hình thức thanh toán');
                    return false;
                }
                var serviceId = '';
                var serviceName = '';
                $(".don-vi-van-chuyen table tr td input").each(function() {
                   if($(this).is(":checked")) {
                      serviceId = $(this).val();
                      serviceName = $(this).attr('data-name');
                   } 
                });
                $.ajax({
                    url: '/kien-hang-yeu-cau-ship-save-update',
                    data: {
                            'time_delevery': time_delevery,
                            'address':address,
                            'don_vi': don_vi,
                            'hinh_thuc': hinh_thuc,
                            'yeu_cau_khac': $(".dia-chi-giao-hang-inner textarea.yeu-cau-khac").val(),
            				kienhang_id: $('#item-giao-hang-hidden').val(),
                            serviceId: serviceId,
                            service_name: serviceName
                    },
                    type: 'POST',
                    success: function(data){
                         if(data.status == 0) {
                         }else {
            				//var socket_gh = io("https://thuongdosocket.herokuapp.com/");
            				//socket_gh.emit("user-send-giao-hang", data);
                            $("a.shipping-address-request-cart-update").remove();
                            $(".dia-chi-giao-hang-inner").html('');
                            $(".dia-chi-giao-hang-inner").append('<div class="message-status-success">Đã gửi thành công</div>');
                            setTimeout(function () {
                				UIkit.modal("#popup-yeu-cau-giao-hang").hide();
            				    window.location.reload(true);
                			 },2000);
                         }
                    },
                    error: function(jqXHR, textStatus, errorThrown){    
            
                    }       
                });
            });
           } 
        },
        complete: function() {
            $("#ajax_loader").hide();
        }
    });
}
function don_hang_data_ajax(stt) {
    var text = $("form.dat-hang-online-form .form-item-sanpham-item-"+stt+"-link input").val();
    var slitString = text.split(' ');
    $.each( slitString, function( key, value ) {
       if(value.indexOf("http") >= 0) {
          var url = value.replace("http"," http");
          var slitUrl = url.split(" ");
          $.each( slitUrl, function( keyurl, item ) {
             if(item.indexOf("http") >= 0) {
                $("form.dat-hang-online-form .form-item-sanpham-item-"+stt+"-link input").val(item);
             }
          });
       }
    });
    
}
function don_hang_tra_cuoc_calculator() {
    var noi_gui_hang = $(".tra-cuoc-item-page select.noi-gui-hang").val();
    var noi_nhan_hang = $(".tra-cuoc-item-page select.noi-nhan-hang").val();
    var chieu_dai = $(".tra-cuoc-item-page input.chieu-dai").val();
    var chieu_rong = $(".tra-cuoc-item-page input.chieu-rong").val();
    var chieu_cao = $(".tra-cuoc-item-page input.chieu-cao").val();
    var trong_luong = $(".tra-cuoc-item-page input.trong-luong").val();
    var result = 0;
    var access = false;
    if(chieu_cao && chieu_rong && chieu_cao) {
        var result = parseFloat(chieu_dai * chieu_rong * chieu_cao / 6000).toFixed(2);    
    }
    console.log(result);
    var type = 1;
    if(result > 0 && trong_luong) {
        if(parseFloat(trong_luong) > result) {
            $(".tra-cuoc-item-page span.message").removeClass('success').addClass('success').empty().html("Kiện hàng <b style='color: red;'>NẶNG</b> đơn vị tính là: <b style='color: #f8c206;'>"+trong_luong+"</b>kg");
            var type = 1; 
        }else {
            var resultM3 = chieu_dai * chieu_rong * chieu_cao / 1000000;
            var trong_luong = resultM3;
            var type = 2;
            $(".tra-cuoc-item-page span.message").removeClass('success').addClass('success').empty().html("Kiện hàng <b style='color: red;'>NHẸ</b> đơn vị tính là: <b style='color: #f8c206;'>"+resultM3+"</b>m<sup>3</sup>");
        }
        access = true;
    }
    if(noi_nhan_hang && noi_gui_hang && access == true) {
        $("#ajax_loader").show();
        $.ajax({
           type: 'POST',
           url: '/tra-cuoc-process',
           data: {
              noi_gui_hang: noi_gui_hang,
              noi_nhan_hang: noi_nhan_hang,
              type: type,
              trong_luong: trong_luong
           },
           dataType: 'JSON',
           success: function(data) {
             if(data) {
                if($(".tra-cuoc-item-page table tr td.result-item").length > 0) {
                    $(".tra-cuoc-item-page td.result-item").each(function(index, value) {
                         console.log(data[index]);
                         $(".tra-cuoc-item-page td.result-item-"+index).empty().html(data[index]);
                    });
                }
             }
           },
           complete: function() {
              $("#ajax_loader").hide();	
           }
        });
    }
}
function kien_hang_yeu_cau_shipping_huy(kien_hang_id) {
    
}
function don_hang_dia_chi_giao_hang_api_result(dia_chi_id) {
    $("#ajax_loader").show();
    $.ajax({
       type: 'POST',
       url:'/don-hang-dia-chi-giao-hang-api-process',
       data: {
          dia_chi_id: dia_chi_id,
          kienhang_id: 1
       },
       dataType: 'HTML',
       success: function(data) {
          if(data) {
             $(".don-vi-van-chuyen").empty().html(data);
             // selected
             $(".don-vi-van-chuyen span").click(function() {
               $(".don-vi-van-chuyen span").removeClass('selected');
               $(this).addClass('selected'); 
            });
            $(".don-vi-van-chuyen table tr td input").bind('click', function(e){
                if($(this).is(':checked')) {
                    $('span.full-item').removeClass('selected');
                    $("span.doi-vi-van-chuyen-item-"+$(this).data('parent')).removeClass('selected').addClass('selected');  
                    $(".don-vi-van-chuyen table tr td input").prop("checked",false);
                    $(this).attr("checked", true);                     
                }
            });
            $("span.full-item").bind('click', function(e){
                if(parseInt($(this).data('item')) == 1000 || parseInt($(this).data('item')) == 1001 || parseInt($(this).data('item') == 1002)) {
                    $(this).removeClass('selected');
                    return false;
                }else {
                    $(".don-vi-van-chuyen table tr td input").prop("checked",false);
                }
            });
            if($(".dia-chi-giao-hang-item ul li.shipping-address-item-"+dia_chi_id).hasClass('selected') === false) {
                $(".dia-chi-giao-hang-item ul li").removeClass('selected');
                $(".dia-chi-giao-hang-item ul li.shipping-address-item-"+dia_chi_id).addClass('selected');
            }
          }
       },
       complete: function() {
          $("#ajax_loader").hide();
       } 
    });
}
function khach_hang_sale_timecountdown(id_class, date_time) {
    var countDownDate = new Date(""+date_time+"").getTime();
    var x = setInterval(function() {
        var now = new Date().getTime();
        var distance = countDownDate - now;
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        $("#"+id_class+"").empty().html("<span><b>"+days + "</b>ngày </span><span><b>" + hours + "</b>giờ </span><span><b>" + minutes + "</b>phút </span><span><b>" + seconds + "</b>giây </span>");
        if (distance < 0) {
            clearInterval(x);
            $("#"+id_class+"").empty();
        }
    }, 1000);
}
function validatePhone(txtPhone) {
    var a = document.getElementById(txtPhone).value;
    var filter = /^((\+[1-9]{1,4}[ \-]*)|(\([0-9]{2,3}\)[ \-]*)|([0-9]{2,4})[ \-]*)*?[0-9]{3,4}?[ \-]*[0-9]{3,4}?$/;
    if (filter.test(a)) {
        return true;
    }
    else {
        return false;
    }
}
function ecommerce_api_tim_kiem_san_pham_by_pager(keyword, page_current) {
   var keyword = $("form.tim-kiem-add-form input.keyword").val();
   var website = $("form.tim-kiem-add-form .form-item-category select").val();
   if(keyword) {
       $("#ajax_loader").show();
       $.ajax({
          type: 'POST',
          url: '/tim-kiem-san-pham/ket-qua',
          data: {
             keyword:keyword,
             page_current: page_current,
             website:website
          },
          dataType: 'json',
          success: function(data) {
             if(parseInt(website) == 3 || parseInt(website) == 2) {
                if(data.numid) {
                    ecommerce_api_tim_kiem_san_pham_chi_tiet(data.numid);
                } else {
                    if(parseInt(data.list.code) == 200) {
                        if(typeof data.list.data.resultList) {
                            var data_product_list = '';
                            $.each(data.list.data.resultList, function(index, item) {
                                var price = '';
                                if(item.promotionPrice != undefined || item.promotionPrice != '') {
                                    var price_exchange = (item.promotionPrice / 100) * data.exchange;
                                    price = '<span class="price-promotion">'+number_format(price_exchange,0,'',',')+'đ</span> \
                                             <span class="price-other"><b>¥'+(item.promotionPrice / 100)+'</b> / <span class="price-sale">¥'+(item.price / 100)+'</span></span>';
                                } else {
                                    price = '<span class="price-promotion">¥'+(item.price / 100)+'</span>';
                                }
                                delivery_fee = '<span class="delivery-fee"> \
                                                    <img src="/sites/all/themes/giaodiennguoidung/images/truct-free-ship-icon.png" /> \
                                                    <b>Freeship</b> \
                                                </span>';
                                if(parseFloat(item.delivery_fee) > 0) {
                                    delivery_fee = '<span class="delivery-fee"> \
                                                        <img src="/sites/all/themes/giaodiennguoidung/images/truct-free-ship-icon.png" /> \
                                                        <b>¥'+item.delivery_fee+'</b> \
                                                     </span>';
                                }
                                image = item.picUrl;
                                image = image.replace('g.search.alicdn.com','img.alicdn.com');
                                image = image.replace('g.search1.alicdn.com','img.alicdn.com');
                                image = image.replace('g.search2.alicdn.com','img.alicdn.com');
                                
                                var itemUrl = item.itemUrl;
                                
                                data_product_list += '<li> \
                                                        <a href="javascript:void(0);" data-url="'+itemUrl+'" onclick="ecommerce_api_tim_kiem_san_pham_chi_tiet('+item.itemId+');" data-numid="'+item.itemId+'" class="image buy-now-'+item.itemId+'" > \
                                                            <img data-original="'+image+'" src="'+image+'" /> \
                                                            '+delivery_fee+' \
                                                        </a>\
                                                        <a href="javascript:void(0);" data-url="'+itemUrl+'" onclick="ecommerce_api_tim_kiem_san_pham_chi_tiet('+item.itemId+');" data-numid="'+item.itemId+'" class="title buy-now-'+item.itemId+'" data-pid="'+item.itemId+'">'+item.title+'</a>\
                                                        <div class="p-item-bottom"> \
                                                            <div class="p-item-bottom-left"> \
                                                                '+price+' \
                                                            </div> \
                                                            <div class="p-item-bottom-right"> \
                                                                <span><b>'+item.salesVolume+'</b> đã bán</span> \
                                                            </div> \
                                                        </div> \
                                                        <div class="p-action-footer"> \
                                                            <a href="'+itemUrl+'" class="view-more" target="_blank">Xem chi tiết</a> \
                                                            <a href="javascript:void(0);" data-url="'+itemUrl+'" onclick="ecommerce_api_tim_kiem_san_pham_chi_tiet('+item.itemId+');" data-numid="'+item.itemId+'" class="buy-now buy-now-'+item.itemId+'">Đặt hàng</a> \
                                                        </div>\
                                                      </li>';
                            });
                            $(".ket-qua-tim-kiem-san-pham-block .content-product").empty().html('<ul>'+data_product_list+'</ul>');
                            
                            $("img.lazy").lazyload({
                               effect : "fadeIn"
                            });
                            
                            if(typeof data.list.data.totalResults) {
                                var pages_max = parseInt(data.list.data.totalResults) / 40;
                                var pager_ins = '';
                                var page_current = parseInt(data.pager_current);
                                var page_first = 1;
                                if(page_current - 4 < 1) {
                                    page_first = 1;
                                } else {
                                    page_first = page_current - 4;
                                }
                                var pager_next = page_current + 4;
                                for(var i = page_first; i < pager_next ; i++) {
                                    var selected_pager = parseInt(data.pager_current) == i ? 'page-current' : '';
                                    pager_ins += '<a href="javascript:void(0);" onclick="ecommerce_api_tim_kiem_san_pham_by_pager(/'+keyword+'/,'+i+');" class="item '+selected_pager+'">'+i+'</a>';
                                }
                                $(".ket-qua-tim-kiem-san-pham-block .pager").empty().html(pager_ins);
                                
                                $(".search-result-total").empty().html('Có <b>'+number_format(data.list.data.totalResults,0,'',',')+'</b> sản phẩm được tìm thấy');
                                
                            }
                            
                        }
                    } else {
                        alert(data.data.error);
                    }   
                }
                  
             }else if(parseInt(website) == 1) {
                if(typeof data.list.data.data) {
                    var data_product_list = '';
                    $.each(data.list.data.data, function(index, item) {
                        var price = '';
                        if(typeof item.priceInfo.price) {
                            var price_exchange = item.priceInfo.price * data.exchange;
                            price = '<span class="price-promotion">'+number_format(price_exchange,0,'',',')+'đ</span> \
                                     <span class="price-sale"><b>¥'+item.priceInfo.price+'</b></span>';
                        }
                        data_product_list += '<li> \
                                                <a href="javascript:void(0);" onclick="ecommerce_api_tim_kiem_san_pham_chi_tiet('+item.offerId+');" data-numid="'+item.offerId+'" class="image buy-now-'+item.offerId+'" > \
                                                    <img data-original="'+item.imageUrl+'" src="'+item.imageUrl+'" /> \
                                                </a>\
                                                <a href="javascript:void(0);" onclick="ecommerce_api_tim_kiem_san_pham_chi_tiet('+item.offerId+');" data-numid="'+item.offerId+'" class="title buy-now-'+item.offerId+'" data-pid="'+item.offerId+'">'+item.subject+'</a>\
                                                <div class="p-item-bottom"> \
                                                    <div class="p-item-bottom-left"> \
                                                        '+price+' \
                                                    </div> \
                                                    <div class="p-item-bottom-right"> \
                                                        <span class="month-sold"><b>'+item.monthSold+'</b> đã bán/tháng</span>\
                                                        <span class="repurchase-rate"><b>'+item.repurchaseRate+'</b> mua lại</span>\
                                                    </div> \
                                                </div> \
                                                <div class="p-action-footer"> \
                                                    <a href="javascript:void(0);" class="view-more" target="_blank">Xem chi tiết</a> \
                                                    <a href="javascript:void(0);" onclick="ecommerce_api_tim_kiem_san_pham_chi_tiet('+item.offerId+');" data-numid="'+item.offerId+'" class="buy-now buy-now-'+item.offerId+'">Đặt hàng</a> \
                                                </div>\
                                              </li>';
                    });
                    
                    $(".ket-qua-tim-kiem-san-pham-block .content-product").empty().html('<ul>'+data_product_list+'</ul>');
                    
                    $("img.lazy").lazyload({
                       effect : "fadeIn"
                    });
                    
                    if(typeof data.list.data.totalRecords) {
                        var pages_max = data.list.data.totalRecords / data.list.data.pageSize;
                        var pager_ins = '';
                        var page_current = parseInt(data.pager_current);
                        var page_first = 1;
                        if(page_current - 4 < 1) {
                            page_first = 1;
                        } else {
                            page_first = page_current - 4;
                        }
                        var pager_next = page_current + 4;
                        for(var i = page_first; i < pager_next ; i++) {
                            var selected_pager = parseInt(data.pager_current) == i ? 'page-current' : '';
                            pager_ins += '<a href="javascript:void(0);" onclick="ecommerce_api_tim_kiem_san_pham_by_pager(/'+keyword+'/,'+i+');" class="item '+selected_pager+'">'+i+'</a>';
                        }
                        $(".ket-qua-tim-kiem-san-pham-block .pager").empty().html(pager_ins);
                    }
                }
             }
          },
          complete: function() {
            $("#ajax_loader").hide(); 
          }
       }); 
   }
}
function ecommerce_api_tim_kiem_san_pham_chi_tiet(pid) {
    $("#ajax_loader").show(); 
    $.ajax({
       type: 'POST',
       url: '/tim-kiem-san-pham/ket-qua/chi-tiet',
       data: {
          pid:pid,
          element_type: 'html',
          url: $("a.buy-now-"+pid).attr('data-url')
       },
       dataType: 'html',
       success: function(data) {
          $("#my_modal").removeClass('not-padding').addClass('not-padding');
          $("#my_modal").removeClass('modal-order-create-order').addClass('modal-eco-api-product-view-detail');
          var html = '<a class="uk-modal-close uk-close"></a>'+data;
          $('#my_modal .uk-modal-dialog').empty().append(html);
          var modal = UIkit.modal("#my_modal").show();
          
          $(".tb-thumb-pictures a").click(function() {
             $(".image-inner img").attr('src', $(this).attr('data-src'));
          });
          
          $(".eco-product-view-detail-info .property-block ul li ol li a.image").click(function() {
             $(".image-inner img").attr('src', $(this).attr('data-src'));
             $(".eco-product-view-detail-info .property-block ul li ol li a.image").removeClass('active');
             $(this).addClass('active');
             
             var exchange = $(".price-inner").attr('data-exchange');
             var promotion_price = $(this).attr('data-promotion-price');
             var price = $(this).attr('data-price');
             
             if(promotion_price) {
                var price_vnd = parseFloat(promotion_price) * parseFloat(exchange);
                $(".price-in-item .promotion-price").empty().html(number_format(price_vnd,0,'',',')+ 'đ');
                $(".price-in-item .promotion-price b").attr('data-price', promotion_price);
                $(".price-in-item .promotion-price b").empty().html('¥' + promotion_price);
                $(".price-in-item span.price").empty().html('¥' + price);
             } else {
                var price_vnd = parseFloat(price) * parseFloat(exchange);
                $(".price-in-item .promotion-price").empty().html(number_format(price_vnd,0,'',',')+ 'đ');
                $(".price-in-item .promotion-price b").attr('data-price', price);
                $(".price-in-item .promotion-price b").empty().html('¥' + price);
                $(".price-in-item span.price").empty().html('¥' + price);
             }
             
             $(".qty-inner .quantity-balance").empty().append('Số lượng còn lại <b>'+$(this).attr('data-quantity')+'</b> sản phẩm');
             
          });
          
          $("span.btn-down").click(function() {
             var qty = $(".qty-inner input.qty").val();
             if(parseInt(qty) - 1 < 0) {
                $(".qty-inner input.qty").val('0');
                return false;
             } else {
                $(".qty-inner input.qty").val(parseInt(qty) - 1);
             }
          });
          
          $("span.btn-up").click(function() {
             var qty = $(".qty-inner input.qty").val();
             $(".qty-inner input.qty").val(parseInt(qty) + 1);
          });
          
          $(".eco-product-view-detail-info .property-block ul li ol li a.title").click(function() {
             $(this).parent().parent().children('li').children('a').removeClass('active');
             $(this).addClass('active');
          });
          
          $("img.lazy").lazyload({
            effect : "fadeIn"
          });
          
       }, 
       complete: function() {
          $("#ajax_loader").hide(); 
       } 
    });
}
function ecommerce_api_tim_kiem_san_pham_them_vao_gio_hang(pid) {
    var qty = $(".qty-inner input.qty").val();
    if(parseInt(qty) < 1) {
        alert('Nhập số lượng >= 1');
        return false;
    }
    var property_lenght = $(".property-block ul li.p-parent").length;
    var data_sku = {};
    var price_sku = $(".price-in-item b.price-cny").attr('data-price');
    var quantity = qty;
    var name_sku = '';
    var image_sku = '';
    var checked = 1; 
    var pr_active = 0; 
    $(".property-block ul li.p-parent").each(function(index, value) {
        $(value).find('ol li a').each(function() {
           if($(this).hasClass('active') === true) {
             pr_active += 1;
             var type = $(this).attr('data-type');
             if(parseInt(type) == 1) {
                image_sku = $(this).attr('data-src');
             }
             name_sku += $(this).attr('data-sku-name') + ';';
           } 
        });
    });
    
    if(parseInt(pr_active) != property_lenght) {
        alert('Vui lòng chọn đầy đủ thông tin sản phẩm');
        return false;
    }
    
    var title = $(".eco-product-view-detail-info h1").attr('data-title');
    var url = $(".eco-product-view-detail-info h1").attr('data-url');
    var pid = $(".eco-product-view-detail-info h1").attr('data-pid');
    var ncc_name = $(".eco-product-view-shop-block").attr('data-name');
    var nccId = $(".eco-product-view-shop-block").attr('data-nccid');
    var price = $(".price-in-item b.price-cny").attr('data-price');
    var qty = qty;
    var image = $('.image-inner img').attr('data-original');
    
    data_sku = {
      'price':price_sku,
      'quantity':quantity,
      'name':name_sku,
      'image':image_sku,
      'checked':checked
    };
    
    var propery_name = '';
    $(".property-block ul li ol li a.active").each(function() {
        propery_name += $(this).attr('data-sku-name');
    });
    
    var product_sku_config = $(".property-block ul").attr('data-config');
    var product_sku_config_paser = JSON.parse(product_sku_config);
    var skuId = '';
    var mpSkuId = '';
    $.each(product_sku_config_paser, function(index, value) {
        if(value.property_name == propery_name) {
            skuId = value.skuId;
            mpSkuId = value.mpSkuId;
        }
    });
    var mpid = $(".eco-product-view-detail-info").attr('data-mpid');
    console.log(mpid);
    
    
    $("#ajax_loader").show();
    $.ajax({
       type: 'POST',
       url: '/tim-kiem-san-pham/them-vao-gio-hang',
       data: {
         title:title,
         url:url,
         pid:pid,
         ncc_name: ncc_name,
         nccId:nccId,
         price:price,
         qty:qty,
         image:image,
         data: name_sku
       },
       dataType: 'json',
       success: function(data) {
          if(parseInt(data.status) == 1) {
            alert(data.msg);
          }
       },
       complete: function() {
         $("#ajax_loader").hide();
       }  
    });
}
function ecommerce_api_tim_kiem_san_pham_dat_hang(pid) {
    var qty = $(".qty-inner input.qty").val();
    if(parseInt(qty) < 1) {
        alert('Nhập số lượng >= 1');
        return false;
    }
    var property_lenght = $(".property-block ul li.p-parent").length;
    var data_sku = {};
    var price_sku = $(".price-in-item b.price-cny").attr('data-price');
    var quantity = qty;
    var name_sku = '';
    var image_sku = '';
    var checked = 1; 
    var pr_active = 0; 
    $(".property-block ul li.p-parent").each(function(index, value) {
        $(value).find('ol li a').each(function() {
           if($(this).hasClass('active') === true) {
             pr_active += 1;
             var type = $(this).attr('data-type');
             if(parseInt(type) == 1) {
                image_sku = $(this).attr('data-src');
             }
             name_sku += $(this).attr('data-sku-name') + ';';
           } 
        });
    });
    
    if(parseInt(pr_active) != property_lenght) {
        alert('Vui lòng chọn đầy đủ thông tin sản phẩm');
        return false;
    }
    
    var title = $(".eco-product-view-detail-info h1").attr('data-title');
    var url = $(".eco-product-view-detail-info h1").attr('data-url');
    var pid = $(".eco-product-view-detail-info h1").attr('data-pid');
    var ncc_name = $(".eco-product-view-shop-block").attr('data-name');
    var nccId = $(".eco-product-view-shop-block").attr('data-nccid');
    var price = $(".price-in-item b.price-cny").attr('data-price');
    var qty = qty;
    var image = $('.image-inner img').attr('data-original');
    
    data_sku = {
      'price':price_sku,
      'quantity':quantity,
      'name':name_sku,
      'image':image_sku,
      'checked':checked
    };
    
    var propery_name = '';
    $(".property-block ul li ol li a.active").each(function() {
        propery_name += $(this).attr('data-sku-name');
    });
    
    var product_sku_config = $(".property-block ul").attr('data-config');
    var product_sku_config_paser = JSON.parse(product_sku_config);
    var skuId = '';
    var mpSkuId = '';
    $.each(product_sku_config_paser, function(index, value) {
        if(value.property_name == propery_name) {
            skuId = value.skuId;
            mpSkuId = value.mpSkuId;
        }
    });
    var mpid = $(".eco-product-view-detail-info").attr('data-mpid');
    console.log(mpid);
    
    
    $("#ajax_loader").show();
    $.ajax({
       type: 'POST',
       url: '/tim-kiem-san-pham/tao-don-hang',
       data: {
         title:title,
         url:url,
         pid:pid,
         ncc_name: ncc_name,
         nccId:nccId,
         price:price,
         qty:qty,
         image:image,
         data: name_sku,
         element_type: 'render'
       },
       dataType: 'html',
       success: function(data) {
          $("#my_modal").removeClass('not-padding').addClass('not-padding');
          $("#my_modal").removeClass('modal-eco-api-product-view-detail').addClass('modal-order-create-order');
          var html = '<a class="uk-modal-close uk-close"></a>'+data;
          $('#my_modal .uk-modal-dialog').empty().append(html);
          var modal = UIkit.modal("#my_modal").show();
          
          $(".order-shop-product button.btn-submit").click(function() {
             var dia_chi_id = '';
             $(".address-shipping span.item input").each(function() {
                if($(this).is(':checked') === true) {
                    dia_chi_id = $(this).val();    
                }
             });
             var kho_id = $("select.kho-nhan").val();
             if(dia_chi_id == '' || dia_chi_id == undefined) {
                alert('Vui lòng chọn địa chỉ trả hàng');
                return false;
             }
             if(kho_id == '' || kho_id == undefined) {
                alert('Vui lòng chọn kho trả hàng');
                return false;
             }
             $("#ajax_loader").show();
             $.ajax({
                type: 'POST',
                url: '/tim-kiem-san-pham/tao-don-hang',
                data: {
                    title:title,
                    url:url,
                    pid:pid,
                    ncc_name: ncc_name,
                    nccId:nccId,
                    price:price,
                    qty:qty,
                    image:image,
                    data: name_sku,
                    element_type: 'confirm',
                    dia_chi_id:dia_chi_id,
                    kho_id:kho_id
                },
                dataType: 'json',
                success: function(data) {
                    if(parseInt(data.status) == 1) {
                        UIkit.modal("#my_modal").hide();
                        alert(data.msg);
                        setTimeout(function() {
                            window.location.replace(data.path);
                        }, 1000);
                    }
                },
                complete: function() {
                    $("#ajax_loader").hide();
                }
             });
             return false;
          });
          
       },
       complete: function() {
         $("#ajax_loader").hide();
       }  
    });
}
function ecommerce_api_tim_kiem_1688_san_pham_chi_tiet(offet_id) {
    $("#ajax_loader").show();
    $.ajax({
       type: 'POST',
       url: '/tim-kiem-san-pham/ket-qua-1688/chi-tiet',
       data: {
         offet_id:offet_id
       },
       dataType: 'html',
       success: function(data) {
          $("#my_modal").removeClass('not-padding').addClass('not-padding');
          $("#my_modal").removeClass('modal-order-create-order').addClass('modal-eco-api-product-view-detail');
          var html = '<a class="uk-modal-close uk-close"></a>'+data;
          $('#my_modal .uk-modal-dialog').empty().append(html);
          var modal = UIkit.modal("#my_modal").show();
          
          $(".order-product-1688-detail-top-image-block ul li a img").click(function() {
             $(".order-product-1688-detail-top-image-block .image-pri-first").empty().html('<img src="'+$(this).attr('src')+'" />');
          });
          
          $(".next-input-group span.down").click(function() {
             var qty = $(this).parent().children('input.qty').val();
             
             var skuId = $(this).parent().parent().attr('data-skuid');
             var skuNameAll = $(this).parent().parent().attr('data-sku-name');
             var specId = $(this).parent().parent().attr('data-specid');
             var price = $(this).parent().parent().children('span.price').attr('data-price');
             var skuNameChi = $(this).parent().parent().children('span.property-name').attr('data-name');
             var image = $(".property-list-block ul li.parent-first ol li.first a.active.image").attr('data-image-url');
             ecommerce_property_selected_list_sku(skuId,skuNameAll,specId, skuNameChi,price, qtyFinal , image);
             
             if(parseInt(qty) == 0) {
                 return false;
             } else {
                $(this).parent().children('input.qty').val(parseInt(qty) - 1);
             }
          });
    
          $(".next-input-group span.up").click(function() {
             var qty = $(this).parent().children('input.qty').val();
             $(this).parent().children('input.qty').val(parseInt(qty) + 1);
             
             qtyFinal = parseInt(qty) + 1;
             
             var skuId = $(this).parent().parent().attr('data-skuid');
             var skuNameAll = $(this).parent().parent().attr('data-sku-name');
             var specId = $(this).parent().parent().attr('data-specid');
             var price = $(this).parent().parent().children('span.price').attr('data-price');
             var skuNameChi = $(this).parent().parent().children('span.property-name').attr('data-name');
             var image = $(".property-list-block ul li.parent-first ol li.first a.active.image").attr('data-image-url');
             ecommerce_property_selected_list_sku(skuId,skuNameAll,specId, skuNameChi,price, qtyFinal , image);
             
          });
          
          $(".order-product-1688-detail-top-info-block .property-list-block ul li.parent ol li a.first").click(function() {
             var skuName = $(this).attr('data-sku');
             $(".order-product-1688-detail-top-info-block .property-list-block ul li.parent ol li a.first").removeClass('active');
             $(this).addClass('active');
             var image_path = $(this).attr('data-image-url');
             if(image_path) {
                $(".order-product-1688-detail-top-image-block .image-pri-first").empty().html('<img src="'+image_path+'" />');
             }
             
             var sku_last_id = $(".property-list-block ul li.last").attr('data-attributes-id');
             var sku_last_arr = $(".property-list-block ul").attr('data-sku-list');
             var sku_arr_parser = JSON.parse(sku_last_arr);
             var sku_list_arr = {};
             $.each(sku_arr_parser, function(key, item) {
                if(parseInt(sku_last_id) == key) {
                    sku_list_arr = item;
                }
             });
             var sku_list_all = $(".property-list-block").attr('data-config');
             var sku_list_all_parser = JSON.parse(sku_list_all);
             var price_exchange = $(".order-product-1688-detail-top-info-block").attr('data-exchange');
             
             var default_price = $(".order-product-1688-detail-top-info-block").attr('data-price');
             if(ecommerce_api_get_leght_object(sku_list_arr) > 0) {
                var sku_htm = '';
                $.each(sku_list_arr, function(sKey, mItem) {
                    
                    var price = 0;
                    var amountOnSale = 0;
                    var skuId = '';
                    var sku_name = '';
                    var specId = '';
                    var price_vnd = 0;
                    $.each(sku_list_all_parser, function(nKey, nItem) {
                        var skuNameAll = skuName + ';' + mItem.value;
                        if(skuNameAll == nItem.sku_name) {
                            price = nItem.price;
                            amountOnSale = nItem.amountOnSale;
                            skuId = nItem.skuId;
                            sku_name = nItem.sku_name;
                            specId = nItem.specId;
                        }
                    });
                    if(price == 0 || price == 'null' || price == null) {
                        price = default_price;
                    }
                    price_vnd = number_format(parseFloat(price) * parseInt(price_exchange), 0,'',',');
                    var class_active = parseInt(amountOnSale) > 0 ? 'active' : 'not-allowed';
                    var qty_disabled = parseInt(amountOnSale) > 0 ? '' : 'disabled';
                    sku_htm += '<li class="chil item-other '+class_active+' p-item-sku-'+skuId+'" data-skuId="'+skuId+'" data-sku-name="'+sku_name+'" data-specId="'+specId+'"> \
                                    <span class="property-name" data-name="'+mItem.value+'"><b>'+mItem.value+'</b></span>\
                                    <span class="price" data-price="'+price+'"><b>¥'+price+'</b><br/>đ'+price_vnd+'</span> \
                                    <span class="amount-on-sale" data-amount="'+amountOnSale+'">Có sẵn <b>'+amountOnSale+'</b> sản phẩm</span> \
                                    <div class="next-input-group next-input-group-'+skuId+'"> \
                                        <span class="down" '+qty_disabled+'>-</span>\
                                        <input type="number" '+qty_disabled+' class="qty qty-'+skuId+'" value="0"/> \
                                        <span class="up" '+qty_disabled+'>+</span>\
                                    </div> \
                                </li>';
                });
                $(".property-list-block ul li.last ol").empty().html(sku_htm);
                
                $(".next-input-group span.down").click(function() {
                    var qty = $(this).parent().children('input.qty').val();
                    
                    var qtyFinal = parseInt(qty) - 1;
                    if(parseInt(qty) == 1) {
                        qtyFinal = 0;
                    }
                    var skuId = $(this).parent().parent().attr('data-skuid');
                    var skuNameAll = $(this).parent().parent().attr('data-sku-name');
                    var specId = $(this).parent().parent().attr('data-specid');
                    var price = $(this).parent().parent().children('span.price').attr('data-price');
                    var skuNameChi = $(this).parent().parent().children('span.property-name').attr('data-name');
                    var image = $(".property-list-block ul li.parent-first ol li.first a.active.image").attr('data-image-url');
                    ecommerce_property_selected_list_sku(skuId,skuNameAll,specId, skuNameChi,price, qtyFinal , image);
                    
                    if(parseInt(qty) == 0) {
                        return false;
                    } else {
                        $(this).parent().children('input.qty').val(parseInt(qty) - 1);
                    }
                });
            
                $(".next-input-group span.up").click(function() {
                    var qty = $(this).parent().children('input.qty').val();
                    $(this).parent().children('input.qty').val(parseInt(qty) + 1);
                    
                    qtyFinal = parseInt(qty) + 1;
                    
                    var skuId = $(this).parent().parent().attr('data-skuid');
                    var skuNameAll = $(this).parent().parent().attr('data-sku-name');
                    var specId = $(this).parent().parent().attr('data-specid');
                    var price = $(this).parent().parent().children('span.price').attr('data-price');
                    var skuNameChi = $(this).parent().parent().children('span.property-name').attr('data-name');
                    var image = $(".property-list-block ul li.parent-first ol li.first a.active.image").attr('data-image-url');
                    ecommerce_property_selected_list_sku(skuId,skuNameAll,specId, skuNameChi,price, qtyFinal , image);
                    
                });
                
             }
             console.log(sku_list_arr);
          });
                    
          $(".buy-action-block a.add-to-cart").click(function() {
             var qty_min = $(".price-begin-block").attr('data-qty');
             var offet_id = $(".order-product-1688-detail-top-info-block").attr('data-offet-id');
             var title = $(".order-product-1688-detail-top-info-block h1.title").attr('data-title');
             var ncc_name = $(".order-product-1688-detail-top-block").attr('data-ncc-name');
             var ncc_id = $(".order-product-1688-detail-top-block").attr('data-ncc-url');
             var url_product = $(".order-product-1688-detail-top-info-block h1.title").attr('data-url');
             var data_product_list = {};
             if($(".property-selected-list-sku a").length > 0) {
                var qty = 0;
                $(".property-selected-list-sku a").each(function() {
                    data_product_list[$(this).attr('data-skuid')] = {
                        'skuid': $(this).attr('data-skuid'),
                        'specid': $(this).attr('data-specid'),
                        'price': $(this).attr('data-price'),
                        'qty': $(this).attr('data-qty'),
                        'image': $(this).attr('data-image'),
                        'sku_name_all': $(this).attr('data-sku-all'),
                        'sku_name': $(this).attr('data-sku-name')
                    };
                    qty += parseInt($(this).attr('data-qty'));
                });
                if(parseInt(qty_min) > qty) {
                    alert('Số lượng phải >= ' + qty_min);
                    return false;
                }
                $("#ajax_loader").show(); 
                $.ajax({
                   type: 'POST',
                   url: '/tim-kiem-san-pham/them-vao-gio-hang-1688',
                   data: {
                      list: JSON.stringify(data_product_list),
                      offet_id:offet_id,
                      title : title,
                      ncc_name:ncc_name,
                      ncc_id:ncc_id,
                      url_product:url_product
                   },
                   dataType: 'json',
                   success: function(data) {
                      if(parseInt(data.status) == 1) {
                         alert(data.msg);
                      }
                   },
                   complete: function() {
                     $("#ajax_loader").hide();
                   } 
                });
             }
          });
          
          $(".buy-action-block a.buy-now").click(function() {
             var qty_min = $(".price-begin-block").attr('data-qty');
             var offet_id = $(".order-product-1688-detail-top-info-block").attr('data-offet-id');
             var title = $(".order-product-1688-detail-top-info-block h1.title").attr('data-title');
             var ncc_name = $(".order-product-1688-detail-top-block").attr('data-ncc-name');
             var ncc_id = $(".order-product-1688-detail-top-block").attr('data-ncc-url');
             var url_product = $(".order-product-1688-detail-top-info-block h1.title").attr('data-url');
             var data_product_list = {};
             if($(".property-selected-list-sku a").length > 0) {
                var qty = 0;
                $(".property-selected-list-sku a").each(function() {
                    data_product_list[$(this).attr('data-skuid')] = {
                        'skuid': $(this).attr('data-skuid'),
                        'specid': $(this).attr('data-specid'),
                        'price': $(this).attr('data-price'),
                        'qty': $(this).attr('data-qty'),
                        'image': $(this).attr('data-image'),
                        'sku_name_all': $(this).attr('data-sku-all'),
                        'sku_name': $(this).attr('data-sku-name')
                    };
                    qty += parseInt($(this).attr('data-qty'));
                });
                if(parseInt(qty_min) > qty) {
                    alert('Số lượng phải >= ' + qty_min);
                    return false;
                }
                $("#ajax_loader").show(); 
                $.ajax({
                   type: 'POST',
                   url: '/tim-kiem-san-pham/tao-don-hang-1688',
                   data: {
                      list: JSON.stringify(data_product_list),
                      offet_id:offet_id,
                      element_type: 'render',
                      title : title,
                      ncc_name:ncc_name,
                      ncc_id:ncc_id,
                      url_product:url_product
                   },
                   dataType: 'html',
                   success: function(data) {
                      $("#my_modal").removeClass('not-padding').addClass('not-padding');
                      $("#my_modal").removeClass('modal-order-create-order').addClass('modal-order-create-order');
                      var html = '<a class="uk-modal-close uk-close"></a>'+data;
                      $('#my_modal .uk-modal-dialog').empty().append(html);
                      var modal = UIkit.modal("#my_modal").show();
                      
                      $(".order-shop-product button.btn-submit").click(function() {
                         var kho_id = $(".o-shop-dia-chi-nhan-hang select.kho-nhan").val();
                         var address_id = '';
                         $(".address-shipping span.item input").each(function() {
                            if($(this).is(':checked') == true) {
                                address_id = $(this).val();
                            }
                         });
                         if(address_id == '') {
                            alert('Vui lòng chọn địa chỉ giao hàng');
                            return false;
                         }
                         if(kho_id == '') {
                            alert('Vui lòng chọn kho nhận hàng');
                            return false;
                         }
                         $("#ajax_loader").show(); 
                         $.ajax({
                            type: 'POST',
                            url: '/tim-kiem-san-pham/tao-don-hang-1688',
                            data: {
                              list: JSON.stringify(data_product_list),
                              offet_id:offet_id,
                              element_type: 'confirm',
                              title : title,
                              kho_id:kho_id,
                              address_id:address_id,
                              ncc_name:ncc_name,
                              ncc_id:ncc_id
                            },
                            dataType: 'json',
                            success: function(data) {
                              if(parseInt(data.status) == 1) {
                                alert(data.msg);
                                UIkit.modal("#my_modal").hide();
                              }
                            },
                            complete: function() {
                                $("#ajax_loader").hide(); 
                            }
                         });
                         return false;
                      });
                      
                   },
                   complete: function() {
                      $("#ajax_loader").hide(); 
                   }
                });
             } else {
                alert('Vui lòng chọn thuộc tính sản phẩm');
             }
          });
          
       },
       complete: function() {
          $("#ajax_loader").hide();
       }
    });
}
function ecommerce_property_selected_list_sku(skuId, property_name_all, specid, property_name, price, qty, image = '') {
    if($(".property-selected-list-sku a").length > 0) {
        count = 0;
        $(".property-selected-list-sku a").each(function() {
          if($(this).hasClass('item-'+skuId) === true) {
            count += 1;
            $(".property-selected-list-sku a.item-"+skuId).attr('data-qty', qty);
            $(".property-selected-list-sku a.item-"+skuId).attr('data-price', price);
          }
       });
       if(count == 0) {
          $(".property-selected-list-sku").append('<a href="javascript:void(0);" class="item-'+skuId+'" data-specid="'+specid+'" data-price="'+price+'" data-qty="'+qty+'" data-image="'+image+'" data-skuid="'+skuId+'" data-sku-all="'+property_name_all+'" data-sku-name="'+property_name+'"></a>');
       }
    } else {
       $(".property-selected-list-sku").append('<a href="javascript:void(0);" class="item-'+skuId+'" data-specid="'+specid+'" data-price="'+price+'" data-qty="'+qty+'" data-image="'+image+'" data-skuid="'+skuId+'" data-sku-all="'+property_name_all+'" data-sku-name="'+property_name+'"></a>');
    }
}
function ecommerce_api_get_leght_object(obj) {
  var size = 0, key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
}