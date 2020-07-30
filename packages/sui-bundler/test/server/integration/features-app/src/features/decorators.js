const decoratorKlass = Target => Target
const decoratorMethod = (Target, name, definition) => definition

@decoratorKlass
export class Klass {
  @decoratorMethod method() {}
}
