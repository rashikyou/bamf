export default class Sync {
  storage: Storage;
  constructor () {
    this.storage = window.localStorage;
  }

  get (item: string) {
    const storageItem: any = this.storage.getItem(item);

    if (this._isJSON(storageItem)) {
      return JSON.parse(storageItem);
    } else {
      return storageItem;
    }
  }

  set (itemName: string, item: string) {
    const storageItem = this._isJSON(item) ? JSON.stringify([item]) : item;
    this.storage.setItem(itemName, storageItem);
  }

  update (itemName: string, data: any) {
    const oldItem = this.get(itemName);
    const storageItem = this._isJSON(oldItem) ? [...oldItem, data] : data;
    this.set(itemName, storageItem);
  }

  _isJSON (str: string): boolean|void {
    try {
      const json = JSON.parse(str);
      if (Object.prototype.toString.call(json).slice(8, -1) !== "Object") {
        return false;
      }
    } catch (e) {
      return false;
    }
  }
}
