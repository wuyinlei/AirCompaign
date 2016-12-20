var gameState = cc.Enum({
    none: 0,
    start: 1,
    stop: 2
});

var common = cc.Class({

    extends: cc.Component,

    properties: {

    },

    statics: {
        gameState
    },


    // use this for initialization
    onLoad: function () {
        D.commonInfo = common;  //公共变量
        D.common = this; //公共方法
    },

    //批量初始化对象池
    batchInitObjPool: function (this0, objArray) {
        for (var i = 0; i < objArray.length; i++) {
            var objinfo = objArray[i];
            this.initObjPool(this0, objinfo);
        }
    },

    //初始化对象池
    initObjPool: function (this0, objInfo) {
        var name = objInfo.name;
        var poolName = name + 'Pool';
        this0[poolName] = new cc.NodePool();

        let initPollCount = objInfo.initPollCount;  //初始化的大小

        for (let ii = 0; ii < initPollCount; ii++) {
            let node0 = cc.instantiate(objInfo.prefab);//创建预制节点
            this0[poolName].put(node0); //通过 putInPoll 接口放入对象池  向缓冲池中存入一个不再需要的节点对象，这个
            //函数会自动的将目标节点从父节点上移除，但是不会进行cleanup操作，这个函数会调用poolHandlerComp的unuse函数，如果
            //组件和函数都存在的话。
        }
    },

    //生成节点
    getNewNode: function (pool, prefab, nodeParent) {
        let newNode = null;
        if (pool.size() > 0) { //通过size 接口判断对象池中是否有空闲的对象
            newNode = pool.get();
        } else {
            newNode = cc.instantiate(prefab); //如果没有空闲的对象，也就是说对象池中的备用对象不够， 才用cc.instantiate重新创建
        }
        nodeParent.addChild(newNode);  //因为传入过来的有该生成节点的父节点  生成之后添加到父节点上
        return newNode;
    },

    //放回对象池
    backObjPool: function (this0, nodeinfo) {
        var poolName = nodeinfo.name + 'Pool';
        this0[poolName].put(nodeinfo); //放回缓存池  返回NodePool对象
    },

    //时间格式化
    timeFmt: function (time, fmt) {
        var o = {
            "M+": time.getMonth() + 1, //月份
            "d+": time.getDate(), //日
            "h+": time.getHours(), //小时
            "m+": time.getMinutes(), //分钟
            "s+": time.getSeconds(), //秒
            "q+": Math.floor((time.getMonth() + 3) / 3), //季度
            "S": time.getMilliseconds() // 毫秒
        };

        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (time.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        }
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
