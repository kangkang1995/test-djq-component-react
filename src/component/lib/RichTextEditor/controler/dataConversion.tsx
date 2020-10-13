import { EditorState, convertFromRaw } from 'draft-js';
import { compositeDecorator } from "./index";

export const exchangeObjToEditorState = function (obj: object) {
  return EditorState.createWithContent(convertFromRaw(obj), compositeDecorator)
};

export const exchangeContentStateToEditorState = function (contentState: object) {
  return EditorState.createWithContent(contentState, compositeDecorator)
};