cc.Class({
    extends: cc.Component,

    properties: () => ({
        blowupani: {
            default: null,
            type: cc.Prefab,
            tooltip: '爆炸动画'
        },

        gameOverClip: cc.AudioClip,

        main: {
            default: null,
            type: require('main')
        },

        bulletGroup: {
            default: null,
            type: require('bulletGroup')
        }
    }),

    // use this for initialization
    onLoad: function () {
        this.eState = D.commonInfo.gameState.none;  //英雄状态
        cc.director.getCollisionManager().enabled = true;
        this.onDrag();  //拖拽监听
    },

    //添加拖动监听
    onDrag: function () {
        //touchmove  相当于cc.Node.EventType.TOUCH_MOVE  滑动监听
        this.node.on('touchmove', this.dragMove, this);
    },

    //去掉拖动监听
    offDrag: function () {
        this.node.off('touchmove', this.dragMove, this);
    },

    //拖动
    dragMove: function (event) {
        var locationv = event.getLocation();
        //将一个点转换到节点 (局部) 空间坐标系。结果以 Vec2 为单位。<br/>
        //返回值将基于节点坐标。
        var location = this.node.parent.convertToNodeSpaceAR(locationv);
        //飞机不飞出屏幕
        var minX = -this.node.parent.width / 2 + this.node.width / 2;
        var maxX = -minX;
        var minY = -this.node.parent.height / 2 + this.node.height / 2;
        var maxY = -minY;
        //以下是对于英雄机的位置的调整 以确保飞机都在屏幕场景中出现
        if (location.x < minX) {
            location.x = minX;
        }
        if (location.x > maxX) {
            location.x = maxX;
        }
        if (location.y < minY) {
            location.y = minY;
        }
        if (location.y > maxY) {
            location.y = maxY;
        }
        this.node.setPosition(location);
    },

    /** 碰撞检测 */
    onCollisionEnter: function (other, self) {
        if (other.node.group == 'ufo') {  //另个节点是ufo  也就是子弹
            if (other.node.name == 'ufoBullet') { // 如果当前节点的名字是ufoBullet  
                this.bulletGroup.changeBullet(other.node.name); //改变子弹  就是加一个子弹轨道
            } else if (other.node.name == 'ufoBomo') { //如果是生命值
                this.main.getUfoBomb();
            }
        } else if (other.node.group == 'enemy') {  //敌机  如果走这个方法逻辑  证明和敌机相撞  就去死啊  
            //播放动画
            var po = this.node.getPosition();  //当前飞机的位置
            var blowup = cc.instantiate(this.blowupani);
            this.node.parent.addChild(blowup);  //添加爆炸预制资源
            blowup.setPosition(po);//设置爆炸位置就是当前飞机相撞的位置

            var animation = blowup.getComponent(cc.Animation); //动画节点
            animation.on('finished', this.onFinished, blowup); //播放
            //播放音效
            cc.audioEngine.playEffect(this.gameOverClip, false);
            //清除节点
            this.node.destory();  //销毁该对象  并释放所有它对其他对象的引用
            //更新分数
            this.main.gameOver(); //游戏结束
        } else {
            return false;
        }
    },

    onFinished: function (event) {
        this.destory();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
