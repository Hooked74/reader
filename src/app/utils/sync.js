import 'isomorphic-fetch';

export function sync(request, err) {
    return fetch(request).then((response) => {
        if (response.status >= 200 && response.status < 300) {
            return Promise.resolve(response);
        } else {
            const errorText = err || response.statusText || `${response.status}`;
            return Promise.reject(new Error(errorText));
        }
    });
} 