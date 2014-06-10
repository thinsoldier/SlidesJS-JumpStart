
// Slideshow needs to wait until after images are loaded because the images need to be measured.
jQuery( window ).load( function(){
	var $ = jQuery;
	
	$('#slides').slidesjs({
		//width: 320, //940,
		//height: 240, //480,

		width: $('#mainphoto').width(),
		height: $('#mainphoto').height(),
		navigation: {active:true},
		pagination: {active:false},
		play:{auto:false, pauseOnHover: true},
		effect:{slide:{speed:2000}},
		callback: { loaded: slidetweaks }
	});

	sjs = $('#slides').data('plugin_slidesjs');
	
	$('#thumbs a').click( function(e){
		e.preventDefault();
		element = $(e.target).closest('a');
		slide = element.data('sjs');
		sjs.goto( slide );
	});
	
});


// This is run as a callback after full window load and after SlidesJS triggers its load event.
// Because I need to measure the size at which the images are displayed I have to make all 
// the image parents visible, then measure and center them, then hide them again, except the first one.
function slidetweaks()
{
	var $ = jQuery;
	
	// put prev & next inside of main slide area so they can be positioned relative to it.
	$('.slidesjs-navigation').appendTo('.slidesjs-container');

	$('.slidesjs-slide').css('display','block');
	$('.slidesjs-slide img').each( function(index,element){ centerImage(element); } );
	$('.slidesjs-slide').css('display','none');
	$('.slidesjs-slide').first().css('display','block');
}


// If device is rotated or window is resized greatly the slideshow and thumbs might need to be recentered.
// Put a a setTimeout delay on the resize event code so resizing windows or rotating devices is not sluggish.
/*
Problems:
! Chrome-Android fires window resize every time its address bar comes into/out of view.
	Possible fix: detect if both width and height have changed and ignore if only height has changed.
! iOS Safari doesn't seem to trigger window resize event when orientation changes.
	the first window.bind below works in iOS safari but the 2nd does not - works in android chrome though.
*/

//--//jQuery(window).bind('resize', function(e)
//--//{
//--//	console.log('does this show up in safari console log?');
//--//});

jQuery(window).bind('resize', function(e)
{
	var $ = jQuery;
	
    window.resizeEvt;
    $(window).resize(function()
    {
        clearTimeout(window.resizeEvt);
        window.resizeEvt = setTimeout(function()
        {
          	$('#thumbs img').each( function(index,element){ centerImage(element); } );
          	
//--//           	sjs.options.height = $('#mainphoto').height();
//--//           	sjs.manualUpdate( slidetweaks );
          	
          	// Recentering the images in the slides isn't as easy as the thumbs, so re-use slidetweaks function.
          	slidetweaks();
				
//--//				console.log( 'viewport resized' );
//--//				alert( 'viewport resized or orientation change' );
        }, 300);
    });
});
