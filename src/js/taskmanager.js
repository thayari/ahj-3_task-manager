import Task from './task';

export default class TaskManager {
  constructor() {
    this.tasks = [];
    this.input = document.querySelector('.input');
    this.allTasks = document.querySelector('.unpinned-container');
    this.pinnedTasks = document.querySelector('.pinned-container');
    this.index = 0;
    this.remove = document.querySelector('.remove');
  }

  addNewTask(input) {
    const task = new Task(input, this.index);
    this.tasks.push(task);
    this.index += 1;
    this.generateList(this.tasks);
  }

  filterByInput() {
    const request = this.input.value.toLowerCase();
    // eslint-disable-next-line max-len
    const filteredList = this.tasks.filter((item) => item.text.toLowerCase().indexOf(request) !== -1 || item.pinned === true);
    this.generateList(filteredList);
  }

  addEvents() {
    this.filterByInput = this.filterByInput.bind(this);
    this.input.addEventListener('input', this.filterByInput);
    this.input.addEventListener('keyup', (event) => {
      if (event.keyCode === 13) {
        this.addNewTask(this.input.value);
        this.input.value = '';
        this.save();
      }
    });
    document.querySelector('.wrapper').addEventListener('click', (event) => {
      if (event.target.classList.contains('pin-button')) {
        const task = this.tasks.filter((item) => item.id === Number(event.target.parentNode.id))[0];
        task.pinned = !task.pinned;
        if (this.input.value) {
          this.filterByInput();
        } else {
          this.generateList(this.tasks);
        }
        this.save();
      }
    });
    this.remove.addEventListener('click', () => {
      this.tasks = [];
      this.save();
      this.generateList(this.tasks);
    });
  }

  generateList(list) {
    this.allTasks.innerHTML = '';
    if (list.filter((item) => item.pinned).length === 0) {
      this.pinnedTasks.innerHTML = '<p class="emptyList">No pinned tasks</p>';
    } else {
      this.pinnedTasks.innerHTML = '';
    }
    list.forEach((task) => {
      if (task.pinned === true) {
        this.pinnedTasks.insertAdjacentHTML('afterbegin', `<div class="task task-pinned" id="${task.id}">
        <p>${task.text}</p>
        <div class="pin-button pin-active"></div>
      </div>`);
      } else if (task.pinned === false) {
        this.allTasks.insertAdjacentHTML('beforeend', `<div class="task task-unpinned" id="${task.id}">
        <p>${task.text}</p>
        <div class="pin-button"></div>
      </div>`);
      }
    });
  }

  save() {
    localStorage.list = JSON.stringify(this.tasks);
    localStorage.index = JSON.stringify(this.index);
  }

  start() {
    this.addEvents();
    if (localStorage.index) {
      this.index = JSON.parse(localStorage.index);
    }
    if (localStorage.list) {
      this.tasks = JSON.parse(localStorage.list);
      this.generateList(this.tasks);
    }
  }
}
