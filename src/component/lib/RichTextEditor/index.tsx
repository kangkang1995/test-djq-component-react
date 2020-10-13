import * as React from 'react';
import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  getDefaultKeyBinding
} from 'draft-js';
import {
  toggleCustomInlineStyle,
  getCustomStyleMap,
} from 'draftjs-utils'
import MediaBlock from './atomicComponent';
import CustomControls from './customControls';
import { emojiMap, base } from 'djq-approach';
const { cookie } = base;
import EditorVideoIdModel from '../editorVideoIdModel'; //视频弹窗
import {
  addImage,
  addVideoID,
  clearFormat,
  counter,
  getCurrentStyle,
  insertText,
  dataConversion,
  compositeDecorator,
  onBackSpace,
  ondelete
} from "./controler";
import './style';

interface Props {
  height?: number,//高度
  width?: number,//宽度
  getValue?: any,
  setTextStyle?: any,
  style?: object,
  insertValue?: any,
  insertImage?: any,
  insertText?: any,
  listenFocus?: any,
  blur?: any,
  calculateText?: any,//计算字数
  listenCurrentStyle?: any,//监听样式
  reloadImage?: any,//图片重新上传
  customControl?: any[],
  listenBlur?: any,
  placeholder?: any
}

interface State {
  editorState: any
  readOnly: boolean
}

export default class extends React.Component<Props, State> {
  dealEditorState = "";
  showVideoIdRef = null;
  static defaultProps = {
    getValue: null,
    setTextStyle: null,
    insertValue: null,
    insertAtomic: null,
    insertText: null,
    onBackSpace: null,
    listenFocus: null,
    blur: null,
    focus: null,
    width: null,
    height: null,
  };
  constructor(props) {
    super(props);
    cookie.delete('color')
    this.state = { editorState: EditorState.createEmpty(compositeDecorator), readOnly: false };
    props.setTextStyle && props.setTextStyle(this._setTextStyle);
    props.insertValue && props.insertValue(this._insertValue);
    props.insertAtomic && props.insertAtomic(this._insertAtomic);
    props.insertText && props.insertText(this._insertText);
    props.getValue && props.getValue(this._getValue);
    props.blur && props.blur(this._blur);
    props.focus && props.focus(this._focus);
    props.onBackSpace && props.onBackSpace(this._onBackSpace);
  }
  Editor = null;

  /**
   * @description 更新文本数据
   * @param {object} editorState editorState结构
   * @param {viod} callback 回调
   */
  _onChange = (editorState, cb?: any) => {
    const { calculateText, listenCurrentStyle } = this.props;
    switch (this.dealEditorState) {
      case "clearBlock":
        editorState = clearFormat(this.dealEditorState, editorState);
        break;
    }
    this.dealEditorState = "";
    this.setState({ editorState }, () => {
      calculateText && calculateText(counter(this._getValue()));
      listenCurrentStyle && listenCurrentStyle(getCurrentStyle(editorState));
      cb && cb(editorState)
    });
  };

  /**
   * @description 设置文本样式
   * @param {object} type 类型
   * @param {object} style 样式
   */
  private _setTextStyle = ({ type, style }) => {
    this.chooseStyle(type, style);
  };
  private _insertValue = (obj, cb?: void) => {//插入数据
    this._onChange(dataConversion.exchangeObjToEditorState(obj), cb)
  };
  private _insertAtomic = (type, obj) => {//插入媒体
    const contentState = this.state.editorState.getCurrentContent();
    if (type === 'image') {
      this._onChange(addImage(this.state.editorState, obj));
    } else if (type === 'videoID') {
      this._onChange(addVideoID(this.state.editorState, obj));
    }
    return contentState.getLastCreatedEntityKey();
  };
  private _getValue = () => {//获取数据
    return convertToRaw(this.state.editorState.getCurrentContent());
  };
  /**
   * @description 插入文本
   * @param {object} obj 
   * @param {obj} type 文本类型['emoji','text']
   * @param {obj} text 文本内容
   */
  private _insertText = (obj) => {
    const { editorState } = this.state;
    switch (obj.type) {
      case "emoji":
        let unicode = emojiMap.unicodeMap.get(obj.text);
        this._onChange(insertText(editorState, unicode));
        break;
      default:
        this._onChange(insertText(editorState, obj.text));
        break;
    }
    // this.Editor.focus();
    // document.activeElement.blur();
  };
  private _blur = () => {
    this.Editor.blur();
  };
  private _focus = () => {
    this.Editor.focus();
  };
  private _listenFocus = () => {
    this.props.listenFocus && this.props.listenFocus()
  }
  private _listenBlur = () => {
    this.props.listenBlur && this.props.listenBlur()
  }
  private _onBackSpace = () => {
    const { editorState } = this.state;
    let result = ondelete(editorState) || editorState;
    this._onChange(onBackSpace(result) || result);
  }
  chooseStyle = (type, style) => {
    // 通过toggleBlockType函数，传入上一个editorState和系统块类型的key，返回一个新的editorState。
    this._onChange(
      type === 'block'
        ? RichUtils.toggleBlockType(
          this.state.editorState,
          style
        )
        : RichUtils.toggleInlineStyle(
          this.state.editorState,
          style
        )
    );
  };
  _myMediaBlockRenderer = (block) => {
    const { reloadImage } = this.props;
    if (block.getType() === 'atomic') {
      return {
        component: MediaBlock,//定义的组件
        editable: false,
        props: {
          blur: this._setReadOnly,
          onChange: this._onChange,
          reload: reloadImage,
        }
      };
    }
    return null;
  };
  _setReadOnly = (bool: boolean) => {
    this.setState({ readOnly: bool })
  };

  // 检测 命令行 快捷键
  handleKeyCommand = (command: string) => {
    // console.log(command, 'command')
    switch (command) {
      case "split-block":
        // 这2个隐掉，因为当初不能判断现在的格式，所以每次空格都清除掉所有格式
        this.dealEditorState = "clearBlock";
        return "not-handled";
      case "backspace":
        const { editorState } = this.state;
        let res = onBackSpace(editorState);
        // onBackSpace 返回上一步
        if (res) {
          this._onChange(res);
          return "handled";
        }
        return "not-handled";
      default:
        return "not-handled";
    }
  }
  // 把自定义格式的css和styleName对应上
  _getBlockStyle = (blockName) => {
    switch (blockName.getType()) {
      case 'blockquote':
        return 'RichEditor-blockquote';
      default:
        return null;
    }
  }

  //视频id
  _showVideoIdModel = (res, cb) => {
    this.showVideoIdRef(cb);
  };
  // 视频弹窗 回调触发
  _drawVideoIdEditor = (cb, obj) => {
    //cb 是绘制富文本的回调函数
    // obj是子组件弹窗传过来的参数
    // cb({value:'外层视频'})
    cb(obj);
  };

  // 更改文本颜色
  _setTextColor = (color) => {
    const { editorState } = this.state;
    const newTextColor = `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`
    cookie.set('color', newTextColor);  //缓存刚才设置的颜色
    // toggleCustomInlineStyle  这个工具不错哦，直接更改 行内样式，大佬封装的
    // bgcolor
    const newEditState = toggleCustomInlineStyle(
      editorState,
      'color',
      newTextColor,
    )
    this._onChange(newEditState)
  }

  // 清除所有样式
  _clearBlock = () =>{
    const { editorState } = this.state;
    // console.log(this.Editor,'this.Editor')
    // const newEditorState = clearFormat('clearBlock', editorState);
    
    // this._onChange(newEditorState)
  }

  // 重新处理 customControl
  // 因为 比如添加视频的弹窗处理，如果写在外面的话，调用这个组件要写很多东西，所以把自定义的一些组件直接写在这里面
  // 当然，无论写在里面写在外面都通用
  _assginCustomControl = () => {
    let customControl = this.props.customControl;
    customControl.map((item, index) => {
      if (typeof item === 'object') {
        if (item.component === 'videoID') {
          item.customRequest = this._showVideoIdModel;
        }
        //  else if (item.component === 'COLOR') {
        //   item.customRequest = this._setTextColor;
        // }else if(item.component === 'clearBlock'){
        //   item.customRequest = this._clearBlock;
        // }
      }
    })
    return customControl
  }

  render() {
    return (
      <div className={"contain-box"}>
        {/* 富文本 的头部 */}
        <CustomControls
          editorState={this.state.editorState}
          chooseLabel={this.chooseStyle}
          onChange={this._onChange}
          customControl={this._assginCustomControl()}
        />
        {/* 富文本的主要内容 */}
        <div className="djq-editor-container" style={{ ...this.props.style, height: this.props.height }}>
          <Editor
            ref={ref => this.Editor = ref}
            editorState={this.state.editorState}
            blockRendererFn={this._myMediaBlockRenderer} //可以自定义的地方
            handleKeyCommand={this.handleKeyCommand}
            customStyleMap={getCustomStyleMap()}
            onChange={this._onChange}
            onFocus={this._listenFocus}
            onBlur={this._listenBlur}
            readOnly={this.state.readOnly}
            stripPastedStyles={true}
            placeholder={this.props.placeholder}
            blockStyleFn={this._getBlockStyle}
          />
        </div>

        <EditorVideoIdModel
          showVideoIdRef={ref => {
            this.showVideoIdRef = ref;
          }}
          drawVideoIdEditor={this._drawVideoIdEditor}
        />
      </div>
    );
  }
}
