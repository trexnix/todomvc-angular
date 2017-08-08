import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';

import { RouterStub, ActivatedRouteStub } from '../router-stubs';
import { TodoAppComponent } from './todo-app.component';
import { TodoService } from '../todo.service';

describe('TodoAppComponent', () => {
  let component: TodoAppComponent;
  let fixture: ComponentFixture<TodoAppComponent>;
  let compiled: HTMLElement;
  let activatedRoute: ActivatedRouteStub;

  beforeEach(async(() => {
    class TodoServiceStub extends TodoService {
      constructor() {
        spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify([
          {title: 'first todo', done: true, createdAt: 1},
          {title: 'second todo', done: false, createdAt: 2},
          {title: 'third todo', done: true, createdAt: 3}
        ]));
        spyOn(localStorage, 'setItem');
        super();
      }
    }

    activatedRoute = new ActivatedRouteStub;

    TestBed.configureTestingModule({
      declarations: [ TodoAppComponent ],
      providers: [
        {provide: Router, useClass: RouterStub},
        {provide: ActivatedRoute, useValue: activatedRoute},
        {provide: TodoService, useClass: TodoServiceStub},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoAppComponent);
    component = fixture.componentInstance;
    compiled = fixture.debugElement.nativeElement;
  });

  it('/todos should list all todos', () => {
    activatedRoute.testParamMap = {};
    fixture.detectChanges();
    expect(component.todos.length).toEqual(3);
    expect(compiled.textContent).toContain('first todo');
    expect(compiled.textContent).toContain('second todo');
    expect(compiled.textContent).toContain('third todo');
  });

  it('/todos/active should list active todos only', () => {
    activatedRoute.testParamMap = {type: 'active'};
    fixture.detectChanges();
    expect(component.todos.length).toEqual(1);
    expect(compiled.textContent).not.toContain('first todo');
    expect(compiled.textContent).toContain('second todo');
    expect(compiled.textContent).not.toContain('third todo');
  });

  it('/todos/completed should list completed todos only', () => {
    activatedRoute.testParamMap = {type: 'completed'};
    fixture.detectChanges();
    expect(component.todos.length).toEqual(2);
    expect(compiled.textContent).toContain('first todo');
    expect(compiled.textContent).not.toContain('second todo');
    expect(compiled.textContent).toContain('third todo');
  });

  it('should show active items count', () => {
    activatedRoute.testParamMap = {};
    fixture.detectChanges();
    expect(compiled.textContent).toContain('1 items left');
  });

  it('should create new todo', async(() => {
    activatedRoute.testParamMap = {};
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('.new-todo')).nativeElement;

    // Fill out the input field
    input.value = 'new todo'
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    // Press enter key
    input.dispatchEvent(new KeyboardEvent('keyup', {'key': 'Enter'}));
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(input.value).toEqual('');
      expect(compiled.textContent).toContain('new todo');
    });
  }));

  it('click x button should destroy a todo', () => {
    activatedRoute.testParamMap = {};
    fixture.detectChanges();
    const clearBtn = fixture.debugElement.queryAll(By.css('.destroy'))[1].nativeElement;
    clearBtn.dispatchEvent(new Event('click'));
    fixture.detectChanges();
    expect(compiled.textContent).not.toContain('second todo');
    expect(compiled.textContent).toContain('first todo');
    expect(compiled.textContent).toContain('third todo');
  });

  it('click Clear button should clear all completed todos', () => {
    activatedRoute.testParamMap = {};
    fixture.detectChanges();
    const clearBtn = fixture.debugElement.query(By.css('.clear-completed')).nativeElement;
    clearBtn.dispatchEvent(new Event('click'));
    fixture.detectChanges();
    expect(compiled.textContent).toContain('second todo');
    expect(compiled.textContent).not.toContain('first todo');
    expect(compiled.textContent).not.toContain('third todo');
  });

  it('tick checkbox should mark/unmark a todo as done', () => {
    activatedRoute.testParamMap = {};
    fixture.detectChanges();
    const secondCheckbox = fixture.debugElement.queryAll(By.css('.toggle'))[1].nativeElement;
    // dispatch a click event doesn't work here???
    // secondCheckbox.dispatchEvent(new Event('click'));
    secondCheckbox.click();
    fixture.detectChanges();
    expect(component.todos[1].done).toBeTruthy();
    // and here also???
    // secondCheckbox.dispatchEvent(new Event('click'));
    fixture.detectChanges();
    secondCheckbox.click();
    expect(component.todos[1].done).toBeFalsy();
  })

  it('click the down arrow button to toggle all todos', () => {
    activatedRoute.testParamMap = {};
    fixture.detectChanges();
    const toggleAllBtn = fixture.debugElement.query(By.css('.toggle-all')).nativeElement;
    toggleAllBtn.click();
    component.todos.forEach((todo) => {
      expect(todo.done).toBeTruthy();
    });

    toggleAllBtn.click();
    component.todos.forEach((todo) => {
      expect(todo.done).toBeFalsy();
    });
  })

  it('blur input while editing should update todo title', () => {
    activatedRoute.testParamMap = {};
    fixture.detectChanges();
    const secondTodo = fixture.debugElement.queryAll(By.css('.todo-list li'))[1];
    const secondTodoInput = secondTodo.query(By.css('.edit')).nativeElement;
    secondTodoInput.value = 'update second todo';
    secondTodoInput.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    expect(compiled.textContent).toContain('update second todo');
    expect(component.todos[1].title).toEqual('update second todo');
  })

  it('pressing Esc key while editing should cancel the editing action', () => {
    activatedRoute.testParamMap = {};
    fixture.detectChanges();
    const secondTodo = fixture.debugElement.queryAll(By.css('.todo-list li'))[1];
    const secondTodoInput = secondTodo.query(By.css('.edit')).nativeElement;
    secondTodoInput.value = 'updated title';
    secondTodoInput.dispatchEvent(new KeyboardEvent('keyup', {'key': 'Escape'}));
    fixture.detectChanges();
    expect(component.todos[1].title).toEqual('second todo');
    expect(secondTodoInput.value).toEqual('second todo');
    expect(compiled.textContent).toContain('second todo');
    expect(compiled.textContent).not.toContain('updated todo');
  })
});
