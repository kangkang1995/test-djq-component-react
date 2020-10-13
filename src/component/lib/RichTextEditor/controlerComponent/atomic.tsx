import * as React from 'react';
import { Button, Upload, Icon, Popover } from 'antd';
import { SketchPicker } from 'react-color';
import { base} from 'djq-approach';
let {cookie} = base;

// 渲染颜色选择器
let renderColorPicker = (customRequest) => {
  return (
    <SketchPicker color={cookie.get('color')?cookie.get('color'):'rgb(0,0,0)'} onChangeComplete={customRequest} />
  )
}



export default function (obj) {
  const { component, customRequest } = obj;
  const atomicObj = {
    image: {
      component: (cb) => <Upload
        accept={'image/png,image/jpg,image/jpeg,image/gif'}
        fileList={[]}
        customRequest={(res) => {
          customRequest(res, cb)
        }}
      >
        <Button onMouseDown={(e) => {
          e.preventDefault();
        }}><Icon type="upload" style={{ verticalAlign: "middle" }} /> 上传图片</Button>
      </Upload>,
      type: "atomic",
      key: "image",
    },
    videoID: {
      component: (cb) => <Button onClick={(res) => {
        // 需要 customRequest = cb({value:'外层视频'})
        customRequest(res, cb)
      }}>
        <Icon type="play-circle" style={{ verticalAlign: "middle" }} /> 上传视频
      </Button>,
      type: "atomic",
      key: "videoID",
    },
    COLOR: {
      component: (cb) => {
        return <Popover content={renderColorPicker(customRequest)}>
          <Button>
            <Icon style={{ backgroundColor: cookie.get('color')?cookie.get('color'):'rgb(0,0,0)' }} type='down' />
            文本颜色
          </Button>,
        </Popover>
      },
      type: "atomic",
      key: "videoID",
    },
    'clearBlock': {
      component: (cb) => <Button onClick={(res) => {
        console.log(customRequest,res,cb,'clearBlock')
        customRequest()
      }}>
        <Icon type="play-circle" style={{ verticalAlign: "middle" }} /> 清除样式
      </Button>,
      type: "atomic",
      key: "not-handled",
    },
  };
  return atomicObj[component];
}