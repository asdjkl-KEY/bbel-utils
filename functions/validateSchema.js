const ValidationError = require('../classes/ValidationError');

function validateString(schema, value,canThrow) {
    if (typeof value !== 'string') {
        if(canThrow) throw new ValidationError('El valor no es un string');
        return false;
    }
    if (schema.minLength && value.length < schema.minLength) {
        if(canThrow) throw new ValidationError('El valor es menor al mínimo permitido');
        return false;
    }
    if (schema.maxLength && value.length > schema.maxLength) {
        if(canThrow) throw new ValidationError('El valor es mayor al máximo permitido');
        return false;
    }
    if (schema.pattern && !schema.pattern.test(value)) {
        if(canThrow) throw new ValidationError('El valor no cumple con el patrón');
        return false;
    }
    if (schema.rules) {
        for (const rule of schema.rules) {
            if (!rule(value)) {
                if(canThrow) {
                    if (rule.name === undefined) throw new ValidationError('El nombre de una de las reglas no está definido');
                    throw new ValidationError(rule.message ?? `El valor no cumple con la regla ${rule.name}`);
                }
                return false;
            }
        }
    }
    return true;
}

function validateInteger(schema, value, canThrow) {
    if (typeof value !== 'number' && typeof value !== 'bigint') {
        if(canThrow) throw new ValidationError('El valor no es un número entero');
        return false;
    }
    if (!Number.isInteger(value)) {
        if(canThrow) throw new ValidationError('El valor no es un número entero');
        return false;
    }
    if (schema.minValue && value < schema.minValue) {
        if(canThrow) throw new ValidationError('El valor es menor al mínimo permitido');
        return false;
    }
    if (schema.maxValue && value > schema.maxValue) {
        if(canThrow) throw new ValidationError('El valor es mayor al máximo permitido');
        return false;
    }
    if (schema.rules) {
        for (const rule of schema.rules) {
            if (!rule(value)) {
                if(canThrow) {
                    if (rule.name === undefined) throw new ValidationError('El nombre de una de las reglas no está definido');
                    throw new ValidationError(rule.message ?? `El valor no cumple con la regla ${rule.name}`);
                }
                return false;
            }
        }
    }
    return true;
}

function validateNumber(schema, value, canThrow) {
    if (typeof value !== 'number') {
        if(canThrow) throw new ValidationError('El valor no es un número');
        return false;
    }
    if (schema.minValue && value < schema.minValue) {
        if(canThrow) throw new ValidationError('El valor es menor al mínimo permitido');
        return false;
    }
    if (schema.maxValue && value > schema.maxValue) {
        if(canThrow) throw new ValidationError('El valor es mayor al máximo permitido');
        return false;
    }
    if (schema.rules) {
        for (const rule of schema.rules) {
            if (!rule(value)) {
                if(canThrow) {
                    if (rule.name === undefined) throw new ValidationError('El nombre de una de las reglas no está definido');
                    throw new ValidationError(rule.message ?? `El valor no cumple con la regla ${rule.name}`);
                }
                return false;
            }
        }
    }
    return true;
}

function validateBoolean(_, value, canThrow) {
    if (typeof value !== 'boolean') {
        if(canThrow) throw new ValidationError('El valor no es un booleano');
        return false
    }
    return true;
}

function validateArray(schema, value, canThrow) {
    if (!Array.isArray(value)) {
        if(canThrow) throw new ValidationError('El valor no es un array');
        return false;
    }
    if (schema.minLength && value.length < schema.minLength) {
        if(canThrow) throw new ValidationError('El tamaño del array es menor al mínimo permitido');
        return false;
    }
    if (schema.maxLength && value.length > schema.maxLength) {
        if(canThrow) throw new ValidationError('El tamaño del array es mayor al máximo permitido');
        return false;
    }
    if (schema.typed) {
        for (const item of value) {
            if (typeof item !== schema.typed) {
                if(canThrow) throw new ValidationError('Uno de los elementos del array no es del tipo esperado');
                return false;
            }
        }
    }
    if (schema.rules) {
        for (const rule of schema.rules) {
            if (!rule(value)) {
                if(canThrow) {
                    if (rule.name === undefined) throw new ValidationError('El nombre de una de las reglas no está definido');
                    throw new ValidationError(rule.message ?? `El valor no cumple con la regla ${rule.name}`);
                }
                return false;
            }
        }
    }
    return true;
}

const types = ['string', 'integer', 'number', 'boolean', 'array', 'object'];
function validateSchemaProperty(schema, parentKey=''){
    if (typeof schema !== 'object') throw new ValidationError(`${parentKey}:\nEl esquema no es un objeto`);
    if (typeof parentKey !== 'string') throw new ValidationError(`${parentKey}:\nEl parentKey no es un string`);
    for (const key of Object.keys(schema)) {
        if (schema[key].type === undefined) throw new ValidationError(`${parentKey}:\nLa propiedad ${key} no tiene un tipo definido`);
        if (!types.includes(schema[key].type)) throw new ValidationError(`${parentKey}:\nEl tipo ${schema[key].type} no es válido`);
        if (schema[key].type === 'object') {
            if (schema[key].schema === undefined) throw new ValidationError(`${parentKey}:\nLa propiedad ${key} no tiene un esquema definido`);
            if (typeof schema[key].schema !== 'object')
                throw new ValidationError(`${parentKey}:\nEl esquema de la propiedad ${key} no es un objeto`);
            validateSchemaProperty(schema[key].schema, parentKey+"->"+key);
        }
        switch (schema[key].type) {
            case 'string':
                if (schema[key].minLength && typeof schema[key].minLength !== 'number')
                    throw new ValidationError(`${parentKey}:\nLa propiedad ${key} debe ser un número`);
                if (schema[key].maxLength && typeof schema[key].maxLength !== 'number')
                    throw new ValidationError(`${parentKey}:\nLa propiedad ${key} debe ser un número`);
                if (schema[key].pattern && !(schema[key].pattern instanceof RegExp))
                    throw new ValidationError(`${parentKey}:\nLa propiedad ${key} debe ser una expresión regular`);
                if (schema[key].rules && !Array.isArray(schema[key].rules))
                    throw new ValidationError(`${parentKey}:\nLa propiedad ${key} debe ser un array de funciones`);
                break;
            case 'integer':
                if (schema[key].minValue && typeof schema[key].minValue !== 'number')
                    throw new ValidationError(`${parentKey}:\nLa propiedad ${key} debe ser un número`);
                if (schema[key].maxValue && typeof schema[key].maxValue !== 'number')
                    throw new ValidationError(`${parentKey}:\nLa propiedad ${key} debe ser un número`);
                if (schema[key].rules && !Array.isArray(schema[key].rules))
                    throw new ValidationError(`${parentKey}:\nLa propiedad ${key} debe ser un array de funciones`);
                break;
            case 'number':
                if (schema[key].minValue && typeof schema[key].minValue !== 'number')
                    throw new ValidationError(`${parentKey}:\nLa propiedad ${key} debe ser un número`);
                if (schema[key].maxValue && typeof schema[key].maxValue !== 'number')
                    throw new ValidationError(`${parentKey}:\nLa propiedad ${key} debe ser un número`);
                if (schema[key].rules && !Array.isArray(schema[key].rules))
                    throw new ValidationError(`${parentKey}:\nLa propiedad ${key} debe ser un array de funciones`);
                break;
            case 'boolean':
                break;
            case 'array':
                if (schema[key].minLength && typeof schema[key].minLength !== 'number')
                    throw new ValidationError(`${parentKey}:\nLa propiedad ${key} debe ser un número`);
                if (schema[key].maxLength && typeof schema[key].maxLength !== 'number')
                    throw new ValidationError(`${parentKey}:\nLa propiedad ${key} debe ser un número`);
                if (schema[key].typed && !types.includes(schema[key].typed))
                    throw new ValidationError(`${parentKey}:\nEl tipo ${schema[key].typed} no es válido`);
                if (schema[key].rules && !Array.isArray(schema[key].rules))
                    throw new ValidationError(`${parentKey}:\nLa propiedad ${key} debe ser un array de funciones`);
                break;
            case 'object':
                break;
        }
    }
}

/**
 * Esta función se encarga de validar que el esquema del objeto informado cumpla con los
 * criterios de validación establecidos.
 * @param {Object} schema - Esquema de validación.
 * @param {Object} object - Objeto a validar.
 * @returns {Boolean} - Retorna true si es válido, false en caso contrario.
 * @throws {ValidationError} - Lanza un error si el esquema no cumple con los criterios de validación.
 */
function validateSchema(schema, object) {
    if(!schema) throw new ValidationError("El esquema no puede ser nulo/undefined");
    if(!object) throw new ValidationError("El objeto no puede ser nulo/undefined");

    validateSchemaProperty(schema); 

    const schemaKeys = Object.keys(schema);
    const objectKeys = Object.keys(object);

    for (const key of schemaKeys) {
        if (!objectKeys.includes(key)) return false;
        const schemaType = schema[key].type;
        if (schemaType === 'object') {
            if (!validateSchema(schema[key].schema, object[key]), canThrow) return false;
        }
        switch (schemaType) {
            case 'string':
                try {
                    if (!validateString(schema[key], object[key], canThrow)) return false;
                } catch (error) {
                    if (error instanceof ValidationError) {
                        if (canThrow) throw new ValidationError(`Error en la propiedad '${key}': ${error.message}`);
                    }
                }
                break;
            case 'integer':
                try {
                    if (!validateInteger(schema[key], object[key], canThrow)) return false;
                } catch (error) {
                    if (error instanceof ValidationError) {
                        if (canThrow) throw new ValidationError(`Error en la propiedad '${key}': ${error.message}`);
                    }
                }
                break;
            case 'number':
                try {
                    if (!validateNumber(schema[key], object[key], canThrow)) return false;
                } catch (error) {
                    if (error instanceof ValidationError) {
                        if (canThrow) throw new ValidationError(`Error en la propiedad '${key}': ${error.message}`);
                    }
                }
                break;
            case 'boolean':
                try {
                    if (!validateBoolean(schema[key], object[key], canThrow)) return false;
                } catch (error) {
                    if (error instanceof ValidationError) {
                        if (canThrow) throw new ValidationError(`Error en la propiedad '${key}': ${error.message}`);
                    }
                }
                break;
            case 'array':
                try {
                    if (!validateArray(schema[key], object[key], canThrow)) return false;
                } catch (error) {
                    if (error instanceof ValidationError) {
                        if (canThrow) throw new ValidationError(`Error en la propiedad '${key}': ${error.message}`);
                    }
                }
                break;
        }
    }
    return true;
}

module.exports = validateSchema;