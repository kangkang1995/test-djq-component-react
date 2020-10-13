import * as React from 'react';
import { Button } from 'antd';


export default function (type,component?:any,currentStyle?:any) {
  const blockObj = {
    bigTitle: {
      component: () => {
        return <Button
          type={currentStyle === 'header-one' ? 'primary' : 'default'}
        >{component?component:<span>大标题</span>}</Button>
      },
      type: "block",
      key: "header-one"
    },
    smallTitle: {
      component: () => {
        return <Button
          type={currentStyle === 'header-two' ? 'primary' : 'default'}
        >{component?component:<span>小标题</span>}</Button>
      },
      type: "block",
      key: "header-two"
    },
    blockquote: {
      component: () => {
        return <Button
          type={currentStyle === 'blockquote' ? 'primary' : 'default'}
        >{component?component:<span>引用</span>}</Button>
      },
      type: "block",
      key: "blockquote"
    },
    'unordered-list-item': {
      component: () => {
        return <Button
          type={currentStyle === 'unordered-list-item' ? 'primary' : 'default'}
        >{component?component:<span>符号列表</span>}</Button>
      },
      type: "block",
      key: "unordered-list-item"
    },
    'ordered-list-item': {
      component: () => {
        return <Button
          type={currentStyle === 'ordered-list-item' ? 'primary' : 'default'}
        >{component?component:<span>数字列表</span>}</Button>
      },
      type: "block",
      key: "ordered-list-item"
    }
  };
  return blockObj[type];
}