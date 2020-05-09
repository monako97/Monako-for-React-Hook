[TOC]

# Flex实现常见的几种布局

#### 1.水平，垂直居中

````html
<style type="text/css">
      .box{
          display: flex;
          width: 300px;
          height: 300px;
          border: 1px solid red;
          align-items: center;     /* 垂直居中*/
          justify-content: center; /* 水平居中*/
      }
      .item{
          width: 60px;
          height: 60px;
        	border: 1px solid black;
        	text-align: center;
        	background: blue;
      }
</style>
<div class="box">
    <div class="item item1"></div>
</div>
````

#### 2. 左边固定宽度，右边占满宽度

```html
<style type="text/css">
      .box{
          display: flex;
          width: 100%;
          height: 300px;
          border: 1px solid red;
      }
      .item1{
          width: 100px;
          background: blue;
      }
      .item2{
          flex: 1;
      }
</style>

<div class="box">
    <div class="item1"></div>
    <div class="item2"></div>
</div>
```

#### 3.顶部固定高度，下部占满剩余高度

```html
<style type="text/css">
      .box{
          display: flex;
          width: 100%;
          height: 300px;
          border: 1px solid red;
          flex-direction: column;
      }
      .item1{
          width: 100%;
          height: 20px;
          background: blue;
      }
      .item2{
          width: 100%;
          flex: 1;
          background: #F44336;
      }
</style>

<div class="box">
    <div class="item1"></div>
    <div class="item2"></div>
</div>
```

#### 4.顶部，底部固定高度，中间占满剩余高度

```html
<style type="text/css">
      .box{
          display: flex;
          width: 100%;
          height: 300px;
          border: 1px solid red;
          flex-direction: column;
      }
      .item1{
          width: 100%;
          height: 20px;
          background: blue;
      }
      .item2{
          width: 100%;
          flex: 1;
          background: #F44336;
      }
      .item3{
          width: 100%;
          height: 20px;
          background: blue;
      }
</style>

<div class="box">
    <div class="item1"></div>
    <div class="item2"></div>
    <div class="item3"></div>
</div>
```

#### 5.中部占满剩余高度，元素内部[左边固定宽度，右边占满剩余宽度]

```html
<style type="text/css">
      .box{
          display: flex;
          width: 100%;
          height: 600px;
          border: 1px solid red;
          flex-direction: column;
      }
      .header{
          height: 100px;
          width: 100%;
          background: #3be662;
      }
      .body{
          flex: 1;
          width: 100%;
          background: red;
          display: flex;
          flex-direction: row;
      }
      .footer{
          width: 100%;
          height: 100px;
          background: blue;
      }
      .left{
          width: 100px;
        background: #d7b052;
      }
      .right{
          flex: 1;
        background: #b1c2bd;
      }

</style>
<div class="box">
    <div class="header"></div>
    <div class="body">
      <div class="left"></div>    
      <div class="right"></div>    
    </div>
    <div class="footer"></div>
</div>
```

#### 兼容性写法

```css
/*盒子的兼容性写法*/
.box{
    display: -webkit-flex;  /* 新版本语法: Chrome 21+ */
    display: flex;          /* 新版本语法: Opera 12.1, Firefox 22+ */
    display: -webkit-box;   /* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
    display: -moz-box;      /* 老版本语法: Firefox (buggy) */
    display: -ms-flexbox;   /* 混合版本语法: IE 10 */   
}
/*子元素的兼容性写法*/
.item1 {            
    -webkit-flex: 1;        /* Chrome */  
    -ms-flex: 1             /* IE 10 */  
    flex: 1;                /* Spec - Opera 12.1, Firefox 20+ */
    -webkit-box-flex: 1     /* 老版本语法 - iOS 6-, Safari 3.1-6 */  
    -moz-box-flex: 1;       /* 老版本语法 - Firefox 19- */      
}
```

