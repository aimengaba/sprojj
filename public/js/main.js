$(document).ready(function(){
  var studentsRef = firebase.database().ref("students");
  studentsRef.on('value', function(snapshot){
    console.log(snapshot.val());
    // var keys = Object.keys(snapshot.val());
    // console.log(keys);
    for(var s in snapshot.val()){
      $(".content").append("<div class='card'>\n <img src='http://via.placeholder.com/350x350' alt='Avatar' style='width:100%'/>\n <div class='container'>"+snapshot.val()[s].firstName+"</div></div>")
    }
  })
})
