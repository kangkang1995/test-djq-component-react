import * as React from 'react';
import { Select, message, Modal, } from 'antd';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { base as approachBase } from 'djq-approach';
const { md5, cookie } = approachBase;
interface Data {
}

interface Props {
  initRef?: Function,
  _update?: Function,
  aspectRatio?: Number,//裁剪的尺寸比例
  service?: any,
  CropperModalWidth?: any,//裁剪图片后面的弹窗大小
  CropperStyle?: any,//裁剪图片的样式
}
interface State {
}

export default class extends React.Component<Props, State>{
  cropper = null;
  selectImgName = "";
  selectImgType = "";
  imgType = ""
  state = {
    uid: cookie.get('loginUid'),
    token: cookie.get('loginToken'),
    test_bg_url: "",
    bg_url_status: false,
  };
  constructor(props) {
    super(props);
    props.initRef && props.initRef(this._initCropper);
  }

  _initCropper = (test_bg_url, bg_url_status, selectImgName, selectImgType, imgType,uid=cookie.get('loginUid'),token=cookie.get('loginToken')) => {
    /*
      test_bg_url：原始图片的url
      bg_url_status：模态框的开关
      selectImgName：原始图片的name
      selectImgType：原始图片的文件格式
      imgType：oss需要的type类型
    */
    this.selectImgName = selectImgName;
    this.selectImgType = selectImgType;
    this.imgType = imgType;
    this.setState({
      test_bg_url,
      bg_url_status,
      uid: uid,
      token: token
    })
  }

  // 裁剪
  _setBgStatusOk = () => {
    const { base } = this.props.service;
    let cropper = this.cropper.getCroppedCanvas().toDataURL(this.selectImgType);
    let baseFile = this.dataURLtoFile(cropper, this.selectImgName, this.selectImgType);
    let imgType = this.imgType;
    base.getOssParams({ uid: this.state.uid, access_token: this.state.token }, { type: imgType })
      .then(
        ({ data: { token: option } }) => {
          base.uploadImage(baseFile, option).then(
            (file) => {
              let url = file.data.previewUrl;
              let uploadId = file.data.uploadId;
              this.props._update(url, uploadId, imgType)
              this.setState({
                bg_url_status: false
              })
            }
          );
        }
      )
      .catch(
        (err) => {
          message.error('出错咯');
        });
  };

  _setBgStatusCancel = () => {
    let data = Object.assign({}, this.state, { bg_url_status: false });
    this.setState(
      data
    )
  }

  dataURLtoFile = (dataurl, filename, filetype) => {//将base64转换为文件
    let arr = dataurl.split(','),
      // mime = arr[0].match(/:(.*?);/)[1],
      mime = filetype,
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  render() {
    return (
      <React.Fragment>
        {this._renderCropper()}
      </React.Fragment>
    )
  }
  _renderCropper = () => {
    return <Modal
      title="裁剪图片"
      visible={this.state.bg_url_status}
      onOk={this._setBgStatusOk}
      onCancel={this._setBgStatusCancel}
      maskClosable={false} //点击遮罩层是否关闭
      okText='确认'
      cancelText="返回"
      destroyOnClose={true}
      width={this.props.CropperModalWidth ? this.props.CropperModalWidth : "850px"}
    >
      <Cropper
        src={this.state.test_bg_url}
        className="company-logo-cropper"
        style={this.props.CropperStyle ? this.props.CropperStyle : { height: "400px", width: '100%' }}
        ref={cropper => this.cropper = cropper}
        viewMode={1}
        aspectRatio={this.props.aspectRatio} //裁剪的尺寸比例
        background={true}
        guides={false}
        zoomable={false}  //缩放
        zoomOnTouch={false}  //触摸可缩放图像
      />
    </Modal>
  }
}