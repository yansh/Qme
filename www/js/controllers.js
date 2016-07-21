angular.module('starter.controllers', [])
    .controller('LoginCtrl', function ($scope, LoginService, $ionicPopup, $state) {        
        var currentUser = Parse.User.current();  
/*        if (currentUser != null) {
            $state.transitionTo('public-questions', $state.$current.params, { reload: true });
        } else {*/
            $scope.data = {};
            var isWebView = ionic.Platform.isWebView();
            var isIPad = ionic.Platform.isIPad();
            var isIOS = ionic.Platform.isIOS();
            var isAndroid = ionic.Platform.isAndroid();
            var isWindowsPhone = ionic.Platform.isWindowsPhone();

            $scope.isApp = isIOS || isAndroid || isWindowsPhone;
            $scope.isWebView = isWebView;

            $scope.signup = function () {
                var user = new Parse.User();
                user.set("username", $scope.data.username);
                user.set("password", $scope.data.password);
                user.set("email", $scope.data.username);


                user.signUp(null, {
                    success: function (user) {
                        $state.go('profile');
                    },
                    error: function (user, error) {
                        handleParseError(error);
                        // alert("Error: " + error.code + " " + error.message);
                        var alertPopup = $ionicPopup.alert({
                            title: 'Signup  failed!',
                            template: 'Please try again'
                        });  // Show the error message somewhere and let the user try again.
                        //alert("Error: " + error.code + " " + error.message);
                    }
                });
            }
            $scope.login = function () {
                Parse.User.logIn($scope.data.username, $scope.data.password, {
                    success: function (user) {
                        //$state.go('tab.dash');
                        $state.transitionTo('tab.dash', $state.$current.params, { reload: true });
                        // Do stuff after successful login.
                    },
                    error: function (user, error) {
                        // The login failed. Check error to see why.
                        var alertPopup = $ionicPopup.alert({
                            title: 'Login failed!',
                            template: 'Please check your credentials!'
                        });
                    }
                });
            }
    })
    .controller('AskCtrl', function ($scope,  $state, StoreService, $log, $ionicLoading, socket, $cordovaCamera, $cordovaSocialSharing, $rootScope,  $ionicModal, $ionicPopup, $cordovaGeolocation, $compile) {       

        $scope.cancel = function () {
            //$state.go('tab.dash');
            $state.transitionTo('tab.dash', $state.$current.params, {reload: true});
        }


       
        var deviceInformation = ionic.Platform.device();
        
        var isWebView = ionic.Platform.isWebView();
        var isIPad = ionic.Platform.isIPad();
        var isIOS = ionic.Platform.isIOS();
        var isAndroid = ionic.Platform.isAndroid();
        var isWindowsPhone = ionic.Platform.isWindowsPhone();
        
        $scope.isApp = isIOS || isAndroid || isWindowsPhone;
        var isApp = isIOS || isAndroid || isWindowsPhone;
        
         $scope.data = {};
         $scope.data.yn=true;
         $scope.data.qType=false;
         $scope.contacts = [ { value: '' } ];
         $scope.imageURL = null;
         
         $scope.currentUser = {
          picture: "img/iu.jpg",
          handle: " ",
          name: ""
        }
        
          if(window.plugins.webintent)
            window.plugins.webintent.getExtra(window.plugins.webintent.EXTRA_TEXT,
             function (url) {
               // url is the value of EXTRA_TEXT
              $scope.data.question = url;
              //alert("Got it!:"+url);
             }, function () {
               // There was no extra supplied.
             }
             );
        //$scope.questions = [];
        var currentUser = Parse.User.current();  
               
         $scope.$on("$ionicView.enter", function(){
           if($rootScope.uploaded==true){
             $scope.uploaded=true;
             $scope.imageURL = StoreService.image;
             $rootScope.uploaded=false;
           }
       });

      
        $ionicModal.fromTemplateUrl('templates/share.html', {
              scope: $scope,
              animation: 'slide-in-up'
            }).then(function(modal) {
              $scope.modal = modal;
               //$scope.modal.show();
            }).catch(function(fallback) {
            alert(JSON.stringify(fallback));
      });;
      
                  
            
            $scope.openModal = function() {
              $scope.modal.show();
            };
            $scope.closeModal = function() {
              $scope.modal.hide();
            };
            //Cleanup the modal when we're done with it!
            $scope.$on('$destroy', function() {
              $scope.modal.remove();
            });
            // Execute action on hide modal
            $scope.$on('modal.hidden', function() {
              // Execute action
            });
            // Execute action on remove modal
            $scope.$on('modal.removed', function() {
              // Execute action
            }); 
       
       var options = {timeout: 10000, enableHighAccuracy: true};

          String.prototype.parseUsername = function() {
            return this.replace(/[@]+[A-Za-z0-9-_]+/g, function(u) {
              var username = u.replace("@","")
              return u.link("<b>"+username+"</b>");
            });
        };

    $scope.options = [ { value: '' }];

    $scope.update = function(){
      //$scope.contacts = 
      try {
        
        console.log($scope.data.question.match(/[@]+[A-Za-z0-9-_]+/g).join());
         
         $scope.contacts = ($scope.data.question.match(/[@]+[A-Za-z0-9-_]+/g)).map(function (obj) {
        return {        
            value: obj
             }
      });
      console.log(JSON.stringify ($scope.contacts));
    }
      catch(err) { 
         console.log("Error ids!");
      }
    }
    $scope.addContact = function () {
            $scope.contacts.push( { value: ''});
     };
     

    $scope.remove = function (index) {
          $scope.options.splice(index, 1);
      };
      
    $scope.removeContact = function (index) {
          $scope.contacts.splice(index, 1);
      };
    $scope.preview = function (input)
    {
         if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) { $('#img').attr('src', e.target.result);
             }
            reader.readAsDataURL(input.files[0]);
        }
    }


  $scope.upload = function () {


	var options = {
			quality: 50,
			destinationType: Camera.DestinationType.DATA_URL,
			sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
			targetWidth: 200,
			targetHeight: 200
		};

		$cordovaCamera.getPicture(options).then(function(imageUri) {
			//alert(imageUri);
            $scope.uploaded=true;
            $scope.imageURL = imageUri;
		}, function(err) {
		alert("Error: "+err);
		// error
		});
        };

        $scope.setQType = function(){
          //alert($scope.data.isPoll);
          if($scope.data.isPoll==true){
            $scope.data.yn=false;
          }else $scope.data.yn=true;
        }
        
           $scope.add = function () {
            $scope.options.push({
            value: ''
          });
     };
     
        $scope.qask = function () {

        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

            var currentUser = Parse.User.current();

            var uniqueIds = [];
            var counter = {};
            counter["yes"]=0;
            counter["no"]=0;

            //var answeredUsers=[];
            angular.forEach(angular.copy($scope.contacts),
            function(value, key) {
              this.push(value.value.replace("@",""));
            }, uniqueIds);
            if (uniqueIds.length <0 || uniqueIds[0].value=="" )
             alert("Please enter at least one recpient");
           else if (currentUser) {                  
                var Questions = Parse.Object.extend("Questions");
                var myQuestion = new Questions();
                myQuestion.set("owner", currentUser);
                myQuestion.addUnique("content", $scope.data.question);               
                myQuestion.set("to",uniqueIds);
                myQuestion.set("extra", $scope.data.extraInfo);
                myQuestion.set("title", $scope.data.title);
                //myQuestion.addUnique("answered");
                myQuestion.set("type", "yes/no");
                myQuestion.set("is_private", $scope.data.qType);
                myQuestion.set("counter", counter);

                    if ($scope.imageURL!=null) {
                          var file = $scope.imageURL;
                          var name = "photo.jpg";
                          var parseFile = new Parse.File(name, { base64: file });
                          parseFile.save().then(function() {
                          myQuestion.set("image", parseFile);
                        //  myQuestion.set("answer","");
                          myQuestion.save();
                          }, function(error) {
                            // The file either could not be read, or could not be saved to Parse.
                            alert("Error the image cannot be uploaded :")
                          });
                        }

              if($scope.data.question !="") {   
               myQuestion.save(null,  {
                    success: function(question) {
                    $ionicLoading.hide();
                    //  $scope.openModal();
                    angular.forEach(uniqueIds,
                    function(id){
                    // $log.info("emitting to id:"+id);
                     socket.emit("message", {
                            id: id,
                            from: currentUser.get("handle"),
                            title: $scope.data.question                            
                    });  
                    })
                    
                    if(isApp){
                      var confirmPopup = $ionicPopup.confirm({
                        title: 'Share your question!',
                        template: 'Would you like to share your question?'
                      });
                      confirmPopup.then(function (res) {
                        if (res) {
                          $cordovaSocialSharing.share($scope.data.question, "Question for you!", null, "http://getq.me/#/questions/" + question.id);
                          $state.transitionTo('tab.dash', $state.$current.params, {reload: true});
                        } else {
                          $state.transitionTo('tab.asked', $state.$current.params, {reload: true});
                          //$state.go('tab.asked');
                        }
                      });
                    }else{
                       $state.transitionTo('tab.asked', $state.$current.params, {reload: true});
                    }
                      
                    },
                    error: function(gameScore, error) {
                      // Execute any logic that should take place if the save fails.
                      // error is a Parse.Error with an error code and message.
                      alert('Failed to create new object, with error code: ' + error.message);
                    }
                  });
                                                  
              }else{
                  alert("Please specify your question.");
              }
             
               // $state.go('tab.asked');
            } else {
                //alert("Login!")
                $state.go('public-questions');
            }
        }

        //for polling
        $scope.poll = function () {

                var currentUser = Parse.User.current();


        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
        
                var uniqueIds = [];
            angular.forEach(angular.copy($scope.contacts),
            function(value, key) {
              this.push(value.value.replace("@",""));
            }, uniqueIds);

                var counter = {};
                 angular.forEach(angular.copy($scope.options), function(value, key) {
                   this[value.value]=0;
                }, counter);

                if (currentUser) {



                    var Questions = Parse.Object.extend("Questions");
                    var myQuestion = new Questions();
                    myQuestion.set("owner", currentUser);
                    myQuestion.set("content", angular.copy($scope.options));
                    myQuestion.set("counter", counter);
                    myQuestion.set("to", uniqueIds);
                    myQuestion.set("title", $scope.data.title);
                    //myQuestion.set("answered",false);
                    myQuestion.set("type", "poll");
                    myQuestion.set("is_private", $scope.data.qType);

                        if ($scope.imageURL!=null) {
                              var file = $scope.imageURL;
                              var name = "photo.jpg";
                              var parseFile = new Parse.File(name, { base64: file });
                              parseFile.save().then(function() {
                              myQuestion.set("image", parseFile);
                              //myQuestion.set("answer","");
                              myQuestion.save();
                              }, function(error) {
                                // The file either could not be read, or could not be saved to Parse.
                                alert("Error the image cannot be uploaded :")
                              });
                            }


                    //myQuestion.set("answer","");
                  //  myQuestion.save();

           
                        // Execute any logic that should take place after the object is saved.
                  myQuestion.save(null,  {
                    success: function(question) {
                    $ionicLoading.hide();
                    //  $scope.openModal();
                    if(isApp){
                      var confirmPopup = $ionicPopup.confirm({
                        title: 'Share your question!',
                        template: 'Would you like to share your question?'
                      });
                      confirmPopup.then(function (res) {
                        if (res) {
                          $cordovaSocialSharing.share($scope.data.question, "Question for you!", null, "http://getq.me/#/questions/" + question.id);
                          $state.transitionTo('tab.dash', $state.$current.params, {reload: true});
                        } else {
                          $state.transitionTo('tab.asked', $state.$current.params, {reload: true});
                          //$state.go('tab.asked');
                        }
                      });
                    }else{
                       $state.transitionTo('tab.asked', $state.$current.params, {reload: true});
                    }
                      
                    },
                    error: function(gameScore, error) {
                      // Execute any logic that should take place if the save fails.
                      // error is a Parse.Error with an error code and message.
                      alert('Failed to create new object, with error code: ' + error.message);
                    }
                  });
                      //  alert('New object created with objectId: ' + myQuestion.id);                     
                    //$state.go('tab.asked');
                } else {
                    //alert("Login!")
                    $state.go('public-questions');
                }
            }

    })
     .controller('ProfileCtrl', function ($scope,$ionicLoading, $state,  $cordovaCamera, $ionicUser,  $log, $ionicPush) {
          var currentUser = Parse.User.current();


         $scope.Logout = function () {
           
            Parse.User.logOut().then(
            function() {
                  $state.go('public-questions');
              }, function(error) {
                  alert("Something went wrong, try again!");
              }
          );     
          

         }
    	   $scope.data ={};
          $scope.data.pushNotification=true;
                   
           $scope.uploadImage = function () {


               var options = {
                   quality: 50,
                   destinationType: Camera.DestinationType.DATA_URL,
                   sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                   targetWidth: 200,
                   targetHeight: 200
               };

               $cordovaCamera.getPicture(options).then(function (imageUri) {
                   //alert(imageUri);
                   $scope.uploaded = true;
                   $scope.ulImage = imageUri;
               }, function (err) {
                       alert("Error: " + err);
                       // error
                   });
           };

          if (currentUser) {
              if(currentUser.get('picture')!=null)
              $scope.userImage = currentUser.get('picture').url();
              else
               $scope.userImage = "img/iu.jpg";


           $scope.data.userEmail = currentUser.get("email");
           $scope.data.userLast = currentUser.get("lastName");
           $scope.data.userFirst = currentUser.get("firstName");
           $scope.data.userHandle = currentUser.get("handle");

          }

          $scope.saveProfile = function () {
              if(typeof $scope.data.userHandle=="undefined" || $scope.data.userHandle==null || $scope.data.userHandle==""){
                alert("You need to choose a handle for yourself");
              }else{
                $log.info("Handle: "+ $scope.data.userHandle);
              if ($scope.ulImage != null) {
                  var file = $scope.ulImage;
                  var name = "photo.jpg";

                  var parseFile = new Parse.File(name, { base64: file });

                  parseFile.save().then(function () {
                      currentUser.set("picture", parseFile);
                      currentUser.save();
                  }, function (error) {
                          // The file either could not be read, or could not be saved to Parse.
                          alert("Error the image cannot be uploaded :")
                      });
              }

              var query = new Parse.Query(Parse.User);
              query.equalTo("handle", $scope.data.userHandle);  // find all the women
              if ($scope.data.userHandle != currentUser.get("handle")) {
                query.find({
                  success: function (users) {
                    if (users.length == 0) {
                      currentUser.set("handle", $scope.data.userHandle);
                      currentUser.set("lastName", $scope.data.userLast);
                      currentUser.set("firstName", $scope.data.userFirst);
                      currentUser.set("email", $scope.data.userEmail);
                      //alert($scope.data.userHandle);
                      currentUser.save();
                      // $state.go("tab.dash");
                      $state.transitionTo('tab.dash', $state.$current.params, { reload: true });
                    } else { alert("This handle is taken try another one!"); }
                  },
                  error: function (user, error) {
                    alert("Error!");
                  }
                });
              } else { $state.transitionTo('tab.dash', $state.$current.params, { reload: true }); }

            };
          }
     })
    .controller('PublicCtrl', function ($scope, toaster, $embed, $rootScope, $log, StoreService, $ionicActionSheet, $ionicScrollDelegate, $cordovaSocialSharing, $ionicLoading, $state, $timeout, $cordovaCamera, $q, Questions) {

        $rootScope.$on('$cordovaPush:tokenReceived', function (event, data) {
            console.log('Got token', data.token, data.platform);
            // Do something with the token
        });

        var currentUser = Parse.User.current();
        $scope.logged = false;
        if (currentUser != null)
            $scope.logged = true;

        $scope.login = function (){
            $state.go('login');
        }
        $scope.render = $embed.render;

        $scope.$watchCollection('questions', function (oldVal, newVal) {
            if  (typeof(oldVal) !== 'undefined' && (typeof(newVal) != 'undefined')){ 
             var animate = oldVal.length !== newVal.length;
                $ionicScrollDelegate.$getByHandle('questionScroll').scrollTop(animate);
            }
        });

        var isWebView = ionic.Platform.isWebView();
        var isIPad = ionic.Platform.isIPad();
        var isIOS = ionic.Platform.isIOS();
        var isAndroid = ionic.Platform.isAndroid();
        var isWindowsPhone = ionic.Platform.isWindowsPhone();
        
        $scope.isApp = isIOS || isAndroid || isWindowsPhone;
        
        if ($scope.isApp)
          $state.go('login');
          
       $scope.shareIt  = function(qid,qtext) {
                //alert("Sharing!");
                $cordovaSocialSharing.share(qtext, "I have a question for you", null, "http://getq.me/#/questions/"+qid);
            }
            
      $scope.qdetails = function(id){
        var result = { qId:id };
        $log.info(JSON.stringify(result)) ;      
        $state.go("questions", result);
      }
      /*$scope.$on("$cordovaLocalNotification:added", function(id, state, json) {
         alert("Added a notification");
      });*/
        $scope.getProfile = function(){
            $state.go('profile');
        };

        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        $scope.takePicture= function () {


            var options = {
                quality: 200,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.ID_CAP_CAMERA,
                targetWidth: 200,
                targetHeight: 200
            };

            $cordovaCamera.getPicture(options).then(function (imageUri) {
                //alert(imageUri);
                $rootScope.uploaded = true;
                StoreService.setImage(imageUri);
                $state.go('ask');
            }, function (err) {
                    alert("Error: " + err);
                    // error
                });
        };

        // TETS for comments - dummy

        var listHeight = '140px';

        $scope.no_answer=true;
        $scope.currentUser = {
          picture: "img/iu.jpg",
          handle: " ",
          name: ""
        }
        
        var currentUser = Parse.User.current();
        if (currentUser) {

          if (currentUser.get('picture') != null)
            $scope.currentUser.picture = currentUser.get('picture').url();
            $scope.currentUser.handle = currentUser.get('handle');
            $scope.currentUser.name = currentUser.get('firstName');
          
          $state.transitionTo('tab.public', $state.$current.params, { reload: true });
        }

          $scope.data = {};
          $scope.commentList = [];
            //$scope.userImage="";
            
          /* if(currentUser.get('picture')!=null)
           $scope.userImage = currentUser.get('picture').url();
             else
               $scope.userImage = "img/iu.jpg";*/

           $scope.addElement = function (qid) {

               var today = new Date();
               var src ="" ;
               if (currentUser.get('picture') != null)
                      src = currentUser.get('picture').url();
                               else
                            src = "img/iu.jpg";

               var theComment =
                     { imgUrl: src,
                       commentHtml: $scope.data.comment[qid],
                       fullName: currentUser.get('username'),
                       date: today.getTime()
                       };
                      $scope.data.comment[qid]="";
                       var Questions = Parse.Object.extend("Questions");
                       var query = new Parse.Query(Questions);
                        query.get(qid,{
                                success: function(question) {
                                    var Comment = Parse.Object.extend("Comment");
                                    var myComment = new Comment();
                                    myComment.set('user', currentUser);
                                    //myComment.set('imgUrl', theComment.imgUrl);
                                    //myComment.set('fullName', theComment.fullName);
                                    myComment.set('date', theComment.date);
                                    myComment.set('commentHtml', theComment.commentHtml);
                                    myComment.set('parent', question);
                                    myComment.save();
                                   
                                },
                                error: function(error) {
                                    alert("Error: " + error.code + " " + error.message);
                                }});

                                    $scope.commentList[qid].push (theComment);
               };

        var myQuestions = Parse.Object.extend("Questions");
        var query = new Parse.Query(myQuestions);
        query.equalTo("is_private", false);
       // query.equalTo("to", currentUser.get("handle"));//currentUser.get("username"));
        /*queryA.equalTo("to", currentUser.get("handle"));

        var queryB = new Parse.Query(myQuestions);
        queryB.equalTo("to",currentUser.get("username"));
        

        var query = Parse.Query.or(queryA, queryB);*/
        //query.doesNotExist(answered);
        query.include("owner");
        $scope.questions =[];
       
     
        query.find({
            success: function(questions) {
              //$scope.questions = deferred.resolve($scope,currentUser,questions,false);

              //$scope.questions =
              if(currentUser!=null)
                Questions.getQuestions($scope,currentUser,questions,false, false);
               else
                Questions.getQuestions($scope,currentUser,questions,false, true); 
              $ionicLoading.hide();

            },
            error: function(error) {
                //$ionicLoading.hide();
                $ionicLoading.hide();
                alert("Error ");
            }});

          $scope.doRefresh = function(){
            query.include("owner");
            query.find({
                success: function(questions) {
                  //$scope.questions =
                  //Questions.getQuestions($scope,currentUser,questions,false, false);
                  if(currentUser!=null)
                        Questions.getQuestions($scope,currentUser,questions,false, false);
                   else
                        Questions.getQuestions($scope,currentUser,questions,false, true);
              //    $ionicLoading.hide();

                },
                error: function(error) {
                    //$ionicLoading.hide();
                    $ionicLoading.hide();
                    alert("Error: " + error.code + " " + error.message);
                }});


        };
            // Triggered on a button click, or some other target
        $scope.ask = function () {
          $state.go('ask');
          //$state.transitionTo('ask', {}, {reload: true});                            
        };



           $scope.clicked = function(answer, index, qid){           
              var Answers = Parse.Object.extend("Answers");
              var myAnswer = new Answers();
              
              if (currentUser != null)// loged in
                myAnswer.set("user", currentUser);    
           /*     else{
                var user = new Parse.User();    
                user.set("username", $ionicUser.generateGUID());
                user.set("password", $ionicUser.generateGUID());                        
                user.signUp(null, {
                success: function (user) {
                 myAnswer.set("user", user);    
                },
                error: function (user, error) {
                    handleParseError(error);
                    // alert("Error: " + error.code + " " + error.message);
                    var alertPopup = $ionicPopup.alert({
                        title: 'Anonymous user',
                        template: 'Please try again'
                    });  // Show the error message somewhere and let the user try again.
                    //alert("Error: " + error.code + " " + error.message);
                }
            });                                                  
                }*/         
                
                var Questions = Parse.Object.extend("Questions");
                var query = new Parse.Query(Questions);
                query.get(qid,{
                    success: function(question) {
                       myAnswer.set("content", answer);
                       myAnswer.set("question", question);
                       myAnswer.save().then(function() {
                      // question.addUnique("answered", currentUser);
                      //var answeredUsers = question.relation("answeredUsers");
                      //answeredUsers.add(currentUser);
                       var answers = question.relation("answers");
                       answers.add(myAnswer);
                       //question.set("answer", myAnswer);
                       var counter = question.get("counter");
                       counter[answer] = (counter[answer])+1;
                       question.set("counter", counter);
                       question.save();
                       //$scope.no_answer=false;
                       if(currentUser!=null){
                       //$state.go('tab.answered');
                       $state.transitionTo('tab.answered', $state.$current.params, {reload: true});
                       //$scope.questions.splice(index,1);
                       }else{
                         toaster.pop('success', "Thank you!", "Join the fun and register");                          
                         $state.go('login');
                          
                       }

                     }, function(error) {
                       // The file either could not be read, or could not be saved to Parse.
                       alert("Error saving your answer, try again please");//+JSON.stringify(error));
                     });
                    },
                    error: function(error) {
                        //alert("Error: " + error.code + " " + error.message);
                        alert("Error saving your answer, try again please");
                    }});
                  ;
           }

    })     
 .controller('MainCtrl', function ($scope, $rootScope, $embed, $window, $cordovaLocalNotification, $log, socket, StoreService,$ionicActionSheet, $ionicScrollDelegate, $cordovaSocialSharing, $ionicLoading, $state, $timeout, $cordovaCamera,$q, Questions) {
   
 /*socket.on('news', function (data) {
    //alert(JSON.stringify(data));
    socket.emit('my other event', { my: 'data1' });
  });


 socket.emit('message', {
            id: 'yan',
             title: "test!"                            
                    }); 
   */                 

  //.ready(function () {   
   $scope.openUrl = function (url){       
        $window.open(url, '_system', 'location=yes' );
        return false;
    }

  $scope.render = $embed.render;
  $rootScope.$on('$cordovaPush:tokenReceived', function(event, data) {
          console.log('Got token', data.token, data.platform);
  // Do something with the token
    });

    $scope.$watchCollection('questions', function (oldVal, newVal) {
    var animate = oldVal.length !== newVal.length;
    $ionicScrollDelegate.$getByHandle('questionScroll').scrollTop(animate);
  });
      
        var isWebView = ionic.Platform.isWebView();
        var isIPad = ionic.Platform.isIPad();
        var isIOS = ionic.Platform.isIOS();
        var isAndroid = ionic.Platform.isAndroid();
        var isWindowsPhone = ionic.Platform.isWindowsPhone();
        
        $scope.isApp = isIOS || isAndroid || isWindowsPhone;
       $scope.shareIt  = function(qid,qtext) {
                //alert("Sharing!");
                $cordovaSocialSharing.share(qtext, "I have a question for you", null, "http://getq.me/#/questions/"+qid);
            }
            
      $scope.qdetails = function(id){
        var result = { qId:id };
        $log.info(JSON.stringify(result)) ;      
        $state.go("questions", result);
      }
      /*$scope.$on("$cordovaLocalNotification:added", function(id, state, json) {
         alert("Added a notification");
      });*/
        $scope.getProfile = function(){
            $state.go('profile');
        };

        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        $scope.takePicture= function () {


            var options = {
                quality: 200,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.ID_CAP_CAMERA,
                targetWidth: 200,
                targetHeight: 200
            };

            $cordovaCamera.getPicture(options).then(function (imageUri) {
                //alert(imageUri);
                $rootScope.uploaded = true;
                StoreService.setImage(imageUri);
                $state.go('ask');
            }, function (err) {
                    alert("Error: " + err);
                    // error
                });
        };

        // TETS for comments - dummy

        var listHeight = '140px';

        $scope.no_answer=true;
        $scope.currentUser = {
          picture: "img/iu.jpg",
          handle: " ",
          name: ""
        }
        //$scope.questions = [];
        var currentUser = Parse.User.current();

        if (currentUser) {
          
          if (currentUser.get('picture') != null)
            $scope.currentUser.picture = currentUser.get('picture').url();
            $scope.currentUser.handle = currentUser.get('handle');
            $scope.currentUser.name = currentUser.get('firstName');

          socket.on($scope.currentUser.handle, function (message) {
          //alert(JSON.stringify(message));    
          socket.emit('ACK', { id: message.id, msg_idx: message.idx });
          $cordovaLocalNotification.schedule({
            id: 1,
            title: message.title,
            text: 'from '+message.from,
            data: {
              customProperty: 'custom value'
            }
            }).then(function (result) {
            //console.log('Notification 1 triggered');
          });       
            //$scope.messages.push(message);
           //  alert('new question for you!'+message.title);
          });
          


          $scope.data = {};
          $scope.commentList = [];
            //$scope.userImage="";
            
          /* if(currentUser.get('picture')!=null)
           $scope.userImage = currentUser.get('picture').url();
             else
               $scope.userImage = "img/iu.jpg";*/

           $scope.addElement = function (qid) {

               var today = new Date();
               var src ="" ;
               if (currentUser.get('picture') != null)
                      src = currentUser.get('picture').url();
                               else
                            src = "img/iu.jpg";

               var theComment =
                     { imgUrl: src,
                       commentHtml: $scope.data.comment[qid],
                       fullName: currentUser.get('username'),
                       date: today.getTime()
                       };
                      $scope.data.comment[qid]="";
                       var Questions = Parse.Object.extend("Questions");
                       var query = new Parse.Query(Questions);
                        query.get(qid,{
                                success: function(question) {
                                    var Comment = Parse.Object.extend("Comment");
                                    var myComment = new Comment();
                                    myComment.set('user', currentUser);
                                    //myComment.set('imgUrl', theComment.imgUrl);
                                    //myComment.set('fullName', theComment.fullName);
                                    myComment.set('date', theComment.date);
                                    myComment.set('commentHtml', theComment.commentHtml);
                                    myComment.set('parent', question);
                                    myComment.save();
                                   
                                },
                                error: function(error) {
                                    alert("Error: " + error.code + " " + error.message);
                                }});

                                    $scope.commentList[qid].push (theComment);
               };

        var myQuestions = Parse.Object.extend("Questions");
        var query = new Parse.Query(myQuestions);
        query.equalTo("to", currentUser.get("handle"));//currentUser.get("username"));
        /*queryA.equalTo("to", currentUser.get("handle"));

        var queryB = new Parse.Query(myQuestions);
        queryB.equalTo("to",currentUser.get("username"));
        

        var query = Parse.Query.or(queryA, queryB);*/
        //query.doesNotExist(answered);
        query.include("owner");
        $scope.questions =[];
        

    // Get the data immediately, interval function will run 1 second later
   

    // Function to replicate setInterval using $timeout service.
    $scope.intervalFunction = function() {
        var currentCtrl = 'MainCtrl';
        var currentlyRunning = $rootScope.myAppMainCtrlRefreshRunning;
        //do not run if the MainCtrl is not in scope
        //do not run if we've already got another timeout underway (in case someone jumps back and forth between
        //controllers without waiting 1 second between)
        if (currentCtrl === "MainCtrl" && !currentlyRunning) {
            $timeout(function() {
                $rootScope.myAppMainCtrlRefreshRunning = true;
          query.find({
            success: function(questions) {
              //$scope.questions = deferred.resolve($scope,currentUser,questions,false);

              //$scope.questions =
             // Questions.getQuestions($scope,currentUser,questions,false);
              

            },
            error: function(error) {
                //$ionicLoading.hide();
                alert("Error ");
            }});
                
                $scope.intervalFunction();
                $rootScope.myAppMainCtrlRefreshRunning = false;
            }, 10000);
        };
    };
    // Kick off the interval
    $scope.intervalFunction();       
          if(window.plugins.webintent)
            window.plugins.webintent.getExtra(window.plugins.webintent.EXTRA_TEXT,
             function (url) {
               // url is the value of EXTRA_TEXT
              //alert(url);
              $state.go('ask');
              // alert("Got it!:"+url);
             }, function () {
               // There was no extra supplied.
             }
             );
        //$scope.q
        query.find({
            success: function(questions) {
              //$scope.questions = deferred.resolve($scope,currentUser,questions,false);

              //$scope.questions =
              Questions.getQuestions($scope,currentUser,questions,false,false);
              $ionicLoading.hide();

            },
            error: function(error) {
                //$ionicLoading.hide();
                //alert("Error"+JSON.stringify(error);
                  $ionicLoading.hide();
                   Parse.User.logOut().then(
            function() {
                  $state.go('public-questions');
              }, function(error) {
                  alert("Something went wrong, try again!");
              }
          );     
            }});

          $scope.doRefresh = function(){
            query.include("owner");
            query.find({
                success: function(questions) {
                  //$scope.questions =
                  Questions.getQuestions($scope,currentUser,questions,false,false);

              //    $ionicLoading.hide();

                },
                error: function(error) {
                    //$ionicLoading.hide();
                    alert("Error: " + error.code + " " + error.message);
                }});


        };
            // Triggered on a button click, or some other target
        $scope.ask = function () {
          $state.go('ask');
          //$state.transitionTo('ask', {}, {reload: true});                            
        };


            $scope.clicked = function(answer, index, qid){
              var Answers = Parse.Object.extend("Answers");
              var myAnswer = new Answers();
              myAnswer.set("user", currentUser);
                var Questions = Parse.Object.extend("Questions");
                var query = new Parse.Query(Questions);

                query.get(qid,{
                    success: function(question) {
                       myAnswer.set("content", answer);
                       myAnswer.set("question", question);
                       myAnswer.save().then(function() {
                      // question.addUnique("answered", currentUser);
                      //var answeredUsers = question.relation("answeredUsers");
                      //answeredUsers.add(currentUser);
                       var answers = question.relation("answers");
                       answers.add(myAnswer);
                       //question.set("answer", myAnswer);
                       var counter = question.get("counter");
                       counter[answer] = (counter[answer])+1;
                       question.set("counter", counter);
                       question.save();
                       //$scope.no_answer=false;
                       //$state.go('tab.answered');
                       $state.transitionTo('tab.answered', $state.$current.params, {reload: true});
                       $scope.questions.splice(index,1);

                     }, function(error) {
                       // The file either could not be read, or could not be saved to Parse.
                       alert("Error saving your answers, try again please")
                     });
                    },
                    error: function(error) {
                        alert("Error: " + error.code + " " + error.message);
                    }});
                  };

            }else{
               $state.go('public-questions')
            }


    })
    .controller('AskedTabCtrl', function ($scope,$log, $window, $embed, $timeout, $rootScope,$ionicLoading, $cordovaSocialSharing, StoreService, $cordovaCamera,  $ionicActionSheet, $state, Questions) {


        $scope.no_answer=true;
        $scope.commentList = [];
        $scope.data={};
        
      /*  $scope.render = function (elID){
          
       var el = document.getElementById(elID); 
       
        $log.info(el);
        $timeout(function(){
       var x = new EmbedJS({ 
         element: el,
        tweetsEmbed: true });
        x.render();},0);
        
        //$scope.x = x.element.innerHTML;             
        // x.destroy();
        }*/

        $scope.openUrl = function (url) {
            $window.open(url, '_system', 'location=yes');
            return false;
        }
        
        $scope.render = $embed.render;
       
        var isWebView = ionic.Platform.isWebView();
        var isIPad = ionic.Platform.isIPad();
        var isIOS = ionic.Platform.isIOS();
        var isAndroid = ionic.Platform.isAndroid();
        var isWindowsPhone = ionic.Platform.isWindowsPhone();
        
        $scope.isApp = isIOS || isAndroid || isWindowsPhone;
        
        var currentUser = Parse.User.current();
        
         $scope.currentUser = {
          picture: "img/iu.jpg",
          handle: " ",
          name: ""
        }
        //$scope.questions = [];
        var currentUser = Parse.User.current();

        if (currentUser) {

          if (currentUser.get('picture') != null)
            $scope.currentUser.picture = currentUser.get('picture').url();
            $scope.currentUser.handle = currentUser.get('handle');
            $scope.currentUser.name = currentUser.get('firstName');
          
        }
        
       $scope.getProfile = function(){
            $state.go('profile');
        };

        if (currentUser) {
          

          var src = "";
          if (currentUser.get('picture') != null)
            src = currentUser.get('picture').url();
          else
            src = "img/iu.jpg";

          $scope.shareIt = function (qid, qtext) {
            //alert("Sharing!");
            $cordovaSocialSharing.share(qtext, "I have a question for you", null, "http://getq.me/#/questions/" + qid);
          }
            
        $scope.takePicture= function () {


            var options = {
                quality: 50,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.ID_CAP_CAMERA,
                targetWidth: 200,
                targetHeight: 200
            };

            $cordovaCamera.getPicture(options).then(function (imageUri) {
                //alert(imageUri);
                $rootScope.uploaded = true;
                StoreService.setImage(imageUri);
                $state.go('ask');
            }, function (err) {
                    alert("Error: " + err);
                    // error
                });
        };

          $scope.addElement = function (qid) {
               var today = new Date();
               var src ="" ;
               if (currentUser.get('picture') != null)
                      src = currentUser.get('picture').url();
                               else
                            src = "img/iu.jpg";

               var theComment =
                     { imgUrl: src,
                        commentHtml: $scope.data.comment[qid],
                       fullName: currentUser.get('username'),
                       date: today.getTime()
                       };
                      $scope.data.comment[qid]="";
                      
                       var Questions = Parse.Object.extend("Questions");
                       var query = new Parse.Query(Questions);
                        query.get(qid,{
                                success: function(question) {
                                    var Comment = Parse.Object.extend("Comment");
                                    var myComment = new Comment();
                                    myComment.set('user', currentUser);
                                    //myComment.set('imgUrl', theComment.imgUrl);
                                    //myComment.set('fullName', theComment.fullName);
                                    myComment.set('date', theComment.date);
                                    myComment.set('commentHtml', theComment.commentHtml);
                                    myComment.set('parent', question);
                                    myComment.save();
                                
                                },
                                error: function(error) {
                                    alert("Error: " + error.code + " " + error.message);
                                }});
                                
                            $scope.commentList[qid].push (theComment);
               };

            // Setup the loader
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });

            var myQuestions = Parse.Object.extend("Questions");
            var query = new Parse.Query(myQuestions);
            query.equalTo("owner", currentUser);
            query.include("owner");
            query.include("recipient");
            query.find({
                success: function(questions) {
                   Questions.getQuestions($scope,currentUser,questions,false,true);                  
                   // $scope.questions = questions;
                   $ionicLoading.hide();
                },
                error: function(error) {
                    alert("Error: " + error.code + " " + error.message);
                }});

         
            $scope.getUser = function(username){
              var Users = Parse.Object.extend("User");
              var query = new Parse.Query(Users);
              query.equalTo("username", username);
              var user = query.find({
                  success: function(questions) {
                      $ionicLoading.hide();
                      //alert("Successfully retrieved " + questions.length + " questions"+questions[0].get('content'));
                      //$scope.questions = questions;

                      questions.map(function(obj) {

                        var src ="img/iu.jpg"; ;
                        if (obj.get('picture') != null)
                               src = obj.get('picture').url();
                            return {
                              image: src,
                              recpient: obj.get('username')};
                      });
                     // $scope.questions = questions;

                  },
                  error: function(error) {
                    return {
                      image: src,
                      recpient: username}
                  }});
                  return user;
            };         


               $scope.is_positive = function (answer){
                   if (answer=="yes")
                       return true;
                   else if (answer=="no")
                       return false;
               };

    	$scope.doRefresh = function(){
                     var myQuestions = Parse.Object.extend("Questions");
            var query = new Parse.Query(myQuestions);
            query.equalTo("owner", currentUser);
            query.include("owner");
            query.include("recipient");
            query.find({
                success: function(questions) {
                   Questions.getQuestions($scope,currentUser,questions,false,true);
                   // $scope.questions = questions;
                   $ionicLoading.hide();
                },
                error: function(error) {
                    alert("Error: " + error.code + " " + error.message);
                }});
        };

            // Triggered on a button click, or some other target
            $scope.ask = function () {
              $state.go('ask');
            };
        } else{
            $state.go('public-questions');
        }
    })

    .controller('QuestionCtrl', function ($scope, $embed, $http, $stateParams, $ionicUser, toaster, $log, $ionicModal, $cordovaSocialSharing, $ionicPopup, $state, Questions) {
      //
      $scope.data = {};
      
        $scope.render = $embed.render;
        
        var isWebView = ionic.Platform.isWebView();
        var isIPad = ionic.Platform.isIPad();
        var isIOS = ionic.Platform.isIOS();
        var isAndroid = ionic.Platform.isAndroid();
        var isWindowsPhone = ionic.Platform.isWindowsPhone();
        
        $scope.isApp = isIOS || isAndroid || isWindowsPhone;      
        $scope.isWebView = isWebView;
      
      var currentUser = Parse.User.current();
      $scope.logged = false;
      if (currentUser != null)
        $scope.logged = true;
        $ionicModal.fromTemplateUrl('templates/signup.html', {
              scope: $scope,
              animation: 'slide-in-up'
            }).then(function(modal) {
              $scope.modal = modal;              
               //
            }).catch(function(fallback) {
                alert(JSON.stringify(fallback));
            });
              
            $scope.openModal = function() {
              $scope.modal.show();
            };
            $scope.closeModal = function() {
              $scope.modal.hide();
            };
            //Cleanup the modal when we're done with it!
            $scope.$on('$destroy', function() {
              $scope.modal.remove();
            });
            // Execute action on hide modal
            $scope.$on('modal.hidden', function() {
              // Execute action
            });
            // Execute action on remove modal
            $scope.$on('modal.removed', function() {
              // Execute action
            }); 
             //
     
             $scope.sign = function(){
                  if(currentUser==null){         
                    $scope.modal.show();
                }
             }
             //                        
             
               var Questions =  Parse.Object.extend("Questions");                          
                var query = new Parse.Query(Questions);
                query.include("owner");
                        query.get($stateParams.qId,{
                                success: function(question) {
                                 //$log.info("YAY!"+question.id);
                                  var answeredUsers = question.relation("answers");
                                  var rel_query = answeredUsers.query();
                                  
                                 if(currentUser!=null){
                                 question.addUnique("to", currentUser.get("handle"));
                                 question.save();
                                 rel_query.equalTo("user", currentUser);
                                 }/*else{
                                          var user = new Parse.User();    
                                          user.set("username", $ionicUser.generateGUID());
                                          user.set("password", $ionicUser.generateGUID());                        
                                          user.signUp(null, {
                                          success: function (user) {                                                
                                                rel_query.equalTo("user", user);    
                                          },
                                          error: function (user, error) {
                                              handleParseError(error);
                                              // alert("Error: " + error.code + " " + error.message);
                                              var alertPopup = $ionicPopup.alert({
                                                  title: 'Anonymous user',
                                                  template: 'Please try again'
                                              });  // Show the error message somewhere and let the user try again.
                                              //alert("Error: " + error.code + " " + error.message);
                                          }
                                      });                                   
                                 }*/
                                    // 
                                  //rel_query.include("owner");
                                
                                  rel_query.find().then(
                                    function(listOfUsers){
                                      if(listOfUsers.length==0 || (!question.get("is_private") && currentUser==null)){
                                      //  Questions.getComments($scope,question.id);
                                        var sender = question.get('owner');
                                        var src = "img/iu.jpg";
                                        if (sender!=null && sender.get('picture')!=null)
                                          src = (sender.get('picture')).url();                                                  
                                          var image_src = null;
                                          if (question.get('image'))
                                            image_src = (question.get('image')).url();
                    
                                          $scope.question={content: question.get('content'),
                                                type: question.get('type'),
                                                extraInfo: question.get('extra'), 
                                                counter: question.get('counter'),  
                                                title: question.get('title'),                                                
                                                id: question.id,
                                                image_src: image_src,
                                                date: Date.parse(question.createdAt),
                                                is_private: question.get('is_private'),
                                                owner: sender.get('username'),
                                                userImage: src
                                              };
                                              
                                          $scope.$apply();

                                            }else{
                                                var alertPopup = $ionicPopup.alert({
                                                  title: 'You have answered!',
                                                  template: 'Thank you!'
                                              });
                                              $state.go('public-questions');
                                             // toaster.pop('note', "Answered", "You already answered the question. Thank you");
                                            }
                                          }, function(error){
                                              alert("Error:"+error);
                                          }
                                        );                                    
                                     //

                                            //                                                                 
                                    $scope.$apply();                                         
                                },
                                error: function(error) {
                                  alert("We had difficuly retrieving your question");
                                   // alert("Error: " + error.code + " " + error.message);
                                   //alert(JSON.stringify(error));
                    }});                      
                     
                                                         
             //
           
            
             $scope.shareIt  = function(qid,qtext) {
                //alert("Sharing!");
                $cordovaSocialSharing.share(qtext, "I have a question for you", null, "http://getq.me/#/questions/"+qid);
            };

           $scope.clicked = function(answer, index, qid){           
              var Answers = Parse.Object.extend("Answers");
              var myAnswer = new Answers();
              
              if (currentUser != null)// loged in
                myAnswer.set("user", currentUser);    
           /*     else{
                var user = new Parse.User();    
                user.set("username", $ionicUser.generateGUID());
                user.set("password", $ionicUser.generateGUID());                        
                user.signUp(null, {
                success: function (user) {
                 myAnswer.set("user", user);    
                },
                error: function (user, error) {
                    handleParseError(error);
                    // alert("Error: " + error.code + " " + error.message);
                    var alertPopup = $ionicPopup.alert({
                        title: 'Anonymous user',
                        template: 'Please try again'
                    });  // Show the error message somewhere and let the user try again.
                    //alert("Error: " + error.code + " " + error.message);
                }
            });                                                  
                }*/         
                
                var Questions = Parse.Object.extend("Questions");
                var query = new Parse.Query(Questions);
                query.get(qid,{
                    success: function(question) {
                       myAnswer.set("content", answer);
                       myAnswer.set("question", question);
                       myAnswer.save().then(function() {
                      // question.addUnique("answered", currentUser);
                      //var answeredUsers = question.relation("answeredUsers");
                      //answeredUsers.add(currentUser);
                       var answers = question.relation("answers");
                       answers.add(myAnswer);
                       //question.set("answer", myAnswer);
                       var counter = question.get("counter");
                       counter[answer] = (counter[answer])+1;
                       question.set("counter", counter);
                       question.save();
                       //$scope.no_answer=false;
                       if(currentUser!=null){
                       //$state.go('tab.answered');
                       $state.transitionTo('tab.answered', $state.$current.params, {reload: true});
                       //$scope.questions.splice(index,1);
                       }else{
                         toaster.pop('success', "Thank you!", "Join the fun and register");                          
                         $state.go('public-questions');
                          
                       }

                     }, function(error) {
                       // The file either could not be read, or could not be saved to Parse.
                       alert("Error saving your answer, try again please");//+JSON.stringify(error));
                     });
                    },
                    error: function(error) {
                        //alert("Error: " + error.code + " " + error.message);
                        alert("Error saving your answer, try again please");
                    }});
                  ;
           }
             $scope.signup = function () {
            var user = new Parse.User();
            user.set("handle", $scope.data.handle);
            user.set("username", $scope.data.username);
            user.set("password", $scope.data.password);
            user.set("email", $scope.data.username);


            user.signUp(null, {
                success: function (user) {
                    currentUser=user;
                    $scope.closeModal();
                     $scope.logged = true;
                     $scope.$apply();
                },
                error: function (user, error) {
                    handleParseError(error);
                    // alert("Error: " + error.code + " " + error.message);
                    var alertPopup = $ionicPopup.alert({
                        title: 'Signup  failed!',
                        template: 'Please try again'
                    });  // Show the error message somewhere and let the user try again.
                    //alert("Error: " + error.code + " " + error.message);
                }
            });
        }
        $scope.login = function () {
            Parse.User.logIn($scope.data.username, $scope.data.password, {
                success: function (user) {
                    currentUser=user;
                    $scope.logged = true;
                    $scope.$apply();
                    $scope.closeModal();   
                    // Do stuff after successful login.
                },
                error: function (user, error) {
                    // The login failed. Check error to see why.
                    var alertPopup = $ionicPopup.alert({
                        title: 'Login failed!',
                        template: 'Please check your credentials!'
                    });
                }
            });
        }
    })
    .controller('AnsweredCtrl', function ($scope,  $embed, $state, $rootScope, StoreService, $ionicLoading, $cordovaCamera, $cordovaSocialSharing, $ionicActionSheet, Questions) {

        $scope.questions=[];
        $scope.commentList = [];
        
        $scope.render = $embed.render;
          
        var currentUser = Parse.User.current();
        
      
        var isWebView = ionic.Platform.isWebView();
        var isIPad = ionic.Platform.isIPad();
        var isIOS = ionic.Platform.isIOS();
        var isAndroid = ionic.Platform.isAndroid();
        var isWindowsPhone = ionic.Platform.isWindowsPhone();
        
        $scope.isApp = isIOS || isAndroid || isWindowsPhone;

         $scope.currentUser = {
          picture: "img/iu.jpg",
          handle: " ",
          name: ""
        }
        //$scope.questions = [];
        var currentUser = Parse.User.current();

        if (currentUser) {

          if (currentUser.get('picture') != null)
            $scope.currentUser.picture = currentUser.get('picture').url();
            $scope.currentUser.handle = currentUser.get('handle');
            $scope.currentUser.name = currentUser.get('firstName');         
        }
                              
        $scope.getProfile = function(){
            $state.go('profile');
        };

        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        $scope.takePicture= function () {


            var options = {
                quality: 200,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.ID_CAP_CAMERA,
                targetWidth: 200,
                targetHeight: 200
            };

            $cordovaCamera.getPicture(options).then(function (imageUri) {
                //alert(imageUri);
                $rootScope.uploaded = true;
                StoreService.setImage(imageUri);
                $state.go('ask');
            }, function (err) {
                    alert("Error: " + err);
                    // error
                });
        };


        if (currentUser) {
            var myQuestions = Parse.Object.extend("Questions");
            var query = new Parse.Query(myQuestions);
            //query.equalTo("to", currentUser.get("handle"));
            
            query.include("owner");
            query.include("answer");

            query.find({
                success: function(questions) {                  
                 Questions.getQuestions($scope,currentUser,questions,true,false);                 
             $ionicLoading.hide();
            },
                error: function(error) {
                    alert("Error: " + error.code + " " + error.message);
                }});

    	$scope.doRefresh = function(){
            query.find({
                success: function(questions) {
                  Questions.getQuestions($scope,currentUser,questions,true,false);
                  //$ionicLoading.hide();
                   //$scope.questions = questions;

                },
                error: function(error) {
                    alert("Error: " + error.code + " " + error.message);
                }});
        };
        $scope.data = {};
        $scope.commentList = [];
        $scope.addElement = function (qid) {

               var today = new Date();
               var src ="" ;
               if (currentUser.get('picture') != null)
                      src = currentUser.get('picture').url();
                               else
                            src = "img/iu.jpg";

               var theComment =
                     { imgUrl: src,
                       commentHtml: $scope.data.comment[qid],
                       fullName: currentUser.get('username'),
                       date: today.getTime()
                       };
                      $scope.data.comment[qid]="";
                       var Questions = Parse.Object.extend("Questions");
                       var query = new Parse.Query(Questions);
                        query.get(qid,{
                                success: function(question) {
                                    var Comment = Parse.Object.extend("Comment");
                                    var myComment = new Comment();
                                    myComment.set('user', currentUser);
                                    //myComment.set('imgUrl', theComment.imgUrl);
                                    //myComment.set('fullName', theComment.fullName);
                                    myComment.set('date', theComment.date);
                                    myComment.set('commentHtml', theComment.commentHtml);
                                    myComment.set('parent', question);
                                    myComment.save();
                                   
                                },
                                error: function(error) {
                                    alert("Error: " + error.code + " " + error.message);
                                }});

                                    $scope.commentList[qid].push (theComment);
               };
               
            // Triggered on a button click, or some other target
            $scope.shareIt  = function(qid,qtext) {
               // alert("Sharing!");
                $cordovaSocialSharing.share(qtext, "I have a question for you", null, "http://getq.me/#/questions/"+qid);
            }

            $scope.ask = function () {
              $state.go('ask');

            }
        } else{
            $state.go('public-questions');
        }

    });
