export class WatchedList {
  constructor(initialItems = [], compareItems) {
    this.currentItems = initialItems;
    this.initial = initialItems;
    this.new = [];
    this.removed = [];
    this.updated = [];
    this.compareItems = compareItems;
  }

  getItems() {
    return this.currentItems;
  }

  getNewItems() {
    return this.new;
  }

  getRemovedItems() {
    return this.removed;
  }

  getUpdatedItems() {
    return this.updated;
  }

  isCurrentItem(item) {
    return this.currentItems.filter(v => this.compareItems(item, v)).length !== 0;
  }

  isNewItem(item) {
    return this.new.filter(v => this.compareItems(item, v)).length !== 0;
  }

  isRemovedItem(item) {
    return this.removed.filter(v => this.compareItems(item, v)).length !== 0;
  }

  isUpdatedItem(item) {
    return this.updated.filter(v => this.compareItems(item, v)).length !== 0;
  }

  removeFromNew(item) {
    this.new = this.new.filter(v => !this.compareItems(v, item));
  }

  removeFromCurrent(item) {
    this.currentItems = this.currentItems.filter(v => !this.compareItems(v, item));
  }

  removeFromRemoved(item) {
    this.removed = this.removed.filter(v => !this.compareItems(v, item));
  }

  removeFromUpdated(item) {
    this.updated = this.updated.filter(v => !this.compareItems(item, v))
  }

  wasAddedInitially(item) {
    return this.initial.filter(v => this.compareItems(item, v)).length !== 0;
  }

  exists(item) {
    return this.isCurrentItem(item);
  }

  add(item) {
    if (this.isRemovedItem(item)) {
      this.removeFromRemoved(item);
    }

    if (!this.isNewItem(item) && !this.wasAddedInitially(item)) {
      this.new.push(item);
    }

    if (!this.isCurrentItem(item)) {
      this.currentItems.push(item);
    }
  }

  remove(item) {
    this.removeFromCurrent(item);

    if (this.isNewItem(item)) {
      this.removeFromNew(item);
    }

    if (!this.isRemovedItem(item)) {
      this.removed.push(item);
    }
  }

  update(item, updatedItem) {
    const itemIndex = this.currentItems.findIndex(v => this.compareItems(v, item))
    // console.log(itemIndex)

    if(itemIndex === -1) return


    this.currentItems[itemIndex] = updatedItem

    if(!this.isUpdatedItem(item)) {
      this.updated.push(updatedItem)
    }

    if(this.isNewItem(item)) {
      const newIndex = this.new.findIndex(v => this.compareItems(v, item))
      this.new[newIndex] = updatedItem
    }
  }
}
