function traverseItems(nList, fn) {
  for (let i in nList) {
    let node = nList[i];

    fn.apply(this, [node]);

    if (node.items !== undefined && node.items.length > 0) {
      traverseItems(node.items, fn);
    }
  }
}

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c === 'x' ? r : ((r & 0x3) | 0x8);
    return v.toString(16);
  });
}

function uuid() {
  return uuidv4();
}

function sortByName(arr) {
  let arrCopy = arr.slice();

  arrCopy.sort((a, b) => {
    let aName = a.name.toUpperCase(),
        bName = b.name.toUpperCase();

    if(aName < bName) {
      return -1;
    }

    if(aName > bName) {
      return 1;
    }

    return 0;
  });

  return arrCopy;
}

module.exports = {
  traverseItems,
  uuid,
  sortByName
};