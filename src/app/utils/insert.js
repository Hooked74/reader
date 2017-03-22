export function insertStyles(sStyles) {
    const style = document.createElement('style');
    style.type = "text/css";
    style.innerHTML = sStyles;
    document.head.appendChild(style);

    return style;
};