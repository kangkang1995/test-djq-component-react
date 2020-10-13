import * as React from 'react';
import { Icon, Tooltip, Progress } from 'antd';
import { is } from 'immutable';

interface Props {
  reload: any,
  data: any
}

interface State {

}

export default class extends React.Component<Props, State> {
  constructor(props) {
    super(props);
  }
  shouldComponentUpdate(props) {
    return !is(this.props.data, props.data)
  }
  _renderTemp = (nData) => {
    const { reload } = this.props;
    if (nData.isLoading) {
      return <div className={'masking-box'}>
        <div className={'loading-view'}>
          <Progress type="circle" percent={nData.percent || 0} width={80} strokeWidth={10}
            strokeColor={'#666'} />
        </div>
      </div>
    } else if (nData.error) {
      return <div className={'masking-box'}>
        <div className={'reload-view'} onMouseDown={(e) => {
          e.stopPropagation();
          reload && reload(nData)
        }}>
          <Icon type="reload" />
          <p>图片上传失败</p>
        </div>
      </div>
    }
  };

  render() {
    const { data } = this.props;
    const nData = data.toJS();
    return (
      <>
        <div className={'build-image'}>
          <img src={nData.src || `data:image/jpg;base64,${nData.source}`} />
          {this._renderTemp(nData)}
        </div>
        <figcaption>{nData.description || '对以上图片的描述'}</figcaption>
      </>
    );
  }
}
const Image = (props) => {
  console.log(321321);
  const _loading = () => {
    return <p>123</p>
  };
};
// export default Image