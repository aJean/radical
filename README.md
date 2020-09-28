### radical 设计
webgl 渲染框架，提供新交互体验

#### 封装了什么
立即模式 - 保留模式，为试用者提供定制化的业务产品场景，开箱即用
- 声明式 api、可扩展服务层、应用模型、ui
- 全景编辑平台、ar 编辑器、工具链

#### 逻辑架构
操作 - 数据 - view

#### 开发架构
- 基础层：threejs、glmatrix、tensorflow、artoolkit、webrtc
- 服务层：全景、vr、场景插件
- 应用层：应用模型、ui 组件、监控、统计
- 运行时：dsl compiler、资源加载器

#### 运行架构
requestAnimationFrame - webgl render - 资源分层加载渲染

#### 工具链
cli 工具、编辑标注工具、图形处理工具、图片审核修复工具

#### 可扩展
- 构建态：语言集成
- 运行态：插件、组件、事件、function
- 编辑态：资源、热点、动效、视角
- 组件：ui 界面扩展
- 插件：渲染、动画、3d 功能扩展

#### 帧驱动
基于 questAnimationFrame 渲染绘制模式
生命周期基于 oo、loader 与 raf 建立

#### dsl
custom html tag - parser5 - js api

### 面临问题
- 如何从 web 转向 webgl 开发，建立知识模型和知识储备
- 提供什么样的功能，api、场景、扩展、工具、平台
- 怎样打通产研流程
- 如何衡量产出，产品维度、技术维度
- 如何利用其他部门的能力

#### 选型
- aframe 偏业务框架，基于 threejs
- babylon 学习路线不平缓
- twgl、regl 封装度低，偏底层 api
- threejs 社区活跃、文档成熟、面向对象、有基础 api 也有上层模型
