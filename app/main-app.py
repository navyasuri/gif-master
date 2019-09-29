from flask import Flask, request, render_template, url_for
from flask_socketio import SocketIO, emit, join_room, leave_room
import os, random_question, secret, requests, json, random, string
app = Flask(__name__)
app.config['SECRET_KEY'] = 'socketsecretgifkey'
socketio = SocketIO(app)


url_embed = '''<img src="{url}" width="480" height="288" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><br>'''

users = {}      # format {roomkey, room object}
URL= "https://api.giphy.com/v1/gifs/search"

def update_client_join(usercode):
    room = users['usercode']['room']
    emit('redirect', room=room)
    
@app.route('/')
def home_page(): 
    return render_template("home.html") 

@app.route('/create')
def show_another():
    charset = string.ascii_uppercase
    randomcode = "".join(random.sample(charset, 8))
    return render_template("create.html", code=randomcode)
    # return "Create page"

@app.route('/join')            # where the user joins a room
def join_another():
    return render_template("join.html")
    # return "Join page"

@app.route('/creator_wait')
def creator_ready():
    return render_template("creator_waiting.html")

@app.route('/load_all')
def load_all_players():

    return ""    

@app.route('/joiner_ready', methods=['POST'])       # where the joiners wait
def joiner_ready():
    request.form.get('')
    return "Waiting for others"

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

if __name__=='__main__':
    socketio.run(app)