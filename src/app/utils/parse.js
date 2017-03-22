export function getURLParameter(name, url) {
    url || (url = window.location.href);
    name = name.replace(/[\[\]]/g, "\\$&");

    const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
    const results = regex.exec(url);

    return !results ? null : !results[2] ? '' : decodeURIComponent(results[2].replace(/\+/g, " "));
}

export function getBodyContent(htmlString) {
    return htmlString.replace(/\n+/g, '').replace(/.*<body[^>]*>(.*)<\/body>.*/gi, '$1');
}