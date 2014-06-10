// Centers an <img> tag relative to its parent
// the parent MUST have a fixed width and height.
// So in the case of 
// div a img {}
// ensure the <a> height is manually defined
// instead of being determined by the image it contains.
function centerImage( image )
{
	if(image.tagName.toLowerCase() != 'img'){ return; }

	var $image = $(image);
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

	// Measure and set the orientation of the image: portrait or landscape
	if( $imageWidth  < $imageHeight ){ $image.addClass('portrait'); }
	if( $imageWidth  > $imageHeight ){ $image.addClass('landscape'); }
	
	// Determine and indicate if it is smaller than the parent area.
	if( $imageWidth  < $areaW ){ $image.addClass('tooNarrow'); }
	if( $imageHeight < $areaH ){ $image.addClass('tooShort'); }
	
	// Assigning the tooShort or tooNarrow classes 
	// will have changed the width and height of some images
	// so re-measure the image size before centering.
	$imageWidth  = image.clientWidth;
	$imageHeight = image.clientHeight;
	
	// console.log('2nd W H', $imageWidth, $imageHeight, image);
	
	
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
}


// Slideshow needs to wait until after images are loaded because the images need to be measured.
$( window ).load( function(){
	
	slideshow = $("#slides").slidesjs({
        width: 960,
        height: 640,
        callback: { loaded: slidetweaks }
      });
	
});

// This is run as a callback after full window load and after SlidesJS triggers its load event.
// Because I need to measure the size at which the images are displayed I have to make all 
// the image parents visible, then measure and center them, then hide them again, excpet the first one.
function slidetweaks()
{
	// put prev & next inside of main slide area to they can be positioned relative to it.
	$('.slidesjs-navigation').appendTo('.slidesjs-container');

	$('.slidesjs-slide').css('display','block');
	$('.slidesjs-slide img').each( function(index,element){ centerImage(element); } );
	$('.slidesjs-slide').css('display','none');
	$('.slidesjs-slide').first().css('display','block');
	
	// Grab img src of slideshow elements and generate thumbnails
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
		}		
	})
	
	// Center the thumbnails
	$('.slidesjs-pagination-item img').each( function(index,element){ centerImage(element); } );
	
	var scrollElement = $('.slidesjs-pagination').jScrollPane({
	showArrows:true,
	//arrowScrollOnHover: true,
	arrowButtonSpeed: 70*2,
	animateScroll: true
	});
	
	// global for debugging access
	scrollApi = scrollElement.data('jsp');
	//scrollApi.reinitialise();	
}


// When the viewport is resized/rotated the thumbnails need to be recentered
// and the scrollbar script needs to be reinitialized to be the correct width.
$( window ).resize(function() { 
	$('.slidesjs-slide img').each( function(index,element){ centerImage(element); } );
	scrollApi.reinitialise();
	console.log( 'viewport resized' );
});



//----------------------------- 
// Action buttons

$('.d-act-map, .d-act-share, .d-act-enquire').click( toggleIframe );
$('.d-toggles').click( closeToggles );


function toggleIframe( event )
{
	event.preventDefault();
	
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