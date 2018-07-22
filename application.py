import os

from flask import Flask, session, render_template, request
from tempfile import mkdtemp
from flask_socketio import SocketIO, emit, join_room, leave_room, rooms
from flask_session import Session
from time import strftime, localtime

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

# Configure session to use filesystem
#app.config["SESSION_FILE_DIR"] = mkdtemp()
#app.config["SESSION_PERMANENT"] = False
#app.config["SESSION_TYPE"] = "filesystem"
#Session(app)

# list of all channels
channel_list = {}
message_max = 100


class Message(dict):
    def __init__(self, user, content, chat_time):
        dict.__init__(self, user_name = user, time_stamp = chat_time, message = content)

@app.route("/")
def index():
    return render_template('index.html')

@socketio.on("message create channel")
def add_channel(args):
    channel= args["new_channel"]
    if not channel in channel_list:
        chat_time = strftime("%d %b %Y %H:%M", localtime())
        channel_list[channel] = [Message("Zoltar the All-Knowing", "This is the first message in the {} channel.".format(channel), chat_time)]
    emit("message announce channel list", {"channel_list": list(channel_list.keys())}, broadcast=True)

@socketio.on('join')
def on_join(args):
    channel= args["show_channel"]
    if channel in channel_list:
        for room in rooms(request.sid):
            if room is not request.sid:
                leave_room(room)
        join_room(channel)
        message_list = channel_list[channel]
        emit("message show message list", {"message_list": message_list})

@socketio.on("connect")
def make_channel_list():
    emit("message announce channel list", {"channel_list": list(channel_list.keys())})

@socketio.on("message create message")
def add_message(args):
    #this channel message list
    channel = args["channel_name"]
    if channel in channel_list:
        message= args["new_message"]
        user_name = args["user_name"]
        time_stamp = strftime("%d %b %Y %H:%M", localtime())
        channel_list[channel].append(Message(user_name, message, time_stamp))
        if len(channel_list[channel]) > message_max:
            del channel_list[channel][:-message_max]
        message_list = channel_list[channel]
        emit("message show message list", {"message_list": message_list}, room = channel)