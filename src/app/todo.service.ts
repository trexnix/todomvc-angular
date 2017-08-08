import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { Todo } from './todo';

@Injectable()
export class TodoService {
  LOCALSTORAGE_KEY = 'todomvc_todos';
  private todos: Array<Todo>;
  source = new Subject<void>();

  constructor() {
    this.todos = this.loadData();
    this.source.subscribe(() => this.saveData());
  }

  private loadData() {
    return JSON.parse(localStorage.getItem(this.LOCALSTORAGE_KEY) || '[]');
  }

  private saveData() {
    localStorage.setItem(this.LOCALSTORAGE_KEY, JSON.stringify(this.todos));
  }

  getAll(): Array<Todo> {
    return this.todos.sort((a, b) => b.createdAt - a.createdAt);
  }

  getActive(): Array<Todo> {
    return this.getAll().filter(todo => !todo.done);
  }

  getCompleted(): Array<Todo> {
    return this.getAll().filter(todo => todo.done);
  }

  create(title: string) {
    this.todos.push(new Todo(title));
    this.source.next();
  }

  toggleDone(todo: Todo) {
    todo.done = !todo.done;
    this.source.next();
  }

  updateTitle(todo: Todo, text: string) {
    todo.title = text;
    this.source.next();
  }

  destroy(todo: Todo) {
    const index = this.todos.indexOf(todo);
    if (index > -1) this.todos.splice(index, 1);
    this.source.next();
  }

  clearCompleted() {
    this.todos = this.todos.filter(todo => !todo.done);
    this.source.next();
  }
}
