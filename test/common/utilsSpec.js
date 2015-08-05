/**
 * @file utils - 测试用例
 * @author Yao Chang(yaochang@baidu.com)
 * @date 2015-8-4
 */

define(function (require) {

    var utils = require('common/utils');

    describe('utils', function () {

        it('images loaded then execute callback', function () {

            var imagesLoaded = utils.imagesLoaded;

            var url = 'http://bs.baidu.com/resource/dajiasou/';
            var imgs = [];
            for (var i = 0, len = 10; i < len; i++) {
                var img = new Image();
                img.src = url + (i + 1) + '.jpg';
                imgs.push(img);
            }

            imagesLoaded(imgs, function () {
                tags.forEach(function (value, index) {
                    expect(value).toBeTruthy();
                });
                imgs.forEach(function (img, index) {
                    expect(img.complete).toBeTruthy();
                });
                expect(interval).toBeUndefined();
            });


        });

        it('throttle', function () {

            var throttle = utils.throttle;

            var counter1 = 0;
            var counter2 = 0;

            function fn1() {
                counter1++;
            }

            function fn2() {
                counter2 += 2;
            }

            jasmine.Clock.useMock();

            var fn = throttle([fn1, fn2], 200);
            fn();
            jasmine.Clock.tick(200);
            expect(counter1).toBe(1);
            expect(counter2).toBe(2);

        });

        it('is array', function () {
            expect(utils.isArray([])).toBe(true);
        });

        it('is object', function () {
            expect(utils.isObject({})).toBe(true);
        });

        it('merge objects', function () {
            var extend = utils.extend;

            expect(extend({}, {})).toEqual({});
            expect(extend(
                {
                    a: 1,
                    arr: [1, 2],
                    obj1: 3,
                    obj2: {},
                    obj3: {
                        a: 4,
                        arr: [5, 6]
                    }
                },
                {
                    a: 2,
                    arr: [3, 4],
                    obj1: {},
                    obj2: {
                        a: 4,
                        arr: [5, 6]
                    },
                    obj3: {
                        a: 5,
                        arr: [6, 7]
                    }
                }
            )).toEqual({
                a: 2,
                arr: [1, 2, 3, 4],
                obj1: {},
                obj2: {
                    a: 4,
                    arr: [5, 6]
                },
                obj3: {
                    a: 5,
                    arr: [5, 6, 6, 7]
                }
            });

        });

        it('get min value and index', function () {

            var getMin = utils.getMin;

            expect(getMin([])).toEqual({
                minIndex: -1,
                minHeight: Number.POSITIVE_INFINITY
            });

            expect(getMin([5, 2, 9])).toEqual({
                minIndex: 1,
                minHeight: 2
            });
        });

        it('get max value and index', function () {

            var getMax = utils.getMax;

            expect(getMax([])).toEqual({
                maxIndex: -1,
                maxHeight: Number.NEGATIVE_INFINITY
            });

            expect(getMax([5, 2, 9])).toEqual({
                maxIndex: 2,
                maxHeight: 9
            });
        });
    });
});
