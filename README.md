### radical 设计
webgl 渲染框架，提供新交互体验

#### 逻辑架构
操作 - 数据 - view

#### 开发架构
- 底层：平台、threejs
- 渲染层：api、插件
- 应用层：组件、面向对象、生命周期，业务模型
- 运行时：加载器、实例管理、性能管理

#### 运行架构
requestAnimationFrame - webgl render - 资源分层加载渲染

#### 可扩展
- 构建态：语言集成
- 运行态：插件、组件、事件、function
- 编辑态：资源、热点、动效、视角

#### 扩展方式
- 组件： ui 界面扩展
- 插件： 渲染、动画、3d 功能扩展

#### 帧驱动
基于 questAnimationFrame 渲染绘制模式
生命周期基于 oo、loader 与 raf 建立

![](https://raw.githubusercontent.com/aJean/radical/master/frame.png)
