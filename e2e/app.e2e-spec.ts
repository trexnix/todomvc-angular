import { TodomvcAngularPage } from './app.po';

describe('todomvc-angular App', () => {
  let page: TodomvcAngularPage;

  beforeEach(() => {
    page = new TodomvcAngularPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
