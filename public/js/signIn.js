
function signInFunction(){
    var email = document.getElementById("inputEmail").value;
    var password = document.getElementById("inputPassword").value;
    if(email && password){
        firebase.auth().signInWithEmailAndPassword(email, password).then(function(){
            window.location.href = "pages/home.html";
        }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorMessage);
        });
    }
}

function loadRegisterPage(){
    window.location.href = "pages/home.html";
}
