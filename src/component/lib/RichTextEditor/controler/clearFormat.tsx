import { RichUtils } from 'draft-js';
import getCurrentStyle from './getCurrentStyle';

export default function (type, editorState) {
  switch (type) {
    case "clearBlock":
      return RichUtils.toggleBlockType(
        editorState,
        getCurrentStyle(editorState)
      )
  }
}
