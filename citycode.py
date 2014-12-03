#!/usr/bin/env python
#coding:utf-8

import urllib2
url1='http://m.weather.com.cn/data5/city.xml'
content1=urllib2.urlopen(url1).read()
provinces=content1.split(',')
city=open('D:\\city.py','w')
city.write('#coding:utf8\ncity={\n')
for p in provinces:
    code1=p.split('|')[0]
    url2='http://m.weather.com.cn/data5/city%s.xml' %(code1)
    content2=urllib2.urlopen(url2).read()
    cities=content2.split(',')
    for c in cities:
        code2=c.split('|')[0]
        url3='http://m.weather.com.cn/data5/city%s.xml' %(code2)
        content3=urllib2.urlopen(url3).read()
        districts=content3.split(',')
        for d in districts:
            code3='101'+d.split('|')[0]
            if code3=='101340306':
                city.write(' \'%s\':\'%s\'\n}' %(d.split('|')[1],code3))
            else:
                city.write(' \'%s\':\'%s\',\n' %(d.split('|')[1],code3))
            
    
            
        
    
    
    
