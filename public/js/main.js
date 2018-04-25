$(document).ready(function(){
  var studentsRef = firebase.database().ref("students");
  studentsRef.on('value', function(snapshot){
    console.log(snapshot.val());
    var keys = Object.keys(snapshot.val());
    console.log(keys);
    var i =0;
    for(var s in snapshot.val()){
      $(".content").append("<div id='"+keys[i]+"' class='card'>\n <img src='http://via.placeholder.com/350x350' alt='Avatar' style='width:100%'/>\n <div>"+snapshot.val()[s].firstName+"</div></div>")
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

      $(".card").on("click", function(ev){
        console.log("event.target.id: ", ev.currentTarget.id);
        var userID = $(".content>h2").attr('id');
        var picRef = firebase.database().ref("students/"+userID+"/pics/"+ev.currentTarget.id);
        $(".content > *").remove();
        $(".content").append("<div class='container'><input type='file' class='btn btn-primary'accept='image/*'/><button id='upload'>Upload</button></div>");

        updatePictures(picRef);

        $("#upload").on("click", function(){
          const storageRef = firebase.storage().ref();
          const file = $(":file").get(0).files[0];
          const name = (+new Date()) + '-' + file.name;
          const metadata = { contentType: file.type };
          const task = storageRef.child(name).put(file, metadata);
          task.then((snapshot) => {
              console.log(snapshot.downloadURL);
              var database = firebase.database().ref("students/"+userID+"/pics")
              var storesRef = database.child(ev.currentTarget.id);
              var newStoreRef = storesRef.push();
              newStoreRef.set({
                url: snapshot.downloadURL
              })
              updatePictures(picRef);
          });

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
  function updatePictures(picRef){
    $(".content > .card").remove();
    picRef.on('value', function(snapshot){
      console.log("length ", Object.keys(snapshot.val()).length)
      var size = Object.keys(snapshot.val()).length;
      if(size === 1){
        $(".content").append("<h2>No content...</h2>");
      }else{
        snapshot.forEach(function(childSnapshot){
          if(childSnapshot.key !="0"){
            $(".content").append("<div class='card'>\n <img src="+childSnapshot.val().url+" alt='Avatar' style='width:100%'/>\n</div>")
          }
        })
      }
    })
  }
})
