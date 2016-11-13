import jsen from 'jsen';
import Interface from './interface';

export default class Validator extends Interface {
  build(schema) {
    this.v = jsen(schema);
  }
  assignDefaults(data) {
    return this.v.build(data);
  }
  validate(data) {
    return this.v(data) ? null : this.v.errors;
  }
}
