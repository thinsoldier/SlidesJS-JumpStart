<? 
$files = 
"http://paradisebahamas.xamp/photos/large/543f2ec7ed4b4.jpg
http://brl.xamp/photos/%s/530b816105408.jpg
http://brl.xamp/photos/%s/510aca8934a6c.jpg
http://brl.xamp/photos/%s/51083ab609ebd.jpeg
http://brl.xamp/photos/%s/514894a58b79f.jpeg
http://brl.xamp/photos/%s/514894a668414.jpeg
http://brl.xamp/photos/%s/514894a6e581a.jpeg
http://brl.xamp/photos/%s/514894cc4eb6b.jpeg
http://brl.xamp/photos/%s/514894cfc722e.jpeg
http://brl.xamp/photos/%s/514894ca7fc6a.jpeg
http://brl.xamp/photos/%s/514894ccc76d1.jpeg
http://brl.xamp/photos/%s/514894a886b95.jpeg
http://brl.xamp/photos/%s/514894cf3b7e7.jpeg
http://brl.xamp/photos/%s/514894cbca371.jpeg
http://brl.xamp/photos/%s/514894cd7a763.jpeg
http://brl.xamp/photos/%s/514894cea42cf.jpeg
http://brl.xamp/photos/%s/514894a4896fc.jpeg
http://brl.xamp/photos/%s/514894a3eaf65.jpeg
http://brl.xamp/photos/%s/514894a342bd8.jpeg
http://brl.xamp/photos/%s/514894a7726cf.jpeg
http://brl.xamp/photos/%s/51083ab67efce.jpeg
http://brl.xamp/photos/%s/5148945ca600d.jpg
http://brl.xamp/photos/%s/5148945d2bfa7.jpg
http://brl.xamp/photos/%s/5148945d813da.jpg
http://brl.xamp/photos/%s/5148945dd8239.jpg
http://brl.xamp/photos/%s/5148945e385a0.jpg
http://brl.xamp/photos/%s/5148945e8e967.jpg
http://brl.xamp/photos/%s/5148945ee3f91.jpg
http://brl.xamp/photos/%s/5148945f47561.jpg
http://brl.xamp/photos/%s/51489485a1b86.jpg
http://brl.xamp/photos/%s/51489485f156f.jpg";

$files = explode("\n", $files);


?><!doctype html>
<html>
<head>
<meta charset="utf-8">

<!-- 2014-06-03 -->

<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes, minimum-scale=1.0, maximum-scale=3.0"> 
<meta name="apple-mobile-web-app-capable" content="yes">

<link rel="stylesheet" href="css/slideshow.css" type="text/css">

<script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>

<script src="js/jquery.slides.js"></script>

<script src="js/jquery.lazyload.js"></script>

<script src="js/global.js"></script>
	
<script src="js/slideshow.js"></script>

<style>
body { max-width: 700px; margin: auto; }
</style>


</head>

<body>

<div class="i-beforemain row">
	<div class="" id="mainphoto">
		<div id="slides">

<? 
$format = '<div class="photo-slide">
	<img class="lazy lazy-unloaded" src="spacer.gif" data-original="%s">
	<div class="caption">'.uniqid('Caption Text ').'</div>
</div>
';
foreach( $files as $f )
{
	$usefile = sprintf( $f, 'large' );
	printf( $format, $usefile );
}
?>
		</div>
	</div>
	<div id="thumbHolder" class=" col atleast-3 atleast-4 atleast-6 atleast-7 atleast-10 atleast-11">
	<ul id="thumbs">

<? 
$format = '<li>
	<a href="%s" data-sjs="%s">
	<img class="lazy" alt="" src="spacer.gif" data-original="%s" />
	</a>
	</li>

';
foreach( $files as $key => $f )
{
	$count = $key + 1;
	$usefile = sprintf( $f, 'thumb' );
	printf( $format, $usefile, $count, $usefile );
}
?>
</ul>	
</div>
</div><!-- close i-beforemain -->

</body>
</html>