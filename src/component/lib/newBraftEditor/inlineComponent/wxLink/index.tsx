import * as React from 'react';
import { ContentUtils } from "braft-utils";
import WxLinkmodel from "./wxLinkModel";
import { Icon} from "antd";
// 编写扩展模块
const _drawTxATEditor = (editor, editorState, wxLinkName, wxLinkHref) => {
  // console.log(wxLinkName,wxLinkHref)
  // editor.setValue(
  //   ContentUtils.insertText(editorState, `@${value}`, null, {
  //     type: "AT",
  //     mutability: "IMMUTABLE",
  //     data: { nick_name: value }
  //   })
  // );
  editor.onChange(ContentUtils.insertText(editorState, `${wxLinkName}`, null, {
    type: "WXLINK",
    mutability: "IMMUTABLE",
    data: {
      href: wxLinkHref
    }
  }));
};

let controlRef = null
const bindControlRef = (ref) => controlRef = ref

export default options => {
  let wxLinkRef = null;
  options = {
    closeOnSelect: false,
    closeOnBlur: false,
    ...options
  };
  // console.log(options,'optionsoptionsoptions')
  const { includeEditors } = options;
  return {
    // 指定扩展类型
    type: "entity",
    // 指定该扩展对哪些编辑器生效，不指定includeEditors则对所有编辑器生效
    includeEditors: includeEditors || ['djq-editor-id'],
    // 指定扩展样式名，推荐使用全大写
    name: "WXLINK",
    // 在编辑器工具栏中增加一个样式控制按钮，text可以为一个react组件
    // control: {
    //   text: '按键'
    // },
    control: (props) => {
      return {
        key: "WXLINK",
        type: "component",
        ref: bindControlRef,
        component: (
          <span onMouseDown={(e) => { e.stopPropagation() }}>
            <button
              className="control-item button"
              data-title="微信内链接"
              onClick={
                (e) => {
                  e.stopPropagation()
                  wxLinkRef()
                }
              }
            >
              微信内链接
            </button>
            <WxLinkmodel
              wxLinkRef={ref => (wxLinkRef = ref)}
              drawWxLinkEditor={(wxLinkName, wxLinkHref) => {
                _drawTxATEditor(props.editor, props.editorState, wxLinkName, wxLinkHref)
              }}
            />
          </span>
        )
      }
    },
    // control: props => ({
    //   text: "艾特",
    //   key: "wxAT",
    //   // replace: '测试',
    //   type: "modal",
    //   title: "自定义的组件",
    //   ref: null,
    //   onClick: () => {}, // 指定触发按钮点击后的回调函数
    //   modal: {
    //     id: "my-modal1", // 必选属性，传入一个唯一字符串即可
    //     title: "我的弹窗", // 指定弹窗组件的顶部标题
    //     className: "my-modal", // 指定弹窗组件样式名
    //     width: 300, // 指定弹窗组件的宽度
    //     height: 250, // 指定弹窗组件的高度
    //     showFooter: true, // 指定是否显示弹窗组件底栏
    //     showCancel: true, // 指定是否显示取消按钮
    //     showConfirm: true, // 指定是否显示确认按钮
    //     confirmable: true, // 指定确认按钮是否可用
    //     showClose: true, // 指定是否显示右上角关闭按钮
    //     closeOnBlur: false, // 指定是否在点击蒙层后关闭弹窗(v2.1.24)
    //     closeOnConfirm: true, // 指定是否在点击确认按钮后关闭弹窗(v2.1.26)
    //     closeOnCancel: true, // 指定是否在点击取消按钮后关闭弹窗(v2.1.26)
    //     cancelText: "取消", // 指定取消按钮文字
    //     confirmText: "确定", // 指定确认按钮文字
    //     bottomText: null, // 指定弹窗组件底栏左侧的文字，可传入jsx
    //     onConfirm: () => {
    //       _drawTxATEditor(props.editor, props.editorState,'11111');
    //     }, // 指定点击确认按钮后的回调函数
    //     onCancel: () => {}, // 指定点击取消按钮后的回调函数
    //     onClose: () => {}, // 指定弹窗被关闭后的回调函数
    //     onBlur: () => {}, // 指定蒙层被点击时的回调函数
    //     // children: <span>
    //     // <input value={value} onChange={_onChange}/>
    //     // </span>, // 指定弹窗组件的内容组件
    //     children: <WxATmodel TxATRef={ref => (TxATRef = ref)} /> // 指定弹窗组件的内容组件
    //   }
    // }),
    // 指定该扩展样式的CSS规则，请注意，IE/EDGE浏览器暂时不支持textEmphasis
    style: {
      // textEmphasis: 'circle',
      // textEmphasisPosition: 'under',
      // WebkitTextEmphasis: 'circle',
      // WebkitTextEmphasisPosition: 'under'
    },
    // 指定entity的mutability属性，可选值为MUTABLE和IMMUTABLE，表明该entity是否可编辑，默认为MUTABLE
    mutability: "IMMUTABLE",
    // 指定通过上面新增的按钮创建entity时的默认附加数据
    // data: {
    //   text: '111'
    // },
    // 指定entity在编辑器中的渲染组件
    component: props => {
      // 通过entityKey获取entity实例，关于entity实例请参考https://github.com/facebook/draft-js/blob/master/src/model/entity/DraftEntityInstance.js
      const entity = props.contentState.getEntity(props.entityKey);
      // 通过entity.getData()获取该entity的附加数据
      
      const { href } = entity.getData();
      // let data = entity.getData();
      // console.log(props,this.bindControlRef,'_drawTxATEditor_drawTxATEditor_drawTxATEditor_drawTxATEditor')
      return (
        <span>
          <a className="keyboard-item keyboard-item-wxLink" title={href}>
          <Icon type="link" /> {props.children}
          </a>
          {/* <button onClick={
            ()=>{
              console.log('1111')
              data.href = '3333'
              props.contentState.replaceEntityData(props.entityKey, data);
            }
          }>点击</button> */}
        </span>
      );
    }
    // importer: (nodeName, node) => {
    //   // 指定html转换为editorState时，何种规则的内容将会附加上该扩展样式
    //   // 如果编辑器在createEditorState时使用的是RAW数据，并且开启了stripPastedStyles，则可以不指定importer，因为不存在html转editorState的场景
    //   return nodeName === 'span' && [].find.call(node.style, (styleName) => styleName.indexOf('text-emphasis') !== -1)
    // },
    // exporter: () => {
    //   // 指定该样式在输出的html中如何呈现，对于inline-style类型的扩展可以不指定exporter，输出样式即为该扩展的style
    //   return (
    //     <span style={{
    //       textEmphasis: 'circle',
    //       textEmphasisPosition: 'under',
    //       WebkitTextEmphasis: 'circle',
    //       WebkitTextEmphasisPosition: 'under'
    //     }} />
    //   )
    // }
  };
};
