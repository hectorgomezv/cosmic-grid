export abstract class AstralItem {
  abstract name: string;
}

export class Space extends AstralItem {
  name = 'space';
}

export class Polyanet extends AstralItem {
  name = 'polyanet';
}

export class Soloon extends AstralItem {
  name = 'soloon';
  color: string;

  constructor(color: string) {
    super();
    this.color = color;
  }
}

export class Cometh extends AstralItem {
  name = 'cometh';
  direction: string;

  constructor(direction: string) {
    super();
    this.direction = direction;
  }
}
