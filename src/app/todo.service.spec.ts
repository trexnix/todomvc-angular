import { TestBed, inject } from '@angular/core/testing';

import { TodoService } from './todo.service';

describe('TodoService', () => {
  let service: TodoService;

  beforeEach(() => {
    localStorage.clear();
    service = new TodoService;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have no todos by default', () => {
    expect(service.getAll()).toEqual([]);
  });

  it('should create new todo', () => {
    service.create('new todo');
    expect(service.getAll().length).toEqual(1);
    expect(service.getAll()[0].title).toEqual('new todo');
  });

  it('should list latest todos first', () => {
    jasmine.clock().install();
    let baseTime = new Date();
    jasmine.clock().mockDate(baseTime);
    service.create('first todo');
    jasmine.clock().tick(10);
    service.create('second todo');
    expect(service.getAll().length).toEqual(2);
    expect(service.getAll()[0].title).toEqual('second todo');
    jasmine.clock().uninstall();
  });

  it('#getActive should list active todos only', () => {
    service.create('first todo');
    service.create('second todo');
    service.toggleDone(service.getAll()[0]);
    expect(service.getActive().length).toEqual(1);
    expect(service.getActive()[0].done).toBeFalsy();
  });

  it('#getCompleted should list completed todos only', () => {
    service.create('first todo');
    service.create('second todo');
    service.toggleDone(service.getAll()[0]);
    expect(service.getCompleted().length).toEqual(1);
    expect(service.getCompleted()[0].done).toBeTruthy();
  });

  it('should update a todo', () => {
    service.create('new todo');
    const todo = service.getAll()[0];
    expect(todo.done).toBeFalsy();
    service.toggleDone(todo);
    expect(todo.done).toBeTruthy();

    service.updateTitle(todo, 'todo with new title');
    expect(todo.title).toEqual('todo with new title');
  });

  it('should remove a todo', () => {
    service.create('new todo');
    const todo = service.getAll()[0];
    service.destroy(todo);
    expect(service.getAll().length).toEqual(0);
  });
});
