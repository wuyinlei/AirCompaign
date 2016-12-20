cc.Class({
    extends: cc.Component,

    properties: {
        itemScore: cc.Label,
        itemTime: cc.Label
    },

    // use this for initialization
    onLoad: function () {

    },
    init: function(data) {
        this.itemScore.string = '积分：' + data.score;  //通过data 得到分数和时间  并且进行设置
        this.itemTime.string = '时间：' + data.time;
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});