cc.Class({
    extends: cc.Component,

    properties: {
        itemPrefab: cc.Prefab,
        scrollContent: cc.Node,
        backGame: cc.Node
    },

    // use this for initialization
    onLoad: function () {
        //拿到本地存储的分数的数据  并用JSON转换成一个分数数组
        var infoData = JSON.parse(cc.sys.localStorage.getItem('score'));

        for (var i = 0; i < infoData.length; i++) {  //循环
            var item = cc.instantiate(this.itemPrefab); //精灵

            var data = infoData[i];

            this.scrollContent.addChild(item);  //添加item

            item.getComponent('scoreItemTemplate').init({

                score: data.score,  //分数
                time: data.time  //时间
                
            });
        }
        //touchstart  相当于cc.Node.EventType.TOUCH_START  触摸事件
        this.backGame.on('touchstart', this.backGameO, this);  //
    },

    backGameO: function () {
        cc.director.loadScene('end');  //回到游戏结束场景
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
