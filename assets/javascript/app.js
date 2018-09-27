// Initialize Firebase
var config = {
    apiKey: "AIzaSyCRt9aGUzCARZ6dW_Cv9RcCEsK7RZ-w6P4",
    authDomain: "rp-player.firebaseapp.com",
    databaseURL: "https://rp-player.firebaseio.com",
    projectId: "rp-player",
    storageBucket: "rp-player.appspot.com",
    messagingSenderId: "686973992127"
  };
  firebase.initializeApp(config);



var database = firebase.database();
var username;
var choice;
var wins = 0;
var losses = 0;
var mostRecentUser;
var roomnumber;
database.ref().on('value', function(data) {
    mostRecentUser = data.child('chat').val();
});



// steps
    // modal to get username
    $(window).on('load', function(){
        // can we wrap this in an 'if' to check local storage for a username?
        $('#usernameModal').modal('show');
    });
    // save username to local and to database
    $(document).on("click", ".username-btn", function() {
        username = $("#username").val().trim();
        database.ref('users/' + username).update({
            fWins: wins,
            fLosses: losses,
            fChoice: ""
        })
        $('#usernameModal').modal('hide');
    });
    // get user's clicked play button 
    $(document).on("click", ".play-btn", function() {
        console.log($(this).attr("data-value"))
        choice = $(this).attr("data-value");
        // save choice to database
        database.ref('users/' + username).update({
            fChoice: choice
        })
    });
    // when tracker is true, if the other user's tracker is also true: 
        // disable buttons (for both) by adding attributes: disabled, aria-disabled="true"
        
        // save the clicked button for both
        var playerChoice;
        var opponentChoice;
        database.ref().on('value', function(data) {
            playerChoice = data.child('users/').val();
        });
        // compare to see who won
        var allPlayObj = [
            {
                name: "Rock",
                defeats: ["Scissors", "Lizard"]
            },
            {
                name: "Scissors",
                defeats: ["Lizard", "Paper"]
            },
            {
                name: "Lizard",
                defeats: ["Paper", "Spock"]
            },
            {
                name: "Paper",
                defeats: ["Spock", "Rock"]
            },
            {
                name: "Spock",
                defeats: ["Rock", "Scissors"]
            }
        ]
        // notify winner "You Won"
        // notify loser "You Lost"
        // reset game, ++ wins or losses for that player
        // reset top play message div to display wins, losses and "Click to play again."

        // at end of each round, need to remove checked and active 
        // from the buttons, which look like
        // <label class="play-btn btn btn-secondary active">
        //    <input type="radio" name="options" id="option1" autocomplete="off" checked> Name
        // </label>

    // Chat functionality
        // accept typed input
        $(document).on("click", "#chat-button", function() {
            event.preventDefault();
            var chatMessage = $("#chat-input").val().trim();
            $("#chat-input").val('');
            if (chatMessage === "") {
                return
            }
            else {
            // check if most recent user in database matches local user
                (console.log(mostRecentUser)); 
            // append most recent input to both users' chat boxes:
                // if input is from same user as previous message: 
                if (mostRecentUser === username){
                    // remove time stamp
                    $(".time-stamp").remove();
                    // append <p> with new message
                    var newMessage = $("<p>").text(chatMessage);
                    newMessage.addClass("text-left");
                    // create new time stamp and append
                    var time = $("<p>").text(moment().format('hh:mm')); 
                    time.addClass("text-right time-stamp");
                    $(".chat-log").append(newMessage, time);
                }
                // else 
                else {
                    // remove .most-recent from other all divs
                    $("p").removeClass("time-stamp");
                    var newUserName = $("<span>").text(username);
                    newUserName.addClass("float-left text-secondary");
                    // append <p> with new message
                    var newMessage = $("<p>").append(newUserName);
                    newMessage.append(": " + chatMessage);
                    newMessage.addClass("text-left");
                    // create new time stamp and append
                    var time = $("<p>").text(moment().format('hh:mm')); 
                    time.addClass("text-right time-stamp");
                    $(".chat-log").append(newMessage, time);
                }
            // save who typed most recent input to database
            database.ref('chatprev/').set(username);
            // and save message 
            database.ref('message/').set(chatMessage);
            }
        });
        