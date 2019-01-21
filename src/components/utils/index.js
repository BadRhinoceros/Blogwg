export const getSelectionRange = () => {
  const selection = window.getSelection();
  if (selection.rangeCount === 0) return null;

  return selection.getRangeAt(0);
};

export const getSelectionCoords = (selectionRange) => {
  const editorBounds = document.getElementById('editor-container').getBoundingClientRect();
  const rangeBounds = selectionRange.getBoundingClientRect();
  const rangeWidth = rangeBounds.right - rangeBounds.left;

  const offsetLeft = (rangeBounds.left - editorBounds.left) + (rangeWidth / 2) - (107 / 2);

  const offsetTop = rangeBounds.top - editorBounds.top - 42;

  return { offsetLeft, offsetTop };
};
