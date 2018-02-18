$(document).ready(function() {
    $('#contact_form').bootstrapValidator({
        // To use feedback icons, ensure that you use Bootstrap v3.1.0 or later
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            first_name: {
                validators: {
                        stringLength: {
                        min: 2,
                    },
                        notEmpty: {
                        message: 'Please enter your First Name'
                    }
                }
            },
             last_name: {
                validators: {
                     stringLength: {
                        min: 2,
                    },
                    notEmpty: {
                        message: 'Please enter your Last Name'
                    }
                }
            },
			 user_name: {
                validators: {
                     stringLength: {
                        min: 8,
                    },
                    notEmpty: {
                        message: 'Please enter your Username'
                    }
                }
            },
			 physical_age: {
                validators: {
                     stringLength: {
                        min: 0,
                        max: 3,
                    },
                    notEmpty: {
                        message: 'Please enter students Age'
                    }
                }
            },
			mental_age: {
                validators: {
                     stringLength: {
                        min: 0,
                        max: 3,
                    },
                    notEmpty: {
                        message: 'Please enter childs mental age'
                    }
                }
            },
        iq: {
                  validators: {
                       stringLength: {
                          min: 0,
                          max: 3,
                      },
                      notEmpty: {
                          message: 'Please enter childs IQ'
                      }
                  }
              },
            }
        })
        .on('success.form.bv', function(e) {
            // $('#success_message').slideDown({ opacity: "show" }, "slow") // Do something ...
            if(e.isDefaultPrevented()){

            } else{
              var email = $("#email").value;
              var password = $("#password").value;
              // console.log("email", email);
              // console.log("password", password);
              firebase.auth().createUserWithEmailAndPassword(email, password).then(function(){
                //$('#contact_form').data('bootstrapValidator').resetForm();
              }).catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // ...
              });
            }
          });
        })

function submitFunction1(){
  var firstname = $("#firstName").val();
  var lastName = $("#lastName").val();
  var userName = $("#userName").val();
  var p_age = $("#p_age").val();
  var m_age = $("#m_age").val();
  var iq = $("#iq").val();

  // console.log(firstname);
  var database = firebase.database().ref();
  var storesRef = database.child('students');
  var newStoreRef = storesRef.push();
  if(firstname && lastName && userName){
    newStoreRef.set({
      firstName: firstname,
      lastName: lastName,
      userName: userName,
      p_age: p_age,
      m_age: m_age,
      iq: iq
    });
    window.location.href = "main.html";
  }

  // var newStudent = database.child().push({
  //   firstName: firstName,
  //   lastName: lastName,
  //   userName: userName,
  //   p_age: p_age,
  //   m_age: m_age,
  //   iq: iq
  // })
}
