from flask import Flask, request, render_template, url_for
from flask_socketio import SocketIO, emit
import os, random_question, secret, requests, json, random, string
app = Flask(__name__)

url_embed = '''<iframe src="{url}" width="480" height="288" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><br>'''

users = dict()
URL= "https://api.giphy.com/v1/gifs/search"

@app.route('/')
def home_page(): 
    return render_template("home.html") 

@app.route('/create')
def show_another():
    charset = string.ascii_uppercase
    randomcode = random.sample(charset, 8)
    return render_template("create.html", code=randomcode)
    # return "Create page"

@app.route('/join')
def join_another():
    request.form.get('code')
    return render_template("join.html")
    # return "Join page"

@app.route('/prompt')
def prompt_page():
    html_out = []
    ret = random_question.pick_random()
    # ret += str(random_question.get_keywords(ret))
    key1, key2 = random_question.get_keywords(ret)

    res1 = requests.get(
        URL, 
        params={
            "api_key": secret.GIPHY_API, 
            "q": key1, 
            "limit": 40
        }
    )

    res2 = requests.get(
        URL, 
        params={
            "api_key": secret.GIPHY_API, 
            "q": key2, 
            "limit": 40
        }
    )

    if res1.status_code!=200 or res2.status_code!=200:
        print(res1.text, res2.text)
        return "error"
    data1 = json.loads(res1.text)
    data2 = json.loads(res2.text)
    for obj in data1["data"]+data2["data"]:
        html_out.append(str(url_embed.format(url=obj['embed_url'])))
    random.shuffle(html_out)
    print("\n".join(html_out))
    return ret + "<br>\n".join(html_out[:20])

# @app.route('/')
#     return render_template()