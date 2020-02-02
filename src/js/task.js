export default class Task {
  constructor(text, index) {
    this.text = text;
    this.id = index;
    this.pinned = false;
  }
}
