$(document).ready(function () {
  var studentsRef = firebase.database().ref("students");
  studentsRef.on('value', function (snapshot) {
    console.log(snapshot.val());
    var keys = Object.keys(snapshot.val());
    console.log(keys);
    var i = 0;
    for (var s in snapshot.val()) {
      console.log(snapshot.val()[s].firstName)
      if (snapshot.val()[s].firstName === "Abdul") {
        console.log("updloading pic for abdul")
        $(".content").append("<div id='" + keys[i] + "' class='card'>\n <img src='https://firebasestorage.googleapis.com/v0/b/sproj-2ca67.appspot.com/o/Abdul.jpg?alt=media&token=ee31ee92-85c1-462c-82c0-915fcc84ce17' alt='Avatar' style='width:100%'/>\n <div>" + snapshot.val()[s].firstName + "</div></div>")
      } else {
        $(".content").append("<div id='" + keys[i] + "' class='card'>\n <img src='http://via.placeholder.com/350x350' alt='Avatar' style='width:100%'/>\n <div>" + snapshot.val()[s].firstName + "</div></div>")
      }
      i++;
    }
    $(".content").append("<div class='cards'>\n <img class='plus' src='../images/plus-math.png' alt='Avatar' style='width:100%'/>\n <div><a href='addStudent.html' class='buttonAdd'>Add student</a></div></div>")
    $(".cards").on("click", function (e) {
      window.location.href = "addStudent.html"
    })
    $(".card").on("click", function (e) {
      console.log($(e.currentTarget).children()[1].innerHTML);
      $(".content > *").remove();
      $(".content").append("<h2 id='" + e.currentTarget.id + "'>" + $(e.currentTarget).children()[1].innerHTML + "</h2>");
      $(".content").append("<div id='livingskills' class=card> <img src='../images/canteen.jpg' style='width:100%'/>Living Skills</div>");
      $(".content").append("<div id='class' class=card> <img src='../images/class.jpg' style='width:100%'/>Class</div>");
      $(".content").append("<div id='gym' class=card> <img src='../images/ground.jpg' style='width:100%'/>Gym</div>");
      var picturesRef = firebase.database().ref("students/" + e.currentTarget.id + "/pics");

      $(".card").on("click", function (ev) {
        console.log("event.target.id: ", ev.currentTarget.id);
        var userID = $(".content>h2").attr('id');
        var picRef = firebase.database().ref("students/" + userID + "/pics/" + ev.currentTarget.id);
        $(".content > *").remove();
        // $(".content").append("<div class='container'><input type='file' class='btn btn-primary'accept='image/*'/><button id='upload'>Upload</button></div>");

        updatePictures(picRef);


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
  function updatePictures(picRef) {
    $(".content > .card").remove();
    picRef.on('value', function (snapshot) {
      console.log("length ", Object.keys(snapshot.val()).length)
      var size = Object.keys(snapshot.val()).length;
      snapshot.forEach(function (childSnapshot) {
        if (childSnapshot.key != "0") {
          $(".content").append("<div class='card'>\n <img src=" + childSnapshot.val().url + " alt='Avatar' style='width:100%'/>\n<div><button id=" + childSnapshot.key + " >Record</button></audio></div></div>")
        }
      })
      //***********popup**********
      $(".content").append("<div class='modal fade' id='myModal' role='dialog'>" +
        "<div class= 'modal-dialog'>" +
        "<div class='modal-content'>" +
        "<div class='modal-header'>" +
        "<button type='button' class='close' data-dismiss='modal'>&times;</button>" +
        "<h4 class='modal-title'>Add student image and voice</h4>" +
        "</div> " +
        "<div class='modal-body'>" +
        "<div class='container'><input type='file' class='btn btn-primary'accept='image/*'/><button id='imgUpload'>Upload Image</button></div>" +
        "<div class='container'><input type='file' class='btn btn-primary'accept='audio/*'/><button id='audUpload'>Upload Audio</button></div>" +
        "</div>" +
        "<div class='modal-footer'>" +
        "  <button type='button' class='btn btn-default' data-dismiss='modal'>Close</button></div>" +
        "</div></div></div> ")
      $("#popup").addClass("popup");
      $("#myPopup").addClass("popuptext");
      $(".content").append("<button type='button' class='btn btn - info btn - lg' data-toggle='modal' data-target='#myModal'>Open Modal</button>")
      $(".content").append("<div class='card1' >\n <img class='plus' src='../images/plus-math.png' alt='Avatar' style='width:100%'/>\n <div><a href='addStudent.html' class='buttonAdd'>Add Image</a></div></div>")
      $(".card1").on("click", function () {
        var popup = document.getElementById("myPopup");
        console.log($('#myPopup').css('visibility'))
        if ($('#myPopup').css('visibility') === 'hidden') {
          console.log('here')
          $('#myPopup').css('visibility', 'visible')
        } else {
          $('#myPopup').css('visibility', 'hidden')
        }

        $("#imgUpload").on("click", function () {
          const storageRef = firebase.storage().ref();
          const file = $(":file").get(0).files[0];
          const name = (+new Date()) + '-' + file.name;
          const metadata = { contentType: file.type };
          const task = storageRef.child(name).put(file, metadata);
          task.then((snapshot) => {
            console.log(snapshot.downloadURL);
            var database = firebase.database().ref("students/" + userID + "/pics")
            var storesRef = database.child(ev.currentTarget.id);
            var newStoreRef = storesRef.push();
            newStoreRef.set({
              url: snapshot.downloadURL
            })
            updatePictures(picRef);
          });

        })
        // const storageRef = firebase.storage().ref();
        // const file = $(":file").get(0).files[0];
        // const name = (+new Date()) + '-' + file.name;
        // const metadata = { contentType: file.type };
        // const task = storageRef.child(name).put(file, metadata);
        // task.then((snapshot) => {
        //   console.log(snapshot.downloadURL);
        //   var database = firebase.database().ref("students/" + userID + "/pics")
        //   var storesRef = database.child(ev.currentTarget.id);
        //   var newStoreRef = storesRef.push();
        //   newStoreRef.set({
        //     url: snapshot.downloadURL
        //   })
        //   updatePictures(picRef);
        // });

      })

    })
  }
})
