//敌机组
var enemyG = cc.Class({
    name: 'enemyG',
    properties: {
        name: '',
        freqTime: 0,
        initPollCount: 0,
        prefab: cc.Prefab
    }
});

cc.Class({
    extends: cc.Component,

    properties: () => ({
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        enemyG: {
            default: [],
            type: enemyG
        },

        main: {
            default: null,
            type: require('main')
        }
    }),

    // use this for initialization
    onLoad: function () {
        //初始化敌机组
        this.eState = D.commonInfo.gameState.none;
        D.common.batchInitObjPool(this, this.enemyG);
    },

    startAction: function () {
        this.eState = D.commonInfo.gameState.start;
        //定时生成敌机
        for (var ei = 0; ei < this.enemyG.length; ++ei) {
            var freqTime = this.enemyG[ei].freqTime;
            var fName = 'callback_' + ei;
            this[fName] = function (e) { this.getNewEnemy(this.enemyG[e]); }.bind(this,ei);
            this.schedule(this[fName], freqTime);
        }
    },

    //重新开始
    resumeAction: function () {
        this.enabled = true;
        this.eState = D.commonInfo.gameState.start;
    },

    //暂停
    pauseAction: function () {
        this.enabled = false;
        this.eState = D.commonInfo.gameState.pause;
    },

    //生成敌机
    getNewEnemy: function (enemyInfo) {
        var poolName = enemyInfo.name + 'Pool';  //创建敌机名字
        //根据敌机名字，还有预制资源  当前节点  获取一个新的节点从缓存池中，缓存池如果没有，那么就自己生产一个
        var newNode = D.common.getNewNode(this[poolName], enemyInfo.prefab, this.node);
        var newV2 = this.getNewEnemyPosition(newNode); //获取到新敌机的位置
        newNode.setPosition(newV2); //当前节点设置位置
        newNode.getComponent('enemy').init(); //初始化
    },

    //获取敌机的随机位置
    getNewEnemyPosition: function (newEnemy) {
        //位于上方，刚开始可以不见
        var randx = cc.randomMinus1To1() * (this.node.parent.width / 2 - newEnemy.width / 2);
        var randy = this.node.parent.height / 2 + newEnemy.height / 2;
        return cc.v2(randx, randy);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    enemyDied: function (nodeinfo, score) {
        //回收节点  放回对象池
        D.common.backObjPool(this, nodeinfo);
        //增加分数
        if (parseInt(score) > 0) {
            this.main.gainScore(score);
        }
    },

    /** 得分方法 */
    getScore: function () {
        return this.main.getScore();
    }
});
