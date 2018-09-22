// at end of each round, need to remove checked and active 
// from the buttons, which look like
// <label class="btn btn-secondary active">
//    <input type="radio" name="options" id="option1" autocomplete="off" checked> Name
// </label>



// steps
    // modal to get username
    $(window).on('load',function(){
        $('#usernameModal').modal('show');
    });
    // save username to local and to database
    // 