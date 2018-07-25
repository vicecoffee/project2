// Set the "big" variables
const user_name = "USER_NAME";
const channel_name = "CHANNEL_NAME";

// When the webpage is loaded check if the user is logged in.  If not set up the registration form
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem(user_name) != null) {
        create_socket();
    } else {
        // Show the login div
        document.querySelector("#login").style.display = "block";
       // Add events for logging in user
        document.querySelector('#login_form').onsubmit = () => {
            const login_name = document.querySelector('#login_name').value;
            // Hide the login div
            document.querySelector("#login").style.display = "none";

            localStorage.setItem(user_name, login_name);
            create_socket();
            return false;
        };
    }
});

// Once the user is logged in, set up the sockets...all of them
function create_socket() {
  // Connect to websocket
  const login_name = localStorage.getItem(user_name);
  var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

  // When connected, configure buttons
  socket.on('connect', () => {
      welcome_message = `Welcome, ${login_name}!`;
      document.querySelector("#user_name").innerHTML = welcome_message;
      // Create Channel should emit a "create channel" event
      document.querySelector('#new_channel_form').onsubmit = () => {
              const new_channel = document.querySelector("#new_channel").value;
              // Clear out the form
              document.querySelector("#new_channel").value = '';
              socket.emit('message create channel', {"new_channel": new_channel});
              return false;
      };

     // Show Channel should emit a "show channel" event
       document.querySelector('#channels').onclick = (event) => {
          const target = event.target;
          if(target.tagName == "A"){
                const show_channel = target.text;
                localStorage.setItem(channel_name, show_channel);
                socket.emit('join', {"show_channel": show_channel, "user_name": localStorage.getItem(user_name)});
                return false;
          }

      };

    // Create message
    document.querySelector('#new_message_form').onsubmit = () => {
            const new_message = document.querySelector('#new_message').value;
          //  Clear out the form
            document.querySelector("#new_message").value = '';
            socket.emit('message create message', {"new_message": new_message, "user_name": localStorage.getItem(user_name),
            "channel_name": localStorage.getItem(channel_name)});
            return false;
    };

    // Show the logged-in div
    document.querySelector("#logged-in").style.display = "block";
  });

  // Make function to make channel with hyperlink (not really)
  let create_channel = function(channel_name){
        const a = document.createElement('a');
        a.setAttribute("href", "#");
        const li = document.createElement('li');
        a.innerHTML = channel_name;
        li.append(a);
        document.querySelector('#channels').append(li);
  };
  // To populate my users list
  let create_user = function(user_name){
        const li = document.createElement('li');
        li.innerHTML = user_name;
        document.querySelector('#users').append(li);
  };

  // When a new channel is announced, add to the unordered list
    socket.on('message announce channel', data => {
        create_channel(data.channel);
  });
    // Update new channel list
    socket.on('message announce channel list', data => {
      const channel_list = data.channel_list;
      document.querySelector("#channels").innerHTML = '';
        for (index in channel_list){
            create_channel(channel_list[index]);
        }
  });

  // Function to show users in a room
  socket.on('message show user list', data => {
    const user_list = data.users;
    document.querySelector("#users").innerHTML = '';
    for (index in user_list){
      create_user(user_list[index]);
    }
  });

  // Function to load the messages
    socket.on('message show message list', data => {
        const message_list = data.message_list;
        document.querySelector("#messages").innerHTML = '';
        const channel_name = data.channel_name;
        if (channel_name){
          document.querySelector('#current_channel').innerHTML = channel_name;
        }
        for (index in message_list){
            create_message(message_list[index]);
        }
  });

  // Make function to make convo row for display.  I tried to put the css/html stuff in this but maybe it is not elegant?
  let create_message = function(message_content){
        const message_box = document.createElement("div");
        message_box.setAttribute("class", "row");
        const message_box_name = document.createElement("div");
        message_box_name.setAttribute("class", "col-md-3");
        const message_box_message = document.createElement("div");
        message_box_message.setAttribute("class", "col-md-7");
        const message_box_time_stamp = document.createElement("div");
        message_box_time_stamp.setAttribute("class", "col-md-2");
        message_box_name.innerHTML = message_content.user_name;
        message_box.append(message_box_name);
        message_box_message.innerHTML = message_content.message;
        message_box.append(message_box_message);
        message_box_time_stamp.innerHTML = message_content.time_stamp;
        message_box.append(message_box_time_stamp);
        document.querySelector('#messages').append(message_box);
  };

}
