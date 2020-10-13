import * as React from "react";
import { addImage, getCurrentStyle, addVideoID } from "./controler";
import { stringComponent, objectComponent } from './controlerComponent';


export default (props) => {
  const { editorState, onChange, customControl } = props;
  // editorState.getCurrentInlineStyle()   获取当前富文本内的 行内 文档格式，高亮用的
  let getCurrentInlineStyle = editorState.getCurrentInlineStyle();

  // 这里开始获取当前光标所在的格式的类名; 获取当前富文本内的 块 文档格式，高亮用的

  let selection = editorState.getSelection();
  let getCurrentBlockStyle = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();


  if (!customControl) return null;
  const blockType = getCurrentStyle(editorState);
  const dealComponentRes = (type, key) => {
    if (type === 'atomic') {
      return (option) => {
        if (key == 'image') {
          onChange && onChange(addImage(editorState, option))
        } else if (key == 'videoID') {
          onChange && onChange(addVideoID(editorState, option))
        }
      }
    } else {
      return type === blockType
    }
  };
  return (

    <div className="djq-editor-header">
      {customControl.map((item, index) => {
        if (typeof item === 'string') {
          // 新增的内部块元素需要在这判断一下
          if (
            item === 'bigTitle' ||
            item === 'smallTitle' ||
            item === 'blockquote' ||
            item === 'unordered-list-item' ||
            item === 'ordered-list-item'
          ) {
            // 块
            item = stringComponent(item, null, getCurrentBlockStyle)
          } else {
            // 行内
            item = stringComponent(item, null, getCurrentInlineStyle)
          }

        } else if (typeof item === 'object') {
          if (typeof item.component === 'string') {
            item = objectComponent(item)
          } else {
            if (item.type == 'block') {
              item = stringComponent(item.detailType, item.component, getCurrentBlockStyle)
            }
          }
        }
        return React.cloneElement(
          item.component(
            dealComponentRes(item.type, item.key)
          ), {
          key: index,
          onMouseDown: (e) => {
            e.preventDefault();
            if (item.type !== 'atomic') props.chooseLabel(item.type, item.key)
          }
        })
      })}
    </div>
  );
};