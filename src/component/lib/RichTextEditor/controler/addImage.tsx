import { AtomicBlockUtils, EditorState, convertToRaw } from 'draft-js'
import { exchangeContentStateToEditorState } from './dataConversion';
export default (editorState, data) => {
  const contentState = editorState.getCurrentContent();
  let { entityKey, ...restData } = data;
  if (!entityKey) {
    const contentStateWithEntity = contentState.createEntity('image', 'IMMUTABLE', restData);
    entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    // const newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity });
    const newEditorState = exchangeContentStateToEditorState(AtomicBlockUtils.insertAtomicBlock(editorState, entityKey, ' ').getCurrentContent());
    return EditorState.forceSelection(newEditorState, newEditorState.getCurrentContent().getSelectionAfter())
  } else {
    if (restData.isLoading) {
      let d = contentState.getEntity(entityKey).toJS().data;
      restData = Object.assign(d, restData);
    }
    return exchangeContentStateToEditorState(contentState.replaceEntityData(entityKey, restData));
  }
};