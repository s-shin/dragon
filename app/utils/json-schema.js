import _ from 'lodash';
import Validator from './json-schema-validators/ajv';

export function makeModelsFromJsonSchema(schema) {
  return Object
    .keys(schema.definitions)
    .reduce((prev, v) => {
      const validator = new Validator({
        $ref: `${schema.id}#/definitions/${v}`,
        ...schema,
      });
      return {
        ...prev,
        [_.upperFirst(_.camelCase(v))]: class {
          constructor(dataOrInstance = {}, opts_) { // eslint-disable-line consistent-return, max-len
            const opts = Object.assign({
              skipAssignDefault: false,
              copy: false,
            }, opts_);
            if (dataOrInstance instanceof this.constructor) {
              return opts.copy ? dataOrInstance.clone({ ...opts, copy: false }) : dataOrInstance;
            }
            this.data = opts.copy ? _.cloneDeep(dataOrInstance) : dataOrInstance;
            if (!opts.skipAssignDefault) {
              this.assignDefaults();
            }
          }
          assignDefaults() {
            this.data = validator.assignDefaults(this.data);
            return this;
          }
          validate() {
            return validator.validate(this.data);
          }
          clone(opts) {
            return new this.constructor(_.cloneDeep(this.data), opts);
          }
          equals(other) {
            return _.isEqual(this.data, other.data);
          }
        },
      };
    }, {});
}

export function makeEnumsFromJsonSchema(schema) {
  const enums = {};
  for (const name of Object.keys(schema.definitions)) {
    const d = schema.definitions[name];
    if (!d.enum || d.type !== 'string') {
      continue;
    }
    const enumName = _.snakeCase(name).toUpperCase();
    enums[enumName] = d.enum.reduce((prev, v) => ({
      ...prev,
      [_.snakeCase(v).toUpperCase()]: v,
    }), {});
  }
  return enums;
}

export function makeModelsAndEnumsFromJsonSchema(schema) {
  return {
    ...makeModelsFromJsonSchema(schema),
    ...makeEnumsFromJsonSchema(schema),
  };
}

export default {
  makeModelsFromJsonSchema,
  makeEnumsFromJsonSchema,
  makeModelsAndEnumsFromJsonSchema,
};
