import * as React from 'react';
import { convertToRaw} from 'draft-js';
import BraftEditor from 'braft-editor'
import { Icon, Input, Row, Col, Modal,  } from "antd";
import "./style";

interface Props {
  blockProps?: any,
  contentState?: any,
  block?: any,
}

interface State {
  operateVisible?: boolean,
  description?: string,
  modalVisible?: boolean,
}

export default class extends React.Component<Props, State> {
  state = {
    operateVisible: false,  //图片操作的功能状态
    description: "",
    modalVisible: false, // 图片描述的状态
  }
  constructor(props) {
    super(props);
  }
  // 赋值 description，并弹窗description的model
  _addDescription = (e) => {
    const { contentState, block, blockProps } = this.props;
    blockProps.setReadOnly(true);
    const entity = contentState.getEntity(block.getEntityAt(0));
    const { description } = entity.getData();
    this.setState({ modalVisible: true, description });
  };
  // 更改 operateVisible 状态
  _operateStatus = (e) => {
    let { operateVisible, modalVisible } = this.state;
    if (!modalVisible) {
      this.setState({ operateVisible: !operateVisible });
    }

  }

  // 改变 Description 的值
  _changeDescription = (e) => {
    let value = e.target.value;
    this.setState({
      description: value,
    })
  }
  // 确定description
  _sureDescription = (e) => {
    const { block, contentState, blockProps } = this.props;
    const data = this.props.contentState.getEntity(this.props.block.getEntityAt(0)).getData();
    data.description = this.state.description;
    contentState.replaceEntityData(block.getEntityAt(0), data);
    blockProps.setReadOnly(false);
    this.setState({
      modalVisible: false,
      operateVisible: false,
    })
  }
  // 关闭弹窗
  _cancelDescription = () => {
    const { blockProps } = this.props;
    blockProps.setReadOnly(false);
    this.setState({
      modalVisible: false,
      operateVisible: false,
    })
  }


  // 删除
  _deleteImage = (e) => {
    e.stopPropagation();
    const { contentState, block, blockProps } = this.props;

    const key = block.getKey(); //当前选中block的key值
    let obj = convertToRaw(contentState);  //等于 blockProps.editorState.toRAW(true)
    obj.blocks.forEach((item, i) => {
      if (item.key === key) {
        let entityMapKey = item.entityRanges[0].key;
        delete obj.entityMap[entityMapKey];
        obj.blocks.splice(i, 1);
      }
    });
    //BraftEditor.createEditorState   可以将raw或者html格式的数据转换成editorState数据
    blockProps.editor.onChange(BraftEditor.createEditorState(obj));

    // 下面方法可以直接删除
    // blockProps.editor.onChange(ContentUtils.removeBlock(blockProps.editorState, this.props.block))
  };


  render() {
    const blockData = this.props.contentState.getEntity(this.props.block.getEntityAt(0)).getData();
    return <div>
      <div className="djq-braft-img-box"
        onMouseDown={this._operateStatus}
      >
        <div className="djq-braft-img-box-img">
          <img src={blockData.src} alt="图片" style={{maxWidth:"100%"}}/>
        </div>
        <div className="djq-braft-img-description">
          <span>{blockData.description ? blockData.description : "点击添加注释"}</span>
        </div>


        <div className={this.state.operateVisible ? 'hover' : null}>
          <div className='hover-view'>
            <Row className="hover-view-row" type="flex" justify="center">
              <Col onMouseDown={this._addDescription}>
                <Icon type="form" />
                注释
              </Col>

              <Col onMouseDown={this._addDescription}>
                <Icon type="form" />
                重新上传
              </Col>

              <Col onMouseDown={this._deleteImage}>
                <Icon type="delete" />
                删除
              </Col>
            </Row>
          </div>
        </div>

        <div>
          <Modal
            title="添加图片描述"
            visible={this.state.modalVisible}
            onOk={this._sureDescription}
            maskClosable={false}
            onCancel={this._cancelDescription}
            okText={'确认'}
            cancelText={'取消'}
          >
            <Input value={this.state.description} onChange={this._changeDescription} placeholder="请输入图片描述"/>
          </Modal>
        </div>

      </div>

    </div>
  }

}
