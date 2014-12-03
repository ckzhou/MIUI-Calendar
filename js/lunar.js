function lunar(){							//从1900-2049年之间的农历闰月数据，以"0x04bd8"为例,最后面的8表示闰八月，最前面的0表示闰月是大月，中间的三个十六进制位标出了农历年12个 月中的大月和小月
	this.lunarInfo=new Array(
"0x04bd8","0x04ae0","0x0a570","0x054d5","0x0d260","0x0d950","0x16554","0x056a0","0x09ad0","0x055d2",
"0x04ae0","0x0a5b6","0x0a4d0","0x0d250","0x1d255","0x0b540","0x0d6a0","0x0ada2","0x095b0","0x14977",
"0x04970","0x0a4b0","0x0b4b5","0x06a50","0x06d40","0x1ab54","0x02b60","0x09570","0x052f2","0x04970",
"0x06566","0x0d4a0","0x0ea50","0x06e95","0x05ad0","0x02b60","0x186e3","0x092e0","0x1c8d7","0x0c950",
"0x0d4a0","0x1d8a6","0x0b550","0x056a0","0x1a5b4","0x025d0","0x092d0","0x0d2b2","0x0a950","0x0b557",
"0x06ca0","0x0b550","0x15355","0x04da0","0x0a5d0","0x14573","0x052d0","0x0a9a8","0x0e950","0x06aa0",
"0x0aea6","0x0ab50","0x04b60","0x0aae4","0x0a570","0x05260","0x0f263","0x0d950","0x05b57","0x056a0",
"0x096d0","0x04dd5","0x04ad0","0x0a4d0","0x0d4d4","0x0d250","0x0d558","0x0b540","0x0b5a0","0x195a6",
"0x095b0","0x049b0","0x0a974","0x0a4b0","0x0b27a","0x06a50","0x06d40","0x0af46","0x0ab60","0x09570",
"0x04af5","0x04970","0x064b0","0x074a3","0x0ea50","0x06b58","0x055c0","0x0ab60","0x096d5","0x092e0",
"0x0c960","0x0d954","0x0d4a0","0x0da50","0x07552","0x056a0","0x0abb7","0x025d0","0x092d0","0x0cab5",
"0x0a950","0x0b4a0","0x0baa4","0x0ad50","0x055d9","0x04ba0","0x0a5b0","0x15176","0x052b0","0x0a930",
"0x07954","0x06aa0","0x0ad50","0x05b52","0x04b60","0x0a6e6","0x0a4e0","0x0d260","0x0ea65","0x0d530",
"0x05aa0","0x076a3","0x096d0","0x04bd7","0x04ad0","0x0a4d0","0x1d0b6","0x0d250","0x0d520","0x0dd45",
"0x0b5a0","0x056d0","0x055b2","0x049b0","0x0a577","0x0a4b0","0x0aa50","0x1b255","0x06d20","0x0ada0"
);
	this.days_leave=334;
	this.days_month_leap=new Array(31,29,31,30,31,30,31,31,30,31,30,31);
	this.days_month_nonleap=new Array(31,28,31,30,31,30,31,31,30,31,30,31);
	this.real_lunarYear=null;
	this.real_lunarMonth=null;
	this.real_lunarDate=null;
	this.isLeap=function(sYear){
		if(sYear%400==0||(sYear%4==0&&sYear%100!=0)){
			return true;
		}
		else{
			return false;
		}
	}
	
	this.testHex=function(str){
		var pattern=/^[a-c]$/;
		var lastChar=str.substr(-1,1);
		if(pattern.test(lastChar)){
			switch(lastChar){
				case 'a':
					lastChar=10;
					break;
				case 'b':
					lastChar=11;
					break;
				case 'c':
					lastChar=12;
					break;
				default:
					break;
			}
		}
		else{
			lastChar=parseInt(lastChar);
		}
		return lastChar;
	}
	
	this.days_differ_calc=function(){
		var years_between=this.solar_year>1901?true:false;
		var days_years_between=0;
		if(years_between){
			for(var i=1901;i<this.solar_year;i++){
				if(this.isLeap(i)){
					days_years_between+=366;
				}
				else{
					days_years_between+=365;
				}
			}
		}
		var daysPassed_thisYear=0;
		if(this.isLeap(this.solar_year)){
			for(var i=0;i<this.solar_month;i++){
				daysPassed_thisYear+=this.days_month_leap[i];
			}
		}
		else{
			for(var i=0;i<this.solar_month;i++){
				daysPassed_thisYear+=this.days_month_nonleap[i];
			}
		}
		daysPassed_thisYear+=this.solar_date;
		var total_days_differ=this.days_leave+days_years_between+daysPassed_thisYear+1;
		return total_days_differ;
	}
	
	this.lunar_calc=function(pSolarTime){
		this.solarTime=new Date(pSolarTime);
		this.solar_year=this.solarTime.getFullYear();
		this.solar_month=this.solarTime.getMonth();
		this.solar_date=this.solarTime.getDate();
		
		var total_days_differ=this.days_differ_calc();
		var init_lunar_year=1899;
		var index=null;
		var length_lunarInfo=this.lunarInfo.length;
		for(var i=0;i<length_lunarInfo;i++){
			var info=this.lunarInfo[i];
			var leapMonth=this.testHex(info);
			var isLeapMonthBig=parseInt(info.substr(2,1))?true:false;
			var month_days=parseInt(info.substr(3,3),16).toString(2);
			while(month_days.length<12){
				month_days="0"+month_days;
			}
			var days_of_lunarYear=0;
			var len=month_days.length;
			for(var j=0;j<len;j++){
				if(month_days[j]=="1"){
					days_of_lunarYear+=30;
				}
				else{
					days_of_lunarYear+=29;
				}
			}
			if(leapMonth){
				if(isLeapMonthBig){
					days_of_lunarYear+=30;
				}
				else{
					days_of_lunarYear+=29;
				}
			}
			if(days_of_lunarYear<total_days_differ){
				total_days_differ-=days_of_lunarYear;
				init_lunar_year++;
			}
			else{
				index=i;
				break;
			}
		}
		this.real_lunarYear=init_lunar_year+1;
		
		var init_lunar_month=0;
		var info_thisYear=this.lunarInfo[index];
		var leapMonth_thisYear=this.testHex(info_thisYear);
		var isLeapMonthBig_thisYear=parseInt(info_thisYear.substr(2,1))?true:false;
		var month_days_thisYear=parseInt(info_thisYear.substr(3,3),16).toString(2);
		while(month_days_thisYear.length<12){
			month_days_thisYear="0"+month_days_thisYear;
		}
		var len_t=month_days_thisYear.length;
		for(var j=0;j<len_t;j++){
			var days_of_lunarMonth=0;
			if(month_days_thisYear[j]=="1"){
				days_of_lunarMonth+=30;
			}
			else{
				days_of_lunarMonth+=29;
			}
			if(days_of_lunarMonth<total_days_differ){
				total_days_differ-=days_of_lunarMonth;
				init_lunar_month++;
			}
			else{
				this.real_lunarMonth=init_lunar_month+1;
				break;
			}
			if(leapMonth_thisYear){
				if(j==(leapMonth_thisYear-1)){
					if(isLeapMonthBig_thisYear){
						days_of_lunarMonth=30;
					}
					else{
						days_of_lunarMonth=29;
					}
					if(days_of_lunarMonth<total_days_differ){
						total_days_differ-=days_of_lunarMonth;
					}
					else{
						this.real_lunarMonth=init_lunar_month;
						var islunarLeap=true;
						break;
					}
				}
			}
		}
		this.real_lunarDate=total_days_differ;
		var cNumbers=new Array('十','一','二','三','四','五','六','七','八','九','十','冬','腊');
		if(islunarLeap){
			this.lunarMonth="闰"+cNumbers[this.real_lunarMonth]+"月";
		}
		else if(this.real_lunarMonth==1){
			this.lunarMonth="正月";
		}
		else{
			this.lunarMonth=cNumbers[this.real_lunarMonth]+"月";
		}
		if(this.real_lunarDate==1){
			if(islunarLeap){
				this.real_lunarDate="闰"+cNumbers[this.real_lunarMonth]+"月";
				islunarLeap=false;
			}
			else if(this.real_lunarMonth==1){
				this.real_lunarDate="春节";
			}
			else{
				this.real_lunarDate=cNumbers[this.real_lunarMonth]+"月";
			}
		}
		else if(this.real_lunarDate<=10&&this.real_lunarDate>1){
			if(!islunarLeap){
				if(this.real_lunarMonth==5&&this.real_lunarDate==5){
					this.real_lunarDate="端午";
				}
				else{
					this.real_lunarDate="初"+cNumbers[this.real_lunarDate];
				}
			}
			else{
				this.real_lunarDate="初"+cNumbers[this.real_lunarDate];
			}
		}
		else if(this.real_lunarDate>=11&&this.real_lunarDate<20){
			if(!islunarLeap){
				if(this.real_lunarMonth==1&&this.real_lunarDate==15){
					this.real_lunarDate="元宵";
				}
				else if(this.real_lunarMonth==7&&this.real_lunarDate==15){
					this.real_lunarDate="中元";
				}
				else if(this.real_lunarMonth==8&&this.real_lunarDate==15){
					this.real_lunarDate="中秋";
				}
				else{
					this.real_lunarDate="十"+cNumbers[this.real_lunarDate-10];
				}
			}
			else {
				this.real_lunarDate="十"+cNumbers[this.real_lunarDate-10];
			}
		}
		else if(this.real_lunarDate>=20&&this.real_lunarDate<30){
			if(!month_days_thisYear[11]){
				if(this.real_lunarMonth==12&&this.real_lunarDate==29){
					this.real_lunarDate="除夕";
				}
				else{
					this.real_lunarDate="廿"+cNumbers[this.real_lunarDate-20];
				}
			}
			else {
				this.real_lunarDate="廿"+cNumbers[this.real_lunarDate-20];
			}
		}
		else if(this.real_lunarMonth==12){
			this.real_lunarDate="除夕";
		}
		else{
			this.real_lunarDate="三十";
		}
		return {
				lunar_month:this.lunarMonth,
				lunar_date:this.real_lunarDate
			   };
	}
}
























