// @source Text/StringBuilder.js

Bridge.define("Bridge.Text.StringBuilder", {
    constructor: function () {
        this.buffer = [],
        this.capacity = 16;

        if (arguments.length === 1) {
            this.append(arguments[0]);
        } else if (arguments.length === 2) {
            this.append(arguments[0]);
            this.setCapacity(arguments[1]);
        } else if (arguments.length === 3) {
            this.append(arguments[0], arguments[1], arguments[2]);
        }
    },

    getLength: function () {
        if (this.buffer.length < 2) {
            return this.buffer[0] ? this.buffer[0].length : 0;
        }

        var s = this.buffer.join("");

        this.buffer = [];
        this.buffer[0] = s;

        return s.length;
    },

    getCapacity: function () {
        var length = this.getLength();

        return (this.capacity > length) ? this.capacity : length;
    },

    setCapacity: function (value) {
        var length = this.getLength();

        if (value > length) {
            this.capacity = value;
        }
    },

    toString: function () {
        var s = this.buffer.join("");

        this.buffer = [];
        this.buffer[0] = s;

        if (arguments.length === 2) {
            var startIndex = arguments[0],
                length = arguments[1];

            this.checkLimits(s, startIndex, length);

            return s.substr(startIndex, length);
        }

        return s;
    },

    append: function (value) {
        if (value == null) {
            return this;
        }

        if (arguments.length === 2) {
            // append a char repeated count times
            var count = arguments[1];

            if (count === 0) {
                return this;
            } else if (count < 0) {
                throw new Bridge.ArgumentOutOfRangeException("count", "cannot be less than zero");
            }

            value = Array(count + 1).join(value).toString();
        } else if (arguments.length === 3) {
            // append a (startIndex, count) substring of value
            var startIndex = arguments[1],
                count = arguments[2];

            if (count === 0) {
                return this;
            }

            this.checkLimits(value, startIndex, count);
            value = value.substr(startIndex, count);
        }

        this.buffer[this.buffer.length] = value;

        return this;
    },

    appendFormat: function (format) {
        return this.append(Bridge.String.format.apply(Bridge.String, arguments));
    },

    clear: function () {
        this.buffer = [];

        return this;
    },

    appendLine: function () {
        if (arguments.length === 1) {
            this.append(arguments[0]);
        }

        return this.append("\r\n");
    },

    equals: function (sb) {
        if (sb == null) {
            return false;
        }

        if (sb === this) {
            return true;
        }

        return this.toString() === sb.toString();
    },

    remove: function (startIndex, length) {
        var s = this.buffer.join("");

        this.checkLimits(s, startIndex, length);

        if (s.length === length && startIndex === 0) {
            // Optimization.  If we are deleting everything
            return this.clear();
        }

        if (length > 0) {
            this.buffer = [];
            this.buffer[0] = s.substring(0, startIndex);
            this.buffer[1] = s.substring(startIndex + length, s.length);
        }

        return this;
    },

    insert: function (index, value) {
        if (value == null) {
            return this;
        }

        if (arguments.length === 3) {
            // insert value repeated count times
            var count = arguments[2];

            if (count === 0) {
                return this;
            } else if (count < 0) {
                throw new Bridge.ArgumentOutOfRangeException("count", "cannot be less than zero");
            }

            value = Array(count + 1).join(value).toString();
        }

        var s = this.buffer.join("");
        this.buffer = [];

        if (index < 1) {
            this.buffer[0] = value;
            this.buffer[1] = s;
        } else if (index >= s.length) {
            this.buffer[0] = s;
            this.buffer[1] = value;
        } else {
            this.buffer[0] = s.substring(0, index);
            this.buffer[1] = value;
            this.buffer[2] = s.substring(index, s.length);
        }

        return this;
    },

    replace: function (oldValue, newValue) {
        var r = new RegExp(oldValue, "g"),
            s = this.buffer.join("");

        this.buffer = [];

        if (arguments.length === 4) {
            var startIndex = arguments[2],
                count = arguments[3],
                b = s.substr(startIndex, count);

            this.checkLimits(s, startIndex, count);

            this.buffer[0] = s.substring(0, startIndex);
            this.buffer[1] = b.replace(r, newValue);
            this.buffer[2] = s.substring(startIndex + count, s.length);
        } else {
            this.buffer[0] = s.replace(r, newValue);
        }

        return this;
    },

    checkLimits: function (value, startIndex, length) {
        if (length < 0) {
            throw new Bridge.ArgumentOutOfRangeException("length", "must be non-negative");
        }

        if (startIndex < 0) {
            throw new Bridge.ArgumentOutOfRangeException("startIndex", "startIndex cannot be less than zero");
        }

        if (length > value.length - startIndex) {
            throw new Bridge.ArgumentOutOfRangeException("Index and length must refer to a location within the string");
        }
    }
});
