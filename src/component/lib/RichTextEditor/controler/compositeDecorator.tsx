import * as React from 'react';
import { CompositeDecorator } from 'draft-js';
import { emojiMap as emoji } from 'djq-approach';
import "./emoji/style";
import Object from '../../gameAgainstMap/object';
const emojiMap = emoji.sourceMap;

function analysisEmoji(contentBlock, callback, contentState) {
  const text = contentBlock.getText();
  let emojiList = text.match(/[\ue000-\uefff]/g) || [];
  let emojiRest = text.split(/[\ue000-\uefff]/) || [];
  let mIndex = 0;
  emojiList.forEach((item, index) => {
    let frontIndex = emojiRest[index].length;
    callback(mIndex + frontIndex, mIndex + frontIndex + item.length);
    mIndex += frontIndex + item.length;
  });
}
const emojiComponent = (props: any) => {
  const { decoratedText, offsetKey } = props;
  const index = emojiMap.get(decoratedText);
  let child = props.children[0];
  let pp = { ...child.props, text: "口" };
  let newChild = { ...child, props: pp };
  return <span className={'emoji-box'} data-offset-key={offsetKey}><i className={`emoji sort-${index}`} >{[newChild]}</i></span>;
};

export default new CompositeDecorator([
  {
    strategy: analysisEmoji,
    component: emojiComponent,
  }
]);