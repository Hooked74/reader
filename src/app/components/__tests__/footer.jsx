import React from 'react';
import { shallow } from 'enzyme';
import Footer from '../Footer';

describe('FOOTER COMPONENT', () => {
    it('Должен отрисовать себя и дочерние компоненты', () => {
        const enzymeWrapper = shallow(<Footer />);
        expect(enzymeWrapper.is('#footer')).toBe(true);
    });
});