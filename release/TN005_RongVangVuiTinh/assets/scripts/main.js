/**
 * Created by hwngvnd on 7/11/15.
 */

typeof(TVUB) === 'undefined' ? TVUB = {} : '';

(function () {
    var Game = IGame.core;

    var g = new Game({
        container: '#container',
        baseUrl: 'assets/',
        states: [{
            name: 'Boot',
            state: TVUB.Boot
        }, {
            name: 'Preload',
            state: TVUB.Preload
        }, {
            name: 'Home',
            state: TVUB.Home
        }, {
            name: 'Game',
            state: TVUB.Game
        }, {
            name: 'End',
            state: TVUB.End
        }],
        message: {
            rule: ''
        },
        sound: true,
        autoLoad: true,
        ready: function (game) {
            var data = {
                "title": "Em hãy giúp ngựa con nối các từ trong ô trống ở cột bên trái với ô trống ở cột bên phải để được một câu đúng và phì hợp. Nếu sai quá 3 lần bài thi sẽ dừng lại.",
                "deception": "Em hãy giúp ngựa con nối các từ trong ô trống ở cột bên trái với ô trống ở cột bên phải để được một câu đúng và phì hợp. Nếu sai quá 3 lần bài thi sẽ dừng lại.",
                "time": 1200,
                "time_left":900,
                "play": 10,
                "score":0,
                "game_id": 4,
                "addScore":10,
                "life":3,
                "count_win":10,
                "game_name": "Hổ con",
                "content" : [
                        {
                            type:'text',
                            content:["32x6","1x2","34x77","x"]
                        },
                        {
                            type:'text',
                            content:["1x1","11x","x22","*"]
                        },
                        {
                            type:'text',
                            content:["2x2","22x","x33","x"]
                        },
                        {
                            type:'text',
                            content:["3x3","33x","x44","x"]
                        },
                        {
                            type:'text',
                            content:["4x4","44x","x55","x"]
                        },
                        {
                            type:'text',
                            content:["5x5","55x","x66","x"]
                        },
                        {
                            type:'text',
                            content:["6x6","66x","x77","x"]
                        },
                        {
                            type:'text',
                            content:["7x7","77x","x88","x"]
                        },
                        {
                            type:'text',
                            content:["8x8","88x","x99","x"]
                        },
                        {
                            type:'text',
                            content:["9x9","99x","x00","x"]
                        }
                ]
            };

            game.setGameData(data);

            //thong tin ca nhan
            if (typeof userInfo !== 'undefined') {
                game.provide('user', userInfo);
            }

            game.provide('submitAnswer', function (callback, data) {
                console.log(data);
                if(typeof callback === 'function'){
                    callback(true);
                }
            });

            game.provide('onOverGame', function (setEnd, score, timeLeft) {
                console.log("score: " + score + " timeLeft: " + timeLeft);
                if(typeof setEnd === 'function'){
                    setEnd(score, timeLeft);
                }
            });

            game.on('state', function (data) {
                if (data.state === 'End') {
                    data.button.hide = false;
                    data.button.callback = function (options) {
                        console.log('callback', options);
                    }
                }
            });

            game.on('setData', function (data) {
                console.log(data);
            });

            game.on('click.startGame', function () {
                game.goState('Game');
            });

            game.on('error', function (data) {
                console.log(data);
            });

            game.on('click.endGame', function (data) {
                console.log(data);
            });

            game.off('boot');
        }
    });
})();