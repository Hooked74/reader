if (NODE_ENV === NODE_ENV_DEV) {
    module.exports = require('./Main.dev');
} else {
    module.exports = require('./Main.prod');
}