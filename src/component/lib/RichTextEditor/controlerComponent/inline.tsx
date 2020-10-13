import * as React from 'react';
import { Button } from 'antd';


export default function (type,component?:any,currentStyle?:any) {
  let isChoose = currentStyle.has(type);
  const inlineObj = {
    BOLD: {
      component: () => {
        return <Button
          type={isChoose ? 'primary' : 'default'}
        >{component?component:<span>加粗</span>}</Button>
      },
      type: "inline",
      key: "BOLD"
    },

    ITALIC: {
      component: () => {
        return <Button
          type={isChoose ? 'primary' : 'default'}
        >{component?component:<span>斜体</span>}</Button>
      },
      type: "inline",
      key: "ITALIC"
    },

    UNDERLINE: {
      component: () => {
        return <Button
          type={isChoose ? 'primary' : 'default'}
        >{component?component:<span>下划线</span>}</Button>
      },
      type: "inline",
      key: "UNDERLINE"
    },

    CODE: {
      component: () => {
        return <Button
          type={isChoose ? 'primary' : 'default'}
        >{component?component:<span>未知（一般不要启动）</span>}</Button>
      },
      type: "inline",
      key: "CODE"
    },

    STRIKETHROUGH: {
      component: () => {
        return <Button
          type={isChoose ? 'primary' : 'default'}
        >{component?component:<span>删除线</span>}</Button>
      },
      type: "inline",
      key: "STRIKETHROUGH"
    },
    
  };
  return inlineObj[type];
}