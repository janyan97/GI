# -*- coding: utf-8 -*-  
#!/usr/bin/env python  
import sqlite3
import csv
import os
from flask import Flask
from flaskr import app

file_in = os.path.join(app.root_path, 'static\\demo_in.csv')
file_out = os.path.join(app.root_path, 'static\\demo_out.csv')
#os.remove(file)

#load the data into the database
conn = sqlite3.connect('flaskr.db')
c = conn.cursor()
with open(file_in,'r',encoding='UTF-8') as csvfile:
    reader = csv.reader(csvfile)
    for row in reader:
        a0 = row[0]
        a1 = row[1]
        a2 = row[2]
        a3 = row[3]
        a4 = row[4]
        a5 = row[5]
        a6 = row[6]
        a7 = row[7]
        a8 = row[8]
        a9 = row[9]
        b0 = row[10]
        b1 = row[11]
        b2 = row[12]
        b3 = row[13]
        b4 = row[14]
        c.execute("insert into demo(id_d,year,company,asset,debt,current_assets,inventory,prepayment,unamortized_expenses,current_liabilitie,account_receivable,turnover_days,IDD,DPO,unit) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            [a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4])
c.close()
conn.commit()
conn.close()

#put the data out of the database
conn = sqlite3.connect('flaskr.db')
c = conn.cursor()
result = [] 
a = []
b = []
d = []
c.execute("SELECT * FROM demo")
for res in c:
    result.append(res)
with open(file_out,'w', newline='',encoding='UTF-8') as csvfile:
    writers = csv.writer(csvfile)
    for res in result:
        writers.writerow(res) 
c.close()
conn.commit()
conn.close()
