cc.Class({
    extends: cc.Component,

    properties: ()=>({
        blowupani: {
            default: null,
            type: cc.Prefab,
            tooltip : '爆炸动画'
        },

        gameOverClip: cc.AudioClip,

        main:{
            default: null,
            type: require('main')
        },

        bulletGroup:{
            default: null,
            type: require('bulletGroup')
        }
    }),

    // use this for initialization
    onLoad: function () {

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
