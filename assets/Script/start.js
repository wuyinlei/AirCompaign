cc.Class({
    extends: cc.Component,

    properties: {
        game_loading: cc.Node
    },

    // use this for initialization
    onLoad: function () {
        //找到动画组件
        var gameLoading = this.game_loading.getComponent(cc.Animation);
        gameLoading.play();  //执行动画
        cc.director.preloadScene("main");  //提前加载场景 预加载场景，可以在任何时候调用这个方法，调用完成后
        //你仍需要通过 cc.director.loadScene() 来启动场景，因为这个方法不会执行场景加载操作，计算预加载没有完成，你也可以直接
        //调用 cc.director.loadScene() ,加载完成后场景就会启动
    },

    /** 开始游戏 */
    startGame: function(){
        cc.director.loadScene('main',function(){
            console.log('main is loaded');
        })
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
