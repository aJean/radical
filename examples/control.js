/**
 * @file 场景化插件脚本
 * @author liwenhui01@baidu.com
 */
define(function () {
    function control() {
        /* 指向自身的变量*/
        var self = this;
        /* 场景*/
        this.scene = null;

        /* 相机*/
        this.camera = null;

        /* 画布的dom对象，可以在此dom上添加点击事件、拖动事件*/
        this.canvasDom = null;

        /* Three.js的全局变量*/
        this.three = null;

        /* 场景化类库的全局变量*/
        this.webvr = null;

        /* 自定义的参数*/
        var opt = null;

        /* 设置自定义参数*/
        this.setOpt= function(value){
            opt = value;
        }

        /* 应用开始之前执行
        *  返回值：ture 继续执行；false 中断执行
        * */
        this.onAppStart = function () {
            console.log("onAppStart");
            return true;
        };

        /* 当浏览器不支持webgl时执行 */
        this.onUnSupport = function () {
            console.log("onUnSupport");
        }

        /* 加载json文件前执行
       *  返回值：ture 继续执行；false 中断执行
       * */
        this.beforeLoadJson = function () {
            console.log("beforeLoadJson");
            return true;
        }

        /* 加载json文件成功后执行*/
        this.loadJsonSuccess = function () {
            console.log("loadJsonSuccess");
        }

        /* 加载json文件失败后执行*/
        this.loadJsonError = function () {
            console.log("loadJsonError");
        }

        /* 设置项目的json对象
        *  返回值：设置的json对象
        *
        *   this.setDataJson = function () {
        *       var dataJson;
        *       return dataJosn;
        *   }
        */

        /* 初始化之前执行
        *  返回值：ture 继续执行；false 中断执行
        * */
        this.beforeInit = function () {
            console.log("beforeInit");
            return true;
        }

        /* 初始化后执行*/
        this.afterInit = function () {
            console.log("afterInit");
        }

        /* 渲染之前执行*/
        this.beforeRender = function () {
            //console.log("beforeRender");
        }

        /* 渲染之后执行*/
        this.afterRender = function () {
            //console.log("afterRender");
        }

        /* 进入场景之前执行
        *  参数1 当前场景对象，参数2 将要进入的场景对象
        *  返回值：ture 继续执行；false 中断执行
        * */
        this.beforeEnterScene = function (currentScene, nextScene) {
            console.log("beforeEnterScene");
            return true;
        }

        /* 进入场景之后执行
        * 参数 当前场景对象
        * */
        this.afterEnterScene = function (currentScene) {
            console.log("afterEnterScene");
        }
    }
    return new control();
});