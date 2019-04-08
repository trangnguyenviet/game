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
            for (var i = 0; i < arrName.length; i++) {
                arr.push({
                    image: this.getTextureAtlas(arrName[i]),
                    animation: arrSate[i]
                })
            }

            var tiger = _game.createAtlasObject.apply(this, [arr]);
            tiger.x = 140;
            tiger.y = _game.hh + 100;
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
            this.countAnswer = _game.gameData.count_win;
            this.isAnswer = false;

            this.showStateObject("idle");
            this.playQuest();
            this.startTimer();
        },

        showStateObject: function (state) {
            if (this.player && this.player.destroy) {
                this.player.destroy();
            }
            switch (state) {
                case "idle":
                    this.player = this.createPlayer(["v_phai", "v_trai", "v_than", "v_dau"], [0, 0, 0, 1]);
                    break;
                case "bad":
                    this.player = this.createPlayer(["b_trai", "b_phai", "b_than", "b_dau"], [0, 0, 0, 1]);
                    break;
                case "happy":
                    this.player = this.createPlayer(["t_phai", "t_trai", "t_than", "t_dau"], [0, 0, 0, 1]);
                    break;
            }
        },

        playQuest: function () {
            var arrQuest1 = _game.gameData.content[0];
            var arrQuest2 = _game.gameData.content[1];
            var arrQuest3 = _game.gameData.content[2];

            this.selectCross = null;
            this.selectMiddle = null;

            this.listCrossTop = this.createCross(arrQuest1, 120, 150, this.clickAnswerCross);
            this.listCrossMiddle = this.createCross(arrQuest2, 120, 300, this.clickAnswerMiddle);
            this.listCrossBottom = this.createCross(arrQuest3, 120, 450, this.clickAnswerCross);

            this.hideAnswerCross();
        },

        hideAnswerCross: function () {
            var answereds = _game.gameData.answereds;
            for (var i = 0; i < answereds[0].length; i++) {
                var index = answereds[0][i];
                if (index < this.listCrossTop.children.length) {
                    this.listCrossTop.children[index].visible = false;
                }
            }

            for (var i = 0; i < answereds[1].length; i++) {
                var index = answereds[1][i];
                if (index < this.listCrossBottom.children.length) {
                    this.listCrossBottom.children[index].visible = false;
                }
            }
        },

        createCross: function (listQuest, posX, posY, answerFunction) {
            var crossGroupList = _this.game.add.group();

            for (var i = 0; i < listQuest.length; i++) {
                var quest = listQuest[i];
                var crossGroup = _this.game.add.group();
                var bg = this.getTextureAtlas("bgCross1");
                var bg_select = this.getTextureAtlas("bgCross4");
                var bg_ok = this.getTextureAtlas("bgCross2");
                var bg_fail = this.getTextureAtlas("bgCross3");

                var content = null;
                if (quest.type === 'image') {
                    content = _this.game.add.image(0, 0, quest.content);
                    content.width = bg.width - 12;
                    content.height = bg.height - 12;
                } else {
                    content = _this.game.add.text(0, 0, quest.content, {
                        font: "16px Arial",
                        fill: "#000000",
                        align: 'center',
                        stroke: '#FFFFFF',
                        strokeThickness: 4,
                        wordWrapWidth: 240,
                        wordWrap: true
                    });
                    content.setShadow(3, 3, 'rgba(0,0,0,0.1)', 5);
                    content.lineSpacing = -10;
                }
                bg_select.alpha = 0;
                bg_select.alpha = 0;
                bg_ok.alpha = 0;
                bg_fail.alpha = 0;

                this.updateContentPosition(bg, content);
                crossGroup.add(bg);
                crossGroup.add(bg_select);
                crossGroup.add(bg_ok);
                crossGroup.add(bg_fail);
                crossGroup.add(content);
                crossGroupList.add(crossGroup);

                crossGroup.x = i * (bg.width + this.space);

                crossGroup.group = crossGroupList;

                bg.bg = bg;
                bg.bg_select = bg_select;
                bg.bg_ok = bg_ok;
                bg.bg_fail = bg_fail;
                bg.group = crossGroup;
                bg.index = i;

                bg.inputEnabled = true;
                bg.input.useHandCursor = true;
                bg.events.onInputDown.add(answerFunction, _this);
            }
            crossGroupList.x = _game.aw / 2 - crossGroupList.width / 2 + posX;
            crossGroupList.y = posY;//_game.ah / 2 - crossGroupList.height / 2 + 30;

            for (var i = 0; i < crossGroupList.children.length; i++) {
                var mc = crossGroupList.children[i];
                TweenLite.from(mc, 0.5, {y: 0, alpha: 0, delay: i * 0.05});
            }

            return crossGroupList;
        },

        updateContentPosition: function (bg, content) {
            content.x = bg.x + bg.width / 2 - content.width / 2;
            content.y = bg.y + bg.height / 2 - content.height / 2;
        },

        clickAnswerCross: function (selected) {
            _game.sounds.play('click');
            if (this.isAnswer) return;
            if (this.selectCross) {
                if (this.selectCross === selected) {
                    this.selectCross.bg.alpha = 1;
                    this.selectCross.bg_select.alpha = 0;
                    this.selectCross = null;
                } else {
                    this.selectCross.bg.alpha = 1;
                    this.selectCross.bg_select.alpha = 0;
                    selected.bg.alpha = 0;
                    selected.bg_select.alpha = 1;
                    this.selectCross = selected;
                }
            } else {
                selected.bg.alpha = 0;
                selected.bg_select.alpha = 1;
                this.selectCross = selected;
            }

            this.checkChooseAnswer();
        },

        clickAnswerMiddle: function (selected) {
            _game.sounds.play('click');
            if (this.isAnswer) return;
            if (this.selectMiddle) {
                if (this.selectMiddle === selected) {
                    this.selectMiddle.bg.alpha = 1;
                    this.selectMiddle.bg_select.alpha = 0;
                    this.selectMiddle = null;
                } else {
                    this.selectMiddle.bg.alpha = 1;
                    this.selectMiddle.bg_select.alpha = 0;
                    selected.bg.alpha = 0;
                    selected.bg_select.alpha = 1;
                    this.selectMiddle = selected;
                }
            } else {
                selected.bg.alpha = 0;
                selected.bg_select.alpha = 1;
                this.selectMiddle = selected;
            }

            this.checkChooseAnswer();
        },

        checkChooseAnswer: function () {
            _game.sounds.play('click');
            if (!this.selectCross || !this.selectMiddle) return;
            if (this.isAnswer) return;
            this.isAnswer = true;
            var data = [
                this.selectCross.index,
                this.selectMiddle.index
            ];
            _game.submitAnswer(this.reponseAnswer.bind(this), data);
        },


        showAnswer: function (result) {
            if (this.dropText && this.dropText.destroy) this.dropText.destroy();
            this.dropText = (result) ? this.getTextureAtlas("txtYes") : this.getTextureAtlas("txtNo");
            this.dropText.anchor.set(0.5);
            this.dropText.x = (result) ? 220 : 220;
            this.dropText.y = _game.hh + 200;
            this.game.add.tween(this.dropText).to({y: _game.hh + 180}, 300, Phaser.Easing.Back.Out, true);

            var state = (result) ? "happy" : "bad";
            this.showStateObject(state);
            this.timeout = setTimeout(function () {
                this.showStateObject("idle");
                if (this.dropText && this.dropText.destroy) this.dropText.destroy();
            }.bind(this), 2000);
        },

        showLineAnswer: function (result) {
            var posSelectX = 0;
            var posSelectY = 0;
            var posMiddleX = 0;
            var posMiddleY = 0;
            var spaceH = 12;
            var arrowName = (result) ? "arrow_2" : "arrow";
            var arrow = this.getTextureAtlas(arrowName);
            arrow.anchor.set(0.5, 0.5);

            if (this.selectCross.group.group === this.listCrossTop) {
                posSelectX = this.selectCross.group.x + this.selectCross.width / 2 + this.listCrossTop.x;
                posSelectY = this.selectCross.group.y + this.selectCross.height + this.listCrossTop.y - spaceH;

                posMiddleX = this.listCrossMiddle.x + this.listCrossMiddle.width / 2;
                posMiddleY = this.listCrossMiddle.y + spaceH;

                arrow.x = posMiddleX;
                arrow.y = posMiddleY;
                var rotation = Math.atan((posSelectY - posMiddleY) / (posSelectX - posMiddleX)) * 180 / Math.PI;
                rotation = (posMiddleX < posSelectX) ? rotation + 180 : rotation;
                arrow.angle = rotation;

            } else {
                posSelectX = this.selectCross.group.x + this.selectCross.width / 2 + this.listCrossBottom.x;
                posSelectY = this.selectCross.group.y + this.listCrossBottom.y + spaceH;

                posMiddleX = this.listCrossMiddle.x + this.listCrossMiddle.width / 2;
                posMiddleY = this.listCrossMiddle.y + this.listCrossMiddle.height - spaceH;

                arrow.x = posSelectX;
                arrow.y = posSelectY;
                var rotation = Math.atan((posMiddleY - posSelectY) / (posMiddleX - posSelectX)) * 180 / Math.PI;
                rotation = (posMiddleX > posSelectX) ? rotation + 180 : rotation;
                arrow.angle = rotation;
            }

            var graphics = _this.game.add.graphics(0, 0);
            // draw a circle
            graphics.lineStyle(0);
            graphics.beginFill(0xFFFF0B, 0.5);
            graphics.endFill();

            var color = (result) ? 0x00FF00 : 0xFF0000;

            graphics.lineStyle(5, color);
            graphics.moveTo(posSelectX, posSelectY);
            graphics.lineTo(posMiddleX, posMiddleY);

            window.graphics = graphics;

            var mcSelect = this.selectCross;
            var mcMiddle = this.selectMiddle;

            if (result) {
                _game.sounds.play('answerOk');
                mcSelect.bg_ok.alpha = 1;
                mcMiddle.bg_ok.alpha = 1;

                TweenLite.delayedCall(2, function () {
                    mcSelect.group.visible = false;
                }.bind(this));

                this.countAnswer--;

            } else {
                _game.sounds.play('answerFail');
                mcSelect.bg_fail.alpha = 1;
                mcSelect.bg_select.alpha = 0;
                mcMiddle.bg_fail.alpha = 1;
                mcMiddle.bg_select.alpha = 0;
            }

            TweenLite.delayedCall(2, function () {
                arrow.parent.removeChild(arrow);
                graphics.parent.removeChild(graphics);

                mcSelect.bg.alpha = 1;
                mcSelect.bg_select.alpha = 0;
                mcSelect.bg_fail.alpha = 0;


                mcMiddle.bg.alpha = 1;
                mcMiddle.bg_select.alpha = 0;
                mcMiddle.bg_fail.alpha = 0;
                mcMiddle.bg_ok.alpha = 0;

                if (result) {
                    this.score += this.addScore;
                    _game.updateScore.apply(this, [this.score]);
                    if (this.countAnswer === 0) {
                        this.finishGame();
                    } else {
                        this.isAnswer = false;
                    }
                } else {

                    this.life--;
                    if (this.life <= 0) {
                        this.finishGame();
                    } else {
                        this.isAnswer = false;
                    }
                }
            }.bind(this));

            this.selectCross = null;
            this.selectMiddle = null;
        },


        reponseAnswer: function (result) {
            this.showAnswer(result);
            this.showLineAnswer(result);
        },
    };
};