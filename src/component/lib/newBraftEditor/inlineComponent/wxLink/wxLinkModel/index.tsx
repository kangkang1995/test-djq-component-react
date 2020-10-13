import * as React from 'react';
import { Modal, message,Input,Row, Col } from 'antd';
import {getLength} from "djq-approach/lib/base";
interface Props {
  wxLinkRef?:Function, //ref 父组件调用子组件
  drawWxLinkEditor?:Function, // 子组件 调用父组件
}

interface State {
  wxLinkName?:string,
  wxLinkHref?:string,
  wxLinkVisible?:boolean
}

export default class extends React.Component<Props, State> {
  state = {
    wxLinkName: '', //微信内链 名称
    wxLinkHref:"", //微信内链 链接
    wxLinkVisible: false,
  };
  constructor(props) {
    super(props);
    props.wxLinkRef && props.wxLinkRef(this._showWxLinkVisible)
  }
  // 父组件 调用子组件的地方
  _showWxLinkVisible = () =>{
    this._changeWxLinkVisible(true)
  }

  _changewxLinkName = (e) => {
    let value = e.target.value?e.target.value.trim():"";
    this.setState({
      wxLinkName: value,
    })
  }

  _changewxLinkHref = (e) => {
    let value = e.target.value?e.target.value.trim():"";
    this.setState({
      wxLinkHref: value,
    })
  }

  _changeWxLinkVisible = (status) => {
    this.setState({
      wxLinkVisible: status,
      wxLinkName: '',
      wxLinkHref:'',
    })
  }

  _wxLinkOk = () => {
    let { wxLinkName,wxLinkHref } = this.state;
    if(!getLength(wxLinkName)){
      message.error('请输入微信内链接名称')
      return 
    }else if(!getLength(wxLinkHref)){
      message.error('请输入微信内链接地址')
      return 
    }
    
    this.props.drawWxLinkEditor(wxLinkName,wxLinkHref)

    this._changeWxLinkVisible(false)
  }

  render() {
    return this._renderModel()
  }

  _renderModel = () => {
    return <Modal
      title="添加微信内链接"
      width={600}
      visible={this.state.wxLinkVisible}
      onOk={this._wxLinkOk}
      onCancel={() => { this._changeWxLinkVisible(false) }}
      okText={'确认'}
      cancelText={'取消'}
    >
      <Row align="middle" justify="center" type="flex">
        <Col span={5}>微信内链接名称：</Col>
        <Col span={17} >
          <Input value={this.state.wxLinkName} placeholder="请输入名称" onChange={this._changewxLinkName} />
        </Col>
      </Row>
      <Row align="middle" justify="center" type="flex" style={{marginTop:'15px'}}>
        <Col span={5}>微信内链接地址：</Col>
        <Col span={17} >
          <Input value={this.state.wxLinkHref} placeholder="请输入微信内链接地址，请配置正确" onChange={this._changewxLinkHref} />
        </Col>
      </Row>
    </Modal>
  }

}