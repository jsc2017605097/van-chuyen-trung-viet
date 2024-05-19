$$(document).ready(function($){
	//var modal = UIkit.modal("#popup").show();
	/* var popup_home = true;
	if($('#popup').length){
		if(typeof Storage !== "undefined"){
			if(localStorage.getItem('show-popup') == 1){
				popup_home = true;
			}else{
				localStorage.setItem('show-popup', 1);
			}
		}
		//console.log(localStorage.getItem('show-popup'));
		if(popup_home == true){
			var modal = UIkit.modal("#popup",{center:true}).show();
		}
	} */
	if($('#popup').length){
		var modal = UIkit.modal("#popup", {center:true}).show();
                if(window.showpopup)
                    window.clearTimeout(window.showpopup)
                // resize popup home page
                window.showpopup= setTimeout(function (){
                    var $windowHeight = $(window).outerHeight();
        var $popupHeight = $("#popup .td-thongbao").height();
	$windowHeight= parseInt($windowHeight);
        $popupHeight= parseInt($popupHeight);
        var $h = $popupHeight - $windowHeight;
        console.log($h)
	if($windowHeight<$popupHeight){
		$('#popup').addClass('outzoom');
                if($h>150){
                    $('#popup').addClass('outzoom3');
                }else if($h>100){
                    $('#popup').addClass('outzoom2');
                }else{
                    $('#popup').addClass('outzoom1');
                }
                
	}
                },500);
	
	}
        
});