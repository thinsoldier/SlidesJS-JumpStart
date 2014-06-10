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