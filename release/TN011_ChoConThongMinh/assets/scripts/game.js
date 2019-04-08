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
            _game.createUserInfo.apply(this, [this.getTextureAtlas("bgAvatar"), this.getTextureAtlas('avatar'), 500]);

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
            for (var i = 0; i < arrName.length; i++) {
                arr.push({
                    image: this.getTextureAtlas(arrName[i]),
                    animation: arrSate[i]
                })
            }

            var tiger = _game.createAtlasObject.apply(this, [arr]);
            tiger.x = 200;
            tiger.y = _game.hh + 80;
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
             this.timerText.x = -100;
             this.timerText.y = 550;
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
            this.score =  _game.gameData.score;
            this.countAnswer =  _game.gameData.count_win;
            this.curQuest = _game.gameData.content.length -this.countAnswer;
            this.isAnswer = false;
            this.curSelect = null;

            this.img_bog = this.getTextureAtlas("img_bong_cho");
            this.img_bog.x = 160;
            this.img_bog.y = 460;

            this.showStateObject("idle");
            this.playQuest(this.curQuest);
             this.startTimer();

        },



        showStateObject: function (state) {
            if (this.player && this.player.destroy) {
                this.player.destroy();
            }
            switch (state) {
                case "idle":
                    this.player = this.createPlayer(["bt_trai", "bt_phai", "bt_than", "bt_dau", "bt_bong"], [0, 0, 0, 1, 0]);
                    break;
                case "bad":
                    this.player = this.createPlayer(["b_trai", "b_phai", "b_than", "b_dau", "b_bong"], [0, 0, 0, 1, 0]);
                    break;
                case "happy":
                    this.player = this.createPlayer(["v_trai", "v_phai", "v_than", "v_dau", "v_bong"], [0, 0, 0, 1, 0]);
                    break;
            }
        },

        playQuest: function (questIndex) {
            var quest = _game.gameData.content[questIndex].quest;
            var answer = _game.gameData.content[questIndex].answer;

            if (this.ctnQuest)  this.ctnQuest.destroy();
            if (this.ctnAnswer)  this.ctnAnswer.destroy();

            this.ctnQuest = this.createQuest(quest);
            this.ctnAnswer = this.createAnswer(answer);

            this.sortQuest(this.ctnQuest);
            this.sortAnswer(this.ctnAnswer);
        },

        sortQuest:function (ctnQuest) {
            ctnQuest.y = -200;
            ctnQuest.x = 31;
            _this.game.add.tween(ctnQuest).to({y: 12}, 500, Phaser.Easing.Back.Out, true, 0);
        },

        sortAnswer:function (ctnAnswer) {
            for (var i = 0; i < ctnAnswer.children.length; i++) {
                var mcCross = ctnAnswer.children[i];
                mcCross.y = (mcCross.height + this.space) * i;
                mcCross.x = 400;
                _this.game.add.tween(mcCross).to({x: 0}, 500, Phaser.Easing.Back.Out, true, i * 100);
            }

            ctnAnswer.x = 579;
            ctnAnswer.y = _game.ah/2 -ctnAnswer.height/2;
        },

        createQuest:function (quest) {
            var crossGroupList = _this.game.add.group();
            var bg = this.getTextureAtlas("bgQuest");
            var content = null;
            if (quest.type === 'image') {
                content = _this.game.add.image(0, 0, quest.content);
                content.width = bg.width - 12;
                content.height = bg.height - 12;
            } else {
                content = _this.game.add.text(0, 0, quest.content, {
                    font: "21px Arial",
                    fill: "#000000",
                    align: 'center',
                    stroke: '#FFFFFF',
                    strokeThickness: 4,
                    wordWrapWidth: 480,
                    wordWrap: true
                });
                //content.anchor.set(0.5);
                content.setShadow(3, 3, 'rgba(0,0,0,0.1)', 5);
                content.lineSpacing = -10;
            }

            this.updateContentPosition(bg, content);
            crossGroupList.add(bg);
            crossGroupList.add(content);

            return crossGroupList;
        },

        createAnswer:function (arrAnswer) {
            var crossGroupList = _this.game.add.group();
            for (var i = 0; i < arrAnswer.length; i++) {
                var answer = arrAnswer[i];
                var crossGroup = _this.game.add.group();
                var bg = this.getTextureAtlas("bgAnswer");
                var bg_select = this.getTextureAtlas("bgAnswer_hover");
                var img_yes = this.getTextureAtlas("img_yes");
                var img_no = this.getTextureAtlas("img_no");
                var content = null;
                if (answer.type === 'image') {
                    content = _this.game.add.image(0, 0, answer.content);
                    //content.anchor.set(0.5);
                    content.width = bg.width - 12;
                    content.height = bg.height - 12;
                } else {
                    content = _this.game.add.text(0, 0, answer.content, {
                        font: "21px Arial",
                        fill: "#000000",
                        align: 'center',
                        stroke: '#FFFFFF',
                        strokeThickness: 4,
                        wordWrapWidth: 230,
                        wordWrap: true
                    });
                    //content.anchor.set(0.5);
                    content.setShadow(3, 3, 'rgba(0,0,0,0.1)', 5);
                    content.lineSpacing = -10;
                }
                bg.bg_select = bg_select;
                bg.img_yes = img_yes;
                bg.img_no = img_no;
                bg_select.alpha = 0;
                img_yes.alpha = 0;
                img_no.alpha = 0;
                img_yes.x = bg.width + 5;
                img_yes.y = bg.height/2 - img_yes.height/2;
                img_no.x = bg.width + 5;
                img_no.y = bg.height/2 - img_no.height/2;

                this.updateContentPosition(bg, content);
                crossGroup.add(bg);
                crossGroup.add(bg_select);
                crossGroup.add(content);
                crossGroup.add(img_yes);
                crossGroup.add(img_no);
                crossGroupList.add(crossGroup);

                bg.idx = i;
                bg.inputEnabled = true;
                bg.input.useHandCursor = true;
                bg.events.onInputDown.add(this.sendAnswer, _this);
            }

            return crossGroupList;
        },

        updateContentPosition: function (bg, content) {
            content.x = bg.x + bg.width / 2 - content.width / 2;
            content.y = bg.y + bg.height / 2 - content.height / 2;
        },

        sendAnswer:function (selected) {
            if( this.isAnswer) return;
            this.isAnswer = true;
            this.curSelect = selected;
            this.curSelect.bg_select.alpha = 1;
            _game.submitAnswer(this.reponseAnswer.bind(this), selected.idx);
        },

        reponseAnswer:function (result) {
            this.showStateAnswer(result);
            this.countAnswer--;
            if(result){
                _game.sounds.play('answerOk');
                this.score += this.addScore;
                _game.updateScore.apply(this, [this.score]);
                this.game.add.tween(this.curSelect.img_yes).to({alpha: 1}, 300, Phaser.Easing.Back.Out, true);
            }else{
                _game.sounds.play('answerFail');
                this.life--;
                this.game.add.tween(this.curSelect.img_no).to({alpha: 1}, 300, Phaser.Easing.Back.Out, true);
            }

            TweenLite.delayedCall(2, function () {
                if(this.countAnswer === 0){
                    this.finishGame();
                }else if(this.life <= 0) {
                    this.finishGame();
                }else {
                    this.isAnswer = false;
                    this.curQuest++;
                    this.playQuest(this.curQuest);
                }
            }.bind(this));
        },

        showStateAnswer:function(result){
            if (this.dropText && this.dropText.destroy) this.dropText.destroy();
            this.dropText = (result) ? this.getTextureAtlas("txtYes") : this.getTextureAtlas("txtNo");
            this.dropText.anchor.set(0.5);
            this.dropText.x = 300;
            this.dropText.y = _game.hh + 200;
            this.game.add.tween(this.dropText).to({y: _game.hh + 120}, 300, Phaser.Easing.Back.Out, true);

            var state = (result) ? "happy" : "bad";
            this.showStateObject(state);
            this.timeout = setTimeout(function () {
                this.showStateObject("idle");
                if (this.dropText && this.dropText.destroy) this.dropText.destroy();
            }.bind(this), 2000);
        },
    };
};