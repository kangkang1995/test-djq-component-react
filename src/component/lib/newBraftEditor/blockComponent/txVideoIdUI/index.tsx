import * as React from 'react';
import "./style";

interface Props {
  blockProps?: any,
  contentState?: any,
  block?: any,
}

interface State {
}

export default class extends React.Component<Props, State> {
  state = {
  }
  constructor(props) {
    super(props);
  }

  render() {
    const blockData = this.props.contentState.getEntity(this.props.block.getEntityAt(0)).getData();
    let {tx_video_id,description} = blockData;
    return <div className="djq-tx-video">
      <div className='djq-tx-video-id'>
        腾讯视频id为 {tx_video_id}
      </div>
      <div className="djq-braft-video-description">
        <span>{description ? description : "对以上视频的描述"}</span>
      </div>
    </div>
  }

}
