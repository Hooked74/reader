module.exports = function(host, port) {
    return {
        dev: {
            api: 'http://localhost:9000',
            bitrixApi: 'https://bitrix-api.bookscriptor.ru',
            portal: 'http://' + host + ':' + port
        },
        test: {
            api: 'https://test-new-editor.bookscriptor.ru',
            bitrixApi: 'https://test-bitrix-api.bookscriptor.ru',
            portal: 'https://test.bookscriptor.ru'
        },
        rc: {
            api: 'https://rc-new-editor.bookscriptor.ru',
            bitrixApi: 'https://rc-api.bookscriptor.ru',
            portal: 'https://rc.bookscriptor.ru'
        },
        prod: {
            api: 'https://new-editor.bookscriptor.ru',
            bitrixApi: 'https://bitrix-api.bookscriptor.ru',
            portal: 'https://bookscriptor.ru'
        }
    };
};