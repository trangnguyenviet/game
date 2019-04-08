/**
 * Created by hwngvnd on 7/11/15.
 */

typeof(TVUB) === 'undefined' ? TVUB = {} : '';

TVUB.Preload = function (game) {
    /*
     *   _game: game api
     * */
    var _game = game,
        _gameOptions,
        baseUrl;

    _game.sounds = {
        play: function () {

        }
    };

    _gameOptions = _game.options;
    baseUrl = _gameOptions.baseUrl;

    //PRELOAD
    this.initState = function () {
    };

    this.initState.prototype = {
        preload: function () {
            this.bg = this.add.image(0, 0, 'background');
            _game.state = {
                state: _game.stateList.PRELOAD,
                ref: this
            };
            _game.hw = this.game.world.width * 0.5;
            _game.hh = this.game.world.height * 0.5;
            _game.aw = this.game.world.width;
            _game.ah = this.game.world.height;

            _game.triggerEventListener('state', {
                state: _game.stateList.PRELOAD,
                options: {}
            });

            this.preloadBar = this.add.sprite(_game.hw - 222, _game.hh, 'preloaderBar');
            this.preloadBar.animations.add('walk');
            this.preloadBar.animations.play('walk', 60, true);
            this.load.setPreloadSprite(this.preloadBar);
            this.load.image('avatar', (_game.user && _game.user.avatar) ? _game.user.avatar : 'assets/images/avatar.png');
            this.load.image('khung_ket_qua', baseUrl + 'images/khung-ket-qua.png');
            this.load.image('hoan_thanh_bt', baseUrl + 'images/hoan-thanh-bt.png');
            this.load.image('ten_game', baseUrl + 'images/ten-game.png');
            this.load.image('bat_dau', baseUrl + 'images/bat-dau.png');
            this.load.image('thi_tiep', baseUrl + 'images/thi-tiep.png');
            this.load.image('thi_lai', baseUrl + 'images/thi-lai.png');
            this.load.image('logo_transparent', baseUrl + 'images/logo-transparent.png');
            this.load.image('khung_avatar', baseUrl + 'images/khung-avatar.png');
            this.load.image('text_dung', baseUrl + 'images/text-dung.png');
            this.load.image('text_sai', baseUrl + 'images/text-sai.png');
            this.load.spritesheet('loading', baseUrl + 'images/loading.png', 102, 102, 8);

            this.load.image('o_nho', baseUrl + 'images/o-nho.png');
            this.load.image('o_nho_sai', baseUrl + 'images/o-nho-sai.png');

            //meo duc
            this.load.image('meoduc_bt_dau', baseUrl + 'images/meo-duc/meo-bt/dau.png');
            this.load.image('meoduc_bt_than', baseUrl + 'images/meo-duc/meo-bt/than.png');
            this.load.image('meoduc_bt_tayphai', baseUrl + 'images/meo-duc/meo-bt/tay-phai.png');
            this.load.image('meoduc_bt_taytrai', baseUrl + 'images/meo-duc/meo-bt/tay-trai.png');

            this.load.image('meoduc_vui_dau', baseUrl + 'images/meo-duc/meo-vui/dau.png');
            this.load.image('meoduc_vui_than', baseUrl + 'images/meo-duc/meo-vui/than.png');
            this.load.image('meoduc_vui_tayphai', baseUrl + 'images/meo-duc/meo-vui/tay-phai.png');
            this.load.image('meoduc_vui_taytrai', baseUrl + 'images/meo-duc/meo-vui/tay-trai.png');

            this.load.image('meoduc_buon_dau', baseUrl + 'images/meo-duc/meo-buon/dau.png');
            this.load.image('meoduc_buon_than', baseUrl + 'images/meo-duc/meo-buon/than.png');
            this.load.image('meoduc_buon_tayphai', baseUrl + 'images/meo-duc/meo-buon/tay-phai.png');
            this.load.image('meoduc_buon_taytrai', baseUrl + 'images/meo-duc/meo-buon/tay-trai.png');
            this.load.image('meoduc_buon_bantayphai', baseUrl + 'images/meo-duc/meo-buon/ban-tay-phai.png');
            this.load.image('meoduc_buon_bantaytrai', baseUrl + 'images/meo-duc/meo-buon/ban-tay-trai.png');

            //meocai
            this.load.image('meocai_bt_dau', baseUrl + 'images/meo-cai/meo-bt/dau.png');
            this.load.image('meocai_bt_than', baseUrl + 'images/meo-cai/meo-bt/than.png');
            this.load.image('meocai_bt_tayphai', baseUrl + 'images/meo-cai/meo-bt/tay-phai.png');
            this.load.image('meocai_bt_taytrai', baseUrl + 'images/meo-cai/meo-bt/tay-trai.png');

            this.load.image('meocai_vui_dau', baseUrl + 'images/meo-cai/meo-vui/dau.png');
            this.load.image('meocai_vui_than', baseUrl + 'images/meo-cai/meo-vui/than.png');
            this.load.image('meocai_vui_tayphai', baseUrl + 'images/meo-cai/meo-vui/tay-phai.png');
            this.load.image('meocai_vui_taytrai', baseUrl + 'images/meo-cai/meo-vui/tay-trai.png');

            this.load.image('meocai_buon_dau', baseUrl + 'images/meo-cai/meo-buon/dau.png');
            this.load.image('meocai_buon_than', baseUrl + 'images/meo-cai/meo-buon/than.png');
            this.load.image('meocai_buon_tayphai', baseUrl + 'images/meo-cai/meo-buon/tay-phai.png');
            this.load.image('meocai_buon_taytrai', baseUrl + 'images/meo-cai/meo-buon/tay-trai.png');
            this.load.image('meocai_buon_bantayphai', baseUrl + 'images/meo-cai/meo-buon/ban-tay-phai.png');
            this.load.image('meocai_buon_bantaytrai', baseUrl + 'images/meo-cai/meo-buon/ban-tay-trai.png');

            if (_gameOptions.sound) {
                //am thanh
                this.load.audio('nhac_nen', [baseUrl + 'audio/music.mp3']);
                this.load.audio('click_chuot', [baseUrl + 'audio/click.mp3']);
                this.load.audio('tra_loi_sai', [baseUrl + 'audio/lose.mp3']);
                this.load.audio('tra_loi_dung', [baseUrl + 'audio/win.mp3']);
                this.load.audio('chuyen_man', [baseUrl + 'audio/transition.mp3']);
            }

        },

        create: function () {
            this.preloadBar.cropEnabled = false;
        },

        update: function () {
            if (this.load.hasLoaded) {
                this.preloadBar.visible = false;

                if (_gameOptions.sound) {
                    _game.sounds.chuyen_man = this.add.audio('chuyen_man', 1, false);
                    _game.sounds.tra_loi_dung = this.add.audio('tra_loi_dung', 1, false);
                    _game.sounds.click_chuot = this.add.audio('click_chuot', 1, false);
                    _game.sounds.tra_loi_sai = this.add.audio('tra_loi_sai', 1, false);
                    _game.sounds.nhac_nen = this.add.audio('nhac_nen', 1, true).play();
                    _game.sounds.play = function (action) {
                        switch (action) {
                            case 'chuyen_man':
                                _game.sounds.chuyen_man.play();
                                break;
                            case 'tra_loi_dung':
                                _game.sounds.tra_loi_dung.play();
                                break;
                            case 'tra_loi_sai':
                                _game.sounds.tra_loi_sai.play();
                                break;
                            case 'click_chuot':
                                _game.sounds.click_chuot.play();
                                break;
                            case 'nhac_nen':
                                _game.sounds.nhac_nen.play();
                                break;
                        }
                    };
                } else {
                    //no sound
                }
                this.state.start('Home');
            }
        }
    }
};