# Project 2

Web Programming with Python and JavaScript

Chatterbox:  Tiny round sunglasses and Fila hi-top sneakers are back in style, why not bring back another 90s hit: chat rooms?

Personal Touch:  List all the users in a room.

In application.py

@app.route("/")
@socketio.on("message create channel")
    -adds the new channel to the channel_list
@socketio.on('join')
    -adds to the message list and user list using socketio
@socketio.on("connect")
    -for first time log-ins, shows the channel list
@socketio.on("message create message")
    -adds the message to the message list (class/dict declared at the top of the file)


In index.js

document.addEventListener('DOMContentLoaded', ()
    -sets up the whole app when the user gets to the url
function create_socket()
    -sets up the OG socket- the user_name
socket.on('connect', () => {
    -sets up the other sockets (see below)
document.querySelector('#channels').onclick = (event) => {
    -displays the channel that the user clicks on
document.querySelector('#new_message_form').onsubmit = () => {
    -sends the new message input to python
let create_channel = function(channel_name){
    -adds a channel to the channel list
let create_user = function(user_name){
    -adds a user to the user to the user list
socket.on('message announce channel', data => {
    -sends the necessary info to python
socket.on('message announce channel list', data => {
    -sends the necessary info to python
socket.on('message show user list', data => {
    -sends the necessary info to python
socket.on('message show message list', data => {
    -sends the necessary info to python
let create_message = function(message_content){
    -creates the whopper "message box" content

In index.html
    -n/a

In styles.css
    -n/a

Helpful Sources:
https://flask-socketio.readthedocs.io/en/latest/
https://docs.python.org/3/tutorial/
https://javascript.info/events

Also:  "Coding for Beginners" by Miek McGrath
Also:  "Javascript & JQuery" by Jon Duckett