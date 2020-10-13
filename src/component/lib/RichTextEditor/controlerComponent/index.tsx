import block from './block';
import inline from './inline';
import atomic from './atomic';

const INLINE_STYLES = ['BOLD','ITALIC','UNDERLINE','CODE','STRIKETHROUGH',];
const BLOCK_STYLES = ['bigTitle','smallTitle','blockquote','unordered-list-item','ordered-list-item'];  //blockquote 失败
const ATOMIC_STYLES = ['image','videoID','COLOR','clearBlock'];

export const stringComponent = function(type,component?:any,currentStyle?:any){
  // currentStyle   当前 选择的类型，高亮样式需要的
  if(BLOCK_STYLES.includes(type)){
    return block(type,component,currentStyle)
  }else if(INLINE_STYLES.includes(type)){
    return inline(type,component,currentStyle)
  }
};

export const objectComponent = function (obj) {
  const {component} = obj;
  if(ATOMIC_STYLES.includes(component)){
    return atomic(obj);
  }
};