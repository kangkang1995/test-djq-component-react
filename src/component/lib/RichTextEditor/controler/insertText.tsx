import { EditorState, convertToRaw, Modifier } from 'draft-js'
import { exchangeObjToEditorState } from './dataConversion';
export default function (editorState, text) {
  let obj = convertToRaw(editorState.getCurrentContent());
  let currentSelection = editorState.getSelection();
  const key = currentSelection.getFocusKey();
  const offset = currentSelection.getFocusOffset();
  obj.blocks.map((item) => {
    if (item.key === key) {
      item.text = insertToStr(item.text, offset, text);
    }
    return item;
  });
  const updatedSelection = currentSelection.merge({
    anchorOffset: offset + text.length,
    focusOffset: offset + text.length
  });
  return EditorState.acceptSelection(exchangeObjToEditorState(obj), updatedSelection)
}
function insertToStr(str: string, offset: number, flg: string) {
  // if (str.length === 0) return str;
  let startStr = str.substring(0, offset);
  let endStr = str.substring(offset, str.length);
  return startStr + flg + endStr;
}
