angular.module('starter.services', [])
.directive('question', function() {
  return {        
    compile: function(tElem,attrs) {
      var attr_name = attrs.name;
      return function(scope,elem,attrs) {
        //var x = new EmbedJS({ element: elem});       
       // scope.render(elem[0].parentElement.children[0].children[0]);
      // var uls = elem[0].parentElement.children[0].children[0];
      scope.render(attr_name);
    
       // x.render();  
        //linking function here
      };
    }
  };
})
.service("$embed", ["$timeout", function($timeout){
  return {
    render: function (elID){
          
       var el = document.getElementById(elID); 
       
        //$log.info(el);
        $timeout(function(){
       var x = new EmbedJS({ 
         element: el,         
        tweetsEmbed: true,
         linkOptions        : {
         target             : '_blank'
        },
        marked: true });
        x.render();},0);
        
        //$scope.x = x.element.innerHTML;             
      
        }
  }
}])
    .service('LoginService', function($q) {
      return {
        loginUser: function(name, pw) {
          var deferred = $q.defer();
          var promise = deferred.promise;

          if (name == 'user' && pw == 'secret') {
            deferred.resolve('Welcome ' + name + '!');
          } else {
            deferred.reject('Wrong credentials.');
          }
          promise.success = function(fn) {
            promise.then(fn);
            return promise;
          }
          promise.error = function(fn) {
            promise.then(null, fn);
            return promise;
          }
          return promise;
        }
      }
    })
  .factory('socket', function ($rootScope) {
  var socket = io.connect("https://qme-dev.herokuapp.com");      
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
})
.factory('StoreService', function() {
    var storeService = {};

    storeService.image = "";
    storeService.setImage = function (value) {
       storeService.image = value;
    };

    return storeService;
}).factory('Questions',  ['$q', '$log', '$state', function($q, $log, $state){
    var getComments = function ($scope,question){
        var myComments = Parse.Object.extend("Comment");
        var query = new Parse.Query(myComments);
        query.equalTo("parent", question);
        query.include("user");
        query.find({
                success:
                    function(comments) {
                    var jc = comments.map(function(obj) {
                        var user = obj.get('user');
                        var src="img/iu.jpg";
                        if (user!=null && user.get('picture')!=null){
                           src = user.get('picture').url();
                         }
                       return {imgUrl: src, fullName: user.get('handle'), id: user.id,
                               date: obj.get('createdAt'), commentHtml: obj.get('commentHtml')};
                        });
                          $scope.commentList[question.id] = jc ;
                    },
                    error: function(error) {
                        //no comment
                        $scope.commentList=[];
                    }});

        };
    var  getQuestions = function($scope,currentUser,questions,areAnswered,all) {
        
        //var deferred = $q.defer();
        //var promise = deferred.promise;
           //var qs=[];
           $scope.questions=[];
           //$log.info("here"+questions.length);
            angular.forEach(questions, function(obj) {
               var answeredUsers = obj.relation("answers");
               var rel_query = answeredUsers.query();
               rel_query.include("user");
               rel_query.equalTo("user", currentUser);               
               rel_query.find().then(
                 function(listOfUsers){
                     //$log.info("here!!"+listOfUsers.length);
                   if(all || (!areAnswered &&listOfUsers.length==0)||
                      (areAnswered &&listOfUsers.length>0)){
                      
                     getComments($scope,obj);
                     var sender = obj.get('owner');
                     var src = "img/iu.jpg";
                     if (sender!=null && sender.get('picture')!=null)
                       src = (sender.get('picture')).url();                                                  
                       var image_src = null;
                       if (obj.get('image'))
                         image_src = (obj.get('image')).url();

                      $scope.questions.push({content: obj.get('content'),                            
                             type: obj.get('type'),
                             extraInfo: obj.get('extra'),
                             timestamp: obj.get('createdAt')/1000,
                             counter: obj.get('counter'),
                             id: obj.id,
                             image_src: image_src,
                             title: obj.get("title"),
                             date: Date.parse(obj.createdAt),
                             owner: sender.get('handle'),
                             userImage: src
                           });
                      $scope.$digest();

                   }else{
                     $log.info(areAnswered+ "damn, here!"+listOfUsers.length);
                   }
                 }, function(error){
                    alert("Error:"+error);
                    $state.go('login');
                 }
               );
          }
        );
         //deferred.resolve(qs);
         //return deferred.promise;
        //return qs;
    };
      return {
        getComments: getComments,
        getQuestions: getQuestions
    }}])
.factory('Camera', ['$q', function($q) {

  return {
    getPicture: function(options) {
      var q = $q.defer();

      navigator.camera.getPicture(function(result) {
        // Do any magic you need
        q.resolve(result);
      }, function(err) {
        q.reject(err);
      }, options);

      return q.promise;
    }
  }
}]);
