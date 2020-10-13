import * as React from 'react';
import {
  RichUtils,
} from 'draft-js';
import "braft-editor/dist/index.css";
import BraftEditor from "braft-editor";
import { ContentUtils } from "braft-utils";
import { Upload, Icon,  message } from "antd";
import ColorPicker from 'braft-extensions/dist/color-picker'
import 'braft-extensions/dist/color-picker.css';

import { DjqImage, TxVideoIdModel, TxVideoIdUI,AppImage } from "./blockComponent";
import { WxAT,WxLink,Emoticon } from "./inlineComponent";
import { ImgRender } from './htmlComponent';
import {configROG,configDJQ,configAPP} from './configs';
import "./style";
interface Props {
  // 以下是富文本自带的 props
  // 自定义的props
  DJQObj?: DJQObj, //电竞圈的私有数据
  insertValue?: any,//设置editorState
  blur?:Function,
  focus?:Function,
  getValue?:Function, //获取富文本内容
  getEditorStateLength?:Function, //获取富文本长度
  styles:null,//富文本样式
  setParentComponentCover?:Function | any, //设置帖子封面
  insertInlineStyle?:Function, //设置  行内 内联样式
  insertBlock?:Function, //设置block
  insertEntity?:Function, //设置Entity
  insertAT?:Function, //设置艾特
  calculateText?: Function,//计算字数
  reloadToolStatus?: Function,//当前文本状态
}

interface State {
  editorState?: any,
  readOnly: boolean
}

interface DJQObj {
  editorType?: string,  //富文本的场景标识 目前是: ROG和DJQ 新增APP
  service?:Object | any, //组件库传的协议
  uid?: string | number,          //作者的uid，上传图片需要
  access_token?: string | number,  //作者的access_token，上传图片需要
  imgType?: string,       //图片需要的type类型 上传图片需要
}
// 设置 Entity 的一些参数
interface CustomizeEntity {
  src?:string,
  nick_name?:string,
  size?:number,
  width?:number,
  height?:number,
  upload_id?:string,
  file_name?:string,
}

export default class extends React.Component<Props, State>{
  editorInstanceRef = null; //富文本 ref
  TxVideoIdModelValueRef = null; //腾讯视频id ref
  constructor(props) {
    super(props);
    this.state = {
      editorState: BraftEditor.createEditorState(
        null,
        {
          blockImportFn: this.blockImportFn,
          blockExportFn: this.blockExportFn,
          editorId: 'djq-editor-id'
        },
      ),// 设置编辑器初始内容
      readOnly: false,
    };
    props.blur && props.blur(this._blur);
    props.focus && props.focus(this._focus);
    props.getValue && props.getValue(this._getValue);
    props.insertValue && props.insertValue(this._insertValue);
    props.getEditorStateLength && props.getEditorStateLength(this._getEditorStateLength);
    props.insertInlineStyle && props.insertInlineStyle(this._insertInlineStyle);
    props.insertBlock && props.insertBlock(this._insertBlock);
    props.insertEntity && props.insertEntity(this._insertEntity);
  }

  componentDidMount(){
    let { editorType } = this.props.DJQObj;
    if(editorType === 'ROG') {
      BraftEditor.use([
        ColorPicker({
          includeEditors: ['djq-editor-id'],
          theme: 'light' // 支持dark和light两种主题，默认为dark
        }),
        WxAT({
          includeEditors: ['djq-editor-id'],
        }),
        WxLink({
          includeEditors: ['djq-editor-id'],
        }),
      ])
    }else if(editorType === 'DJQ'){
      
    }else if(editorType === 'APP'){
      const emoticons = ['http://path/to/emoticon-1.png', 'http://path/to/emoticon-2.png',]
      BraftEditor.use([
        WxAT({
          includeEditors: ['djq-editor-id'],
        }),
        Emoticon({
          includeEditors: ['djq-editor-id'],
          // emoticons: emoticons
        }),
      ])
    }
    
  }

  // componentDidUpdate(){
  //   console.log(this._getEditorStateLength())
  // }

  _insertValue = (obj) => {
    //插入数据
    let editorState = BraftEditor.createEditorState(obj,
      {
        blockImportFn: this.blockImportFn,
        blockExportFn: this.blockExportFn,
        editorId: 'djq-editor-id'
      });
    this._handleChange(editorState)
  };

  _handleChange = (editorState) => {
    this.setState({ editorState },()=>{
      this.props.calculateText && this.props.calculateText(this._getEditorStateLength());

      // console.log(ContentUtils.getSelectionInlineStyle(this.state.editorState).has("BOLD"))
      this.props.reloadToolStatus && this.props.reloadToolStatus([ContentUtils.getSelectionBlockType(this.state.editorState)]);
      console.log(ContentUtils.selectionHasInlineStyle(this.state.editorState,"BOLD"),ContentUtils.selectionHasInlineStyle(this.state.editorState,"ITALIC"),ContentUtils.getSelectionBlockType(this.state.editorState),ContentUtils.getSelectionEntityType(this.state.editorState,'AT'))
    })
  }

  _getValue = () => {
    return this.state.editorState
  };

  _blur = () => {
    this.editorInstanceRef.draftInstance.blur();
  };

  _focus = () => {
    this.editorInstanceRef.draftInstance.focus();
  };

  _setReadOnly = (bool: boolean) => {
    this.setState({ readOnly: bool })
  };

  _uploadImage = param => {
    if (!param.file) {
      return false;
    }
    let { service, uid, access_token, imgType } = this.props.DJQObj;
    const { base } = service;
    base.getOssParams({ uid, access_token }, { type:imgType }).then(
      ({ data: { token: option } }) => {
        base.uploadImage(param.file, option).then(
          (file) => {
            const { previewUrl: src, size, width, height, uploadId, filename: fileName } = file.data;
            
            this._handleChange(
              ContentUtils.insertAtomicBlock(this.state.editorState, "DJQIMAGE", "IMMUTABLE", {
                src,
                size,
                width,
                height,
                upload_id: uploadId,
                file_name: fileName,
                description: "",
                zoom:"big"
              })
            )

          }
        )
          .catch((err) => {
            message.error('上传图片失败')
          });
      }
    )
    .catch((err) => {
      message.error('上传图片失败')
    });
    ;

  };

  _blockRenderFn = (contentBlock, { editor, editorState }) => {
    const { editorType } = this.props.DJQObj;
    
    if (contentBlock.getType() === "atomic") {
      const entity = editorState
        .getCurrentContent()
        .getEntity(contentBlock.getEntityAt(0));

      if(editorType === 'ROG') {
        if (entity.getType() === "DJQIMAGE") {
          return {
            component: DjqImage,
            editable: false, // editable并不代表组件内容实际可编辑，强烈建议设置为false
            props: { 
              editor, 
              editorState,
              setReadOnly:this._setReadOnly,
              setParentComponentCover:this.props.setParentComponentCover,
            } // 传入的内容可以在组件中通过this.props.blockProps获取到
          };
        } else if (entity.getType() === "TXVIDEO") {
          return {
            component: TxVideoIdUI,
            editable: false, // editable并不代表组件内容实际可编辑，强烈建议设置为false
            props: { editor, editorState } // 传入的内容可以在组件中通过this.props.blockProps获取到
          };
        }
      }else if(editorType === 'APP'){
        if (entity.getType() === "DJQIMAGE") {
          return {
            component: AppImage,
            editable: false, // editable并不代表组件内容实际可编辑，强烈建议设置为false
            props: { 
              editor, 
              editorState,
              setReadOnly:this._setReadOnly,
            } // 传入的内容可以在组件中通过this.props.blockProps获取到
          };
        }
      }
      
    }
  };

  // 下面自定义block的html导出函数，用于将不同的block转换成不同的html内容。下面函数
  // blockExportFn 在开发者调用this.state.editorState.toHTML() 会触发。
  blockExportFn = (contentState, block) => {
    if (block.type === 'atomic') {
      let ranges = block.entityRanges.length > 0 ? block.entityRanges[0] : -1;
      if (ranges !== -1) {
        let entity = contentState.getEntity(contentState.getBlockForKey(block.key).getEntityAt(0))
        if (entity.getType() === "DJQIMAGE") {
          let blockData = entity.getData()
          return ImgRender(blockData)
        }
      }
    }
    // 导入空格
    if (block.type === "unstyled" && !block.text.length) {
      return `<p><br/></p>`
    }
  }
  // 自定义 html 转block的输入转换器，用于将符合规则的html内容转换成相应的block
  blockImportFn = (nodeName, node) => {

  }

  // 绘制 视频id
  _drawVideoIdEditor = (Obj) => {
    let { tx_video_id, description } = Obj;
    this._handleChange(
      ContentUtils.insertAtomicBlock(this.state.editorState, 'TXVIDEO', 'IMMUTABLE',
        {
          tx_video_id,
          description
        }
      )
    )
  }

  // 获取富文本长度
  _getEditorStateLength = () =>{
    let editorState = this._getValue().toRAW(true);
    let count = 0;
    editorState.blocks.forEach(function (item) {
      count += item.text.length;
    });
    return count;
  }

  // 设置 Block
  _insertBlock = (type) =>{
    let blockArrays = ['unstyled','header-one','header-two','blockquote','unordered-list-item','ordered-list-item'];
    if(blockArrays.includes(type)){
      this._handleChange(
        RichUtils.toggleBlockType(this.state.editorState,type)
      )
    }else{
      console.log('无此参数')
    }
  }

  // 设置 行内内联
  _insertInlineStyle  = (type) =>{
    let inlineArrays = ['BOLD','UNDERLINE','STRIKETHROUGH','ITALIC'];
    // COLOR-666666 颜色暂定
    // editorState  直接设置 自由块
    if(inlineArrays.includes(type)){
      this._handleChange(
        RichUtils.toggleInlineStyle(this.state.editorState,type)
      )
    }else{
      console.log('无此参数')
    }
  }
  // 设置 Entity
  _insertEntity = (type,obj?:CustomizeEntity) =>{
    // let entityArrays = ['WXLINK','TXVIDEO','DJQIMAGE','AT','TAG','HR','EMOTICOM'];
    const entityArrays = ['AT','EMOTICOM'];
    const editorState = this.state.editorState;
    const {src,nick_name,size,width,height,upload_id,file_name,} = obj;
    if(entityArrays.includes(type)){
      // 暂无实现
      if(type === 'EMOTICOM'){
        this._handleChange(
          ContentUtils.insertText(editorState, ' ', null, {
            type: 'EMOTICON',
            mutability: 'IMMUTABLE',
            data: { src }
          })
        )
      }else if(type === 'AT'){
        this._handleChange(
          ContentUtils.insertText(this.state.editorState, `@${nick_name}`, null, {
            type: "AT",
            mutability: "IMMUTABLE",
            data: { nick_name}
          })
        )
      }else if(type === 'DJQIMAGE'){
        this._handleChange(
          ContentUtils.insertAtomicBlock(this.state.editorState, "DJQIMAGE", "IMMUTABLE", {
            src,
            size,
            width,
            height,
            upload_id,
            file_name,
            description: "",
            zoom:"big"
          })
        )
      }
    }else{
      console.log('无此参数')
    }
  }

  
  render() {

    let { editorType } = this.props.DJQObj;

    return <React.Fragment>
      <BraftEditor
        id="djq-editor-id"
        className='djq-newBraftEditor-box'
        value={this.state.editorState}
        ref={instance => this.editorInstanceRef = instance}
        controls={this._renderControls(editorType)}
        headings={this._renderHeadings(editorType)}
        extendControls={this._renderExtendControls(editorType)}
        converts={{ blockImportFn: this.blockImportFn, blockExportFn: this.blockExportFn }}
        blockRendererFn={this._blockRenderFn} // 渲染函数 或 导入函数
        onChange={this._handleChange}
        readOnly={this.state.readOnly}
        fontSizes={configROG.fontSizes}
        style={this.props.styles?this.props.styles:null}
        stripPastedStyles={true} //是否以纯文本模式粘贴内容，默认为false
        // {...this.props}
      />
    </React.Fragment>
  }

  _renderControls = (editorType) =>{
    if(editorType === 'ROG') {
      return configROG.controls
    }else if(editorType === 'DJQ'){
      return configDJQ.controls
    }else if(editorType === 'APP'){
      return configAPP.controls
    }
  }

  _renderHeadings = (editorType) =>{
    if(editorType === 'ROG') {
      return configROG.headings
    }else if(editorType === 'DJQ'){
      return configDJQ.headings
    }else if(editorType === 'APP'){
      return configAPP.headings
    }
  }

  _renderExtendControls = (editorType) =>{
    // 自定义标签栏 ROG
    const extendControlsROG:any = [
      //插入视频id
      {
        key: "djq-tx-video",
        type: "component",
        component: (
          <span>
            <button
              className="control-item button"
              data-title="视频ID"
              onClick={
                () => {
                  this.TxVideoIdModelValueRef()
                }
              }
            >
              视频ID
            </button>
            <TxVideoIdModel
              showVideoIdRef={ref => (this.TxVideoIdModelValueRef = ref)}
              drawVideoIdEditor={this._drawVideoIdEditor}
            />
          </span>
        )
      },
      //插入图片
      {
        key: "djq-uploader",
        type: "component",
        component: (
          <Upload
            accept={"image/png,image/jpg,image/jpeg,image/gif"}
            fileList={[]}
            showUploadList={false}
            customRequest={this._uploadImage}
          >
            <button
              type="button"
              className="control-item button upload-button"
              data-title="插入图片"
            >
              <Icon type="picture" theme="filled" />
            </button>
          </Upload>
        )
      },


    ];

    // 自定义标签栏 ROG
    const extendControlsAPP:any = [
      //插入图片
      {
        key: 'header-one',
        type: 'button',
        text: '大标题',
        onClick: ()=>{
          this._insertBlock('header-one')
        }
      },
      {
        key: 'header-two',
        type: 'button',
        text: '小标题',
        onClick: ()=>{
          this._insertBlock('header-two')
        }
      },
      {
        key: 'bold',
        type: 'button',
        text: '加粗',
        onClick: ()=>{
          this._insertInlineStyle('BOLD')
        }
      },
      {
        key: "djq-uploader",
        type: "component",
        component: (
          <Upload
            accept={"image/png,image/jpg,image/jpeg,image/gif"}
            fileList={[]}
            showUploadList={false}
            customRequest={this._uploadImage}
          >
            <button
              type="button"
              className="control-item button upload-button"
              data-title="插入图片"
            >
              <Icon type="picture" theme="filled" />
            </button>
          </Upload>
        )
      },


    ];

    if(editorType === 'ROG') {
      return extendControlsROG
    }else if(editorType === 'DJQ'){
      
    }else if(editorType === 'APP'){
      return extendControlsAPP
    }
  }

}