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
  var choice = "";
  var wins = 0;
  var losses = 0;
  var mostRecentUser;
  var roomnumber = 0;
  var opponent = "";
  var opponentChoice = "";
  var roomType;
  
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
  
  
  
  // check username against list in database
      // modal to get username
      $(window).on('load', function(){
          // can we wrap this in an 'if' to check local storage for a username?
          $('#usernameModal').modal('show');
      });
      // save username to local var and to database
      $(document).on("click", ".username-btn", function() {
          username = $("#username").val().trim();
          var fNameRef = database.ref('users/' + username);
          fNameRef.transaction(function(currentData) {
              if (currentData === null) {
                  return {fChoice: ""};
              } else {
                  console.log('User already exists.');
                  $('#usernameModalTitle').text('That name is already in use.')
                  return; // Abort the transaction.
              }
              }, function(error, committed) {
              if (error) {
                  console.log('Transaction failed abnormally!', error);
              } else if (!committed) {
                  console.log('We aborted the transaction (because ' +username+ ' already exists).');
              } else {
                  console.log('User ' +username+ ' added!');
                  // check and create roomnumber
                  findRoom();
                  database.ref('users/' + username).onDisconnect().remove();
                  $('#usernameModal').modal('hide');
              } 
          });
      });
  
  $('#usernameModal').on("hidden.bs.modal", function () {
      if (roomType === 'join') {
          updateRoom();
      }
      else if (roomType === 'make') {
          makeRoom();
      }
      else {
          console.log('Room error.')
      }
  }); 
  
  function findRoom() {
      // get snapshot of current rooms
      var roomSnap = database.ref('rooms').orderByKey();
      roomSnap.once("value")
      .then(function(snapshot) {
          // get number of children
          var childCount = snapshot.numChildren();
          console.log('There are ' +childCount+ ' rooms total')
          if (childCount === 0) {
              roomnumber = 1;
              roomType = 'make';
              return
          }
          // tracker of first available room if all are full
          var i = 1;
          // for each room, check if full
          snapshot.forEach(function(childSnapshot) {
              // key should equal room number
              var key = childSnapshot.key;
              console.log('Room number ' +key+ ' exists.');
              // 'full' will return a Boolean
              var a = childSnapshot.child('full').val();
              console.log('full for ' +key+ ' is ' +a)
              // if a not-full room is found, join the room
              if (!a) {
                  roomnumber = key;
                  console.log('Key = ' +key+ ', Roomnumber = ' +roomnumber);
                  roomType = 'join'
                  console.log('i is ' +i+ ' and room type is ' +roomType);
                  opponent = childSnapshot.child('A').val();
                  console.log('Opponent is ' +opponent)
                  return
              }
              else if (roomnumber === 0 && i < key) {
                  roomnumber = i;
                  roomType = 'make';
                  console.log('i is ' +i+ ' and room type is ' +roomType);
              }
              else if (roomnumber === 0 && i === childCount) {
                  roomnumber = i + 1;
                  roomType = 'make';
                  console.log('i is ' +i+ ' and room type is ' +roomType);
              }
              i++
          })
      })
  };
  
  function updateRoom() {
      database.ref('rooms/' + roomnumber).update({full: true, B: username, message: username + ' has joined.'});
  }
  
  function makeRoom() {
      database.ref('rooms/' + roomnumber).update({full: false, A: username, message: username + ' has joined.'});
  }
  
  
  // to play game
      // get user's clicked play button 
      $(document).on("click", ".play-btn", function() {
          console.log($(this).attr("data-value"))
          choice = $(this).attr("data-value");
          console.log('Chose ' + choice)
          // save choice to database
          database.ref('users/' + username).update({fChoice: choice})
          console.log('Database should be updated.')
      });
      // when tracker is true, if the other user's tracker is also true: 
      // disable buttons (for both) by adding attributes: disabled, aria-disabled="true"
      
      // save opponent's Choice
      database.ref('users').on('value', function(data) {
          if (roomnumber !== 0 && opponent !== "") {
              opponentChoice = data.child(opponent + '/fChoice').val();
              console.log('Opponent chose ' + opponentChoice)
              var outcome = "";
              // compare to see who won
              if (choice !== "" && opponentChoice !== "") {
                  if (choice === opponentChoice) {
                      // tie game
                      outcome = "tied";
                      resetGame(outcome);
                  }
                  else {
                      for (i = 0; i < allPlayObj.length; i++) {
                          if (allPlayObj[i]['name'] === choice) {
                              if (allPlayObj[i]['defeats'].includes(opponentChoice)) {
                                  outcome = "won";
                                  wins++
                                  resetGame(outcome);
                              }
                              else {
                                  outcome = "lost";
                                  losses++
                                  resetGame(outcome);
                              }
                          }
                      }
                  }
                  
              }
              // reset game, ++ wins or losses for that player
              // reset top play message div to display wins, losses and "Click to play again."
  
              // at end of each round, need to remove checked and active 
              // from the buttons, which look like
              // <label class="play-btn btn btn-secondary active">
              //    <input type="radio" name="options" id="option1" autocomplete="off" checked> Name
              // </label>
          }
      });
  
      function resetGame(outcome) {
          // display outcome
          $('#game-status').text('You ' +outcome+ '. Click below to play again.');
          $('.player-status').text('Wins: ' + wins + ', Losses: ' + losses);
          // reset buttons
          $('.btn-pusher').removeAttr('checked');
          $('.play-btn').removeClass('active');
          choice = "";
          database.ref('users/' + username).update({fChoice: ""})
          database.ref('users/' + opponent).update({fChoice: ""})
      }
  
  
  // Chat functionality
      // listen for local input and update database
      $(document).on("click", "#chat-button", function() {
          event.preventDefault();
          var chatMessage = $("#chat-input").val().trim();
          $("#chat-input").val('');
          if (chatMessage === "") {
              return
          }
          else {
              database.ref('rooms/' + roomnumber).update({message: chatMessage, chatPrev: username});
          }
      });
  
      // listener for database change in chat
      // FIXME: chat updates whenever ANY change occurs in any of the rooms
      // when I tried adding roomnumber to the first reference listener 
      // (and removing roomnumber from internal references)
      // the the chat function completely stopped working
      // does it bind to the roomnumber? How do I get this listener to bind to only a non-0 room?
      database.ref('rooms').on('value', function(data) {
          if (roomnumber !== 0) {
              // make sure player A is connected
              var playerA = data.child(roomnumber + '/A').val();
              if (playerA === username) {
                  opponent = data.child(roomnumber + '/B').val();
              }
              // save chat message
              chatMessage = data.child(roomnumber + '/message').val();
              console.log('Chat message: ' + chatMessage)
              if (chatMessage !== (undefined||null)) {
              var newUser = data.child(roomnumber + '/chatPrev').val();
              console.log('New user: ' + newUser)
              // append most recent input chat box
                  // if input is from same user as previous message: 
                  if (newUser === ("" || null) || mostRecentUser === newUser){
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
                      var newUserName = $("<span>").text(newUser);
                      // get player's own username to show up in different color
                      if (newUser === username) {
                          newUserName.addClass("float-left text-info");
                      }
                      else {
                          newUserName.addClass("float-left text-secondary");
                      }
                      // append <p> with new message
                      var newMessage = $("<p>").append(newUserName);
                      newMessage.append(": " + chatMessage);
                      newMessage.addClass("text-left");
                      // create new time stamp and append
                      var time = $("<p>").text(moment().format('hh:mm')); 
                      time.addClass("text-right time-stamp");
                      $(".chat-log").append(newMessage, time);
                  }
              }
              mostRecentUser = newUser
          }
      });
  
  
  // // when user leaves, delete their data
  // $(window).on("beforeunload", function() {
  //     // remove that user from firebase
  //     if (roomnumber !== 0) {
  //         database.ref('users/' + username).remove();
  //         if (opponent === ("" || null)) {
  //             database.ref('rooms/' + roomnumber).remove();
  //             console.log('Room should be removed')
  //         }
  //         else {
  //             database.ref('rooms/' + roomnumber + '/B').remove();
  //             database.ref('rooms/' + roomnumber + '/chatPrev').remove();
  //             database.ref('rooms/' + roomnumber).update({A: opponent, full: false, message: username + ' has disconnected.'});
  //         }
  //     }
  // });
  
  
  
  database.ref('rooms/' + roomnumber)