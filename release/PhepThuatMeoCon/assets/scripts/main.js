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
            rule: 'Hãy giúp Mèo con chọn cặp đôi giống nhau!'
        },
        sound: true,
        autoLoad: true,
        ready: function (game) {
            var data = {
                "title": "Chọn các cặp bằng nhau",
                "time": 1200,
                "play": 10,
                "game_id": 4,
                "game_name": "Mèo con",
                "content": [
                    {
                        "question": [
                            "7 + 1",
                            "8"
                        ]
                    },
                    {
                        "question": [
                            "10 + 7",
                            "7 + 10"
                        ]
                    },
                    {
                        "question": [
                            "11 + 7 + 1",
                            "19"
                        ]
                    },
                    {
                        "question": [
                            "12 + 8",
                            "20"
                        ]
                    },
                    {
                        "question": [
                            "13",
                            "13"
                        ]
                    },
                    {
                        "question": [
                            "69",
                            "69 + 0"
                        ]
                    },
                    {
                        "question": [
                            "8 - 2",
                            "4 + 2"
                        ]
                    },
                    {
                        "question": [
                            "9 - 2",
                            "5 + 2"
                        ]
                    },
                    {
                        "question": [
                            "Mèo",
                            "{img:assets/images/2.png}"
                        ]
                    },
                    {
                        "question": [
                            "Chim",
                            "{img:assets/images/4.png}"
                        ]
                    }
                ]
            };

            game.setGameData(data);

            //thong tin ca nhan
            if (typeof userInfo !== 'undefined') {
                game.provide('user', userInfo);
            }

            game.provide('submitAnswer', function (callback, answer1, answer2) {
                var result = false;
                console.log(answer1, answer2);
                if(answer1.index === answer2.index){
                    result = true;
                }

                if(typeof callback === 'function'){
                    callback(result);
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