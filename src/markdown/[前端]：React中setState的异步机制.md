[TOC]

# React：setState的异步机制

#### setState为什么是异步的、什么时候是异步的？

setState本身的执行过程是同步的，只是因为在react的合成事件与钩子函数中执行顺序在更新之前，所以不能直接拿到更新后的值，形成了所谓的异步；

#### 能不能同步，什么时候是同步的？

可以同步，在ajax、原生事件与setTimeout中是同步的

1. **setState在生命周期和合成事件中批量覆盖执行**

   > 在React的生命周期钩子和合成事件中，多次执行setState，会批量执行。
   >
   > 
   >
   > 
   >
   > 具体表现为，多次同步执行的setState，会进行合并，类似于Object.assign，相同的key，后面的会覆盖前面的，当遇到多个setState调用时候，会提取单次传递setState的对象，把他们合并在一起形成一个新的单一对象，并用这个单一的对象去做setState的事情，就像Object.assign的对象合并，后一个key值会覆盖前面的key值

```javascript
const a = {name : 'kong', age : '17'}
const b = {name : 'fang', sex : 'men'}
Object.assign({}, a, b);
//{name : 'fang', age : '17', sex : 'men'}
```

2. **setState在原生事件，setTimeout，setInterval，Promise等异步操作中，state会同步更新**异步操作中setState，即使在React的钩子或合成事件中，state都不会批量更新，而是会同步更新，
   多次连续操作setState，每次都会re-render，state会同步更新

3. **setState的基本过程**

   setState的调用会引起React的更新生命周期的4个函数执行。

   shouldComponentUpdate、componentWillUpdate、render、componentDidUpdate

   1. shouldComponentUpdate：返回true，进行下一步

      this.state没有被更新，返回false，停止，更新 state

   2. componentWillUpdate：state没有被更新

   3. render：state被更新。

   > 总之，直到下一次render函数调用(或者下一次shouldComponentUpdate返回false时)才能得到更新后的state

4. **获取更新后的状态可以有3种方法：**

   * **setState函数式**

   * **setState在setTimeout，Promise等异步中执行**

   * **setState callback**

     ```react
     setState({
         index: 1
     }}, function(){
         console.log(this.state.index);
     })
     ```

#### setState的缺点

1. **setState有可能循环调用**

   调用setState之后，shouldComponentUpdate、componentWillUpdate、render、componentDidUpdate 等生命周期函数会依次被调用（如果shouldComponentUpdate没有返回 false的话），如果我们在render、componentWillUpdate或componentDidUpdate中调用了setState方法，那么可能会造成循环调用，最终导致浏览器内存占满后崩溃

2. **setState可能会引发不必要的渲染**

   1. 新 state 和之前的一样。这种情况可以通过 shouldComponentUpdate 解决。

   2. state 中的某些属性和视图没有关系（譬如事件、timer ID等），这些属性改变不影响视图的显示。

3. **setState并不总能有效地管理组件中的所有状态**

   因为组件中的某些属性是和视图没有关系的，当组件变得复杂的时候可能会出现各种各样的状态需要管理，这时候用setState管理所有状态是不可取的。state中本应该只保存与渲染有关的状态，而与渲染无关的状态尽量不放在state中管理，可以直接保存为组件实例的属性，这样在属性改变的时候，不会触发渲染，避免浪费

#### setState和replaceState的区别

> **setState：** 是修改其中的部分状态，相当于Object.assign，只是覆盖，不会减少原来的状态
>
> **replaceState：** 是完全替换原来的状态，相当于赋值，将原来的state替换为另一个对象，如果新状态属性减少，那么state中就没有这个状态了

