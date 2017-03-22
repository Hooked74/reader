import React from 'react';
import { shallow } from 'enzyme';
import Navigation from '../Navigation';

describe('NAVIGATION COMPONENT', () => {
    it('Должен занять нужную позицию', () => {
        const enzymeWrapper = shallow(<Navigation align="left" />);
        expect(enzymeWrapper.hasClass('navigation-left')).toBe(true);
        enzymeWrapper.setProps({ align: "right" });
        expect(enzymeWrapper.hasClass('navigation-right')).toBe(true);
    });
});