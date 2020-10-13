import * as React from 'react';
import { Modal, message, Input, Row, Col } from 'antd';
import { getLength } from "djq-approach/lib/base";
interface Props {
  TxATRef?: Function, //ref 父组件调用子组件
  drawTxATEditor?: Function, // 子组件 调用父组件
}

interface State {
  nick_name?: string,
  ATVisible?: boolean
}

export default class extends React.Component<Props, State> {
  state = {
    nick_name: '', //艾特的人
    ATVisible:false,
  };
  constructor(props) {
    super(props);
    props.TxATRef && props.TxATRef(this._showATVisible)
  }
  // 父组件 调用子组件的地方
  _showATVisible = () => {
    this._changeATVisible(true)
  }
  getValue = () => {
    return this.state.nick_name;
  }

  _changeATVisible = (ATVisible) =>{
    if(ATVisible){
      this.setState({
        ATVisible
      })
    }else{
      this.setState({
        ATVisible,
        nick_name:"",
      })
    }
    
  }

  _changeNickName = (e) => {
    let value = e.target.value ? e.target.value.trim() : "";
    this.setState({
      nick_name: value,
    })
  }

  _ATOk = () =>{
    let {nick_name} = this.state;
    if(getLength(nick_name)){
      this.props.drawTxATEditor(nick_name);
      this.setState({
        nick_name:"",
        ATVisible:false,
      })
    }else{
      message.error("昵称不能为空")
    }
    
  }

  render() {
    return this._renderModel()
  }

  _renderModel = () => {
    return <Modal
    title="添加艾特"
    visible={this.state.ATVisible}
    onOk={this._ATOk}
    onCancel={() => { this._changeATVisible(false) }}
    okText={'确认'}
    cancelText={'取消'}
  >
    <Row align="middle" justify="center" type="flex">
      <Col span={5}>艾特名称：</Col>
      <Col span={18} >
        <Input value={this.state.nick_name} placeholder="请输入昵称" onChange={this._changeNickName} />
      </Col>
    </Row>
  </Modal>

  }

}