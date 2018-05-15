$(document).ready(function () {
  var studentsRef = firebase.database().ref("students");
  studentsRef.once('value', function (snapshot) {
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
      var picturesRef = firebase.database().ref("students/" + e.currentTarget.id + "/upload/pics");

      $(".card").on("click", function (ev) {
        console.log("event.target.id: ", ev.currentTarget.id);
        var userID = $(".content>h2").attr('id');
        var picRef = firebase.database().ref("students/" + userID + "/upload/" + ev.currentTarget.id);
        $(".content > *").remove();
        // $(".content").append("<div class='container'><input type='file' class='btn btn-primary'accept='image/*'/><button id='upload'>Upload</button></div>");

        updatePictures(picRef, userID, ev.currentTarget.id);


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
  function updatePictures(picRef, userID, currTarget) {
    $(".content > .card").remove();
    $("#addImg").remove();
    picRef.once('value', function (snapshot) {
      $(".content > .card").remove();
      console.log("snapshot", snapshot)
      // console.log("length ", Object.keys(snapshot.val()).length)
      var size = Object.keys(snapshot.val()).length;
      snapshot.forEach(function (childSnapshot) {
        console.log("child snapshot key", childSnapshot.val())
        if (childSnapshot.key != "0") {
          $(".content").append("<div class='card'>\n <img src=" + childSnapshot.val().imgURL + " alt='Avatar' style='width:100%'/>\n<div></audio></div></div>")
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
        "<div class='loader'></div>" +
        "<div class='container' id='imageU'><input id='inputImg' type='file' class='btn btn-primary'accept='image/*'/></div>" +
        "<div class='container' id='audioU'><input id='inputAud' type='file' class='btn btn-primary'accept='audio/*'/><button id='upload'>Upload</button></div>" +
        "</div>" +
        "<div class='modal-footer'>" +
        "  <button type='button' class='btn btn-default' data-dismiss='modal'>Close</button></div>" +
        "</div></div></div> ")
      $(".loader").addClass(".loader")
      $("#popup").addClass("popup");
      $("#myPopup").addClass("popuptext");
      //add student button
      $(".content").append("<button id='addImg' type='button' class='btn btn - info btn - lg' data-toggle='modal' data-target='#myModal'>Add Image and Audio</button>")
      // $(".content").append("<div class='card1' >\n <img class='plus' src='../images/plus-math.png' alt='Avatar' style='width:100%'/>\n <div><a href='addStudent.html' class='buttonAdd'>Add Image</a></div></div>")
      // $(".card1").on("click", function () {
      //   var popup = document.getElementById("myPopup");
      //   console.log($('#myPopup').css('visibility'))
      //   if ($('#myPopup').css('visibility') === 'hidden') {
      //     console.log('here')
      //     $('#myPopup').css('visibility', 'visible')
      //   } else {
      //     $('#myPopup').css('visibility', 'hidden')
      //   }

      //uploads image to firebase
      $("#imgUpload").on("click", function () {
        const storageRef = firebase.storage().ref();
        const file = $(":file").get(0).files[0];
        const name = (+new Date()) + '-' + file.name;
        const metadata = { contentType: file.type };
        const task = storageRef.child(name).put(file, metadata);
        $(".loader").css("display", "block");
        task.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
          function (snapshot) {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
              case firebase.storage.TaskState.PAUSED: // or 'paused'
                console.log('Upload is paused');
                break;
              case firebase.storage.TaskState.RUNNING: // or 'running'
                console.log('Upload is running');
                break;
            }
          }, function (error) {

            // A full list of error codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
            switch (error.code) {
              case 'storage/unauthorized':
                // User doesn't have permission to access the object
                $(".loader").css("display", "none");
                $("#imageU").append("<h4>Error uploading image, user doesn't have permission to access the object!</h4>")
                break;

              case 'storage/canceled':
                // User canceled the upload
                $(".loader").css("display", "none");
                $("#imageU").append("<h4>Error uploading image!</h4>")
                break;

              case 'storage/unknown':
                $(".loader").css("display", "none");
                $("#imageU").append("<h4>Error uploading image!</h4>")
                // Unknown error occurred, inspect error.serverResponse
                break;
            }
          }, function () {
            // Upload completed successfully, now we can get the download URL
            task.snapshot.ref.getDownloadURL().then(function (downloadURL) {
              console.log('File available at', downloadURL);
              $(".loader").css("display", "none")
              $("#imageU > *").remove();
              $("#imageU").append("<h4>Image uploaded successfully!</h4>")
              console.log(downloadURL);
              var database = firebase.database().ref("students/" + userID + "/upload/pics")
              var storesRef = database.child(currTarget);
              var newStoreRef = storesRef.push();
              newStoreRef.set({
                url: downloadURL
              })
              updatePictures(picRef, userID, currTarget);
              console.log('File available at', downloadURL);
            });

          }
        );
      });

      // })
      //upload audio to firebase
      var imgdownloadURL = "";
      var audiodownloadURL = "";
      $("#upload").on("click", function () {
        const storageRef = firebase.storage().ref();
        const audioFile = $("#inputAud")[0].files[0];
        const imageFile = $("#inputImg")[0].files[0];
        if (audioFile && imageFile) {
          const audioName = (+new Date()) + '-' + audioFile.name;
          const audioMetadata = { contentType: audioFile.type };
          const task = storageRef.child(audioName).put(audioFile, audioMetadata);
          $(".loader").css("display", "block")
          task.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
            function (snapshot) {
              // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
              var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log('Upload is ' + progress + '% done');
              switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED: // or 'paused'
                  console.log('Upload is paused');
                  break;
                case firebase.storage.TaskState.RUNNING: // or 'running'
                  console.log('Upload is running');
                  break;
              }
            }, function (error) {

              // A full list of error codes is available at
              // https://firebase.google.com/docs/storage/web/handle-errors
              switch (error.code) {
                case 'storage/unauthorized':
                  // User doesn't have permission to access the object
                  $(".loader").css("display", "none");
                  $("#audioU").append("<h4>Error uploading audio, user doesn't have permission to access the object!</h4>");
                  break;

                case 'storage/canceled':
                  // User canceled the upload
                  $(".loader").css("display", "none");
                  $("#imageU").append("<h4>Error uploading audio!</h4>");
                  break;

                case 'storage/unknown':
                  $(".loader").css("display", "none");
                  $("#imageU").append("<h4>Error uploading audio!</h4>")
                  // Unknown error occurred, inspect error.serverResponse
                  break;
              }
            }, function () {
              // Upload completed successfully, now we can get the download URL
              task.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                // $(".loader").css("display", "none")
                // $("#audioU > *").remove();
                // $("#audioU").append("<h4>Audio uploaded successfully!</h4>")
                audiodownloadURL = downloadURL;
                const Imgname = (+new Date()) + '-' + imageFile.name;
                const imgmetadata = { contentType: imageFile.type };
                const task1 = storageRef.child(Imgname).put(imageFile, imgmetadata);
                $(".loader").css("display", "block");
                task1.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
                  function (snapshot) {
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    switch (snapshot.state) {
                      case firebase.storage.TaskState.PAUSED: // or 'paused'
                        console.log('Upload is paused');
                        break;
                      case firebase.storage.TaskState.RUNNING: // or 'running'
                        console.log('Upload is running');
                        break;
                    }
                  }, function (error) {

                    // A full list of error codes is available at
                    // https://firebase.google.com/docs/storage/web/handle-errors
                    switch (error.code) {
                      case 'storage/unauthorized':
                        // User doesn't have permission to access the object
                        $(".loader").css("display", "none");
                        $("#imageU").append("<h4>Error uploading image, user doesn't have permission to access the object!</h4>")
                        break;

                      case 'storage/canceled':
                        // User canceled the upload
                        $(".loader").css("display", "none");
                        $("#imageU").append("<h4>Error uploading image!</h4>")
                        break;

                      case 'storage/unknown':
                        $(".loader").css("display", "none");
                        $("#imageU").append("<h4>Error uploading image!</h4>")
                        // Unknown error occurred, inspect error.serverResponse
                        break;
                    }
                  }, function () {
                    // Upload completed successfully, now we can get the download URL
                    task1.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                      console.log('File available at', downloadURL);
                      $(".loader").css("display", "none")
                      $("#imageU > *").remove();
                      $("#audioU > *").remove();
                      $("#imageU").append("<h4>Image and Audio uploaded successfully!</h4>")

                      // console.log(downloadURL);
                      var database = firebase.database().ref("students/" + userID + "/upload")
                      var storesRef = database.child(currTarget);
                      var newStoreRef = storesRef.push();
                      newStoreRef.set({
                        imgURL: downloadURL,
                        audioURL: audiodownloadURL
                      })
                      updatePictures(picRef, userID, currTarget);
                      console.log('File available at', downloadURL);
                    });

                  }
                );
                // var database = firebase.database().ref("students/" + userID + "/upload/")
                // var storesRef = database.child(currTarget);
                // var newStoreRef = storesRef.push();
                // newStoreRef.set({
                //   audiourl: downloadURL
                // })
                // updatePictures(picRef, userID, currTarget);
                // console.log('File available at', downloadURL);
              });
            }
          );



        }

      })
    })
    // Listen for state changes, errors, and completion of the upload.


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



    // })
  }
})
