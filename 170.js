// Centers an <img> tag relative to its parent
// the parent MUST have a fixed width and height.
// So in the case of 
// div a img {}
// ensure the <a> height is manually defined
// instead of being determined by the image it contains.
function centerImage( image )
{
	if(image.tagName.toLowerCase() != 'img'){ return; }

// 	image.style.position = 'relative';
// 	image.style.top = '0px';
// 	image.style.left = '0px';
// 	image.style.transition = 'top 1s, left 1s';



	var $image = $(image);
	// A0
	// Measure the size at which the image is displayed,
	// not the intrinsic size of the image file itself.
	var $imageWidth  = image.clientWidth;
	var $imageHeight = image.clientHeight;
	
	// console.log('1st W H', $imageWidth, $imageHeight, image);

	var area = $image.parent();
	// Size of the image's parent element.
	// Only works if the size is explicitly set in pixels or 100% of some grandparent element.
	var $areaW = area.width();
	var $areaH = area.height();

	// A1
	// Measure and set the orientation of the image: portrait or landscape
	if( $imageWidth  < $imageHeight ){ $image.addClass('portrait'); }
	if( $imageWidth  > $imageHeight ){ $image.addClass('landscape'); }
	
	// B1
	// Assigning the classes might have changed
	// the width and height of some images
	// so re-measure the image size before centering.
	$imageWidth  = image.clientWidth;
	$imageHeight = image.clientHeight;
	
	// console.log('2nd W H', $imageWidth, $imageHeight, image);

	
	// A2
	// Determine and indicate if it is smaller than the parent area.
	if( $imageWidth  < $areaW ){ $image.addClass('tooNarrow'); }
	if( $imageHeight < $areaH ){ $image.addClass('tooShort'); }
	
	// B2
	// Assigning the classes might have changed
	// the width and height of some images
	// so re-measure the image size before centering.
	$imageWidth  = image.clientWidth;
	$imageHeight = image.clientHeight;
	
	// console.log('3rd W H', $imageWidth, $imageHeight, image);
	
	
	// Position the image in the center of its parent.
	var $left = 0;
	if( $areaW < $imageWidth )
	{
		var $left = $areaW - $imageWidth;
		$left = Math.round($left / 2);
	}
	
	var $top = 0;
	if($areaH < $imageHeight )
	{
		var $top = $areaH - $imageHeight;	
		$top = Math.round($top /2);
	}
	
	image.style.position = 'relative';
	image.style.top = $top + 'px';
	image.style.left = $left + 'px';
	
	jQuery.event.trigger({
			type: "centerImageFinished",
			image: image,
			time: new Date()
		});
}


// ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^

$(document).ready(function() {
	$('.d-act-map a').magnificPopup({type:'iframe', mainClass: 'mfp-fade'});
  
	$('.d-act-share a').magnificPopup(
		{
			type:'iframe', 
			mainClass: 'mfp-fade', 
			removalDelay:400,
			callbacks: {
				open: function() {
			// Will fire when this exact popup is opened
			// this - is Magnific Popup object
				}
		
			}
		}
		);
  
});



/*
The slideshow is slidesjs 3 - slidesjs.com/
The slideshow navigation is also a part of slidesjs.
The photos in the slideshow navigation is added by my custom code.
The scrollbar for the slideshow navigation is provided by jScrollPane.
http://jscrollpane.kelvinluck.com/ & https://github.com/vitch/jScrollPane
*/



// Slideshow needs to wait until after images are loaded because the images need to be measured.
$( window ).load( function(){
	
	// Slideshow doesn't work if there's only 1 slide. If only 1 then clone the 1 slide.
	if( $("#slides").children().length < 2 )
	{ 
		$("#slides").children().first().clone().addClass('clone_of_sjs_slide_1').appendTo("#slides");
		var paginavOptionValue = false;
	} else { var paginavOptionValue = true; }
	
	// Create Slideshow.
	slideshow = $("#slides").slidesjs({
        width: 960,
        height: 640,
        pagination: { active: paginavOptionValue },
        navigation: { active: paginavOptionValue },
        callback: { loaded: slidetweaks }
      });
      
     	// sjs is global access to slideshow api.
		sjs = $('#slides').data('plugin_slidesjs');
		
});

// This is run as a callback after full window load and after SlidesJS triggers its load event.
// Because I need to measure the size at which the images are displayed I have to make all 
// the image parents visible, then measure and center them, then hide them again, except the first one.
function slidetweaks()
{
	// Because of where this callback function is executed within 
	// SlidesJS code I don't have access to sjs variable in here :(

	// put prev & next inside of main slide area so they can be positioned relative to it.
	$('.slidesjs-navigation').appendTo('.slidesjs-container');

	$('.slidesjs-slide').css('display','block');
	$('.slidesjs-slide img').each( function(index,element){ centerImage(element); } );
	$('.slidesjs-slide').css('display','none');
	$('.slidesjs-slide').first().css('display','block');
	
	
	if( $('.slidesjs-pagination-item').length === 0 ) { return; }
	
	// Grab img src of slideshow elements and generate thumbnail images.
	// Place the created imgs inside of the slide numbers created by slidesjs pagination feature.
	$('.slidesjs-pagination-item a').each( function(index,element){
		// pagination item
		element = $(element); 
		var key = element.data().slidesjsItem;
		// slide div that corresponds to current pagination item
		var slide = $("[slidesjs-index='"+key+"']");
		
		if(slide.hasClass('videotour-slide'))
		{ 
			element.html('virtual tour icon');
		}
		
		
		var sourceImage = $("[slidesjs-index='"+key+"'] img");
		if( sourceImage.length )
		{
			var imgurl = sourceImage.attr('src').replace('/large/' , '/thumb/');
			var thumb = $('<img>').attr('src', imgurl).attr('class', sourceImage.attr('class') );
			element.html( thumb );
			thumb.on('load', function(e){ centerImage(e.target) } );
		}		
	})	
	
	// Only use scrollbar plugin if not on small viewport
	if (document.documentElement.clientWidth > 640 ) 
	{
		// create scrollbar area for thumbnails
		var scrollElement = $('.slidesjs-pagination').jScrollPane({
		showArrows:true,
		//arrowScrollOnHover: true,
		arrowButtonSpeed: 70*2,
		animateScroll: true
		});
	
		// global for debugging access
		scrollApi = scrollElement.data('jsp');
	}
}

// ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^


// Put a a setTimeout delay on the resize event code so resizing windows or rotating devices is not sluggish.
$(window).bind('resize', function(e)
{
    window.resizeEvt;
    $(window).resize(function()
    {
        clearTimeout(window.resizeEvt);
        window.resizeEvt = setTimeout(function()
        {
            $('.slidesjs-slide img').each( function(index,element){ centerImage(element); } );
				if(scrollApi){ scrollApi.reinitialise(); }
				console.log( 'viewport resized' );
        }, 250);
    });
});


// ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^


//----------------------------- 
// Action buttons

// $('.d-act-map, .d-act-share, .d-act-enquire').click( toggleIframe );
// $('.d-toggles').click( closeToggles );


function toggleIframe( event )
{
	event.preventDefault(); 
	
	return
	
	var $target = $(event.target).closest('div[data-toggletarget]');
	
	var $container = $('.d-area-' + $target.data('toggletarget') );
	
	if($container.hasClass('d-default'))
	{
		$container.removeClass('d-default');
		var url = $container.find('div').data('iframe');
		//console.log(url);
		$container.html('<div class="d-xclose">X</div><iframe src='+url+'></iframe>');
	}
	$container.slideToggle();
}


function closeToggles( event )
{
	var target = $(event.target);
	if ( target.hasClass('d-xclose') )
	{
		target.parent().slideToggle();
	}
}