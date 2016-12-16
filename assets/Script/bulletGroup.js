//子弹生成设置好
var bPosition = cc.Class({
    name: 'bPosition',
    properties: {
        xAxis: {
            default: '',
            tooltip: "初始x轴,相对hero"
        },
        yAxis: {
            default: '',
            tooltip: "初始y轴,相对hero"
        },
    },
});

//不限时长子弹
var bulletInfinite = cc.Class({
    name: "bulletInfinite",
    properties: {
        name: '',
        freqTime: 0,
        initPollCount: 0,
        prefab: cc.prefab,
        position: {
            default: [],
            type: bPosition,
            tooltip: '每次多少排子弹'
        },
    },
});

//有限时长子弹组
var bulletFiniteG = cc.Class({
    name: "bulletFiniteG",
    extends: bulletInfinite,
    properties: {
        finiteTime: 0,
        orginName: '',
    }
});

cc.Class({
    extends: cc.Component,

    properties: () => ({
        bulletInfinite: {
            default: null,
            type: bulletInfinite,
            tooltip: '无限时长子弹组'
        },

        bulletFiniteG: {
            default: null,
            type: bulletFiniteG,
            tooltip: '有限时长子弹组'
        },
        hero: cc.Node
    }),

    // use this for initialization
    onLoad: function () {
        this.eState = D.commonInfo.gameState.none;
        //初始化无限子弹组
        D.common.initObjPool(this, this.bulletInfinite);
        //初始化有限子弹组
        D.common.batchInitObjPool(this, this.bulletFiniteG);
    },

    /** 开始执行动作 */
    startAction: function () {
        this.eState = D.commonInfo.gameState.start;
        //生成子弹
        this.getNewbullet(this.bulletInfinite);
        this.bICallback = function(){this.getNewbullet(this.bulletInfinite);}.bind(this);
        this.schedule(this.bICallback,this.bulletInfinite.freqTime);
    },

    /** 停止一切动作 */
    pauseAction:function(){
        this.enabled = false;
        this.eState = D.commonInfo.gameState.pause;
    },

    /** 恢复状态 */
    resumeAction: function(){
        this.enabled = true;
        this.resumeAction = D.commonInfo.gameState.start;
    },

    /** 生成子弹 */
    getNewbullet: function (bulletInfo) {
        var poolName = bulletInfo.name + 'Pool';
        for (var bc = 0; bc < bulletInfo.length; bc++) {
            var newNode = D.common.getNewNode(this[poolName], bulletInfo.prefab, this.node);
            var newV2 = this.getBulletPosition(bulletInfo.position[bc]);
            newNode.setPosition(newV2);
            newNode.getComponent('bullet').bulletGroup = this;
        }
    },

    /** 获取子弹位置 */
    getBulletPosition: function (posInfo) {
        var hPos = this.hero.getPosition();
        var newV2_x = hPos.x + eval(posInfo.xAxis);
        var newV2_y = hPos.y + eval(posInfo.yAxis);
        return cc.p(newV2_x, newV2_y);
    },

    /** 子弹灭亡 */
    bulletDied : function(nodeinfo){
        //回收节点
        D.common.backObjPool(this,nodeinfo);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
