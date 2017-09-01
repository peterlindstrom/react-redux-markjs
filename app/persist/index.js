/* eslint-disable no-underscore-dangle */
class Persist {

  fetchMarkings() {
    if (localStorage && !localStorage.getItem('markings')) {
      localStorage.setItem('markings', JSON.stringify([]));
    }
    let markings = JSON.parse(localStorage.getItem('markings'));
    if (!markings || markings.length === 0 ) {
      markings = [
        {
          containerId: "article-2",
          articleId: "article-2",
          currentPage: 1,
          selectedText: "Proin ut ligula",
          matchingIndex: 0,
        },
      ];
    }
    return markings;
  }

  addMarking(marking) {
    const markings = JSON.parse(localStorage.getItem('markings'));
    markings.push(marking);

    localStorage.setItem('markings', JSON.stringify(markings));
    return marking;
  }

  updateMarking(marking) {
    const markings = JSON.parse(localStorage.getItem('markings'));
    const toDelete = new Set([marking.id]);
    const newArray = markings.filter(obj => !toDelete.has(obj.id));
    newArray.push(marking);
    localStorage.setItem('markings', JSON.stringify(newArray));
    return marking;
  }

  deleteMarking(markingId) {
    const markings = JSON.parse(localStorage.getItem('markings'));
    const toDelete = new Set([markingId]);
    const newArray = markings.filter(obj => !toDelete.has(obj.id));
    localStorage.setItem('markings', JSON.stringify(newArray));
    return markingId;
  }
}

export default new Persist();
