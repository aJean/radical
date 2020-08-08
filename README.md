### radical 设计
webgl 渲染框架，提供新交互体验

#### 封装了什么
立即模式 - 保留模式，为试用者提供定制化的业务产品场景，开箱即用
- 声明式 api、可扩展服务层、应用模型、ui

#### 逻辑架构
操作 - 数据 - view

#### 开发架构
- 基础层：threejs、glmatrix、tensorflow、webrtc
- 服务层：全景、vr、场景插件
- 应用层：应用模型、ui 组件、监控、统计
- 运行时：dsl compiler、资源加载器

#### 运行架构
requestAnimationFrame - webgl render - 资源分层加载渲染

#### 工具链
cli 工具、编辑标注工具、图形处理工具、图片修复工具、浏览器插件

#### 可扩展
- 构建态：语言集成
- 运行态：插件、组件、事件、function
- 编辑态：资源、热点、动效、视角
- 组件：ui 界面扩展
- 插件：渲染、动画、3d 功能扩展

#### 帧驱动
基于 questAnimationFrame 渲染绘制模式
生命周期基于 oo、loader 与 raf 建立
