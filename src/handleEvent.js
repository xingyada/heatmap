"use strict";

import {CONSTANT as CONST, globalConfig} from './config';
import thumbnail from './thumbnail';
import cache from './cache';
import utils from './utils';

// 事件处理对象
var handleEvent = {
    init: function (isbind) {
        if (this.isbind) return;
        this.isbind = isbind;
        this.globalUnbind();
        this.globalBind();
    },
    globalBind: function () {
        document.addEventListener('mousedown', this.mouseDown, false);
        document.addEventListener('mousemove', this.mouseMove, false);
        document.addEventListener('mouseup', this.mouseUp, false);
        this.isbind = true;
    },
    globalUnbind: function () {
        document.removeEventListener('mousedown', this.mouseDown, false);
        document.removeEventListener('mousemove', this.mouseMove, false);
        document.removeEventListener('mouseup', this.mouseUp, false);
        this.isbind = false;
    },
    mouseDown: function (event) {
        // 点击滑块
        var slider = event.target;
        if (slider.classList.contains(CONST.HM_MINI_SLIDER)) {
            document.body.classList.add(CONST.HM_USER_SELECT);
            handleEvent.isDrag = true;
            handleEvent.heatmap = cache.get(slider.getAttribute(CONST.HM_ID) * 1);
            handleEvent.offsetX = event.offsetX || 0;
            handleEvent.offsetY = event.offsetY || 0;
            // 回调函数
            handleEvent.heatmap.opt.onDragStart.call(handleEvent.heatmap, event);
        }
    },
    mouseMove: function (event) {
        // 拖拽状态, 拖拽元素
        if (!handleEvent.isDrag) return;
        // 函数节流
        if (!utils.throttle(new Date().getTime())) return;
        // 计算坐标移动滑块
        var heatmap = handleEvent.heatmap,
            offset = heatmap.mini.container.getBoundingClientRect();
        var y = event.pageY - handleEvent.offsetY - offset.top;
        var computed = getComputedStyle(heatmap.mini.slider) || {};
        var h = computed.height.replace(/px/, '')*1;
        thumbnail.move.call(heatmap, {
            y: utils.getSliderCoordY.call(heatmap, y, h),
            h: h
        });
        // 回调函数(联动通过回调函数来解决)
        handleEvent.heatmap.opt.onDrag.call(handleEvent.heatmap, event);
    },
    mouseUp: function (event) {
        document.body.classList.remove(CONST.HM_USER_SELECT);
        delete handleEvent.heatmap;
        delete handleEvent.isDrag;
        delete handleEvent.offsetX;
        delete handleEvent.offsetY;
        // 回调函数(联动通过回调函数来解决)
        handleEvent.heatmap.opt.onDragEnd.call(handleEvent.heatmap, event);
    }
};

export default handleEvent;