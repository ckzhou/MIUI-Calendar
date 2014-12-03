var detail_weather=$("detail-weather");
var citySpan=$("city");
var weatherSpan=$("weather-des");
var tempSpan=$("temp");
var dayImage=$("dayimg");
var nightImage=$("nightimg");
var xmlhttp;
if(window.XMLHttpRequest){
	xmlhttp=new XMLHttpRequest();
}
else{
	xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
}
var cAddress=returnCitySN['cname'].substring(3,5);
var city=citycode[cAddress];
var url="getWeather.php?citycode="+city;
var imgUrl="http://m.weather.com.cn/img/";
xmlhttp.onreadystatechange=function(){
	if(xmlhttp.readyState==4&&xmlhttp.status==200){		//如果http响应已经就绪而且状态吗是200，处理ajax返回的json内容
		var jsonText=eval('('+xmlhttp.responseText+')').weatherinfo;
		var cityname=jsonText.city;
		var weather=jsonText.weather;
		var temp1=jsonText.temp1;
		var temp2=jsonText.temp2;
		var dayImg=jsonText.img1;
		var nightImg=jsonText.img2;
		var ptime=jsonText.ptime;
		citySpan.innerHTML=cityname;
		weatherSpan.innerHTML=weather;
		tempSpan.innerHTML=temp1+"～"+temp2;
		dayImage.src=imgUrl+dayImg;
		nightImage.src=imgUrl+nightImg;
	}
}
xmlhttp.open("GET",url,true);
xmlhttp.send();



