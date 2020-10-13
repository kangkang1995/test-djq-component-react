import * as React from 'react';
import { Modal, message,Input,Row, Col } from 'antd';
import {getLength} from "djq-approach/lib/base";
interface Props {
  showVideoIdRef?:Function, //ref 父组件调用子组件
  drawVideoIdEditor?:Function, // 子组件 调用父组件
}

interface State {
  videoIdValue?:string,
  videoIdTagValue?:string,
  videoIdVisible?:boolean
}

export default class extends React.Component<Props, State> {
  state = {
    videoIdValue: '', //视频id
    videoIdTagValue:"", //视频描述
    videoIdVisible: false,
  };
  constructor(props) {
    super(props);
    props.showVideoIdRef && props.showVideoIdRef(this._showVideoIdVisible)
  }
  // 父组件 调用子组件的地方
  _showVideoIdVisible = () =>{
    this._changeVideoIdVisible(true)
  }

  _changeVideoIdValue = (e) => {
    let value = e.target.value?e.target.value.trim():"";
    this.setState({
      videoIdValue: value,
    })
  }

  _changeVideoIdTagValue = (e) => {
    let value = e.target.value;
    this.setState({
      videoIdTagValue: value,
    })
  }

  _changeVideoIdVisible = (status) => {
    this.setState({
      videoIdVisible: status,
      videoIdValue: '',
      videoIdTagValue:'',
    })
  }

  _videoIdOk = () => {
    let { videoIdValue,videoIdTagValue } = this.state;
    if(!getLength(videoIdValue)){
      message.error('请输入腾讯视频id')
      return 
    }else if(getLength(videoIdValue)>100){
      message.error('视频id长度为1-100字节')
      return 
    }
    // 处理 腾讯视频id https://v.qq.com/x/cover/mzc002000u4eppz/t0034lvf9pq.html?videoMark=
    let splitVideoIdTagValue = videoIdValue.split('/');
    let newVideoIdTagValue = splitVideoIdTagValue[splitVideoIdTagValue.length - 1].split('.html')[0];
    this.props.drawVideoIdEditor({
      tx_video_id: newVideoIdTagValue,
      description:videoIdTagValue,
    })

    this._changeVideoIdVisible(false)
  }

  render() {
    return this._renderModel()
  }

  _renderModel = () => {
    return <Modal
      title="添加视频"
      visible={this.state.videoIdVisible}
      onOk={this._videoIdOk}
      onCancel={() => { this._changeVideoIdVisible(false) }}
      okText={'确认'}
      cancelText={'取消'}
    >
      <Row align="middle" justify="center" type="flex">
        <Col span={5}>腾讯视频id：</Col>
        <Col span={18} >
          <Input value={this.state.videoIdValue} placeholder="请输入腾讯视频完整地址" onChange={this._changeVideoIdValue} />
        </Col>
      </Row>
      <Row align="middle" justify="center" type="flex" style={{marginTop:'15px'}}>
        <Col span={5}>视频描述：</Col>
        <Col span={18} >
          <Input value={this.state.videoIdTagValue} placeholder="非必填" onChange={this._changeVideoIdTagValue} />
        </Col>
      </Row>
    </Modal>
  }

}