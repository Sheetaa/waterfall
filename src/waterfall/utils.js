/**
 * @file 瀑布流依赖的工具函数
 * @author Yao Chang(yaochang@baidu.com)
 * @date 2015-7-21
 */

define(function (require) {

    /**
     * 判断给定所有图片是否都已经加载完成
     *
     * @param {Array.<HTMLImageElement>} imgs 图片DOM数组
     * @param {Function} callback 图片加载完成以后执行的回调函数
     */
    function imagesLoaded(imgs, callback) {
        var len = imgs.length;
        var tags = [];
        for (var i = 0; i < len; i++) {
            tags[i] = false;
        }
        imgs.forEach(function (img, index) {
            img.onload = function () {
                tags[index] = true;
            };
            img.onerror = function () {
                tags[index] = true;
            };
        });
        var interval = setInterval(function () {
            var tag = true;
            tags.forEach(function (value, index) {
                if (value === false) {
                    tag = false;
                }
            });
            if (tag === true) {
                clearInterval(interval);
                callback(imgs);
            }
        }, 100);
    }

    /**
     * 节流阀函数，控制回调函数每指定间隔执行一次
     * 特点：可以控制一批函数
     *
     * @param {Array.<Function>} callbackList 要控制的回调函数列表
     * @param {number} interval 函数执行时间间隔
     * @return {Function} 闭包
     */
    function throttle(callbackList, interval) {
        var previous = 0;
        var timerList = [];

        function isTimer() {
            if (!timerList.length) {
                return false;
            }
            return timerList.some(function (element) {
                if (element) {
                    return true;
                }
            });
        }

        return function () {
            var now = new Date().getTime();
            if (!previous) {
                previous = now;
            }
            var remaining = interval - now + previous;
            if (remaining <= 0) {
                if (isTimer()) {
                    timerList.forEach(function (value) {
                        clearTimeout(value);
                    });
                    timerList = [];
                }
                previous = now;
            }
            if (remaining > 0 && !timerList.length) {
                callbackList.forEach(function (value) {
                    timerList.push(setTimeout(value, remaining));
                });
            }
        };
    }

    /**
     * 合并对象，将源对象合并到目标对象中，然后返回目标对象
     * 遇到相同的键，替换之；遇到值为数组的，合并数组
     *
     * @param {Object} target 目标对象
     * @param {Object} source 源对象
     * @return {Object} target 返回目标对象
     */
    function extend(target, source) {
        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                if (target[key] && isArray(target[key])) {
                    target[key] = target[key].concat(source[key]);
                }
                else if (target[key] && isObject(target[key])) {
                    target[key] = extend(target[key], source[key]);
                }
                else {
                    target[key] = source[key];
                }
            }
        }
        return target;
    }

    /**
     * 判断是不是数组
     *
     * @param {Object} arr 对象
     * @return {boolean} 返回真假值
     */
    function isArray(arr) {
        return Object.prototype.toString.call(arr) === '[object Array]';
    }

    /**
     * 判断是不是对象
     *
     * @param {Object} obj 对象
     * @return {boolean} 返回真假值
     */
    function isObject(obj) {
        return Object.prototype.toString.call(obj) === '[object Object]';
    }

    /**
     * 计算数组的最小值和相应索引
     *
     * @param {Array.<number>} arr 待计算数组
     * @return {Object} 返回最小值和索引
     */
    function getMin(arr) {
        var minIndex = 0;
        var minHeight = Number.POSITIVE_INFINITY;
        for (var i = 0, len = arr.length; i < len; i++) {
            if (arr[i] < minHeight) {
                minIndex = i;
                minHeight = arr[i];
            }
        }
        return {
            minIndex: minIndex,
            minHeight: minHeight
        };
    }

    /**
     * 计算数组的最大值和相应索引
     *
     * @param {Array.<number>} arr 待计算数组
     * @return {Object} 返回最大值和索引
     */
    function getMax(arr) {
        var maxIndex = 0;
        var maxHeight = Number.NEGATIVE_INFINITY;
        for (var i = 0, len = arr.length; i < len; i++) {
            if (arr[i] > maxHeight) {
                maxIndex = i;
                maxHeight = arr[i];
            }
        }
        return {
            maxIndex: maxIndex,
            maxHeight: maxHeight
        };
    }

    return {
        imagesLoaded: imagesLoaded,
        throttle: throttle,
        extend: extend,
        getMin: getMin,
        getMax: getMax
    };
});
