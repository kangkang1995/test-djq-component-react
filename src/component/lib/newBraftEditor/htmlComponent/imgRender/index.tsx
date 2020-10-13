import * as React from 'react';

export default (blockData: any) => {
  return <div className="djq-braft-img-box">
    <div className="djq-braft-img-box-img">
      <img src={blockData.src} alt="图片" />
    </div>
    <div className="djq-braft-img-description">
      <figcaption>{blockData.description ? blockData.description : "对以上图片的描述"}</figcaption>
    </div>
  </div>
}