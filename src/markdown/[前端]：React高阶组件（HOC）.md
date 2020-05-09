[TOC]

# React高阶组件

> 类似于高阶函数，即指接受React组件作为参数，输出一个新的组件的函数，在这个函数中，我们可以修饰组件的 props 与 state，所以在一些特定情况下高阶组件可以让我们的代码看起来更优美，更具有复用性。
>
> - 高阶组件就是一个没有副作用的纯函数，各个高阶组件不会互相依赖耦合
> - 高阶组件也有可能造成冲突，但我们可以在遵守约定的情况下避免这些行为
> - 高阶组件并不关心数据使用的方式和原因，而被包裹的组件也不关心数据来自何处。高阶组件的增加不会为原组件增加负担

#### 主要两种实现方式

1. **属性代理**==props proxy==: 高阶组件通过被包裹的React组件来操作props

   ```react
   function proxyHOC(WrappedComponent) {
     return class extends Component {
       render() {
         return <WrappedComponent {...this.props} />;
       }
     }
   }
   ```

   对比原生组件增强的项

   - 可操作所有传入的 ==props==
   - 可操作组件的生命周期
   - 可操作组件的 ==static==方法
   - 获取 ==refs==

2. **反向继承**==inheritance inversion==: 高阶组件继承于被包裹的React组件

   对比原生组件增强的项：

   - 可操作所有传入的==props==
   - 可操作组件的生命周期
   - 可操作组件的 ==static==方法
   - 获取 ==refs==
   - 可操作 ==state==
   - 可以渲染劫持

   ```react
   function inheritHOC(WrappedComponent) {
     return class extends WrappedComponent {
       render() {
         return super.render();
       }
     }
   }
   ```

#### 应用场景

##### 可以实现的功能：

###### 组合渲染

> 可使用任何其他组件和原组件进行组合渲染，达到样式、布局复用等效果

```react
// 属性代理实现
function stylHOC(WrappedComponent) {
  return class extends Component {
    render() {
      return (<div>
        <div className="title">{this.props.title}</div>
        <WrappedComponent {...this.props} />
      </div>);
    }
  }
}
// 反向继承实现
function styleHOC(WrappedComponent) {
  return class extends WrappedComponent {
    render() {
      return <div>
        <div className="title">{this.props.title}</div>
        {super.render()}
      </div>
    }
  }
}
```

###### 条件渲染

> 根据特定的属性决定原组件是否渲染

```react
// 属性代理实现
function visibleHOC(WrappedComponent) {
  return class extends Component {
    render() {
      if (this.props.visible === false) return null;
      return <WrappedComponent {...props} />;
    }
  }
}
// 反向继承实现
function visibleHOC(WrappedComponent) {
  return class extends WrappedComponent {
    render() {
      if (this.props.visible === false) return null
      else return super.render()
    }
  }
}
```

###### 操作props

```react
// 通过属性代理实现
function proxyHOC(WrappedComponent) {
  return class extends Component {
    render() {
      const newProps = {
        ...this.props,
        user: 'ConardLi'
      }
      return <WrappedComponent {...newProps} />;
    }
  }
}
```

###### 获取refs

```react
// 通过属性代理实现
function refHOC(WrappedComponent) {
  return class extends Component {
    componentDidMount() {
      this.wapperRef.log()
    }
    render() {
      return <WrappedComponent {...this.props} ref={ref => { this.wapperRef = ref }} />;
    }
  }
}
```

###### 状态管理

```react
// 通过属性代理实现
function proxyHoc(WrappedComponent) {
  return class extends Component {
    constructor(props) {
      super(props);
      this.state = { value: '' };
    }
    onChange = (event) => {
      const { onChange } = this.props;
      this.setState({
        value: event.target.value,
      }, () => {
        if(typeof onChange ==='function') onChange(event);
      })
    }
    render() {
      const newProps = {
        value: this.state.value,
        onChange: this.onChange,
      }
      return <WrappedComponent {...this.props} {...newProps} />;
    }
  }
}

class HOC extends Component {
  render() {
    return <input {...this.props}></input>
  }
}

export default proxyHoc(HOC);
```

###### 操作state

```react
// 通过反向继承实现
function debugHOC(WrappedComponent) {
  return class extends WrappedComponent {
    render() {
      console.log('props', this.props);
      console.log('state', this.state);
      return (
        <div className="debuging">
          {super.render()}
        </div>
      )
    }
  }
}
```

###### 渲染劫持

```react
// 通过反向继承实现
function hijackHOC(WrappedComponent) {
  return class extends WrappedComponent {
    render() {
      const tree = super.render();
      let newProps = {};
      if (tree && tree.type === 'input') newProps = { value: '渲染被劫持了' };
      const props = Object.assign({}, tree.props, newProps);
      const newTree = React.cloneElement(tree, props, tree.props.children);
      return newTree;
    }
  }
}
// cloneElement
```

##### 实际应用场景：

###### 日志打点

###### 权限控制

###### 双向绑定

```react
class Form extends Component {
  static childContextTypes = {
    model: PropTypes.object,
    changeModel: PropTypes.func
  }
  constructor(props, context) {
    super(props, context);
    this.state = {
      model: props.model || {}
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.model) {
      this.setState({
        model: nextProps.model
      })
    }
  }
  changeModel = (name, value) => {
    this.setState({
      model: { ...this.state.model, [name]: value }
    })
  }
  getChildContext() {
    return {
      changeModel: this.changeModel,
      model: this.props.model || this.state.model
    };
  }
  onSubmit = () => {
    console.log(this.state.model);
  }
  render() {
    return <div>
      {this.props.children}
      <button onClick={this.onSubmit}>提交</button>
    </div>
  }
}
// 用于双向绑定的
function proxyHoc(WrappedComponent) {
  return class extends Component {
    static contextTypes = {
      model: PropTypes.object,
      changeModel: PropTypes.func
    }

    onChange = (event) => {
      const { changeModel } = this.context;
      const { onChange } = this.props;
      const { v_model } = this.props;
      changeModel(v_model, event.target.value);
      if(typeof onChange === 'function'){onChange(event);}
    }

    render() {
      const { model } = this.context;
      const { v_model } = this.props;
      return <WrappedComponent
        {...this.props}
        value={model[v_model]}
        onChange={this.onChange}
      />;
    }
  }
}

class Input extends Component {
  render() {
    return <input {...this.props}></input>
  }
}
// 使用
export default class extends Component {
  render() {
    return (
      <Form >
        <Input v_model="name"></Input>
        <Input v_model="pwd"></Input>
      </Form>
    )
  }
}
```



###### 表单校验

> 基于上面的双向绑定的例子，我们再来一个表单验证器，表单验证器可以包含验证函数以及提示信息，当验证不通过时，展示错误信息

```react
function validateHoc(WrappedComponent) {
  return class extends Component {
    constructor(props) {
      super(props);
      this.state = { error: '' }
    }
    onChange = (event) => {
      const { validator } = this.props;
      if (validator && typeof validator.func === 'function') {
        if (!validator.func(event.target.value)) {
          this.setState({ error: validator.msg })
        } else {
          this.setState({ error: '' })
        }
      }
    }
    render() {
      return <div>
        <WrappedComponent onChange={this.onChange}  {...this.props} />
        <div>{this.state.error || ''}</div>
      </div>
    }
  }
}
const validatorName = {
  func: (val) => val && !isNaN(val),
  msg: '请输入数字'
}
const validatorPwd = {
  func: (val) => val && val.length > 6,
  msg: '密码必须大于6位'
}
<HOCInput validator={validatorName} v_model="name"></HOCInput>
<HOCInput validator={validatorPwd} v_model="pwd"></HOCInput>
```



#### React.cloneElement

相当于: <element.type {...element.props} {...props}>{children}</element.type>

> ==React.cloneElement()==克隆并返回一个新的==React==元素`，使用`==element==作为起点。生成的元素将会拥有原始元素props与新props的浅合并。新的子级会替换现有的子级。来自原始元素的 key 和 ref 将会保留。

