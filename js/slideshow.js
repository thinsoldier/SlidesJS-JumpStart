jQuery(document).ready(function($) {
	// Make the thumbs ready to center themselves as soon as they load
	$('#thumbs img').on('load', function(e){ centerImage(e.target) } );
	
	// Force webkit/chrome to trigger a load even for each thumb.
	// This is faster than waiting for the entire window.load
	$('#thumbs img').each(function(i,e){ e.src = e.src+'?jsonload' });
});


// Slideshow needs to wait until after images are loaded because the images need to be measured.
jQuery( window ).load( function(){
	var $ = jQuery;
	
	window.mainphotoElement = $('#mainphoto').get(0);
	
	// Slideshow doesn't work if there's only 1 slide. If only 1 then clone the 1 slide.
	if( $("#slides").children().length < 2 )
	{ 
		$("#slides").children().first().clone().addClass('clone_of_sjs_slide_1').appendTo("#slides");
		var paginavOptionValue = false;
	} else { var paginavOptionValue = true; }
	
	// Create Slideshow.
	slideshow = $("#slides").slidesjs({
		width: $('#mainphoto').width(),
		height: $('#mainphoto').height(),
      pagination: { active: false },
      navigation: { active: paginavOptionValue },
		play:{auto:false, pauseOnHover: true},
		effect: { slide: { speed: 3000 } },
		callback: { loaded: slidetweaks }
	});
      
   // sjs is global access to slideshow api.
	sjs = $('#slides').data('plugin_slidesjs');
	
	$('#thumbs a').click( function(e){
		e.preventDefault();
		element = $(e.target).closest('a');
		slide = element.data('sjs');
		sjs.goto( slide );
	});
	
	
	$(window).resize(function () {
		// As soon as you started resizing, set element.height to auto so it is squishy
		var heightVal = window.mainphotoElement.style.height;
		if( heightVal != 'auto') { window.mainphotoElement.style.height = 'auto'; }		
		
		 // Right when you stop resizing, set element.height to nothing so that the
		 // height defined in stylesheet takes over.
		 // UponOrientation will measure based on the stylesheet value.
		 waitForFinalEvent( function() 
		 {
			 $('#mainphoto').get(0).style.height = null;
			 uponOrientation();
			 console.log('...waitForFinalEvent...uponOrientation');
		 }, 500, "resize_uponOrientation");
	});	
});


// This is run as a callback after full window load and after SlidesJS triggers its load event.
// Because I need to measure the size at which the images are displayed I have to make all 
// the image parents visible, then measure and center them, then hide them again, except the first one.
function slidetweaks()
{
	var $ = jQuery;

	// Because of where this callback function is executed within 
	// SlidesJS code I don't have access to sjs variable in here :(

	// put prev & next inside of main slide area so they can be positioned relative to it.
	$('.slidesjs-navigation').appendTo('.slidesjs-container');

	$('.slidesjs-slide').css('display','block');
	$('.slidesjs-slide img').each( function(index,element){ centerImage(element); } );
	$('.slidesjs-slide').css('display','none');
	$('.slidesjs-slide').first().css('display','block');
}


// If device is rotated or window is resized greatly the slideshow and thumbs might need to be recentered.
// Put a a setTimeout delay on the resize event code so resizing windows or rotating devices is not sluggish.
// iOS safari might not trigger window resize events when a device is rotated so matchMedia is the only way to go for that.

// Find matches
var mql = window.matchMedia("(orientation: portrait)");

// If there are matches, we're in portrait
if(mql.matches) {  // Portrait orientation
	// --
} else {  // Landscape orientation
	// --
}

// Add a media query change listener
mql.addListener( orientationChangeHandler );

// Orientation changes are fired before the css breakpoint styles have been applied.
// So need to delay the execution of uponOrientation function with setTimeout.
var timer_id = null; //global
function orientationChangeHandler(m)
{
	console.log(m);
	timer_id = setTimeout(function() {
		uponOrientation();
	}, 300);
	 
	if(m.matches) { } // Changed to portrait	
	else { } // Changed to landscape
}

function uponOrientation()
{
	var $ = jQuery;

	// recenter thumbs
	$('#thumbs img').each( function(index,element){ centerImage(element); } );

	// Measure the height of the slideshow area (changes via css based on orientations)
	// and tell the slideshow the new height value.
	// It will be used in sjs.update later
		//console.log('old height ', sjs.options.height);
	sjs.options.height = $('#mainphoto').height();
		//console.log('new height ', sjs.options.height);

	// Recentering the images in the slides isn't as easy as the thumbs, so re-use slidetweaks function
	// as a callback to make sure it only happens after sjs.update has changed the height of the slideshow.
	sjs.manualUpdate( slidetweaks );
	
	// Now go back to the first slide after orientation change.
	// Trying to go back to the same slide from before the orientation change would require more
	// nitty gritty manipulation of SlidesJS internals.
	// It is possible but not enough time and I'd probably want to add to the SlidesJS api to do it.
	sjs.goto( 1 );
	
	clearTimeout(timer_id);
}
