import * as React from 'react';
import {Icon,Tooltip} from 'antd';

export default (props) => {
  const {cz,xxhc,content,thzbs} = props.data;
  return (
    <div className={'build-equip'}>
      <h1>出装顺序</h1>
      <div className={'cz-content'}>
        {cz.map((item,index)=>
          <dl key={`${item.id}-${index}`}>
            <dd><img src={item.icon_url} /></dd>
            <dt>{item.name}</dt>
          </dl>
        )}
      </div>
      <h2>详细合成数据</h2>
      <div className={'xxhc-content'}>
        {xxhc.map((item,index)=>
          <dl key={`${item.id}-${index}`}>
            <dd><img src={item.icon_url} /></dd>
            <dt>{item.name}</dt>
          </dl>
        )}
      </div>
      <figcaption>{content}</figcaption>
      <h2>替换装备</h2>
      {
        thzbs.map((item,index)=>
          <div className={'thzbs-content'} key={index}>
            <div className={'thzbs-build'}>
              <dl>
                <dd><img src={item.zb1.icon_url}/></dd>
                <dt>{item.zb1.name}</dt>
              </dl>
              <dl>
                <dd><img src={item.zb2.icon_url}/></dd>
                <dt>{item.zb2.name}</dt>
              </dl>
            </div>
            <figcaption>{item.content}</figcaption>
          </div>
        )
      }
    </div>
  );
};