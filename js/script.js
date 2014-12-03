function $(id){	
	return document.getElementById(id);
}

function addEvent(node,eventType,handler){	//编写兼容个浏览器的添加事件函数
	if(typeof(node.addEventListener)=="function"){
		node.addEventListener(eventType,handler,false);
	}
	else if(typeof(node.attachEvent)=="function"){
		node.attachEvent("on"+eventType,handler);
	}
	else{
		node["on"+eventType]=handler;
	}
}

var year_area=$("year");
var month_area=$("month");
var day_area=$("day");
var btn_last_month=$("btn-last-month");
var btn_today=$("btn-today");
var btn_next_month=$("btn-next-month");
var dates_table=$("dates");
var dates_ceils=dates_table.getElementsByTagName("td");
var daysArr=["周日","周一","周二","周三","周四","周五","周六"];
function drawCalendar(){
	this.fitIE=function(x){		//兼容IE和火狐
		return x<10?"0"+x:x;
	}
	//设置对象的相关属性
	this.nowTime=new Date();
	this.year=this.nowTime.getFullYear();
	this.month=this.nowTime.getMonth()+1;//getMonth方法返回的值和真实值差一
	this.date=this.nowTime.getDate();
	this.cdate=this.date;
	this.day=this.nowTime.getDay();
	this.lunarObj=new lunar();
	this.fdayOfMonth=new Date(this.year+"-"+this.fitIE(this.month)+"-"+"01").getDay();
	//定义对象的方法
	this.isLeap=function(year){	//设置对象在闰年和平年的对应属性
		if(this.year%400==0||(this.year%4==0&&this.year%100!=0)){
			this.daysOfMonths=[31,29,31,30,31,30,31,31,30,31,30,31];
		}
		else{
			this.daysOfMonths=[31,28,31,30,31,30,31,31,30,31,30,31];
		}
		this.daysOfTheMonth=this.daysOfMonths[this.month-1];
		this.ldayOflMonth=this.daysOfMonths[new Date(this.year+"-"+(this.month-1)+"-"+this.date).getMonth()];
	}
	this.getlunarInfo=function(year,month,date){
		var lunar_today=this.lunarObj.lunar_calc(year+"-"+this.fitIE(month)+"-"+this.fitIE(date));
		$("lunar-month").innerHTML=lunar_today.lunar_month;
		$("lunar-date").innerHTML=lunar_today.lunar_date;
	}
	this.fillHeaderInfo=function(){			//填写日历头部的年月和星期信息
			this.isLeap(this.year);
			year_area.innerHTML=this.year+"年";
			month_area.innerHTML=this.month+"月";
			day_area.innerHTML=arguments[0]?arguments[0]:daysArr[this.day];
	}
	this.fillDates=function(){				//绘制正确的日期表格
		if(this.month==2&&this.date>this.daysOfMonths[1]){
			this.date=this.daysOfMonths[1];
		}
		else{
			this.date=this.nowTime.getDate();
		}
		//填写本月的日期信息
		for(var i=(typeof(arguments[0])!="undefined"?arguments[0]:this.fdayOfMonth),jday=1;i<(typeof(arguments[0])!="undefined"?arguments[0]:this.fdayOfMonth)+(typeof(arguments[1])!="undefined"?arguments[1]:this.daysOfTheMonth);i++){
			var solarStr=this.year+"-"+this.fitIE(this.month)+"-"+this.fitIE(jday);
			var lunarDate=this.lunarObj.lunar_calc(solarStr).lunar_date;
			if(jday==this.date){
				dates_ceils[i].innerHTML="<span id='today' class='today'>"+jday+"</span><i class='lunar-today'>"+lunarDate+"</i>";
			}
			else{
				dates_ceils[i].innerHTML="<span class='another'>"+jday+"</span><i class='another'>"+lunarDate+"</i>";
			}
			jday++;
		}
		//填写下个月的日期信息
		for(var i=(typeof(arguments[0])!="undefined"?arguments[0]:this.fdayOfMonth)+(typeof(arguments[1])!="undefined"?arguments[1]:this.daysOfTheMonth),jday=1;i<dates_ceils.length;i++){
			if(this.month==12){
				var solarStr=(this.year+1)+"-"+"01"+"-"+this.fitIE(jday);
			}
			else{
				var solarStr=this.year+"-"+this.fitIE(this.month+1)+"-"+this.fitIE(jday);
			}
			var lunarDate=this.lunarObj.lunar_calc(solarStr).lunar_date;
			dates_ceils[i].innerHTML="<span class='next'>"+jday+"</span><i class='next'>"+lunarDate+"</i>";
			jday++;
		}
		//填写上个月的日期信息
		for(var i=(typeof(arguments[0])!="undefined"?arguments[0]:this.fdayOfMonth)-1,jday=(typeof(arguments[2])!="undefined"?arguments[2]:this.ldayOflMonth);i>=0;i--){
			if(this.month==1){
				var solarStr=(this.year-1)+"-"+12+"-"+this.fitIE(jday);
			}
			else{
				var solarStr=this.year+"-"+this.fitIE(this.month-1)+"-"+this.fitIE(jday);
			}
			var lunarDate=this.lunarObj.lunar_calc(solarStr).lunar_date;
			dates_ceils[i].innerHTML="<span class='last'>"+jday+"</span><i class='last'>"+lunarDate+"</i>";
			jday--;
		}
		this.getlunarInfo(this.year,this.month,this.date);
	}
	this.bindEvent=function(){	//绑定相关事件
		addEvent(btn_last_month,"click",this.eventHandler.go_last_month);
		addEvent(btn_today,"click",this.eventHandler.back_today);
		addEvent(btn_next_month,"click",this.eventHandler.go_next_month);
		addEvent(dates_table,"click",this.eventHandler.click_dates_table);
	}
	this.eventHandler={
		go_last_month:function(){			//跳至上一个月
			calendar.month-=1;			
			if(calendar.month<1){
				calendar.month=12;
				calendar.year-=1;
				calendar.isLeap(calendar.year);
			}
			var monthStr=calendar.fitIE(calendar.month);
			var monthStr1=calendar.fitIE(calendar.month-1);
			var dateStr=calendar.fitIE(calendar.date);
			var today=new Date(calendar.year+"-"+monthStr+"-"+dateStr);
			var fdayOfTheMonth=new Date(calendar.year+"-"+monthStr+"-"+"01").getDay();
			var daysOfTheMonth=calendar.daysOfMonths[calendar.month-1];
			if(calendar.month==1){
				var ldayOflMonth=31;
			}
			else{
				var ldayOflMonth=calendar.daysOfMonths[new Date(calendar.year+"-"+monthStr1+"-"+dateStr).getMonth()];
			}
			calendar.fillHeaderInfo(daysArr[today.getDay()]);
			calendar.fillDates(fdayOfTheMonth,daysOfTheMonth,ldayOflMonth);
		},
		back_today:function(){				//返回到今天
			calendar.year=calendar.nowTime.getFullYear();
			calendar.month=calendar.nowTime.getMonth()+1;
			calendar.fillHeaderInfo();
			calendar.fillDates();
		},
		go_next_month:function(){			//跳至下一个月
			calendar.month+=1;
			if(calendar.month>12){
				calendar.year+=1;
				calendar.month=1;
				calendar.isLeap(calendar.year);
			}
			var monthStr=calendar.fitIE(calendar.month);
			var monthStr1=calendar.fitIE(calendar.month-1);
			var dateStr=calendar.fitIE(calendar.date);
			var today=new Date(calendar.year+"-"+monthStr+"-"+dateStr);
			var fdayOfTheMonth=new Date(calendar.year+"-"+monthStr+"-"+"01").getDay();
			var daysOfTheMonth=calendar.daysOfMonths[calendar.month-1];
			if(calendar.month==1){
				var ldayOflMonth=31;
			}
			else{
				var ldayOflMonth=calendar.daysOfMonths[new Date(calendar.year+"-"+monthStr1+"-"+dateStr).getMonth()];
			}
			calendar.fillHeaderInfo(daysArr[today.getDay()]);
			calendar.fillDates(fdayOfTheMonth,daysOfTheMonth,ldayOflMonth);
		},
		click_dates_table:function(e){
			var event=e||window.event;
			var target=event.target||event.srcElement;
			if(target.tagName==="SPAN"||target.tagName==="I"){
				if(target.className==="last"){
					btn_last_month.click();
				}
				else if(target.className==="next"){
					btn_next_month.click();
				}
				else if(target.className==="another"){
					if(target.id=="today"||target.parentNode.getElementsByTagName('span')[0].id=="today"){
						$("today").style.color="#FFF";
					}
					else{
						$("today").style.color="#da033f";
					}
					document.getElementsByClassName("today")[0].className='another';
					document.getElementsByClassName('lunar-today')[0].className="another";
					if(target.tagName==="I"){
						target.parentNode.getElementsByTagName('span')[0].className="today";
						target.className="lunar-today";
						calendar.cdate=target.parentNode.getElementsByTagName('span')[0].innerHTML;
					}
					else{
						target.parentNode.getElementsByTagName('i')[0].className="lunar-today";
						target.className="today";
						calendar.cdate=target.innerHTML;
					}
					calendar.getlunarInfo(calendar.year,calendar.month,calendar.cdate);
				}
			}
		}
	}
}

var calendar=new drawCalendar();
calendar.fillHeaderInfo();
calendar.fillDates();
calendar.bindEvent();