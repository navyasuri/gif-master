from flask import Flask, request, render_template, url_for
import os
app = Flask(__name__)

users = dict()

@app.route('/')
def home_page(): 
    return render_template("home.html") 

@app.route('/create')
def show_another():
    return render_template("create.html")
    # return "Create page"

@app.route('/join')
def join_another():
    return render_template("join.html")
    # return "Join page"

# @app.route('/')
#     return render_template()