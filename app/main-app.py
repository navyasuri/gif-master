from flask import Flask, request, render_template, url_for
import os, random_question
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
    
@app.route('/prompt')
def prompt_page():
    ret = random_question.pick_random()
    ret += str(random_question.get_keywords(ret))
    return ret

# @app.route('/')
#     return render_template()