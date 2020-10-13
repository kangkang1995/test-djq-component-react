import * as React from 'react'
import { Image, BuildEquip } from './libs'
import { Modal, Input, Icon } from 'antd';
import { EditorState, AtomicBlockUtils, convertToRaw, convertFromRaw } from 'draft-js';
import * as Immutable from 'immutable';
import { dataConversion } from '../controler';
import './style'

interface Props {
  contentState: any,
  block: any,
  blockProps: any,
  entityKey: any,
}
interface State {
  modalShow: boolean,
  value,
  isChoose: boolean
}

export default class extends React.Component<Props, State> {
  element: HTMLImageElement;
  state = {
    value: '',
    modalShow: false,
    isChoose: false
  };
  _addDescription = (e) => {
    const { contentState, block, blockProps } = this.props;
    e.stopPropagation();
    blockProps.blur(true);
    const entity = contentState.getEntity(block.getEntityAt(0));
    const { description } = entity.getData();
    this.setState({ modalShow: true, value: description });
  };
  _deleteImage = (e) => {
    e.stopPropagation();
    const { contentState, block, blockProps } = this.props;
    const key = block.getKey();
    let obj = convertToRaw(contentState);
    obj.blocks.forEach((item, i) => {
      if (item.key === key) {
        let entityMapKey = item.entityRanges[0].key;
        delete obj.entityMap[entityMapKey];
        obj.blocks.splice(i, 1);
      }
    });
    blockProps.onChange(dataConversion.exchangeObjToEditorState(obj));
  };
  _handleOk = (e) => {
    // e.stopPropagation();
    const { block, contentState } = this.props;
    const entityKey = block.getEntityAt(0);
    let data = contentState.getEntity(entityKey).toJS().data;
    data.description = this.state.value;
    contentState.replaceEntityData(block.getEntityAt(0), data);
    this.props.blockProps.blur(false);
    this.setState({ modalShow: false })
    this.setState(({ isChoose }) => {
      return {
        isChoose: !isChoose
      }
    })
  };
  _handleCancel = () => {
    this.props.blockProps.blur(false);
    this.setState({ modalShow: false })
    this.setState(({ isChoose }) => {
      return {
        isChoose: !isChoose
      }
    })
  };
  render() {
    const { contentState, block, blockProps } = this.props;
    const { isChoose } = this.state;
    let entityKey = block.getEntityAt(0);
    if (!entityKey) return null;
    const entity = contentState.getEntity(entityKey);
    const type = entity.getType();
    if (type === 'image') {
      const data = entity.getData();
      const blockData = Immutable.fromJS(data);
      return (
        <div>
          <div className={`atomic-content ${isChoose ? 'hover' : ''}`} onMouseDown={(e) => {
            e.preventDefault();
            if (data.isLoading) return;
            this.setState(({ isChoose }) => {
              return {
                isChoose: !isChoose
              }
            })
          }}>
            <div className="imageBox">
              <div className="inputBoxMeng" onMouseDown={(e) => {
                e.stopPropagation()
              }} style={{ display: this.state.modalShow ? 'flex' : 'none', }}></div>

              <Image data={blockData} reload={blockProps.reload} />
              <div className={'hover-view'}>
                <div className={'des-box'} onMouseDown={this._addDescription}>
                  <Icon type="form" />
                  <span>注释</span>
                </div>
                <div className={'delete-box'} onMouseDown={this._deleteImage}>
                  <Icon type="delete" />
                  <span>删除</span>
                </div>
              </div>
              {/* <div className="inputBoxBox"  > */}
                <div className="inputBox" style={{ display: this.state.modalShow ? 'block' : 'none', }} onMouseDown={(e)=>{e.stopPropagation()}}>
                  <div className='title'>请输入图片描述</div>
                  <Input type="text" value={this.state.value} onChange={({ target: { value } }) => {
                    this.setState({ value })
                  }} />
                  <div className="option">
                    <div className="handOk" onClick={this._handleOk}>ok</div>
                    <div onClick={this._handleCancel}>cancel</div>
                  </div>
                </div>
              </div>
            {/* </div> */}
          </div>

          {/* <Modal
            title="添加图片描述"
            visible={this.state.modalShow}
            onOk={this._handleOk}
            maskClosable={false}
            onCancel={this._handleCancel}
          >
            <Input value={this.state.value} onChange={({ target: { value } }) => {
              this.setState({ value })
            }} />
          </Modal> */}
        </div>
      )
    } else if (type === 'build_equip') {
      return (
        <div className={'atomic-content'}>
          <BuildEquip data={entity.getData()} />
        </div>
      )
    }else if (type === 'videoID') {
      // 添加到 富文本里的 内容
      const data = entity.getData() || null;
      const blockData = Immutable.fromJS(data) || null;
      const link_url = blockData.get('link_url') || null;
      const content = blockData.get('content') || null;
      return (
        <>
          <div className='atomic-video-id'>
              腾讯视频，视频id为 {link_url}
          </div>
          <figcaption>
            {content}
          </figcaption>
        </>
      )
    }
  }
}