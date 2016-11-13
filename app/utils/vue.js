export function validatorForJsonSchemaModel(model) {
  const errors = model.validate();
  const ok = !errors;
  if (!ok) {
    const e = new Error();
    console.warn(errors, e.stack); // eslint-disable-line no-console
  }
  return ok;
}

export default { validatorForJsonSchemaModel };
