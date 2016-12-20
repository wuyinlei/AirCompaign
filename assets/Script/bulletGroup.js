//子弹生成位置
var bPosition = cc.Class({
    name: 'bPosition',
    properties: {
        xAxis: {
            default: '',
            tooltip: '初始x轴，相对hero',
        },
        yAxis: {
            default: '',
            tooltip: '初始y轴，相对hero'
        },
    },
});

//不限时长子弹
var bulletInfinite = cc.Class({
    name: 'bulletInfinite',
    properties: {
        name: '',
        freqTime: 0,
        initPollCount: 0,
        prefab: cc.Prefab,
        position: {
            default: [],
            type: bPosition,
            tooltip: '每次多少排子弹',
        }
    }
});

//有限时长子弹组
var bulletFiniteG = cc.Class({
    name: 'bulletFiniteG',
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
            default: [],
            type: bulletFiniteG,
            tooltip: '有限时长子弹组'
        },
        hero: cc.Node,
    }),

    // use this for initialization
    onLoad: function () {
        this.eState = D.commonInfo.gameState.none;
        //初始化无限子弹组
        D.common.initObjPool(this, this.bulletInfinite);
        //初始化🈶限子弹组
        D.common.batchInitObjPool(this, this.bulletFiniteG);
    },

    //开始执行动作
    startAction: function () {
        //游戏状态
        this.eState = D.commonInfo.gameState.start;
        //生成子弹
        this.getNewbullet(this.bulletInfinite);
        //构造执行动作
        this.bICallback = function () { this.getNewbullet(this.bulletInfinite); }.bind(this);
        //第一个参数是  处理回调的方法   既可以使用CCClass的成员方法，也可以声明一个匿名的函数
        //第二个参数间隔时间
        this.schedule(this.bICallback, this.bulletInfinite.freqTime); //定时器   定时执行

    },

    /** 暂停动作 */
    pauseAction: function () {
        this.enabled = false;
        //当前游戏状态改为暂停
        this.eState = D.commonInfo.gameState.pause;
    },

    /** 恢复动作 */
    resumeAction: function () {
        this.enabled = true;
        this.eState = D.commonInfo.gameState.start;
    },
    //换子弹
    changeBullet: function (ufoBulletName) {
        this.unschedule(this.bICallback);  //根据指定的回调函数和调用对象。
        this.unschedule(this.bFCallback); //取消
        for (var bi = 0; bi < this.bulletFiniteG.length; bi++) {

            if (this.bulletFiniteG[bi].orginName == ufoBulletName) {
                this.bFCallback = function (e) { this.getNewbullet(this.bulletFiniteG[e]); }.bind(this, bi);
                this.schedule(this.bFCallback, this.bulletFiniteG[bi].freqTime, this.bulletFiniteG[bi].finiteTime);
                var delay = this.bulletFiniteG[bi].freqTime * this.bulletFiniteG[bi].finiteTime;
                //第一个参数处理回调的方法  第二个参数是子弹发射间隔      第三个参数是一直重复   第四个是重复时间
                this.schedule(this.bICallback, this.bulletInfinite.freqTime, cc.macro.REPEAT_FOREVER, delay);
            }
        }
    },
    //生成子弹
    getNewbullet: function (bulletInfo) {
        var poolName = bulletInfo.name + 'Pool';  //名字
        for (var bc = 0; bc < bulletInfo.position.length; bc++) { //子弹长度
            //构建新的节点
            var newNode = D.common.genNewNode(this[poolName], bulletInfo.prefab, this.node);
            var newV2 = this.getBulletPostion(bulletInfo.position[bc]); //位置
            newNode.setPosition(newV2); //给新节点设置位置
            newNode.getComponent('bullet').bulletGroup = this; //
        }
    },
    //获取子弹位置
    getBulletPostion: function (posInfo) {
        var hPos = this.hero.getPosition(); //当前飞机所在位置
        //eval  将一个JS代码字符串求值成特定的对象 xAxis这个在设置的时候是一个js代码  比如 this.hero.width / 2 
        var newV2_x = hPos.x + eval(posInfo.xAxis);
        var newV2_y = hPos.y + eval(posInfo.yAxis);
        return cc.p(newV2_x, newV2_y);  //回传位置信息
    },

    //子弹灭亡
    bulletDied: function (nodeinfo) {
        //回收节点
        D.common.backObjPool(this, nodeinfo);
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});