from flask import Flask, request, render_template, url_for
import os
app = Flask(__name__)

@app.route('/')
def home_page(): 
    return render_template("home.html") 

@app.route('/create')
def show_another():
    return render_template("create.html")

@app.route('/join')
def join_another():
    return render_template("join.html")

@app.route('/')
    return render_template()