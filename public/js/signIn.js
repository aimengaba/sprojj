$(document).ready(function(){
  var user = firebase.auth().currentUser;
  console.log("user", user);
  if (user){
    window.location.href = "pages/main.html";
  }
})
function signInFunction(){
    var email = document.getElementById("inputEmail").value;
    var password = document.getElementById("inputPassword").value;
    if(email && password){
        firebase.auth().signInWithEmailAndPassword(email, password).then(function(){
            window.location.href = "pages/main.html";
        }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            document.getElementById("error").innerHTML = errorMessage;
            console.log(errorMessage);
        });
    }
}
