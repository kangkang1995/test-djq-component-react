import React, { Component } from "react";
import { NewBraftEditor } from "../../../component";
import { base as approachBase } from 'djq-approach';
const { cookie } = approachBase;
import "./style.scss";
import * as env from "env";

import Service from 'djq-server';
const netService = new Service({
  env
});

export default class extends Component {
  auth_access_token = cookie.get('loginToken') || '';  //目前用的是cookie，真实应该用帖子作者的信息
  auth_uid = cookie.get('loginUid') || '';
  state = {
    value: ""
  };
  constructor(props) {
    super(props);
    window._insertBlock = (type) =>{
      this._insertBlock(type)
    };
    window._insertInlineStyle = (type) =>{
      this._insertInlineStyle(type)
    }
    window._insertEntity = (type,obj) =>{
      this._insertEntity(type,obj)
    }
    window._blur = (bool) =>{
      this._blur()
    }
    window._focus = () =>{
      this._focus()
    }
    
  }
  componentDidMount() {
    let content = {"blocks":[{"key":"","text":"法第三方第三方第三方收到水电费水电费都是父","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":4,"length":8,"style":"BOLD"},{"offset":12,"length":9,"style":"ITALIC"}],"entityRanges":[],"data":{}},{"key":"","text":"11111","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"","text":"1212121212","type":"header-one","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}
    this._insertValue(content)
  }

  componentDidUpdate(){
    console.log(this.getEditorStateLength())
  }

  _getValue = () => {
    // let contents = richTextBuilder.encodeFromDraft(
    //   convertToRaw(this.newBraftEditorRef.getValue().getCurrentContent()),
    //   "rog"
    // );
    // console.log(
    //   contents,
    //   convertToRaw(this.newBraftEditorRef.getValue().getCurrentContent()),
    //   JSON.stringify(convertToRaw(this.newBraftEditorRef.getValue().getCurrentContent()))
    // );
    console.log(this.newBraftEditorRef._getValue().toRAW(false),this.newBraftEditorRef._getValue().toRAW(true),this.newBraftEditorRef._getValue().toHTML())
    // console.log(this._getEditorStateLength())
  };

  _setParentComponentCover = (url) =>{
    console.log(url)
  }
  // 发送字数
  _calculateText(num) {
    try {
      window.webkit.messageHandlers.caluteNumberOfWord.postMessage(num);
    } catch (e) {}
    try {
      AndroidJs.caluteNumberOfWord(num);
    } catch (e) {}
  }
  // 发送状态
  _reloadToolStatus(arrays) {
    console.log(arrays,'arrays')
    try {
      window.webkit.messageHandlers.reloadToolStatus.postMessage(arrays);
    } catch (e) {}
    try {
      // AndroidJs.caluteNumberOfWord(num);
    } catch (e) {}
  }

  render() {
    return (
      <React.Fragment>
        <button onClick={this._getValue}>获取内容</button>
        <div className="new-djq-editor-container">
          <NewBraftEditor
            ref={instance => (this.newBraftEditorRef = instance)}
            setParentComponentCover={this._setParentComponentCover}
            insertValue={(ref) => this._insertValue = ref}
            getEditorStateLength={(ref) => this._getEditorStateLength = ref}
            insertInlineStyle={(ref) => this._insertInlineStyle = ref}
            insertBlock={(ref) => this._insertBlock = ref}
            insertEntity={(ref) => this._insertEntity = ref}
            blur={(ref) => this._blur = ref}
            focus={(ref) => this._focus = ref}
            DJQObj={
              {
                // editorType: "ROG",
                editorType: "APP",
                service: netService,
                uid: this.auth_uid,
                access_token: this.auth_access_token,
                imgType: 'COMMUNITY_THREAD_PIC',
              }
            }
            calculateText={this._calculateText}
            reloadToolStatus={this._reloadToolStatus}
            // styles={{width:"890px"}}
            styles={{width:"100%"}}
          />
        </div>
      </React.Fragment>
    );
  }
}
