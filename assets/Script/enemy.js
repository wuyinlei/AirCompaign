cc.Class({
    extends: cc.Component,

    properties: {
        xMinSpeed: {
            default: 0,
            type: cc.Integer,
            tooltip: "x轴最小速度"
        },
        xMaxSpeed: {
            default: 0,
            type: cc.Integer,
            tooltip: "x轴最大速度"
        },
        yMinSpeed: {
            default: 0,
            type: cc.Integer,
            tooltip: "y轴最小速度"
        },
        yMaxSpeed: {
            default: 0,
            type: cc.Integer,
            tooltip: "y轴最大速度"
        },
        initHP: {
            default: 0,
            type: cc.Integer,
            tooltip: "初始生命值"
        },
        initSpriteFreme: {
            default: null,
            type: cc.SpriteFrame,
            tooltip: "初始化的图像"
        },
        score: {
            default: 0,
            type: cc.Integer,
            tooltip: "死后获得的分数"
        },
        enemyDownClip: cc.AudioClip
    },

    // use this for initialization
    onLoad: function () {
        console.log('enemy onLoad');
        //获取碰撞系统  var manager = cc.director.getCollisionManager();
        //默认碰撞系统是禁用的，如果需要使用则需要开启碰撞检测系统
        //manager.enabled = true
        cc.director.getCollisionManager().enabled = true;

        this.xSpeed = Math.random() * (this.xMaxSpeed - this.xMinSpeed) + this.xMinSpeed;
        this.ySpeed = Math.random() * (this.yMaxSpeed - this.yMinSpeed) + this.yMinSpeed;
        this.enemyGroup = this.node.parent.getComponent('enemyGroup');  //获取enemyGroup对象
    },

    init: function () {
        if (this.node.group != 'enemy') {
            this.node.group = 'enemy';
        }
        if (this.hP != this.initHP) {
            this.hP = this.initHP;
        }
        var nSprite = this.node.getComponent(cc.Sprite);
        if (nSprite.spriteFrame != this.initSpriteFreme) {
            nSprite.spriteFrame = this.initSpriteFreme;
        }

    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if (this.enemyGroup.eState != D.commonInfo.gameState.start) {
            return;
        }
        //分数不同，速度不同
        var scores = this.enemyGroup.getScore();
        if (scores < 50000) {
            this.node.y += dt * this.ySpeed;
        }
        else if (scores > 50000 && scores < 100000) {
            this.node.y += dt * this.ySpeed - 0.5;
        }
        else if (scores > 100000 && scores < 150000) {
            this.node.y += dt * this.ySpeed - 1;
        }
        else if (scores > 150000 && scores < 200000) {
            this.node.y += dt * this.ySpeed - 1.5;
        }
        else if (scores > 200000 && scores < 250000) {
            this.node.y += dt * this.ySpeed - 2;
        }
        else if (scores > 250000 && scores < 300000) {
            this.node.y += dt * this.ySpeed - 2.5;
        } else {
            this.node.y += dt * this.ySpeed - 3;
        }

        this.node.x += dt * this.xSpeed;
        //子弹出屏幕之后，回收节点
        if (this.node.y < -this.node.parent.height / 2) {
            this.enemyGroup.enemyDied(this.node, 0);  //回收节点
        }

    },

    /**
     * 碰撞检测
     * Cocos Creator中内置了一个简单易用的碰撞检测系统,他会根据添加的碰撞组件进行碰撞检测,
     * 当一个碰撞组件被启用的时候,这个碰撞组件会被自动的添加到碰撞检测系统中,并搜索能够与它进行碰撞的其他已经
     * 添加的碰撞组件来生成一个碰撞对,需要注意的是,一个节点上的碰撞组件,无论如何都不会相互进行碰撞检测的
     * @param {Collider} other  产生碰撞的另一个碰撞组件
     * @param {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionEnter: function (other, self) {
        if (other.node.group != 'bullet') {  //当前节点是否匹配子弹节点
            return;
        }
        var bullet = other.node.getComponent('bullet'); //获取到子弹组件
        if (this.hP > 0) {  //血量值
            //防止再次碰撞
            this.hP -= bullet.hpDrop;
        } else {
            return;
        }
        if (this.hP <= 0) {
            this.node.group = 'default'; //不让动画在执行碰撞
            //播放动画
            var anim = this.getComponent(cc.Animation);
            var animName = self.node.name + 'ani';
            anim.play(animName);
            anim.on('finished', this.onFinished, this);
            //播放音效
            cc.audioEngine.playEffect(this.enemyDownClip, false);

        }
    },

    //动画结束后，动画节点回收
    onFinished: function (event) {
        this.enemyGroup.enemyDied(this.node, this.score);
    }
});
