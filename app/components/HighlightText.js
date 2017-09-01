import { Component } from 'react';
import PropTypes from 'prop-types';
import throttle from 'lodash/throttle';

// Excluding selectors where highlighting should not be activated
const EXCLUDE_CLASS_SELECTOR = ['.math'];
const EXCLUDE_TAG_SELECTOR = ['IMG'];
// For markjs just to be sure
const EXCLUDE_SELECTOR = [...EXCLUDE_CLASS_SELECTOR, ...EXCLUDE_TAG_SELECTOR];
// The container for where highlights should be activated
const VALID_HIGHLIGHT_CONTAINER = '.article';
// The lenght of the text to be matched to find the matching index, if longer than this sets matching index 0.
const REGEXP_MAXLENGTH = 512;

// Settings for Markjs when highlighting text
const MARK_DEFAULT_PROPS = {
  separateWordSearch: false,
  diacritics: false,
  accuracy: {
    value: 'exactly',
    limiters: [''],
  },
  exclude: EXCLUDE_SELECTOR,
  acrossElements: true,
  caseSensitive: true,
};

// Only show the mark if the index matches the current index e.g. if we have
// multiple matches
const filterMarking = (currentIndex, index) => {
  // Filter only the selected marking, not all words matching in container
  const match = (currentIndex - 1 === index) ||
    (index === -1);
  return match;
};

// Returns the highlighted text
const getSelectedText = () => {
  let sel;
  let txt = '';
  /* eslint-disable no-cond-assign */
  if (window.getSelection) {
    txt = window.getSelection().toString();
  } else if ((sel = document.selection) && sel.type === 'Text') {
    txt = sel.createRange().text;
  }
  /* eslint-enable no-cond-assign */
  return txt;
};

// Workaround to not get mark tags on elements that will break the html markup
const removeInvalidMarkings = () => {
  const tbody = document.querySelectorAll('tbody > mark');
  tbody.forEach((item) => {
    item.parentNode.removeChild(item);
  });
  const tr = document.querySelectorAll('tr > mark');
  tr.forEach((item) => {
    item.parentNode.removeChild(item);
  });
  const ul = document.querySelectorAll('ul > mark');
  ul.forEach((item) => {
    item.parentNode.removeChild(item);
  });
  const ol = document.querySelectorAll('ol > mark');
  ol.forEach((item) => {
    item.parentNode.removeChild(item);
  });
  const fig = document.querySelectorAll('figure > mark');
  fig.forEach((item) => {
    item.parentNode.removeChild(item);
  });
};

const renderMarking = (props) => {
  const {
    selectedText,
    matchingIndex,
    containerId,
    className,
  } = props;
  const container = document.querySelector(`#${containerId}`);
  return new Promise((resolve, reject) => {
    // Get the selected range
    if (selectedText) {
      let currentIndex = 0;
      const markInstance = new global.Mark(container);
      // markjs does not like \n when marking over <br> or <p>, so we are first trying
      // to remove \n and see if it's a valid mark
      markInstance.mark(selectedText.replace(/\n/g, ''), {
        element: 'mark',
        className,
        ...MARK_DEFAULT_PROPS,
        done: (marked) => {
          if (marked) {
            removeInvalidMarkings();
            resolve();
          } else {
            // if failing the mark we try again without removing line breaks from selection
            // this applies to marking of <li> elements
            currentIndex = 0;
            markInstance.mark(selectedText, {
              element: 'mark',
              className,
              ...MARK_DEFAULT_PROPS,
              done: (markedNextTry) => {
                if (markedNextTry) {
                  removeInvalidMarkings();
                  resolve();
                } else {
                  reject();
                }
              },
              fail: reject,
              // eslint-disable-next-line no-return-assign
              filter: () =>
                filterMarking(
                  currentIndex += 1,
                  matchingIndex,
                ),
            });
          }
        },
        fail: reject,
        // eslint-disable-next-line no-return-assign
        filter: () =>
          filterMarking(
            currentIndex += 1,
            matchingIndex,
          ),
      });
    }
  });
};

const unmark = (className) => {
  const markEls = [...document.body.querySelectorAll(`.${className}`)];

  if (!markEls || !markEls.length) {
    return Promise.resolve();
  }

  const promises = markEls.map((markEl) => {
    const instance = new global.Mark(markEl);

    return new Promise(resolve => instance.unmark({
      done: resolve,
    }));
  });

  return Promise.all(promises);
};

class HighlightText extends Component {
  static getMediaQueryList() {
    if (window) {
      return window.matchMedia('(min-width: 62em)');
    }

    return null;
  }
  constructor(props) {
    super(props);

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onViewportChange = this.onViewportChange.bind(this);
    this.onSelectionChanged = throttle(this.selectionChanged.bind(this), 500);

    this.state = {
      largeViewport: window &&
      window.matchMedia &&
      window.matchMedia('(min-width: 62em)').matches,
      mounted: false,
    };
  }

  componentDidMount() {
    document.addEventListener('selectionchange', this.onSelectionChanged);
    document.body.addEventListener('mousedown', this.onMouseDown);
    document.body.addEventListener('mouseup', this.onMouseUp);
    this.mql = HighlightText.getMediaQueryList();

    if (this.mql) {
      this.mql.addListener(this.onViewportChange);
    }
    this.setState({mounted: true});
  }

  componentDidUpdate(prevProps, prevState) {
    const { markings,
      updatedIndex,
      setHighlightText,
      currentPage,
      selectedMarking,
      visibleEditor,
      markingsToBeRemoved,
      resetRemoveHighlights,
      articleId,
    } = this.props;
    const {
      mounted
    } = this.state;

    const { largeViewport } = this.state;

    if (markingsToBeRemoved && markingsToBeRemoved.length) {
      const promises = markingsToBeRemoved.map(id => unmark(`mark-${id}`));
      Promise.all(promises).then(() => {
        resetRemoveHighlights();
      }).catch(() => {});
    }

    // remove any old temporary markings
    if (!visibleEditor) {
      unmark('mark-temporary');
    }

    // we only create a temporary marking when we have an unsaved marking and press
    // the "Highlight" button.
    if (selectedMarking && !selectedMarking.id && visibleEditor) {
      renderMarking({
        ...selectedMarking,
        className: 'mark-temporary',
      }).catch(() => {
        this.props.closeContextMenu();
      });
    }

    const markingsChanged = (prevProps.markings.length !== markings.length) ||
      prevProps.markings.index !== markings.index ||
      prevProps.updatedIndex !== updatedIndex ||
      prevProps.setHighlightText !== setHighlightText ||
      prevState.largeViewport !== largeViewport ||
      prevState.mounted !== mounted;

    if (markings && markings.length) {
      if (markingsChanged) {
        window.requestAnimationFrame(() => {
          this.renderHighlights(articleId, currentPage, false);
        });
      }
    }
  }

  componentWillUnmount() {
    document.removeEventListener('selectionchange', this.onSelectionChanged);
    document.body.removeEventListener('mousedown', this.onMouseDown);
    document.body.removeEventListener('mouseup', this.onMouseUp);
    if (this.mql) {
      this.mql.removeListener(this.onViewportChange);
    }
  }

  onViewportChange(mql) {
    this.setState({ largeViewport: mql.matches });
    this.forceUpdate();
  }

  onMouseDown(event) {
    if (event.target.closest('.menu')) {
      return;
    }

    if (this.props.visible) {
      // always close the context menu first
      this.props.closeContextMenu();
    }

    // if we click on an existing mark we ashould open the mark editor directly
    const mark = event.target.closest('mark');
    if (mark && event.target.closest(VALID_HIGHLIGHT_CONTAINER) && !mark.classList.contains('mark-temporary')) {
      this.openMarkEditor(mark);
    }
  }

  onMouseUp(event) {
    if (event.target.closest('mark') || !event.target.closest(VALID_HIGHLIGHT_CONTAINER) || !getSelectedText()) {
      return;
    }

    this.props.setHighlightText({
      posX: event.clientX,
      posY: event.clientY,
    });
  }

  getMarkSelection() {
    const { articleId,
      currentPage,
      visibleEditor,
    } = this.props;

    if (visibleEditor) {
      return null;
    }

    const selection = window.getSelection();
    const selectedText = getSelectedText();

    if (!selectedText.trim()) {
      return null;
    }

    const parentNode = selection.anchorNode.parentNode;

    for (let i = 0; i < EXCLUDE_CLASS_SELECTOR.length; i += 1) {
      if (parentNode.closest(EXCLUDE_CLASS_SELECTOR[i]) ||
        parentNode.classList.contains(EXCLUDE_CLASS_SELECTOR[i])) {
        return null;
      }
    }
    for (let i = 0; i < EXCLUDE_TAG_SELECTOR.length; i += 1) {
      if (parentNode.closest(EXCLUDE_TAG_SELECTOR[i]) ||
        parentNode.tagName === EXCLUDE_TAG_SELECTOR[i]) {
        return null;
      }
    }
    if (!parentNode.closest(VALID_HIGHLIGHT_CONTAINER)) {
      return null;
    }

    const containerId = parentNode.closest(VALID_HIGHLIGHT_CONTAINER).id;
    const storeArticleId = articleId;
    const selectedPage = currentPage;
    // Get the selected range
    if (selection.rangeCount && !selection.getRangeAt(0).collapsed) {
      const range = selection.getRangeAt(0);

      const precedingRange = document.createRange();
      const container = document.getElementById(containerId);
      precedingRange.setStartBefore(container.firstChild);
      precedingRange.setEnd(range.startContainer, range.startOffset);

      const wholeRange = document.createRange();
      wholeRange.setStartBefore(container.firstChild);
      wholeRange.setEndAfter(container.lastChild);
      // Get the text preceding the selection to get the matching index
      // and checking the whole selection to compare to matches
      const textPrecedingSelection = precedingRange.toString();
      const textWholeSelection = wholeRange.toString();
      let matchingIndex = null;
      let match = null;
      let matchWhole = null;
      if (selectedText.length <= REGEXP_MAXLENGTH) {
        try {
          const safeText = (selectedText || '').replace(/([?!${}*:()|=^[\]/\\.+])/g, '\\$1');
          const regExp = new RegExp(safeText, 'g');
          match = textPrecedingSelection.match(regExp);
          matchWhole = textWholeSelection.match(regExp);
          matchingIndex = match ? match.length : 0;
        } catch (e) {
          return null;
        }
      }
      if (!matchWhole || (matchWhole && matchWhole.length === 1)) {
        matchingIndex = -1;
      }

      return {
        containerId,
        articleId: storeArticleId,
        currentPage: selectedPage || 1,
        selectedText,
        matchingIndex,
      };
    }

    return null;
  }

  selectionChanged() {
    const selection = this.getMarkSelection();
    // save selection results for context menu
    if (selection) {
      this.props.setCurrentMarking(selection);
    }
  }

  openMarkEditor(mark) {
    const {
      setHighlightText,
      selectMarking,
      toggleEditor,
    } = this.props;

    const markPosition = mark.getBoundingClientRect();
    setHighlightText({
      posX: markPosition.left,
      posY: markPosition.bottom,
    });
    const marking = mark.className.replace(/mark-/, '');
    selectMarking(marking);
    toggleEditor(true);
  }

  renderHighlights(articleId, page) {
    if (!articleId || isNaN(page)) {
      return;
    }
    const { markings } = this.props;
    markings.forEach((marking) => {
      if (marking.articleId === articleId &&
        (page === marking.currentPage || page === null)) {
        if (window) {
          const selectorElement = document.querySelector(`#${marking.containerId}`);

          if (!marking.containerId) {
            return null;
          }
          const instance = new global.Mark(selectorElement);
          let currentIndex = 0;
          const markingElements = document.querySelectorAll(`.mark-${marking.id}`);
          if (!markingElements.length) {
            // markjs does not like \n when marking over <br> or <p>, so we are first trying
            // to remove \n and see if it's a valid mark
            return instance.mark(marking.selectedText.replace(/\n/g, ''), {
              element: 'mark',
              className: `mark-${marking.id}`,
              ...MARK_DEFAULT_PROPS,
              done: (marked) => {
                if (marked) {
                  removeInvalidMarkings();
                } else {
                  // if failing the mark we try again without removing line breaks from selection
                  // this applies to marking of <li> elements
                  currentIndex = 0;
                  instance.mark(marking.selectedText, {
                    element: 'mark',
                    className: `mark-${marking.id}`,
                    ...MARK_DEFAULT_PROPS,
                    done: (markedNextTry) => {
                      if (markedNextTry) {
                        removeInvalidMarkings();
                      }
                    },
                    // eslint-disable-next-line no-return-assign
                    filter: () =>
                      filterMarking(
                        currentIndex += 1,
                        marking.matchingIndex,
                      ),
                  });
                }
              },
              // eslint-disable-next-line no-return-assign
              filter: () =>
                filterMarking(
                  currentIndex += 1,
                  marking.matchingIndex,
                ),
            });
          }
        }
      }
      return false;
    });
  }

  render() {
    return null;
  }
}

HighlightText.defaultProps = {
  markings: [],
  updatedIndex: 0,
  markingsToBeRemoved: [],
  currentPage: 1,
};

HighlightText.propTypes = {
  articleId: PropTypes.string,
  visible: PropTypes.bool,
  visibleEditor: PropTypes.bool,
  setHighlightText: PropTypes.func.isRequired,
  toggleEditor: PropTypes.func.isRequired,
  markings: PropTypes.arrayOf(PropTypes.object),
  markingsToBeRemoved: PropTypes.arrayOf(PropTypes.string),
  selectMarking: PropTypes.func.isRequired,
  selectedMarking: PropTypes.shape({}),
  currentPage: PropTypes.number,
  updatedIndex: PropTypes.number,
  setCurrentMarking: PropTypes.func.isRequired,
  resetRemoveHighlights: PropTypes.func.isRequired,
  closeContextMenu: PropTypes.func.isRequired,
};

export default HighlightText;
