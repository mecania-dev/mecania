primitives = (bool, str, int, float, type(None))


def is_primitive(obj):
    return isinstance(obj, primitives)


def is_primitive_class(cls):
    return cls in primitives
