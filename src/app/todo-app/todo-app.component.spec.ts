import { async, ComponentFixture, TestBed } from '@angular/core/testing';
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
});
