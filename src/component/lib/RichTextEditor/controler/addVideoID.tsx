import { AtomicBlockUtils, EditorState,  } from 'draft-js'
import { exchangeContentStateToEditorState } from './dataConversion';
export default (editorState, data) => {
  const contentState = editorState.getCurrentContent();
  let { entityKey, ...restData } = data;
  const contentStateWithEntity = contentState.createEntity('videoID', 'IMMUTABLE', restData);
  entityKey = contentStateWithEntity.getLastCreatedEntityKey();
  // const newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity });
  const newEditorState = exchangeContentStateToEditorState(AtomicBlockUtils.insertAtomicBlock(editorState, entityKey, ' ').getCurrentContent());
  return EditorState.forceSelection(newEditorState, newEditorState.getCurrentContent().getSelectionAfter())
};