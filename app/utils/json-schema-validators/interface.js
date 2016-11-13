/* eslint-disable class-methods-use-this, no-unused-vars, no-unreachable */
export default class JsonSchemaValidator {
  constructor(...args) {
    this.build(...args);
  }
  build(schema) {
    throw new Error('not implemented');
  }
  assignDefaults(data) {
    throw new Error('not implemented');
    return data;
  }
  validate(data) {
    throw new Error('not implemented');
    return null;
  }
}
