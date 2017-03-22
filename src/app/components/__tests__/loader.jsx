import React from 'react';
import { shallow } from 'enzyme';
import Loader from '../Loader';

describe('LOADER COMPONENT', () => {
    it('Должен отрисовать себя и дочерние компоненты', () => {
        const enzymeWrapper = shallow(<Loader visible={false} />);
        expect(enzymeWrapper.is('#loader')).toBe(true);
    });

    it('Должен изменять видимость', () => {
        const enzymeWrapper = shallow(<Loader visible={false} />);
        expect(enzymeWrapper.hasClass('hidden')).toBe(true);
        enzymeWrapper.setProps({ visible: true });
        expect(enzymeWrapper.hasClass('hidden')).toBe(false);
    });

    it('Должен показывать текст загрузки', () => {
        const text = "Test Loader";
        const enzymeWrapper = shallow(<Loader visible={true} message={text}/>);
        expect(enzymeWrapper.find(".replace-text").text()).toBe(text);
    });
});