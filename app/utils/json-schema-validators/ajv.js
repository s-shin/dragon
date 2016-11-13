import _ from 'lodash';
import Ajv from 'ajv';
import Interface from './interface';

export default class Validator extends Interface {
  build(schema) {
    this.ajv = new Ajv({ useDefaults: true });
    this.v = this.ajv.compile(schema);
  }
  assignDefaults(data) {
    data = _.cloneDeep(data); // eslint-disable-line no-param-reassign
    this.v(data);
    return data;
  }
  validate(data) {
    return this.v(data) ? null : this.v.errors;
  }
}
