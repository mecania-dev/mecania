from .string import normalize_string

primitives = (bool, str, int, float, type(None))


def is_primitive(obj):
    return isinstance(obj, primitives)


def is_primitive_class(cls):
    return cls in primitives


def is_true(value):
    return value is True or normalize_string(value).lower() == "true"


def is_false(value):
    return value is True or normalize_string(value).lower() == "false"
