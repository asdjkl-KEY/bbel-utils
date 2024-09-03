class EventBus {
    constructor() {
        this.listeners = {};
        this.oncelisteners = {};
    }

    /**
     * @param {string} event - El evento al que se quiere suscribir
     * @param {Function} callback - La función que se ejecutará cuando se emita el evento
     */
    on(event, callback) {
        if (typeof event !== 'string') throw new Error('El evento debe ser un string');
        if (typeof callback !== 'function') throw new Error('El callback debe ser una función');

        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push();
    }
    
    /**
     * @param {string} event - El evento que se quiere desactivar
     */
    off(event) {
        if (typeof event !== 'string') throw new Error('El evento debe ser un string');
        delete this.listeners[event];
    }

    /**
     * @param {string} event - El evento que se quiere emitir
     * @param {any} data - Los datos que se quieren enviar a los suscriptores
     */
    emit(event, data) {
        if (typeof event !== 'string') throw new Error('El evento debe ser un string');
        if (!this.listeners[event]) return;
        this.listeners[event].forEach(callback => callback(data));
    }

    /**
     * @param {string} event - El evento al que se quiere suscribir una única vez
     * @param {Function} callback - La función que se ejecutará cuando se emita el evento
     */
    once(event, callback) {
        if (typeof event !== 'string') throw new Error('El evento debe ser un string');
        if (typeof callback !== 'function') throw new Error('El callback debe ser una función');

        if (!this.oncelisteners[event]) this.oncelisteners[event] = [];
        this.oncelisteners[event].push(callback);
    }

    /**
     * @param {string} event - El evento que se quiere emitir una única vez
     * @param {any} data - Los datos que se quieren enviar a los suscriptores
     */
    emitOnce(event, data) {
        if (typeof event !== 'string') throw new Error('El evento debe ser un string');
        if (!this.oncelisteners[event]) return;
        this.oncelisteners[event].forEach(callback => callback(data));
        delete this.oncelisteners[event];
    }

    /**
     * @param {string} event - El evento que se quiere desactivar
     */
    offOnce(event) {
        if (typeof event !== 'string') throw new Error('El evento debe ser un string');
        delete this.oncelisteners[event];
    }
}

module.exports = EventBus;