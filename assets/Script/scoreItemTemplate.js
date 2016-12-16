cc.Class({
    extends: cc.Component,

    properties: {
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
        itemScore: cc.Label,
        itemTime: cc.Label
    },

    // use this for initialization
    onLoad: function () {

    },

    init: function(){
        this.itemScore.string = "积分：" + data.score;
        this.itemTime.string = "时间：" + data.time;
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
