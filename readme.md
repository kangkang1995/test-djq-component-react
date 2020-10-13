## 版本管理
```
git版本号：x.y.z
x：年份，跟随年份变化
y：有新功能， y+1
z：始终为0

npm版本号：
取git版本号x.y.z的x.y.(每次发包自动+1)

例子
git版本号：20.1.0

npm版本号：
首次发包：20.1.0
下次发包：20.1.1
下下次发包：20.1.2
以此类推。。。
```

## djq-component-react

> 电竞圈React组件库

- [djqRoute](#djqRoute)
- [gameAgainstMap](#gameagainstmap)
- [reactUI](#reactUI)
- [RichTextEditor](#RichTextEditor)
- [RenderHeader](#RenderHeader)
- [record](#record)
- [RImg](#RImg) //暂时别用，图片的gulp有问题
- [cropperImgModel](#cropperImgModel)
#### djqRoute

> 电竞圈路由组件

使用方法

```
import { djqRoute } from 'djq-component-react'
const { CustomRoute, RouteMiddleware } = djqRoute;

const app = new RouteMiddleware();

app.use('/page', '路由').then(
  protocolManage => {
    protocolManage.use('/a', '页面A', PageA).then(
        page=>{
            page.use('/b', '页面B', PageB);
        }
    );
  },
);

const routeConfig = app.createConfig();

export default class App extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Layout style={{ height: '100%', minWidth: 1365 }}>
        <Layout.Sider
          breakpoint='md'
          collapsedWidth='0'
          theme={'dark'}>
          <CustomRoute.Menu
            baseRoute={'/documents'}
            routeConfig={routeConfig}
            location={this.props.location}
          />
        </Layout.Sider>
        <Layout>
          <Layout.Content>
            <CustomRoute.Routes 
                routeConfig={routeConfig} 
                baseRoute={'/documents'} />
          </Layout.Content>
        </Layout>
      </Layout>
    )
  }
}
```

#### gameAgainstMap

> 对阵图渲染组件，须配合djq-approah中的gameAgainstMap使用

使用方法

```
import { GameAgainstMap, base as approachBase } from 'djq-approach';
import { gameAgainstMap as DrawMap } from 'djq-component-react';

let params = {
  isSwitch: true,             // 是否切换full_name与id_name
  isTeam: false,              // 是否团队
  status: "START",            // 对阵状态
  uid: 0,                     // uid
  is_manage: true,            // 是否是裁判
  editStep: 1,                // 编辑轮次(下一次) 
}
let vsData = {}               // 对阵图数据
let currentPattern = 0        // 当前阶段

// 创建一个GameAgainstMap实例
// 调用实例的draw方法，返回处理后的数据
let map = new GameAgainstMap(vsData, params);
let drawData = map.draw(currentPattern); // 返回处理后的数据


/*
*对阵图事件
*1.vsClick点击对阵
*2.vsExchange对阵交换
*3.vsLocate定位时调用
*/
_vsClick = (vs) => {}

_vsExchange = (obj, callBack) => {}

_vsLocate = (vsX,vsY) => {}
```

```
  <DrawMap.Draw 
    rule={drawData.rule} 
    data={drawData.dataMap} 
    params={drawData.params} 
    vsClick={this._vsClick}
    vsExchange={this._vsExchange}
    vsLocate={this._vsLocate}
  />
```

#### reactUI

> React UI组件

#### RichTextEditor

> 基于draft.js的富文本编辑器

```
import { RichTextEditor } from 'djq-component-react';

export default class extends Component {
  constructor(props) {
    super(props);
  }

  _uploadImage = (res, cb) => {
    cb({ src: "http://djq-user-pub-data.oss-cn-hangzhou.aliyuncs.com/bigeyes/182/banner.jpg" });
  };
  render() {
    return <div className={'editor-box'}>
      <RichTextEditor
        customControl={[
          'bigTitle',
          'smallTitle',
          {
            component: 'image',
            customRequest: this._uploadImage
          }
        ]}
        height={150}
        style={{ padding: 0, caretColor: "#ff5454" }}
        insertValue={(ref) => this._insertValue = ref}
        insertAtomic={(ref) => this._insertAtomic = ref}
        calculateText={this._calculateText}
        listenCurrentStyle={this._listenCurrentStyle}
        reloadImage={this._reloadImage}
        setTextStyle={(ref) => this._setTextStyle = ref}
        getValue={(ref) => this._getValue = ref}
        insertText={(ref) => this._insertText = ref}
        blur={(ref) => this._blur = ref}
        focus={(ref) => this._focus = ref}
        listenFocus={this._listenFocus}
        listenBlur={this._listenBlur}
        onBackSpace={(ref) => this._onBackSpace = ref}
        placeholder={111}
      />
    </div>
  }
}
```
#### RenderHeader
> 编辑后台的头部ui

使用方法
```

import { RenderHeader, } from 'djq-component-react';

_renderHeader() {
    return <RenderHeader>
      <RenderHeader.RenderHeaderLeft>
        left
      </RenderHeader.RenderHeaderLeft>
      <RenderHeader.RenderHeaderRight>
        right
      </RenderHeader.RenderHeaderRight>
    </RenderHeader>
  }
```

#### record

> React 工程 操作日志 组件

使用方法

```
import { Record, } from 'djq-component-react';

_renderRecord = () => {
    return <Record
        type="TOPIC_MANAGER"
        service={this.props.service}
        ref={showRecord => this.showRecord = showRecord}
    />
}

```

#### RImg

> React 工程 图片错误处理

使用方法

```javascript
import { RImg, } from 'djq-component-react';

_renderRecord = () => {
    return <RImg 
      width={100} 
      src={banner_url + '?math=' + Math.random()} 
    />
}

// width?: any,
// src?: any,
// style?: any,
// className?: any,
// alt?: string

```

#### cropperImgModel
> react图片裁剪

```javascript
import { cropperImgModel, } from 'djq-component-react';

_renderRecord = () => {
    return <cropperImgModel
        _update={(url, uploadId, type) => { this._saveImg(url, uploadId, type) }}
        aspectRatio={820/220}
        service={this.props.service}
        initRef={ref => {
          this._initCropper = ref
        }}
      />
}

// initRef?: Function,
// _update?: Function,//回调父组件
// aspectRatio?: Number,//裁剪的尺寸比例
// service?: any,
// CropperModalWidth?: any,//裁剪图片后面的弹窗大小
// CropperStyle?:any,//裁剪图片的样式
```