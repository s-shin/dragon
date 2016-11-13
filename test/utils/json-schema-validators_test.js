import assert from 'power-assert';
import ValidatorByAjv from '../../app/utils/json-schema-validators/ajv';
import ValidatorByJsen from '../../app/utils/json-schema-validators/jsen';

const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  id: 'test',
  $refs: '#/definitions/user',
  definitions: {
    user: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        location: { $ref: '#/definitions/location', default: '(none)' },
      },
      required: ['name', 'location'],
    },
    location: { type: 'string', default: '(none)' },
  },
};

function assertValidation(validator) {
  [
    {
      g: { name: 'foo', location: 'bar' },
      e: { name: 'foo', location: 'bar' },
    },
    {
      g: { name: 'foo' },
      e: { name: 'foo', location: '(none)' },
    },
    {
      g: { name: 'foo', location: undefined },
      e: { name: 'foo', location: '(none)' },
    },
  ].forEach((c) => {
    const user = validator.assignDefaults(c.g);
    // assert.deepStrictEqual(user, c.e);
    assert(validator.validate(user) === null);
  });
}

describe('JSON schema validator', () => {
  describe('by ajv', () => {
    let validator;
    beforeEach(() => {
      validator = new ValidatorByAjv(schema);
    });
    it('should create a validator.', () => {
      assert(validator);
    });
    it('#vaidate', () => {
      assertValidation(validator);
    });
  });

  describe('by jsen', () => {
    let validator;
    beforeEach(() => {
      validator = new ValidatorByJsen(schema);
    });
    it('should create a validator.', () => {
      assert(validator);
    });
    it('#vaidate', () => {
      assertValidation(validator);
    });
  });
});
