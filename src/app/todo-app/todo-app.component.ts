import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';

import { Todo } from '../todo';
import { TodoService } from '../todo.service';

@Component({
  selector: 'app-todo-app',
  templateUrl: './todo-app.component.html',
  styleUrls: ['./todo-app.component.css'],
  host: {'class': 'todoapp'}
})
export class TodoAppComponent implements OnInit {
  todos: Array<Todo> = [];
  filterParam: string = '';

  paramSub: any;
  todoSub: any;

  constructor(private todoService: TodoService,
              private router: Router,
              private route: ActivatedRoute) {}

  ngOnInit() {
    this.paramSub = this.route.paramMap
      .switchMap((params: ParamMap) => {
        this.todos = [];
        this.filterParam = params.get('type') || 'all';
        return this.getFilteredList(this.filterParam);
      })
      .subscribe((todo: Todo) => this.todos.push(todo));

    this.todoSub = this.todoService.source
      .subscribe(() => this.todos = this.getFilteredList(this.filterParam));
  }

  ngOnDestroy() {
    this.paramSub.unsubscribe();
  }

  getFilteredList(filter = 'all'): Array<Todo> {
    const filterToMethodNames = {
      all: 'getAll',
      active: 'getActive',
      completed: 'getCompleted'
    }
    const methodName = filterToMethodNames[filter] || filterToMethodNames['all'];
    return this.todoService[methodName]();
  }

  getActiveItems(): Array<Todo> {
    return this.todos.filter(item => !item.done);
  }

  createTodo(fieldInput: any) {
    if (!fieldInput.value)
      return;
    this.todoService.create(fieldInput.value);
    fieldInput.value = '';
  }

  destroyTodo(todo: Todo): void {
    this.todoService.destroy(todo);
  }

  toggleTodo(todo: Todo): void {
    this.todoService.toggleDone(todo);
  }

  clearCompleted(): void {
    this.todoService.clearCompleted();
  }
}
