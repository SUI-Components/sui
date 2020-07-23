const decoratorKlass = Target => Target
const decoratorMethod = (Target, name, definition) => definition

@decoratorKlass
class Klass {
  @decoratorMethod method() {}
}

export {Klass}
