cc.Class({
    extends: cc.Component,

    properties: () => ({
        pause: cc.Button, //类型
        btnSprite: { //精灵
            default: [],
            type: cc.SpriteFrame,  //精灵帧
            tooltip: '暂停按钮不同状态的图片'  //提示
        },

        bomb: cc.Node,
        gameMusic: {
            default: null,
            type: cc.AudioSource
        },
        useBombClip: cc.AudioClip,

        //敌机组
        enemyGroup: {
            default: null,
            type: require('enemyGroup'),
        },

        //飞机  英雄
        hero: {
            default: null,
            type: require('hero'),
        },

        //ufo组   生命值
        ufoGroup: {
            default: null,
            type: require('ufoGroup')
        },

        //子弹组
        bulletGroup: {
            default: null,
            type: require('bulletGroup')
        },

        scoreDisplay: cc.Label,  //分数

        bombNoDisplay: cc.Label,  //生命值
    }),

    // use this for initialization
    onLoad: function () {  //用于各种初始化
        this.score = 0;
        this.bombNo = 0;
        this.scoreDisplay.string = this.score;
        this.bombNoDisplay.string = this.bombNo;
        this.eState = D.commonInfo.gameState.start;  //当前游戏状态

        this.enemyGroup.startAction();
        this.bulletGroup.startAction();
        this.ufoGroup.startAction();
        //touchstart 对应cc.Node.EventType.TOUCH_START
        this.bomb.on('touchstart', this.bombOnClick, this);
        this.gameMusic.play();
    },

    //监听事件
    bombOnClick: function () {
        var bombNoLabel = this.bomb.getChildByName('bombNo').getComponent(cc.Label);
        var bombNo = parseInt(bombNoLabel.string);

        if (bombNo > 0) {
            bombNoLabel.string = bombNo - 1;
            this.removeEnemy();
            cc.audioEngine.playEffect(this.useBombClip, false);
        } else {
            console.log('没有子弹');
        }
    },

    //暂停按钮点击事件
    pauseClick: function () {
        if (this.eState == D.commonInfo.gameState.pause) { //点击暂停按钮的时候，当前的状态是暂停状态  那么就去恢复游戏   继续游戏
            this.resumeAction();
            this.eState = D.commonInfo.gameState.start;
        } else if (this.eState == D.commonInfo.gameState.start) { //点击暂停按钮的时候，当前状态是开始状态，改状态为暂停
            this.pauseAction();
            this.eState = D.commonInfo.gameState.pause;
        }
    },

    //游戏继续
    resumeAction: function () {
        this.enemyGroup.resumeAction();
        this.bulletGroup.resumeAction();
        this.ufoGroup.resumeAction();
        this.hero.onDrag();
        this.gameMusic.resume();
        this.pause.normalSprite = this.btnSprite[0];
        this.pause.pressedSprite = this.btnSprite[1];
        this.pause.hoverSprite = this.btnSprite[2];
    },

    //游戏暂停
    pauseAction: function () {
        this.enemyGroup.pauseAction();
        this.bulletGroup.pauseAction();
        this.hero.offDrag();
        this.gameMusic.pause();
        this.ufoGroup.pauseAction();
        this.pause.normalSprite = this.btnSprite[2];
        this.pause.pressedSprite = this.btnSprite[3];
        this.pause.hoverSprite = this.btnSprite[3];
    },

    //增加分数
    gainScore: function (scoreno) {
        this.score += scoreno;
        //更新scoreDisplay Label 的文字
        this.scoreDisplay.string = this.score.toString();
    },

    //get分数
    getScore: function () {
        return parseInt(this.scoreDisplay.string);
    },

    //分数写到本地  (当前分  最高分  历史记录)
    updateScore: function () {
        var currentScore = this.scoreDisplay.string;
        var scoreData = {
            'score': currentScore,
            'time': D.comment.timeFmt(new Date(), 'yyyy-MM-dd hh:mm:ss'),
        };
        var preData = cc.sys.localStorage.getItem('score');
        var preTopScore = cc.sys.localStorage.getItem('topScore');

        if (!preTopScore || parseInt(preTopScore) < parseInt(currentScore)) {
            cc.sys.localStorage.setItem('topScore', currentScore);
        }
        if (!preData) {
            preData = [],
                preData.unshift(scoreData);
        } else {
            preData = JSON.parse(preData);
            if (!(preData instanceof Array)) {
                preData = [];
            }
            preData.unshift(scoreData);
        }
        cc.sys.localStorage.setItem('currentScore', currentScore);
        cc.sys.localStorage.setItem('score', JSON.stringify(preData));
    },

    //清除敌机
    removeEnemy: function () {
        this.enemyGroup.node.removeAllChildren();
    },

    //接到生命值   然而没有用  照样死啊  我擦。。。。
    getUfoBomb: function () {
        if (parseInt(this.bombNoDisplay.string) < 3) { //多于三个生命就不累计额
            this.bombNoDisplay.string += 1;
        }
    },

    //游戏结束
    gameOver: function () {
        this.pauseAction();
        this.updateScore();
        cc.director.loadScene('end');
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
