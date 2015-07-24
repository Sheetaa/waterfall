var utils = (function () {
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

    function getArray(obj, num) {
        var arr = [];
        for (var i = 0; i < num; i++) {
            arr[i] = obj;
        }
        return arr;
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

    return {
        imagesLoaded: imagesLoaded,
        getArray: getArray,
        getMin: getMin
    };
})();
