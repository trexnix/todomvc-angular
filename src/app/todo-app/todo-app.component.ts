import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';

import { Todo } from '../todo';
import { TodoService } from '../todo.service';

@Component({
  selector: 'app-todo-app',
  templateUrl: './todo-app.component.html',
  styleUrls: ['./todo-app.component.css']
})
export class TodoAppComponent implements OnInit {
  todos: Array<Todo> = [];
  filterParam: string = '';

  paramSub: any;

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

}