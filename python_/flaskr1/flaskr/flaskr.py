# all the imports
import os
import sqlite3

from flask import Flask, request, session, g, redirect, url_for, abort, render_template, flash
     
app = Flask(__name__) # create the application instance :)
app.config.from_object(__name__) # load config from this file , flaskr.py

app.config.from_envvar('FLASKR_SETTINGS', silent=True)
from flask import render_template, flash, redirect, session, url_for, request, g
from flask.ext.login import login_user, logout_user, current_user, login_required
from flaskr import db, app, models
from flaskr.forms import LoginForm
from flaskr.models import User, ROLE_USER, ROLE_ADMIN


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        form = LoginForm()
        a = User.query.filter_by(username=form.username.data,password=form.password.data).first()
        b = str(a)
        if a is None:
            session['log_in'] = False
            return redirect(url_for('login'))
        elif b == '<User \'admin\'>':
            return render_template('afterlogin.html')
        return render_template('lala.html')
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.pop('logged_in', None)
    #flash('You were logged out')
    #return redirect(url_for('login'))
    return render_template('login.html')

from werkzeug.contrib.cache import SimpleCache
cache = SimpleCache()

@app.route('/data')
def datamap():
    var1 = cache.get('companyResult')
    var2 = cache.get('businessResult')
    var3 = cache.get('dateResult')
    var4 = cache.get('binResult')
    var5 = cache.get('cheResult')
    return render_template('datamap.html',var1=var1,var2=var2,var3=var3,var4=var4,var5=var5)

@app.route('/back')
def back():
    #if session['username'] = None
      #  return redirect(url_for('logout') )
    return render_template('afterlogin.html')

@app.route('/gejson')
def gejson():
    cache.set('companyResult', request.args.get('companyResult'))
    cache.set('businessResult', request.args.get('businessResult'))
    cache.set('dateResult', request.args.get('dateResult'))
    cache.set('binResult', request.args.get('binResult'))
    cache.set('cheResult', request.args.get('cheResult'))
    return request.args.get('companyResult')
    



