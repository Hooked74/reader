export default class PageCalculator {
    __bookItem;
    __imageRatio;
    __fillableElement;

    __pages;

    __statusContinue = 'continue';

    static getElementSize(element) {
        if (element instanceof Element) {
            const style = getComputedStyle(element);
            return {
                width: parseFloat(style.width) || 0,
                height: parseFloat(style.height) || 0,
                paddingTop: parseFloat(style.paddingTop) || 0,
                paddingBottom: parseFloat(style.paddingBottom) || 0,
                paddingLeft: parseFloat(style.paddingLeft) || 0,
                paddingRight: parseFloat(style.paddingRight) || 0
            };
        } else {
            return {
                width: 0,
                height: 0,
                paddingTop: 0,
                paddingBottom: 0,
                paddingLeft: 0,
                paddingRight: 0
            };
        }
    }

    static getBodyContent(htmlString) {
        return htmlString.replace(/.*<body[^>]*>(.*)<\/body>.*/gim, '$1');
    }

    static idToDataAttribute(element) {
        if (element && element.id) {
            element.dataset.id = element.id;
            element.removeAttribute('id');
        }
    }

    static getEmptyCloneElement(element) {
        const clone = element.cloneNode(false);
        clone.innerHTML = '';
        return clone;
    }

    static setHtml(elements, parentElement) {
        parentElement.innerHTML = '';
        for (let i = 0; i < elements.length; i++) {
            parentElement.appendChild(elements[i]);    
        }
    }

    constructor(bookItem, imageRatio, fillableElement) {
        this.__bookItem = bookItem;
        this.__imageRatio = imageRatio;
        this.__fillableElement = fillableElement;
    }

    setBookItem(bookItem) {
        this.__bookItem = bookItem;
        return this; 
    }

    setImageRatio(imageRatio) {
        this.__imageRatio = imageRatio;
        return this; 
    }

    setFillableElement(fillableElement) {
        this.__fillableElement = fillableElement;
        return this; 
    }

    get pages() {
        this.__pages = [];
        switch (this.__bookItem.split('-')[0]) {
        case "cover":
            return this.__getCoverPages();
        case "title":
            return this.__getTocTitle();
        case "toc":
            return this.__getTocPages();
        case "chapter":
            return this.__getChapterPages();
        default:
            console.error('Неизвестный тип главы', this.__bookItem.id);
            location.replace(PORTAL_URL); 
        }    
    }

    get statusHeight() {
        const page = this.__fillableElement.parentNode;
        const pageHeight = parseFloat(getComputedStyle(page).height);
        const fillableElementHeight = parseFloat(getComputedStyle(this.__fillableElement).height);

        return fillableElementHeight < pageHeight ? 1 : fillableElementHeight === pageHeight ? 0 : -1; 
    }

    __normalizeImage(image) {
        if (image && this.__imageRatio[image.src]) {
            return new Promise((resolve, reject) => {
                image.onload = resolve;
                image.onerror = reject;
                image.src = this.__imageRatio[image.src];
            })
            .then(() => {
                const imageParagraph = image.parentNode;
                const imageWrapper = document.createElement('div');
                imageWrapper.classList.add('image-wrapper');
                imageWrapper.appendChild(image);
                this.__normalizeImageByType(image, imageWrapper);

                imageParagraph.insertBefore(imageWrapper, image);
                imageParagraph.removeChild(image);
            })
            .catch(error => {
                console.warn(`Не удалось загрузить картинку по адресу - ${this.__imageRatio[image.src]}`);
                console.error(`Произошла следующая ошибка - ${error}`);

                const imageParagraph = image.parentNode;
                if (imageParagraph.childNodes.length > 1) {
                    imageParagraph.removeChild(image);
                } else {
                    imageParagraph.parentNode.removeChild(imageParagraph);
                }
            });
        }
        return Promise.resolve();
    }

    __normalizeImageByType(image) {
        switch (image.dataset.position) {
        case 'break':
            this.__normalizeImageBreak(...arguments);
            break;
        case 'inline':
            this.__normalizeImageInline(...arguments);
            break;
        case 'wrap':
            this.__normalizeImageWrap(...arguments);
            break;
        case 'full':
            this.__normalizeImageFull(...arguments);
            break;
        default:
            this.__normalizeImageBreak(...arguments);
            break;
        }    
    }

    __normalizeImagePadding(image, imageWrapper) {
        imageWrapper.style.paddingTop = `${image.dataset.paddingTop || 0}px`;        
        imageWrapper.style.paddingBottom = `${image.dataset.paddingBottom || 0}px`;      
        imageWrapper.style.paddingLeft = `${image.dataset.paddingLeft || 0}px`;     
        imageWrapper.style.paddingRight = `${image.dataset.paddingRight || 0}px`;       
    }

    __normalizeImageBreak(image, imageWrapper) {
        imageWrapper.style.width = '100%';
        imageWrapper.style.boxSizing = 'border-box';
        imageWrapper.style.textAlign = image.dataset.align || 'center';
        image.style.width = `${image.dataset.width || 100}%`;
        this.__normalizeImagePadding(image, imageWrapper);
        this.__appendImageDescription(image, imageWrapper);
        this.__appendImageSource(image, imageWrapper);

        this.__fillableElement.appendChild(imageWrapper);
        const {height: fillableElementHeight} = PageCalculator.getElementSize(this.__fillableElement);
        const {height: imageWrapperHeight} = PageCalculator.getElementSize(imageWrapper);
        if (fillableElementHeight < imageWrapperHeight) {
            const diffHeight = imageWrapperHeight - fillableElementHeight;
            const {width: imageWidth, height: imageHeight} = PageCalculator.getElementSize(image);
            const diffWidth = diffHeight * imageWidth / imageHeight;
            image.style.width = `calc(${image.style.width} - ${diffWidth}px)`;
        }

        this.__fillableElement.removeChild(imageWrapper);
    }

    __normalizeImageInline(image, imageWrapper) {
        imageWrapper.style.display = 'inline-block';
        imageWrapper.style.boxSizing = 'border-box';
        imageWrapper.style.verticalAlign = image.dataset.valign || 'baseline';
        imageWrapper.style.lineHeight = 0;
        this.__normalizeImagePadding(image, imageWrapper);
        image.style.height = `${image.dataset.height || 20}pt`;

        this.__fillableElement.appendChild(imageWrapper);
        const {width: fillableElementWidth} = PageCalculator.getElementSize(this.__fillableElement);
        const {width: imageWrapperWidth} = PageCalculator.getElementSize(imageWrapper);
        if (imageWrapperWidth > fillableElementWidth) {
            imageWrapper.style.width = '100%';
            image.style.width = '100%'; 
            image.style.removeProperty('height');  
        }
        
        this.__fillableElement.removeChild(imageWrapper);
    }

    __normalizeImageWrap(image, imageWrapper) {
        imageWrapper.style.width = `${image.dataset.width || 50}%`;
        imageWrapper.style.boxSizing = 'border-box';
        imageWrapper.style.textAlign = 'center';
        imageWrapper.style.float = image.dataset.align === 'left' || image.dataset.align === 'right' ? image.dataset.align : 'left';
        this.__normalizeImagePadding(image, imageWrapper);
        image.style.width = '100%';
    }

    __normalizeImageFull(image, imageWrapper) {
        imageWrapper.style.width = '100%';
        imageWrapper.style.height = '100%';
        imageWrapper.style.boxSizing = 'border-box';
        imageWrapper.style.textAlign = image.dataset.align || 'center';
        this.__normalizeImagePadding(image, imageWrapper);
        this.__appendImageDescription(image, imageWrapper);
        this.__appendImageSource(image, imageWrapper);

        this.__fillableElement.appendChild(imageWrapper);
        const imageWrapperSize = PageCalculator.getElementSize(imageWrapper);
        
        let dedicateHeight = 0;
        for (let node of imageWrapper.childNodes) {
            if (node.nodeName.toLowerCase() === 'img' || node.type !== 1) continue;
            dedicateHeight += parseFloat(getComputedStyle(node).height);
        }

        const wrapperWidth = imageWrapperSize.width - imageWrapperSize.paddingLeft - imageWrapperSize.paddingRight;
        const wrapperHeight = imageWrapperSize.height - imageWrapperSize.paddingBottom - imageWrapperSize.paddingTop - dedicateHeight;

        image.style.width = `${wrapperWidth}px`;
        const {height: imageHeight} = PageCalculator.getElementSize(image);
        if (imageHeight > wrapperHeight) {
            image.style.height = `${wrapperHeight}px`;
            image.style.removeProperty('width');     
        }
        
        this.__fillableElement.removeChild(imageWrapper);
    }

    __appendImageDescription(image, imageWrapper) {
        if (image.dataset.description) {
            const description = document.createElement('div');
            description.classList.add('image-description');
            description.innerHTML = image.dataset.description;
            imageWrapper.appendChild(description);
        }
    }

    __appendImageSource(image, imageWrapper) {
        if (image.dataset.source) {
            const source = document.createElement('div');
            source.classList.add('image-source');
            source.innerHTML = image.dataset.source;
            imageWrapper.appendChild(source);
        }
    }

    async __getCoverPages() {
        const bodyContentString = PageCalculator.getBodyContent(this.__bookItem.content);
        const wrapper = document.createElement('div');
        wrapper.innerHTML = bodyContentString;

        const wrapperNode = wrapper.firstChild;
        PageCalculator.idToDataAttribute(wrapperNode);

        const cover = wrapper.querySelector('img');
        if (cover) {
            cover.styles.maxWidth = '100%';    
            cover.styles.maxHeight = '100%';    
            cover.styles.display = 'block';    
            cover.styles.margin = '0 auto';    
        }
        
        await this.__normalizeImage(cover);

        this.__fillableElement.innerHTML = PageCalculator.getEmptyCloneElement(wrapperNode);
        this.__fillingPages(wrapperNode, this.__fillableElement.firstChild);

        return this.__pages;
    }

    __joinWordsInHalfText(words) {
        let halfWordsCount = Math.ceil(words.length / 2);
        return [
            words.slice(halfWordsCount).join(' '),
            words.slice(0, halfWordsCount).join(' ')
        ]; 
    }

    __cropText(fromNode, toNode) {
        const toNodeStyles = getComputedStyle(toNode);
        const textStack = this.__joinWordsInHalfText(fromNode.nodeValue.split(' '));
        
        fromNode.nodeValue = '';
        
        while (textStack.length) {
            const text = textStack.pop();
            fromNode.nodeValue = fromNode.nodeValue ? `${fromNode.nodeValue} ${text}` : text;           
            
            if (this.statusHeight !== -1) continue;

            const lastIndex = fromNode.nodeValue.lastIndexOf(text) - 1;
            fromNode.nodeValue = lastIndex < 0 ? '' : fromNode.nodeValue.slice(0, lastIndex);  

            const words = text.split(' ');
            if (words.length <= 1 && toNodeStyles.fontText === 'justify') {
                toNode.classList.add("last-line-justify");
                break;
            }
            textStack.push(...this.__joinWordsInHalfText(words));
        }
    }

    __fillingPages(fromNode, toNode, deep = false) {
        const stackNodes = [...fromNode.childNodes].reverse();

        iterateStack: while (stackNodes.length) {
            const node = stackNodes.pop();
            switch (node.nodeType) {
            case 1:
                const resultProcessingElement = this.__processingElementNode(node, toNode, stackNodes, deep);
                if (resultProcessingElement === this.__statusContinue) {
                    continue iterateStack;    
                } else if (Array.isArray(resultProcessingElement)) {
                    return resultProcessingElement;
                }
                break;
            case 3: 
                const resultProcessingText = this.__processingTextNode(node, toNode, stackNodes, deep);
                if (resultProcessingText === this.__statusContinue) {
                    continue iterateStack;    
                } else if (Array.isArray(resultProcessingText)) {
                    return resultProcessingText;
                }
                break;
            default: continue iterateStack;
            }
            if (deep) return;
            if (toNode.childNodes.length) this.__appendPage(!!stackNodes.length);
        }

        if (!deep && toNode.childNodes.length) this.__appendPage(false);
    }

    __processingElementNode(currentNode, toNode, stackNodes, deep) {
        const cloneNode = currentNode.cloneNode(false);
        PageCalculator.idToDataAttribute(currentNode);
        toNode.appendChild(cloneNode);
        switch (this.statusHeight) {
        case 1: return this.__statusContinue;
        case -1:
            const nodeName = currentNode.nodeName.toLowerCase();
            let lostChildNodes = null;
            if (nodeName !== 'img') {
                cloneNode.innerHTML = "";
                lostChildNodes = this.__fillingPages(currentNode, cloneNode, true);                       
                if (!cloneNode.childNodes.length) {
                    toNode.removeChild(cloneNode);
                    if (!deep && toNode.childNodes.length) {
                        stackNodes.push(currentNode);
                        return;
                    }
                }
            } else {

            }

            if (lostChildNodes && lostChildNodes.length) {
                const lostNode = currentNode.cloneNode(false);
                PageCalculator.setHtml(lostChildNodes, lostNode);
                stackNodes.push(lostNode);
                if (deep) return stackNodes.reverse();
            }
        }
    }

    // if (nodeName !== 'img') {
    //     var $wrap = $node.clone().empty().appendTo($to);
    //     me._tranceNodes($node, $wrap, true);
    //     if ($node.is(":empty")) $node.remove();                        
    //     if ($wrap.is(":empty")) $wrap.remove(); //TODO: возможно коментирование данной строки в некоторых книгах
    // } else if (!me._$intermediateEl.text() 
    //             && !me._$intermediateEl.find('img').length) {  
    //     var $cloneImg = $node.clone();
    //     $cloneImg.appendTo($to);
        
    //     var intermediateHeight = me._$intermediateEl.height();
    //     var diffHeight = intermediateHeight - me._params.height;    
    //     $cloneImg.css('max-height',  me._params.height - diffHeight);
        
    //     $node.remove();
    // } else {
    //     var $cloneImg = $node.clone();
    //     var intermediateHeight = me._$intermediateEl.height();
    //     var diffHeight = me._params.height - intermediateHeight;
    //     var heightIsEqualImg = Math.round(diffHeight / 2 * 3);
        
    //     $cloneImg.appendTo($to);
    //     var imgHeight = $cloneImg.height();
        
    //     if (heightIsEqualImg >= imgHeight) {
    //         $cloneImg.css('max-height',  diffHeight);
    //         $node.remove();    
    //     } else {
    //         $cloneImg.remove();    
    //     }
    // }

    __processingTextNode(currentNode, toNode, stackNodes, deep) {
        const cloneNode = currentNode.cloneNode(false);
        toNode.appendChild(cloneNode);
        switch (this.statusHeight) {
        case 1: return this.__statusContinue;
        case -1:
            this.__cropText(cloneNode, toNode);

            if (!cloneNode.nodeValue.length) {
                toNode.removeChild(cloneNode);
                return;
            }

            const lostTextNode = currentNode.cloneNode(false);
            lostTextNode.nodeValue = lostTextNode.nodeValue.slice(cloneNode.nodeValue.length);
            if (lostTextNode.nodeValue[0] === ' ') {
                lostTextNode.nodeValue = lostTextNode.nodeValue.slice(1);
            }
            stackNodes.push(lostTextNode);
            if (deep) return stackNodes.reverse();
        }
    }

    __appendPage(isNotRemoveWrapper = false) {
        const page = document.createElement('div');
        page.classList.add("page-content");
        page.innerHTML = this.__fillableElement.innerHTML;
        if (isNotRemoveWrapper) {
            this.__fillableElement.firstChild.innerHTML = '';
        } else {
            this.__fillableElement.innerHTML = '';    
        }

        let id = '';
        let textOffset = 0;
        let firstElementHaveId = null;
        if (page.firstChild && page.firstChild.firstChild && page.firstChild.firstChild.dataset.id) {
            id = page.firstChild.firstChild.dataset.id;
        } else if (firstElementHaveId = page.querySelector("[data-id]")) {
            id = firstElementHaveId.dataset.id;            
        }

        page.dataset.paragraphId = id;

        if (firstElementHaveId !== page.firstChild && this.__pages.length && id) {
            let i = this.__pages.length;
            for (;i--;) {
                const elementEqualId = this.__pages[i].querySelector(`[data-id="${id}"]`);
                if (!elementEqualId) break;
                textOffset += elementEqualId.innerText.length;
            }
        }
        page.dataset.textOffset = textOffset;    

        this.__pages.push(page);
    }
}

// class Page extends Component {
//     render() {
//         return <div className="page-content" dangerouslySetInnerHTML={{__html: this.props.pageContent}}></div>;
//     }
// }