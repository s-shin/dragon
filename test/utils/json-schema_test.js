import assert from 'power-assert';
import {
  makeModelsAndEnumsFromJsonSchema,
} from '../../app/utils/json-schema';

describe('json-schema utility', () => {
  let models;
  beforeEach(() => {
    models = makeModelsAndEnumsFromJsonSchema({
      $schema: 'http://json-schema.org/draft-04/schema#',
      id: 'test',
      definitions: {
        person: {
          type: 'object',
          properties: {
            name: { $ref: '#/definitions/name' },
            age: { type: 'integer', minimum: 0 },
            // this 'default' is required for ajv limitation.
            gender: { $ref: '#/definitions/gender', default: 'not specified' },
          },
          required: ['name', 'gender'],
          additionalProperties: false,
        },
        name: {
          type: 'object',
          properties: {
            first: { type: 'string' },
            last: { type: 'string' },
            middle: { type: 'string' },
            aliases: {
              type: 'array',
              items: { type: 'string' },
            },
          },
          required: ['first'],
        },
        gender: {
          type: 'string',
          enum: ['male', 'female', 'not specified'],
          default: 'not specified',
        },
      },
    });
  });

  it('should create models', () => {
    assert(models);
  });

  it('basic', () => {
    const p = new models.Person({
      name: { first: 'alice' },
    });
    assert(p.validate() === null);
    assert(p.data.name.first === 'alice');
    assert((new models.Name(p.data.name)).equals(new models.Name({ first: 'alice' })));
    assert(!p.data.age);
    assert(p.data.gender === models.GENDER.NOT_SPECIFIED);
  });
});
