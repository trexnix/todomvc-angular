export class Todo {
  title: string;
  done: boolean;
  createdAt: number;

  constructor(title: string) {
    this.title = title;
    this.done = false;
    this.createdAt = +(new Date);
  }
}
