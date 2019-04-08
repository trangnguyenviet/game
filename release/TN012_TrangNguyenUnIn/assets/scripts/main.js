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
                "vPoint":5,
                "vQuest":"Câu hỏi hàng dọc: Đây là từ chỉ ngày mà học sinh mong đợi sau ba tháng hè.",
                "content" : [
                    {
                        type:'text',
                        content:"Hàng ngang thứ 1: Đây là từ chỉ dụng cụ học tập của học sinh dùng để vạch ra những đường thẳng.",
                        num:6,
                        start:0
                    },
                    {
                        type:'text',
                        content:"Hàng ngang thứ 2: Đây là từ chỉ tên gọi khác của loài hoa phượng vĩ mà học trò thường gọi.",
                        num:6,
                        start:5
                    },
                    {
                        type:'text',
                        content:"Hàng ngang thứ 3: Đây là từ chỉ khoảng thời gian nghỉ giải lao giữa các tiết học.",
                        num:6,
                        start:4
                    },
                    {
                        type:'text',
                        content:"Hàng ngang thứ 4: Đây là hành động của giáo viên giúp học sinh hiểu bài trên lớp.",
                        num:8,
                        start:4
                    },
                    {
                        type:'text',
                        content:"Hàng ngang thứ 5: Đây là từ chỉ người phụ nữ đứng trên bục giảng, giảng bài cho học sinh.",
                        num:6,
                        start:3
                    },
                    {
                        type:'text',
                        content:"Hàng ngang thứ 6: Đây là từ chỉ tài liệu mà thầy, cô giáo chuẩn bị trước khi đến lớp.",
                        num:6,
                        start:4
                    },
                    {
                        type:'text',
                        content:"Hàng ngang thứ 7: đây là từ chỉ sự vật có trong lớp học mà các giáo viên lấy phấn viết lên để học sinh nhìn rõ bài học.",
                        num:7,
                        start:4
                    },
                    {
                        type:'text',
                        content:"Hàng ngang thứ 8: Đây là từ chỉ hành động của học sinh khi cô giáo đang giảng bài.",
                        num:8,
                        start:1
                    },
                    {
                        type:'text',
                        content:"Hàng ngang thứ 9: Đây là từ chỉ nơi học tập của sinh viên đại học.",
                        num:10,
                        start:5
                    },
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
                    callback([1,0,0,1,1,1,0,0,0,0]);
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