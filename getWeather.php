<?php
	header("Content-type:text/json");
	$citycode=$_GET['citycode'];
	$weatherAPI="http://www.weather.com.cn/data/cityinfo/".$citycode.".html";
	$json=file_get_contents($weatherAPI);
	echo $json;
?>