var express = require('express'),
    app = express()
    , http = require('http')
    , server = http.createServer(app)
    , io = require('socket.io').listen(server);

var Parse = require('parse/node').Parse;
var currentUser = null;
Parse.initialize("JA5Ysrjkw0k6QoTFobJ0asUiXFVcc6rSsbYBAvvy", "9xyB7idyhuouEpyzSfoPN5cHY444CtPukfKFWl3g");
Parse.User.enableRevocableSession();
function handleParseError(err) {
    switch (err.code) {
        case Parse.Error.INVALID_SESSION_TOKEN:
            Parse.User.logOut();
            break;
    }
}

/*Parse.User.logIn("qmebot@qmeapp.com", "123", {
                success: function (user) {
                    currentUser=user;  
                    // Do stuff after successful login.
                },
                error: function (user, error) {
                    // The login failed. Check error to see why.
                    var alertPopup = $ionicPopup.alert({
                        title: 'Login failed!',
                        template: 'Please check your credentials!'
                    });
                }
            });*/
var sockets = io;
//server.listen("3000");

var all_messages = []; //stores all the messages from all the users

var Twit = require('twit');

var T = new Twit({
    consumer_key: 'JiVfeV5eu3tkDQFH35Ss2OCJJ'
    , consumer_secret: 'chIDuLSxr8P8zdbHX3v9lNFs6r0HnuSEEZIusLXt82ma5Ku4rW'
    , access_token: '4557194247-Cl2iYJNoOpWn2sS40kZjuckT6hkds82FAa89YQd'
    , access_token_secret: 'M882iixDLvHlNYhpffxYsHrUh6gf2KeSPAP53q8TirkkJ'
});

var createQuestion = function (currentUser, tweet) {
    //--
    var counter = {};
    counter["yes"] = 0;
    counter["no"] = 0;
    var Questions = Parse.Object.extend("Questions");
    var myQuestion = new Questions();
    var url = 'https://twitter.com/' + tweet.user.screen_name + '/status/' + tweet.id_str;
    myQuestion.set("owner", currentUser);
    myQuestion.addUnique("content", url);                                          
    // myQuestion.set("to",""uniqueIds"");
    myQuestion.set("extra", "What do you think?");
    // myQuestion.set("title", $scope.data.title);
    //myQuestion.addUnique("answered");
    myQuestion.set("type", "yes/no");
    myQuestion.set("is_private", false);
    myQuestion.set("counter", counter);
    //myQuestion.set("answer","");
    //  myQuestion.save();           
    // Execute any logic that should take place after the object is saved.
    myQuestion.save(null, {
        success: function (question) {
            var retweetBody = '@' + tweet.user.screen_name + ' use this @qme_app link to get the answer  ' + "http://getq.me/#/questions/" + question.id + ' #yes_or_no ';
           /* T.post('statuses/update', { status: retweetBody }, function (err, response) {
                if (response) {
                    console.log('Quote Tweeted Tweet ID: ' + tweet.id_str);
                }
                if (err) {
                    console.log('Quote Tweet Error: ', err);
                }
            });*/
        },
        error: function (gameScore, error) {
            // Execute any logic that should take place if the save fails.
            // error is a Parse.Error with an error code and message.
            console.log('Failed to create new object, with error code: ' + error.message);
        }
    });

}
var retweetRecent = function () {
    T.get('search/tweets', { q: "#yesorno OR 'yes or no'" , lang: "en", result_type: "recent" }, function (err, data, response) {
        if (!err) {
            var tweet = data.statuses[0];
            if ((tweet.text).indexOf("@qme_app") == -1) {

                var request = require("request");
                request({ url: 'https://randomuser.me/api/', dataType: 'json' }, function (error, response, body) {
                    console.log("Here!");
                    //console.log(JSON.parse(body).results[0]);
                    // console.log(response);              
                    var fields = JSON.parse(body).results[0].user;
                    delete fields['password'];
                    delete fields['salt'];
                    delete fields['md5'];
                    delete fields['sha1'];
                    delete fields['sha256'];
                    delete fields['registered'];
                    delete fields['dob'];
                    delete fields['HETU'];
                    delete fields['INSEE'];
                    delete fields['phone'];
                    delete fields['cell']
                    delete fields['version'];
                    var random_user = {
                        username: fields.username,
                        email: fields.email,
                        password: "password",
                        profile: fields
                    }
                   // console.log(user.profile.name.first);
                    //SIGN IN THE USER
                   
                       var user = new Parse.User();
                        user.set("username", random_user.email);
                        user.set("fistName", random_user.profile.name.first);
                        user.set("lastName", random_user.profile.name.last);
                        user.set("password", "123");
                        user.set("handle", random_user.username);
                        user.set("email", random_user.email);

                        user.signUp(null, {
                            success: function (user) {                                
                                createQuestion(user, tweet);
                                console.log("question created: "+tweet);
                            },
                            error: function (user, error) {
                                console.error(error);
                                //alert("Error: " + error.code + " " + error.message);
                            }
                        });
                                                             
                    //
                    
                }).on('error', function (e) {
                    console.error(e);
                    console.log(e);
                });
            }                
            //            
            //
            
            //--                       
           
        } else {
            console.log('Search Error: ', err);
        }
    });
}



retweetRecent();
setInterval(retweetRecent, 2000000);

io.on('connection', function (socket) {
    //console.log(all_messages);    
    // socket.emit('news', { hello: 'world' });
    socket.on('ACK', function (user) {
        //  console.log(all_messages);   
        var user_messages = all_messages[user.id];
        user_messages.splice(user.msg_idx, 1);
        all_messages[user.id] = user_messages;

    });
    socket.on('message', function (msg) {       
        //  console.log(msg);
        var user_messages = all_messages[msg.id];
        if (!user_messages) { //exists
            user_messages = new Array();
        }
        user_messages.push(msg);
        all_messages[msg.id] = user_messages;
        user_messages.forEach(function (msg, idx, arr) {
            //  console.log("Emitting!")
            // console.log(msg);
            socket.broadcast.emit(msg.id, { id: msg.id, title: msg.title, from: msg.from, idx: idx });
            //console.log(JSON.stringify(all_messages));
        }, this);

    });

});

app.use(express.static('www'));

// CORS (Cross-Origin Resource Sharing) headers to support Cross-site HTTP requests
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

// API Routes
// app.get('/blah', routeHandler);

app.set('port', process.env.PORT || 5000);

server.listen(app.get('port'), function () {
    //    console.log('Express server listening on port ' + app.get('port'));
});