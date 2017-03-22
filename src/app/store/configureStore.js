if (NODE_ENV === NODE_ENV_DEV) {
    module.exports = require('./configureStore.dev');
} else {
    module.exports = require('./configureStore.prod');
}