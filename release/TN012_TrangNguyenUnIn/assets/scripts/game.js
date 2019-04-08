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
            tiger.x = 190;
            tiger.y = _game.hh + 70;

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
            this.timerText.x = 0;
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
            this.spaceW = 5;
            this.spaceH = 5;
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

            // this.showStateObject("idle");
            this.playQuest();
            this.startTimer();
            this.initButtonNopBai();

            this.game.input.keyboard.addCallbacks(this, null, null, this.keyPress.bind(this));
        },

        keyPress: function (char) {
            if (!this.curSelect) return;
            this.curSelect.content.text = char;
            this.autoNextSelect(this.curSelect);
        },

        autoNextSelect:function (curSelect) {
            var arrIdx =  curSelect.idx.split("_");
            var indexV = parseInt(arrIdx[0]);
            var indexH = parseInt(arrIdx[1]);
            var i = indexV;
            var j = indexH + 1;

            while (1){
                if(j >= this.vtGroup.children[i].children.length) {
                    i = i + 1;

                    j = 0;
                }

                if(i >= this.vtGroup.children.length){
                    i = 0;
                }

                if(i === indexV && j === indexH) break;

                var mcCross = this.vtGroup.children[i].children[j];
                if(mcCross.alpha === 0) {
                    j++;
                    continue;
                }
                // if(mcCross.content.text !== "" && mcCross.content.text != " ") {
                //     j++;
                //     continue;
                // }

                this.onHanlerClickCross(mcCross.bg);
                break;
            }
        },

        initButtonNopBai: function () {
            this.btnNopBai = this.getTextureAtlas("btnNopBai");
            this.btnNopBai.x = _game.aw - 80;
            this.btnNopBai.y =  40;
            this.btnNopBai.anchor.set(0.5);
            this.btnNopBai.inputEnabled = true;
            this.btnNopBai.input.pixelPerfectClick = true;
            this.btnNopBai.input.useHandCursor = true;
            this.btnNopBai.events.onInputDown.add(this.onNopBai, this);
            this.btnNopBai.events.onInputOver.add(this.hanlerOverButton, this);
            this.btnNopBai.events.onInputOut.add(this.hanlerOutButton, this);
        },

        showStateObject: function (state) {
            if (this.player && this.player.destroy) {
                this.player.destroy();
            }
            switch (state) {
                case "idle":
                    this.player = this.createPlayer(["bt_trai, bt_phai", "bt_than", "bt_dau"], [0, 0, 0, 1]);
                    break;
                case "bad":
                    this.player = this.createPlayer(["b_trai", "b_phai", "b_than", "b_dau"], [0, 0, 0, 1]);
                    break;
                case "happy":
                    this.player = this.createPlayer(["v_trai", "v_phai", "v_than", "v_dau"], [0, 0, 0, 1]);
                    break;
            }
        },

        playQuest: function () {
            this.maxCross = 0;
            var arrQuest = _game.gameData.content;
            if (this.vtGroup)  this.vtGroup.destroy();
            if (this.numGroup)  this.vtGroup.destroy();
            if (this.asGroup) this.asGroup.destroy();

            this.numGroup = _this.game.add.group();
            this.vtGroup = _this.game.add.group();
            this.asGroup = _this.game.add.group();

            for (var i = 0; i < arrQuest.length; i++) {
                var crossGroup = _this.game.add.group();
                var len = arrQuest[i].num + arrQuest[i].start;
                if (this.maxCross < len) this.maxCross = len;
                for (var j = 0; j < len; j++) {
                    var mcCross = this.createCross(arrQuest[i].start, i + "_" + j, this.onHanlerClickCross);
                    mcCross.x = (mcCross.width + this.spaceW ) * (j + 1);
                    mcCross.y = (mcCross.height + this.spaceH) * i;
                    crossGroup.add(mcCross);
                    this.game.add.tween(mcCross).from({x: 0}, 150 * (j + 1), Phaser.Easing.Back.Out, true);
                }
                this.vtGroup.add(crossGroup);

                // var num = this.getTextureAtlas("img" + (i + 1));
                // num.y = (crossGroup.height + this.spaceH) * i;
                // this.numGroup.add(num);

                var mc = this.createQuest(i, this.onHanlerClickQuestHorizontal);
                mc.y = (crossGroup.height + this.spaceH) * i;
                this.asGroup.add(mc);

            }

            // for (var i = 0; i < this.asGroup.children.length; i++) {
            //     var mc = this.asGroup.children[i];
            //     mc.x = (this.maxCross + 1) * (mcCross.width + this.spaceW ) + 10;
            //
            //     this.game.add.tween(mc).from({alpha: 0}, 2000, Phaser.Easing.Back.In, true);
            // }

            var mc = this.createQuest(null, this.onHanlerClickQuestVerical);
            mc.y = -mc.height - 10;
            mc.x = (mcCross.width + this.spaceW ) * (_game.gameData.vPoint + 1) + 5;
            this.asGroup.add(mc);
            this.game.add.tween(mc).from({alpha: 0}, 2000, Phaser.Easing.Back.In, true);

            this.vtGroup.x = _game.aw - (this.maxCross * ( this.vtGroup.width + this.spaceW)) - 100;
            this.vtGroup.y = _game.ah / 2 - this.vtGroup.height / 2 + 50;

            // this.numGroup.x = this.vtGroup.x;
            // this.numGroup.y = this.vtGroup.y;

            this.asGroup.x = this.vtGroup.x;
            this.asGroup.y = this.vtGroup.y;


        },

        createQuest: function (idx, func) {
            var crossGroup = _this.game.add.group();
            var mcQuest = (idx !== null)?this.getTextureAtlas("img" + (idx + 1)):this.getTextureAtlas("img_quest");
            var mcYes = this.getTextureAtlas("img_yes");
            var mcNo = this.getTextureAtlas("img_no");

            crossGroup.add(mcQuest);
            crossGroup.add(mcYes);
            crossGroup.add(mcNo);

            crossGroup.mcQuest = mcQuest;
            crossGroup.mcYes = mcYes;
            crossGroup.mcNo = mcNo;
            mcQuest.idx = idx;

            mcYes.alpha = 0;
            mcNo.alpha = 0;

            mcQuest.inputEnabled = true;
            mcQuest.input.useHandCursor = true;
            mcQuest.events.onInputDown.add(func, _this);

            return crossGroup;
        },

        createCross: function (start, idx, func) {
            var a = idx.split("_");
            var px = parseInt(a[1]);
            var vPoint = _game.gameData.vPoint;
            var crossGroup = _this.game.add.group();
            var bg = (px !== vPoint) ? this.getTextureAtlas("bgCross1") : this.getTextureAtlas("bgCross3");
            var bg_select = this.getTextureAtlas("bgCross2");
            var content = _this.game.add.text(0, 0, "", {
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
            bg.idx = idx;

            crossGroup.bg = bg;
            crossGroup.content = content;
            crossGroup.idx = idx;
            this.updateContentPosition(bg, content);
            crossGroup.add(bg);
            crossGroup.add(bg_select);
            crossGroup.add(content);


            if (px >= start) {
                bg.inputEnabled = true;
                bg.input.useHandCursor = true;
                bg.events.onInputDown.add(func, _this);
            } else {
                crossGroup.alpha = 0;
            }
            return crossGroup;
        },

        updateContentPosition: function (bg, content) {
            content.x = bg.x + bg.width / 2 - content.width / 2;
            content.y = bg.y + bg.height / 2 - content.height / 2 + 5;
        },

        onHanlerClickCross: function (selected) {
            if( this.isAnswer)return;
            if (this.curSelect) {
                this.curSelect.bg_select.alpha = 0;
                this.curSelect.alpha = 1;
            }
            selected.bg_select.alpha = 1;
            selected.alpha = 0;
            _game.sounds.play('click');
            this.curSelect = selected;
        },

        onHanlerClickQuestVerical:function (selected) {
            this.openQuest(_game.gameData.vQuest);
        },

        onHanlerClickQuestHorizontal: function (selected) {
            var arrQuest = _game.gameData.content;
            this.openQuest(arrQuest[selected.idx].content);
        },

        openQuest:function (content) {
            if(this.questGroup) return;
            if( this.isAnswer)return;

            this.overlay = this.getTextureAtlas("overlay");
            this.overlay.width = _game.aw;
            this.overlay.height = _game.ah;

            this.bgAlert =  this.getTextureAtlas("bg_alert");
            this.bgAlert.anchor.set(0.5, 0.5);
            this.bgAlert.x = _game.hw;
            this.bgAlert.y = _game.hh;

            this.txtAlert = this.add.text(_game.hw, _game.hh - 180, content || '', {
                font: "30px Arial",
                fill: "#000000",
                align: 'center',
                stroke: '#FFFFFF',
                strokeThickness: 5,
                wordWrapWidth: 550,
                wordWrap: true
            });
            this.txtAlert.setShadow(3, 3, 'rgba(0,0,0,0.1)', 5);
            this.txtAlert.anchor.set(0.5, 0);

            // var scrollMask = this.game.add.graphics(0, 0);
            // scrollMask.beginFill(0xffffff);
            // scrollMask.drawRect( this.txtAlert.x - this.txtAlert.width/2, this.txtAlert.y , this.txtAlert.width, 360 );
            // scrollMask.endFill();
            // this.txtAlert.mask = scrollMask;

            this.btnClose = this.getTextureAtlas("btnClose");
            this.btnClose.x = _game.hw ; //-  this.btnClose.width;
            this.btnClose.y = _game.hh + 220; //-  this.btnClose.height;
            this.btnClose.anchor.set(0.5);
            this.btnClose.inputEnabled = true;
            this.btnClose.input.pixelPerfectClick = true;
            //this.btnClose.input.useHandCursor = true;
            this.btnClose.events.onInputDown.add(this.closeQuest, this);
            this.btnClose.events.onInputOver.add(this.mouseoverStartBtn, this);
            this.btnClose.events.onInputOut.add(this.mouseoutStartBtn, this);

            if (this.questGroup && this.questGroup.destroy) {
                this.questGroup.destroy();
            }

            this.questGroup = this.game.add.group();
            this.questGroup.add(this.overlay);
            this.questGroup.add(this.bgAlert);
            this.questGroup.add(this.txtAlert);
            this.questGroup.add(this.btnClose);
        },

        mouseoverStartBtn: function (btn) {
            this.game.add.tween(btn.scale).to({x: 1.1, y: 1.1}, 500, Phaser.Easing.Linear.None, true);
        },

        mouseoutStartBtn: function (btn) {
            this.game.add.tween(btn.scale).to({x: 1, y: 1}, 500, Phaser.Easing.Linear.None, true);
        },

        closeQuest:function () {
            _game.sounds.play('click');
            if (this.questGroup && this.questGroup.destroy) {
                this.questGroup.destroy();
                this.questGroup = null;
            }
        },

        onNopBai: function () {
            if(this.questGroup) return;
            if( this.isAnswer)return;
            var arrQuest = _game.gameData.content;
            this.isAnswer = true;
            var results = [];
            for(var i = 0; i < this.vtGroup.children.length;i++){
                var mcCross = this.vtGroup.children[i];
                var answer = [];
                for(var j = arrQuest[i].start; j < mcCross.children.length;j++){
                    answer.push(mcCross.children[j].content.text);
                }
                results.push(answer);
            }
            _game.submitAnswer(this.reponseAnswer.bind(this), results);
        },

        reponseAnswer:function (result) {
            for(var i = 0; i < this.asGroup.children.length;i++){
                var mc = this.asGroup.children[i];
                if(result[i] && result[i] === 1){
                    mc.mcYes.alpha = 0;
                    mc.mcYes.x = -100;
                    this.game.add.tween(mc.mcYes).to({alpha: 1,x:0}, 1000, Phaser.Easing.Back.In, true, 2000*i);
                    this.game.add.tween(mc.mcQuest).to({alpha: 0}, 500, Phaser.Easing.Back.In, true, 2000*i);
                    this.timeout = setTimeout(function () {
                        _game.sounds.play('answerOk');
                    }.bind(this), 2000*i);
                }else{
                    mc.mcNo.alpha = 0;
                    mc.mcNo.x = -100;
                    this.game.add.tween(mc.mcNo).to({alpha: 1, x:0}, 1000, Phaser.Easing.Back.In, true, 2000*i);
                    this.game.add.tween(mc.mcQuest).to({alpha: 0}, 500, Phaser.Easing.Back.In, true, 2000*i);
                    this.timeout = setTimeout(function () {
                        _game.sounds.play('answerFail');
                    }.bind(this), 2000*i);
                }
            }
            clearInterval(this.timer);
            this.timeout = setTimeout(function () {
                this.finishGame()
            }.bind(this), this.asGroup.children.length * 2000 + 1000);
        }
    };
};

String.prototype.replaceAll = function (str1, str2, ignore) {
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, "\\$&"), (ignore ? "gi" : "g")), (typeof(str2) == "string") ? str2.replace(/\$/g, "$$$$") : str2);
}
