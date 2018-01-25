import React from 'react';
import Enzyme, { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {
    SystemErrorMessage,
    SystemInfoMessage,
    SystemSuccessMessage,
    SystemNewsMessage,
} from '../';
import SystemMessage from '../SystemMessage';
import sinon from 'sinon';

Enzyme.configure({adapter: new Adapter()});

describe('<SystemMessage />', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(
            <SystemMessage>
                Blå sjiraff
            </SystemMessage>
        );
    });

    it('renders with provided body', () => {
        const text = wrapper.find('.ffe-system-message__content');
        expect(text.length).to.be(1);
        expect(text.text()).to.be('Blå sjiraff');
    });

    it('closes itself after a click on the close container', done => {
        wrapper.find('.ffe-system-message__close').simulate('click');
        setTimeout(() => {
            const component = wrapper.find('.ffe-system-message-wrapper');
            expect(component.first().instance().style.height).to.be('0px');
            done();
        }, 100);
    });

    it('should accept style prop to apply styles to outermost container', () => {
        const el = shallow(<SystemMessage style={{ marginTop: '40px' }} />);
        expect(el.props().style.marginTop).to.be('40px');
    });

    it('should execute onClose prop when close button is clicked', done => {
        const onClickSpy = sinon.spy();
        wrapper = mount(
            <SystemInfoMessage onClose={onClickSpy}>
                Melding
            </SystemInfoMessage>
        );
        const component = wrapper.find('.ffe-system-message');
        expect(component.length).to.be(1);
        wrapper.find('.ffe-system-message__close').simulate('click');

        setTimeout(() => {
            expect(onClickSpy.calledOnce).to.be(false);
        }, 100);

        setTimeout(() => {
            expect(onClickSpy.calledOnce).to.be(true);
            done();
        }, 300);
    });
});

describe('for different types of message', () => {
    let wrapper;

    it('creates info-message', () => {
        wrapper = mount(
            <SystemInfoMessage>
                Infomelding
            </SystemInfoMessage>
        );
        const message = wrapper.find('.ffe-system-message-wrapper');
        expect(message.hasClass('ffe-system-message-wrapper--info')).to.be(true);
    });

    it('creates error-message', () => {
        wrapper = mount(
            <SystemErrorMessage>
                Feilmelding
            </SystemErrorMessage>
        );
        const message = wrapper.find('.ffe-system-message-wrapper');
        expect(message.hasClass('ffe-system-message-wrapper--error')).to.be(true);
    });

    it('create success-message', () => {
        wrapper = mount(
            <SystemSuccessMessage>
                Gladmelding
            </SystemSuccessMessage>
        );
        const message = wrapper.find('.ffe-system-message-wrapper');
        expect(message.hasClass('ffe-system-message-wrapper--success')).to.be(true);
    });

    it('create news-message', () => {
        wrapper = mount(
            <SystemNewsMessage>
                Nyhetsmelding
            </SystemNewsMessage>
        );
        const message = wrapper.find('.ffe-system-message-wrapper');
        expect(message.hasClass('ffe-system-message-wrapper--news')).to.be(true);
    });
});
