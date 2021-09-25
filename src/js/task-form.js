import Storage from './storage';
import Task from './task';

const priorityText = {
  0.1: "Trivial",
  1: "Easy",
  1.5: "Medium",
  2: "Hard"
};

export default class TaskForm {
  constructor(trello, storage = new Storage(trello)) {
    this.t = trello;
    this.storage = storage;
  }

  initialize() {
    this.storage.getTask().then(task => {
      this.initializeElements();

      this.setPriority(task.priority);

      this.listenToSubmit();
    });
  }

  initializeElements() {
    this.$priority = document.getElementById('priority');
    this.$submitButton = document.getElementById('submit-btn');
  }

  setPriority(val) {
    this.$priority.value = val;
  }

  listenToSubmit() {
    this.$submitButton.addEventListener('click', () => this.handleSubmit());
  }

  updatePriority(val) {
    return new Task(this.t).handleUpdate({ priority: val });
  }

  handleSubmit() {
    this.$submitButton.disabled = true;
    const priority = Number(this.$priority.value);

    this.storage
      .getTask()
      .then(task => task.priority !== priority && this.updatePriority(priority))
      .then(() => {
		  this.t.closePopup();
		  this.notify('Task was set to ', 'success');
	  });
  }
  
  notify(message, display = 'info') {
    this.t.alert({
      message,
      display,
      duration: 5 // min is 5
    });
  }
}
