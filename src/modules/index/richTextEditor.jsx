import React, { Component } from "react";
import { RichTextEditor } from "../../component";
import { Input } from "antd";
import { richTextBuilder } from "djq-approach";
import draftToHtml from "draftjs-to-html"; //测试用的，实际放在包里; 目前测试可以处理行内元素的转换
const { TextArea } = Input;
import "./richTextEditor.scss";

// 可以参考一下这些文章：
//   https://segmentfault.com/a/1190000019833834
//   官网等

export default class extends Component {
  state = {
    value: ""
  };
  constructor(props) {
    super(props);
    //设置文本样式
    window.setTextStyle = obj => {
      if (typeof obj === "object") {
        this._setTextStyle && this._setTextStyle(obj);
      } else {
        try {
          obj = JSON.parse(obj);
          this._setTextStyle && this._setTextStyle(obj);
        } catch (e) {}
      }
    };
    //插入图片
    window.insertAtomic = obj => {
      if (typeof obj === "object") {
        let { type, data } = obj;
        if (typeof data !== "object") {
          data = JSON.parse(data);
        }
        return this._insertAtomic(type, data);
      } else {
        try {
          obj = JSON.parse(obj);
          const { type, data } = obj;
          let key = this._insertAtomic(type, data);
          AndroidJs.getImageKey(key);
        } catch (e) {}
      }
    };
    //插入内联文本
    window.insertText = obj => {
      if (typeof obj === "object") {
        return this._insertText(obj);
      } else {
        try {
          obj = JSON.parse(obj);
          let key = this._insertText(obj);
        } catch (e) {}
      }
    };
    //失焦
    window.blur = () => {
      this._blur && this._blur();
    };
    window.focus = () => {
      this._focus && this._focus();
    };
    //退格
    window.onBackSpace = () => {
      this._onBackSpace && this._onBackSpace();
    };
    //获取结果数据
    window.getResult = bool => {
      let result = JSON.stringify(this._save(bool));
      try {
        AndroidJs.getResult(result);
      } catch (error) {
        return result;
      }
    };
    //从草稿箱插入内容
    window.setValueFromDraft = obj => {
      let title = "",
        editorState = { blocks: [], entityMap: {} };
      if (typeof obj === "object") {
        title = obj.title;
        editorState = obj.data;
      } else {
        try {
          obj = JSON.parse(obj);
          title = obj.title;
          editorState = obj.data;
        } catch (e) {}
      }
      if (typeof editorState !== "object") {
        try {
          editorState = JSON.parse(editorState);
        } catch (e) {}
      }
      this.setState({ value: title });
      this._insertValue && this._insertValue(editorState);
    };
    //从服务器插入内容
    window.setValueFromServer = obj => {
      let title = "",
        data = [];
      if (typeof obj === "object") {
        title = obj.title;
        data = obj.data;
      } else {
        try {
          obj = JSON.parse(obj);
          title = obj.title;
          data = obj.data;
        } catch (e) {}
      }
      if (typeof data !== "object") {
        try {
          data = JSON.parse(data);
        } catch (e) {}
      }
      let editorState = richTextBuilder.decodeToDraft(data);
      this.setState({ value: title });
      this._insertValue && this._insertValue(editorState);
    };
  }
  componentDidMount() {
    let editorState = {
      blocks: [
        {
          data: {
            range: ["wechat", "twitter"]
          },
          depth: 0,
          entityRanges: [],
          inlineStyleRanges: [],
          key: "faqfo",
          text: "hahah aha\uf001dsdas",
          type: "unstyled"
        },
        {
          data: {},
          depth: 0,
          entityRanges: [{ offset: 0, length: 1, key: 0 }],
          inlineStyleRanges: [],
          key: "fpqfo",
          text: " ",
          type: "atomic"
        },
        {
          data: {},
          depth: 0,
          entityRanges: [],
          inlineStyleRanges: [],
          key: "fqqfo",
          text: "",
          type: "unstyled"
        },
        {
          data: {},
          depth: 0,
          entityRanges: [{ offset: 0, length: 1, key: 1 }],
          inlineStyleRanges: [],
          key: "apqfo",
          text: " ",
          type: "atomic"
        }
      ],
      entityMap: {
        0: {
          data: {
            src:
              "http://testuserdjqpubdata.dianjingquan.cn/community/thread/6ccc5168-85b9-4720-bfad-c624e608cf49/pictures/COMMUNITY_THREAD_PIC-6918964c-7ec5-4826-ad3c-32d66ac68ee1.jpg",
            error: true
          },
          mutability: "IMMUTABLE",
          type: "image"
        },
        1: {
          data: {
            src:
              "http://testuserdjqpubdata.dianjingquan.cn/community/thread/6ccc5168-85b9-4720-bfad-c624e608cf49/pictures/COMMUNITY_THREAD_PIC-6918964c-7ec5-4826-ad3c-32d66ac68ee1.jpg",
            isLoading: true,
            percent: 30
          },
          mutability: "IMMUTABLE",
          type: "image"
        }
      }
    };
    // this._insertValue && this._insertValue(editorState)
  }
  _save = bool => {
    try {
      let res = this._getValue();
      let obj = {};
      if (bool) {
        obj = richTextBuilder.encodeFromDraft(res);
        obj.text_contents = [];
      } else {
        obj = { data: res };
      }
      obj.title = this.state.value;
      return obj;
    } catch (e) {
      return e;
    }
  };
  _preventReturn(e) {
    e.preventDefault(); //for firefox
  }
  _calculateText(num) {
    try {
      window.webkit.messageHandlers.caluteNumberOfWord.postMessage(num);
    } catch (e) {}
    try {
      AndroidJs.caluteNumberOfWord(num);
    } catch (e) {}
  }
  _listenFocus() {
    try {
      window.webkit.messageHandlers.listenFocus.postMessage();
    } catch (e) {}
    try {
      AndroidJs.listenFocus();
    } catch (e) {}
  }
  _listenCurrentStyle(style) {
    // console.log(style)
  }
  _reloadImage(obj) {
    try {
      window.webkit.messageHandlers.reUploadImage.postMessage(obj);
    } catch (e) {}
    try {
      AndroidJs.reUploadImage(JSON.stringify(obj));
    } catch (e) {}
  }

  _uploadImage = (res, cb) => {
    cb({
      src:
        "http://djq-user-pub-data.oss-cn-hangzhou.aliyuncs.com/bigeyes/182/banner.jpg"
    });
  };
  _onchange = ({ target: { value } }) => {
    let length = value.replace(/[^\x00-\xff]/g, "**").length;
    if (length > 60) {
      alert("已达字数上限（30个字数）");
    } else {
      this.setState({ value: value });
    }
  };

  _handleSubmit = () => {
    let contents = richTextBuilder.encodeFromDraft(
      this._getValue && this._getValue(),
      "rog"
    );
    let testjsonString = JSON.stringify(this._getValue());
    let testdraftToHtml = draftToHtml(this._getValue());
    console.log(contents, this._getValue(), testdraftToHtml, "保存");
  };

  render() {
    return (
      <div className={"editor-box"}>
        {/* <button onMouseDown={(e) => {
        e.preventDefault();
        this._insertText({ type: 'emoji', text: "/:dx" })
        // console.log(richTextBuilder.encodeFromDraft(this._getValue()));
        // this._onBackSpace();
      }}>保存</button> */}
        <div className={"editor-title"}>
          <TextArea
            value={this.state.value}
            onChange={this._onchange}
            placeholder="输入帖子标题"
            autoSize
            onPressEnter={this._preventReturn}
          />
        </div>
        <RichTextEditor
          customControl={[
            "BOLD",
            "ITALIC",
            "UNDERLINE",
            "STRIKETHROUGH",
            "bigTitle",
            "smallTitle",
            'blockquote',
            'unordered-list-item',
            'ordered-list-item',
            {
              component: "COLOR",
              customRequest: null
            },
            {
              component: "videoID",
              customRequest: null
            },
            {
              component: "image",
              customRequest: this._uploadImage
            },
            {
              component: "clearBlock",
              customRequest: null
            },
          ]}
          // height={150}
          style={{ padding: 0, caretColor: "#ff5454" }}
          insertValue={ref => (this._insertValue = ref)}
          insertAtomic={ref => (this._insertAtomic = ref)}
          calculateText={this._calculateText}
          listenCurrentStyle={this._listenCurrentStyle}
          reloadImage={this._reloadImage}
          setTextStyle={ref => (this._setTextStyle = ref)}
          getValue={ref => (this._getValue = ref)}
          insertText={ref => (this._insertText = ref)}
          blur={ref => (this._blur = ref)}
          focus={ref => (this._focus = ref)}
          listenFocus={this._listenFocus}
          listenBlur={this._listenBlur}
          onBackSpace={ref => (this._onBackSpace = ref)}
          // placeholder={111}
        />
        <div>
          <button
            onClick={() => {
              this._handleSubmit();
            }}
          >
            保存
          </button>
        </div>
      </div>
    );
  }
}
