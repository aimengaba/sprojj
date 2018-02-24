$(document).ready(function(){
  var studentsRef = firebase.database().ref("students");
  studentsRef.on('value', function(snapshot){
    console.log(snapshot.val());
    var keys = Object.keys(snapshot.val());
    console.log(keys);
    var i =0;
    for(var s in snapshot.val()){
      $(".content").append("<div id='"+keys[i]+"' class='card'>\n <img src='http://via.placeholder.com/350x350' alt='Avatar' style='width:100%'/>\n <div class='container'>"+snapshot.val()[s].firstName+"</div></div>")
      i++;
    }
    $(".card").on("click", function(e){
      console.log($(e.currentTarget).children()[1].innerHTML);
      $(".content > *").remove();
      $(".content").append("<h2 id='"+e.currentTarget.id+"'>"+$(e.currentTarget).children()[1].innerHTML+"</h2>");
      $(".content").append("<div id='canteen' class=card> <img src='../images/canteen.jpg' style='width:100%'/>Canteen</div>");
      $(".content").append("<div id='class' class=card> <img src='../images/class.jpg' style='width:100%'/>Class</div>");
      $(".content").append("<div id='ground' class=card> <img src='../images/ground.jpg' style='width:100%'/>Ground</div>");
      var picturesRef = firebase.database().ref("students/"+e.currentTarget.id+"/pics");

      $(".card").on("click", function(event){
        console.log($(".content>h2").attr('id'))
        var picRef = firebase.database().ref("students/"+$(".content>h2").attr('id')+"/pics");
        $(".content > *").remove();
        $(".content").append("<div class='container'><a href='#' class='btn btn-primary'>Add picture</a></div>")
        picRef.on('value', function(snapshot){
          console.log("length ", snapshot.val().length)
          if(snapshot.val().length === 1){
            $(".content").append("<h2>No content...</h2>");
          }else{
            for(var i=0; i<snapshot.val().length; i++){

            }
          }
        })
      });
      // studentsRef.on('value', function(snapshot){
      //   if(snapshot.length === 1){
      //
      //   }
      //   for(var s in snapshot){
      //     // if()
      //   }
      // })
    })
  })
})
