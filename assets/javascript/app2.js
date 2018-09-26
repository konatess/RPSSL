// Initialize Firebase
firebase.initializeApp(config);

var database = firebase.database();
var username;
var choice;
var wins = 0;
var losses = 0;
var mostRecentUser;
var roomnumber;
// database.ref().on('value', function(data) {
//     mostRecentUser = data.child('chat').val();
//     console.log(mostRecentUser)
//     roomnumber = data.numChildren();
//     console.log(roomnumber)
//     data.forEach( function(data) {
//         console.log(data.key)
//     })
// });


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
                return {
                    fWins: wins,
                    fLosses: losses,
                    fChoice: "",
                    fOpponent: ""
                };
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
                var fRoomRef = database.ref('rooms').orderByKey();
                fRoomRef.once("value")
                    .then(function(snapshot) {
                    snapshot.forEach(function(childSnapshot) {
                        // key will be "ada" the first time and "alan" the second time
                        var key = childSnapshot.key;
                        console.log(key);
                        // childData will be the actual contents of the child
                        var childData = childSnapshot.val();
                        console.log(childData);
                    });
                });

                $('#usernameModal').modal('hide');
            }
            
            });

        // database.ref('users/' + username).update({
        //     fWins: wins,
        //     fLosses: losses,
        //     fChoice: ""
        // })
        // console.log(username + "'s data: ", snapshot.val());

        
        
    });

// check and create roomnumber
// database.ref('rooms/')
// var fRoomRef = database.ref('rooms/' + username);
//         fRoomRef.transaction(function(currentData) {
//             if (currentData === null) {
//                 return username;
//             } else {
//                 console.log('User already exists.');
//                 $('#usernameModalTitle').text('That name is already in use.')
//                 return; // Abort the transaction.
//             }
//             }, function(error, committed) {
//             if (error) {
//                 console.log('Transaction failed abnormally!', error);
//             } else if (!committed) {
//                 console.log('We aborted the transaction (because ' +username+ ' already exists).');
//             } else {
//                 console.log('User ' +username+ ' added!');
                
//                 $('#usernameModal').modal('hide');
//             }
            
//             });
  



// // Assume we have the following data in the Database:
// {
//     "users": {
//       "ada": {
//         "first": "Ada",
//         "last": "Lovelace"
//       },
//       "alan": {
//         "first": "Alan",
//         "last": "Turing"
//       }
//     }
//   }
  
//   // Loop through users in order with the forEach() method. The callback
//   // provided to forEach() will be called synchronously with a DataSnapshot
//   // for each child:
//   var query = firebase.database().ref("users").orderByKey();
//   query.once("value")
//     .then(function(snapshot) {
//       snapshot.forEach(function(childSnapshot) {
//         // key will be "ada" the first time and "alan" the second time
//         var key = childSnapshot.key;
//         // childData will be the actual contents of the child
//         var childData = childSnapshot.val();
//     });
//   });

//   // You can cancel the enumeration at any point by having your callback
// // function return true. For example, the following code sample will only
// // fire the callback function one time:
// var query = firebase.database().ref("users").orderByKey();
// query.once("value")
//   .then(function(snapshot) {
//     snapshot.forEach(function(childSnapshot) {
//       var key = childSnapshot.key; // "ada"

//       // Cancel enumeration
//       return true;
//   });
// });



// // Increment Ada's rank by 1.
// var adaRankRef = firebase.database().ref('users/ada/rank');
// adaRankRef.transaction(function(currentRank) {
//   // If users/ada/rank has never been set, currentRank will be `null`.
//   return currentRank + 1;
// });




