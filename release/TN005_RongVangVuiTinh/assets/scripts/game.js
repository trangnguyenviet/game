/**
 * Created by hwngvnd on 7/11/15.
 */

typeof(TVUB) === 'undefined' ? TVUB = {} : '';

TVUB.Game = function (game) {
    /*
     *   _game: game api
     * */
    var _game = game,
        _gameOptions;

    _gameOptions = _game.options;

    //PRELOAD
    this.initState = function () {
    };

    this.initState.prototype = {
        create: function () {
            var gameData = _game.gameData;
            _this = this;

            //check data
            if (!gameData.content || gameData.content.length === 0) {
                _game.triggerEventListener('error', {
                    action: 'NoData',
                    message: 'Không có dữ liệu!'
                });
                return false;
            }
            this.bg = this.add.image(0, 0, 'background');
            this.bg.width = _game.aw;
            this.bg.height = _game.ah;

            _game.hideLoading();
            _game.createUserInfo.apply(this, [this.getTextureAtlas("bgAvatar"), this.getTextureAtlas('avatar')]);

            this.initGame();
        },

        preload: function () {
            _game.sounds.play('transition');
            _game.state = {
                state: _game.stateList.GAME,
                ref: this
            };

            for (var i = 0; i < _game.gameData.content.length; i++) {
                var quest = _game.gameData.content[i];
                for (var j = 0; j < quest.length; j++) {
                    var mcCross = quest[j];
                    if (mcCross.type === 'image') {
                        this.load.image(mcCross.content, mcCross.content);
                    }
                }
            }

        },

        createPlayer: function (arrName, arrSate) {
            var arr = [];

            var mayBay = this.getTextureAtlas("maybay");
            mayBay.x = -150;
            mayBay.y = 40;

            for (var i = 0; i < arrName.length; i++) {
                arr.push({
                    image: this.getTextureAtlas(arrName[i]),
                    animation: arrSate[i]
                })
            }

            var tiger = _game.createAtlasObject.apply(this, [arr]);
            tiger.x = 190;
            tiger.y = _game.hh + 70;

            tiger.addAt(mayBay, 0);
            return tiger;
        },

        startTimer: function () {
            this.timerGroup = this.game.add.group();
            this.timerGroup.x = _game.hw + 50;
            this.timerGroup.y = -100;
            this.timerText = this.add.text(0, 0, "00:00", {
                font: "40px Arial",
                fill: "#000",
                align: 'center',
                stroke: '#F2F2F2',
                strokeThickness: 4,
                wordWrapWidth: 200,
                wordWrap: true
            });

            this.timerText.anchor.set(0.5);
            this.timerText.x = 70;
            this.timerText.y = 34;
            this.timerGroup.add(this.timerText);
            this.game.add.tween(this.timerGroup).to({y: 10}, 500, Phaser.Easing.Back.Out, true);
            this.timer = setInterval(function () {
                _this.updateTimer();
            }, Phaser.Timer.SECOND);
        },

        updateTimer: function () {
            this.timmeLeft -= 1;
            var sec_num = parseInt(this.timmeLeft, 10); // don't forget the second param
            if (sec_num > 0) {
                var hours = Math.floor(sec_num / 3600);
                var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
                var seconds = sec_num - (hours * 3600) - (minutes * 60);

                if (minutes < 10) {
                    minutes = "0" + minutes;
                }
                if (seconds < 10) {
                    seconds = "0" + seconds;
                }
                this.timerText.setText(minutes + ':' + seconds);
            } else {
                clearInterval(this.timer);
                this.finishGame();
            }
        },

        getTextureAtlas: function (name) {
            var sprite = this.add.sprite(0, 0, 'game_atlas');
            sprite.frameName = name;
            return sprite;
        },

        destroyGroup: function (group) {
            if (group && group.destroy) {
                group.destroy();
            }
        },

        hanlerOverButton: function (button) {
            this.game.add.tween(button.scale).to({x: 1.1, y: 1.1}, 500, Phaser.Easing.Linear.None, true);
        },

        hanlerOutButton: function (button) {
            this.game.add.tween(button.scale).to({x: 1, y: 1}, 500, Phaser.Easing.Linear.None, true);
        },

        finishGame: function () {
            _game.onOverGame(this.setEnd, this.score, this.timmeLeft);

        },

        setEnd: function (score, time_left) {
            _game.sounds.play('transition');

            _game.gameData.score = score;
            _game.gameData.time_left = time_left;

            $('#answer-txt').remove();
            clearTimeout(this.timeout);
            clearTimeout(this.timeoutEndGame);
            clearTimeout(this.timer);
            this.timeoutEndGame = setTimeout(function () {
                _this.game.state.start('End');
            }, 300);
        },

        //==============================================================================================================
        //==============================================================================================================
        //==============================================================================================================

        initGame: function () {
            this.space = 5;
            this.life = _game.gameData.life || 3;
            this.addScore = _game.gameData.addScore || 10;
            this.timmeLeft = _game.gameData.time_left;
            this.totalTime = _game.gameData.time;
            this.score = _game.gameData.score;
            var countAnswer = _game.gameData.count_win;
            this.curQuest = _game.gameData.content.length - countAnswer;
            this.isAnswer = false;
            this.curSelect = null;
            this.vtGroup = null;

            this.showStateObject("idle");
            this.createBackground();
            this.playQuest(this.curQuest);
            this.startTimer();
            this.initButtonNextQuest();

            this.game.input.keyboard.addCallbacks(this, null, null, this.keyPress.bind(this));
        },

        keyPress: function (char) {
            if (!this.curSelect) return;

            if (this.curSelect.isNumber) {
                if (char >= 0 || char <= 9) {
                    this.curSelect.content.text = char;
                }
            } else {
                if (char === "+" || char === "-" || char === "*" || char === "/") {
                    this.curSelect.content.text = char;
                }
            }

        },

        initButtonNextQuest: function () {
            this.btnNextQuest = this.getTextureAtlas("btnNopBai");
            this.btnNextQuest.x = _game.hw + 300;
            this.btnNextQuest.y = _game.hh + 250;
            this.btnNextQuest.anchor.set(0.5);
            this.btnNextQuest.inputEnabled = true;
            this.btnNextQuest.input.pixelPerfectClick = true;
            this.btnNextQuest.input.useHandCursor = true;
            this.btnNextQuest.events.onInputDown.add(this.onNextQuest, this);
            this.btnNextQuest.events.onInputOver.add(this.hanlerOverButton, this);
            this.btnNextQuest.events.onInputOut.add(this.hanlerOutButton, this);
        },

        createBackground: function () {
            var bg = this.getTextureAtlas("bg_game");
            bg.x = 370;
            bg.y = 130;
        },

        showStateObject: function (state) {
            if (this.player && this.player.destroy) {
                this.player.destroy();
            }
            switch (state) {
                case "idle":
                    this.player = this.createPlayer(["bt_phai", "bt_than", "bt_dau", "bt_trai"], [0, 0, 1, 0]);
                    break;
                case "bad":
                    this.player = this.createPlayer(["b_phai", "b_than", "b_dau", "b_trai"], [0, 0, 1, 0]);
                    break;
                case "happy":
                    this.player = this.createPlayer(["v_trai", "v_phai", "v_than", "v_dau"], [0, 0, 0, 1]);
                    break;
            }
        },

        playQuest: function (questIndex) {
            var arrQuest = _game.gameData.content[questIndex].content;
            if (this.vtGroup)  this.vtGroup.destroy();
            this.vtGroup = _this.game.add.group();
            var spaceKQ = 20;
            var maxCross = 0;
            var mcCross = null;
            for (var i = 0; i < arrQuest.length - 1; i++) {
                var strNum = arrQuest[i];
                maxCross = (strNum.length > maxCross) ? strNum.length : maxCross;
                for (var key = strNum.length - 1; key >= 0; key--) {
                    mcCross = this.createCross(strNum[key], i, this.onHanlerClickCross);
                    mcCross.x = -(strNum.length - 1 - key) * (mcCross.width + this.space);
                    if (i === arrQuest.length - 2) {
                        mcCross.y = i * (mcCross.height + this.space) + spaceKQ;
                    } else {
                        mcCross.y = i * (mcCross.height + this.space);
                    }
                    this.game.add.tween(mcCross).from({y: mcCross.y - 100}, 250 * (i + key + 1), Phaser.Easing.Back.Out, true);
                    this.vtGroup.add(mcCross);
                }
            }

            this.vtGroup.x = 720;
            this.vtGroup.y = 200;

            var mcLine = this.getTextureAtlas("line");
            mcLine.width = (mcCross.width + this.space) * maxCross;
            mcLine.x = this.vtGroup.x + mcCross.width - mcLine.width;
            mcLine.y = this.vtGroup.y + 135;

            var cal = this.createCrossCal(arrQuest[arrQuest.length - 1], arrQuest.length - 1, this.onHanlerClickCrossCal);
            cal.x = -mcLine.width - 30;
            cal.y = mcCross.height + this.space / 2 - cal.height / 2;
            this.game.add.tween(cal).from({y: cal.y - 100}, 250 * (5), Phaser.Easing.Back.Out, true);
            this.vtGroup.add(cal);
        },

        createCrossCal: function (s, idx, func) {
            var crossGroup = _this.game.add.group();
            var bg = this.getTextureAtlas("bgCross3");
            var bg_select = this.getTextureAtlas("bgCross4");
            var str = (s !== "x") ? s : " ";
            var content = _this.game.add.text(0, 0, str, {
                font: "24px Arial",
                fill: "#000000",
                align: 'center',
                stroke: '#FFFFFF',
                strokeThickness: 4,
                wordWrapWidth: 240,
                wordWrap: true
            });
            content.setShadow(3, 3, 'rgba(0,0,0,0.1)', 5);
            content.lineSpacing = -10;
            bg_select.alpha = 0;
            bg.bg_select = bg_select;
            bg.content = content;
            bg.isNumber = false;
            bg.idx = idx;

            crossGroup.content = content;
            crossGroup.idx = idx;
            this.updateContentPosition(bg, content);
            crossGroup.add(bg);
            crossGroup.add(bg_select);
            crossGroup.add(content);

            if (str === " ") {
                bg.inputEnabled = true;
                bg.input.useHandCursor = true;
                bg.events.onInputDown.add(func, _this);
            }

            return crossGroup;
        },

        createCross: function (s, idx, func) {
            var crossGroup = _this.game.add.group();
            var bg = this.getTextureAtlas("bgCross1");
            var bg_select = this.getTextureAtlas("bgCross2");
            var str = (s !== "x") ? s : " ";
            var content = _this.game.add.text(0, 0, str, {
                font: "24px Arial",
                fill: "#000000",
                align: 'center',
                stroke: '#FFFFFF',
                strokeThickness: 4,
                wordWrapWidth: 240,
                wordWrap: true
            });
            content.setShadow(3, 3, 'rgba(0,0,0,0.1)', 5);
            content.lineSpacing = -10;
            bg_select.alpha = 0;
            bg.bg_select = bg_select;
            bg.content = content;
            bg.isNumber = true;
            bg.idx = idx;

            crossGroup.content = content;
            crossGroup.idx = idx;

            this.updateContentPosition(bg, content);
            crossGroup.add(bg);
            crossGroup.add(bg_select);
            crossGroup.add(content);

            if (str === " ") {
                bg.inputEnabled = true;
                bg.input.useHandCursor = true;
                bg.events.onInputDown.add(func, _this);
            }

            return crossGroup;
        },

        updateContentPosition: function (bg, content) {
            content.x = bg.x + bg.width / 2 - content.width / 2;
            content.y = bg.y + bg.height / 2 - content.height / 2 + 5;
        },

        onHanlerClickCrossCal: function (selected) {
            if (this.curSelect) {
                this.curSelect.bg_select.alpha = 0;
                this.curSelect.alpha = 1;
            }
            selected.bg_select.alpha = 1;
            selected.alpha = 0;

            this.curSelect = selected;
        },

        onHanlerClickCross: function (selected) {
            if (this.curSelect) {
                this.curSelect.bg_select.alpha = 0;
                this.curSelect.alpha = 1;
            }
            selected.bg_select.alpha = 1;
            selected.alpha = 0;
            _game.sounds.play('click');
            this.curSelect = selected;
        },

        onNextQuest: function () {
            if (this.isAnswer) return;
            _game.sounds.play('click');
            var arrQuest = [];
            this.btnNextQuest.inputEnabled = false;
            this.btnNextQuest.input.pixelPerfectClick = false;
            this.btnNextQuest.input.useHandCursor = false;
            arrQuest[0] = [];
            arrQuest[1] = [];
            arrQuest[2] = [];
            arrQuest[3] = [];

            for (var i = 0; i < this.vtGroup.children.length; i++) {
                var a = this.vtGroup.children[i];
                arrQuest[a.idx].unshift(a.content.text);
            }

            var results = [];
            for (var i = 0; i < arrQuest.length; i++) {
                var s = arrQuest[i].toString();
                s = s.replaceAll(" ", "x");
                s = s.replaceAll(",", "");
                results.push(s);
            }
            _game.submitAnswer(this.reponseAnswer.bind(this), results);
        },

        reponseAnswer: function (result) {
            this.showAnswer(result);
            if (result) {
                this.score += this.addScore;
                _game.updateScore.apply(this, [this.score]);
                _game.sounds.play('answerOk');
            } else {
                _game.sounds.play('answerFail');
                this.life--;
            }

            this.timeout = setTimeout(function () {
                if (this.life <= 0) {
                    this.finishGame();
                    return;
                }
                this.curQuest++;
                if (this.curQuest < _game.gameData.content.length) {
                    this.isAnswer = false;
                    this.btnNextQuest.inputEnabled = true;
                    this.btnNextQuest.input.pixelPerfectClick = true;
                    this.btnNextQuest.input.useHandCursor = true;
                    this.playQuest(this.curQuest);
                } else {
                    this.finishGame();
                }
            }.bind(this), 2000);
        },

        showAnswer: function (isOk) {
            if (this.dropText && this.dropText.destroy) this.dropText.destroy();
            this.dropText = (isOk) ? this.getTextureAtlas("txtYes") : this.getTextureAtlas("txtNo");
            this.dropText.anchor.set(0.5);
            this.dropText.x = 320;
            this.dropText.y = _game.hh;
            this.game.add.tween(this.dropText).to({y: _game.hh + 100}, 300, Phaser.Easing.Back.Out, true);

            var state = (isOk) ? "happy" : "bad";
            this.showStateObject(state);
            this.timeout = setTimeout(function () {
                this.showStateObject("idle");
                if (this.dropText && this.dropText.destroy) this.dropText.destroy();
            }.bind(this), 2000);
        },


    };
};

String.prototype.replaceAll = function (str1, str2, ignore) {
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, "\\$&"), (ignore ? "gi" : "g")), (typeof(str2) == "string") ? str2.replace(/\$/g, "$$$$") : str2);
}
