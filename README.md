# Table canvas 表格

这是一个基于 React 框架，主要利用 canvas 来绘制内容的表格项目。

# 在线预览

项目在[netlify 预览](https://circkoooooo-table.netlify.app/)

# 项目介绍

项目从渲染到交互逻辑，大概如下。

### 渲染层 - canvas 渲染表格所有样式和内容

在`canvas层`来绘制表格的所有结构和文字内容，所以表格的任何文字等都是在 canvas 中，无法选中等。

### 事件层 - 鼠标事件监听索引并映射到 canvas 层

在`interaction交互层`用来接受所有的鼠标点击移动事件等，根据表格单元格尺寸来计算对应 canvas 位置单元格的索引，从而实现记录鼠标所指位置的单元格索引。

其中封装了`Scrollbar滚动条组件`，canvas 只在可见区域里面绘制，则用滚动条组件来模拟滚动，通过偏移量来实现 canvas 内容的滚动。

### 高亮和输入框层

高亮和输入层，也是表格主体里面**可见的一层 dom 元素层**。其中高亮即为选中单元格之后的高亮边框，输入框为了方便修改样式等，用 contentEditable 的 div 元素构造的输入框。

### 数据管理层

关于表格样式和表格数据等在`redux`进行统一管理。

# 项目结构简要说明

页面布局管理主要在[Background.tsx](./src/layout/Background.tsx)中来实现，此作为布局的根组件。

[core](./src/core)实现了上述渲染、事件、高亮输入、数据管理的所有内容。

# 项目运行

```bash
# 安装包
pnpm install

# 启动项目
pnpm run start
```
