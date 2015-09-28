var millisecond = 750;
var elementProxy = {};
var holdTimeout,touchTimeout;
//调用事件
function runevent(element,name){
    if(window.jQuery || window.Zepto){
        $(element).trigger(name);
        return false;
    };
    var evt = document.createEvent('Event');
    evt.initEvent(name, true, true);
    element.dispatchEvent(evt);
}
//清理时间
function clearLongTime(){
    if(holdTimeout){
        clearTimeout(holdTimeout);
        holdTimeout = null;
    }
}
function getX_Y(event){
    var client = event.touches[0] || event.changedTouches[0];
    return {
        x : client.clientX,
        y : client.clientY
    }
}
function touchstart(ev){
    var element            = ev.touches[0].target;
    var point              = getX_Y(ev);
    elementProxy.x         = point.x;
    elementProxy.y         = point.y;
    elementProxy.mx        = 0;
    elementProxy.my        = 0;
    elementProxy.element   = element;
    var now = Date.now();
    var delta = now - (elementProxy.last_time || 0)
    elementProxy.last_time = Date.now();
    if(delta < 250){
        elementProxy.doubleTap = true;
    }
    holdTimeout = setTimeout(function(){
        runevent(elementProxy.element,'hold');
        elementProxy = {};
    },millisecond);
}
function touchmove(ev){
    clearLongTime();
}
function touchend(ev){
    clearLongTime();
    var point = getX_Y(ev);
    elementProxy.mx = Math.abs(point.x - elementProxy.x);
    elementProxy.my = Math.abs(point.y - elementProxy.y);
    if(elementProxy.mx > 50){
        if(elementProxy.x < point.x){
            runevent(elementProxy.element,'swipRight');
        }else{
            runevent(elementProxy.element,'swipLeft');
        }
        elementProxy = {};
        return true;
    }
    if(elementProxy.my > 50){
        if(elementProxy.y < point.y){
            runevent(elementProxy.element,'swipDown');
        }else{
            runevent(elementProxy.element,'swipTop');
        }
        elementProxy = {};
        return true
    }
    if(elementProxy.element){
        runevent(elementProxy.element,'tap');
        if(elementProxy.doubleTap){
            runevent(elementProxy.element,'dbtap');
        }
    }
    touchTimeout = setTimeout(function(){
        clearTimeout(touchTimeout);
        touchTimeout = null;
        elementProxy = {};
    },250);
}
// uc游览器
// 关闭默认手势
try {navigator.control.gesture(false);} catch (e) {}
 
// 关闭长按弹出菜单
try {navigator.control.longpressMenu(false);} catch (e) {}

document.addEventListener('touchstart',touchstart);
document.addEventListener('touchstart',touchstart);
document.addEventListener('touchmove',touchmove);
document.addEventListener('touchend',touchend);
document.addEventListener('touchcancel',touchend);