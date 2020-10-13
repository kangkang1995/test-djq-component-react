import { EditorState, Modifier, convertToRaw } from 'draft-js'
import { exchangeObjToEditorState } from './dataConversion';
const tryToRemoveBlockStyle = function (editorState) {
    var selection = editorState.getSelection();
    var offset = selection.getAnchorOffset();
    if (selection.isCollapsed() && offset === 0) {
        var key = selection.getAnchorKey();
        var content = editorState.getCurrentContent();
        var block = content.getBlockForKey(key);

        var firstBlock = content.getFirstBlock();
        if (block.getLength() > 0 && block !== firstBlock) {
            return null;
        }
        var type = block.getType();
        var blockBefore = content.getBlockBefore(key);
        if (type === 'code-block' && blockBefore && blockBefore.getType() === 'code-block' && blockBefore.getLength() !== 0) {
            return null;
        }

        if (type !== 'unstyled') {
            // return DraftModifier.setBlockType(content, selection, 'unstyled');
            // 没有 DraftModifier 这个方法了
            return Modifier.setBlockType(content, selection, 'unstyled');      
        }
    }
    return null;
}
export default function onBackSpace(editorState) {
    var selection = editorState.getSelection();
    if (!selection.isCollapsed() || selection.getAnchorOffset() || selection.getFocusOffset()) {
        return null;
    }
    var content = editorState.getCurrentContent();
    var startKey = selection.getStartKey();
    var blockBefore = content.getBlockBefore(startKey);
    if (blockBefore && blockBefore.getType() === 'atomic') {
        let contentObj = convertToRaw(content);
        let blockKey = blockBefore.getKey();
        contentObj.blocks = contentObj.blocks.filter((item) => {
            if (item.key === blockKey) {
                delete contentObj.entityMap[item.entityRanges[0].key];
                return false;
            }
            return true;
        })
        const updatedSelection = selection.merge({
            anchorOffset: 0,
            focusOffset: 0
        });
        return EditorState.acceptSelection(exchangeObjToEditorState(contentObj), updatedSelection)
    }
    var withoutBlockStyle = tryToRemoveBlockStyle(editorState);
    if (withoutBlockStyle) {
        return EditorState.push(editorState, withoutBlockStyle, 'change-block-type');
    }
    return null;
}