import { EditorState, convertToRaw, Modifier } from 'draft-js'
import { exchangeObjToEditorState } from './dataConversion';
export default function (editorState) {
    const content = editorState.getCurrentContent();
    let obj = convertToRaw(content);
    let currentSelection = editorState.getSelection();
    let key = currentSelection.getFocusKey();
    let offset = currentSelection.getFocusOffset();
    if (offset <= 0 && obj.blocks.length === 1) return editorState
    let restText = "";
    obj.blocks = obj.blocks.filter((item) => {
        if (item.key === key) {
            if (offset > 0) {
                item.text = deleteStr(item.text, offset);
                return true;
            } else {
                restText = item.text;
                return false;
            }
        }
        return true;
    });
    let lastKey = content.getKeyBefore(key);
    if (lastKey && offset <= 0) {
        obj.blocks.map((item) => {
            if (item.key === lastKey) {
                offset = item.text.length;
                item.text = item.text + restText;
            }
            return item;
        });
        key = lastKey;
    } else {
        offset && offset--;
    }
    return EditorState.acceptSelection(exchangeObjToEditorState(obj), currentSelection.merge({
        anchorKey: key,
        focusKey: key,
        anchorOffset: offset,
        focusOffset: offset
    }))
}
function deleteStr(str: string, offset: number) {
    if (offset === 0) return str;
    let strArr = str.split('');
    strArr.splice(offset - 1, 1);
    return strArr.join('');
}
