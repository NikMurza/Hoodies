import * as React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import URLImage from '../UrlImage';

describe('UrlImage component', () => {
  it('render default', async () => {
    expect(toJson(shallow(<URLImage src="assets/img.svg" />))).toMatchSnapshot();
  });

  it('change props', async () => {
    const wrapper = shallow(<URLImage src="assets/img.svg" />);
    wrapper.setProps({ src: './img.svg' });
  });

  it('unmount', async () => {
    const wrapper = shallow(<URLImage src="assets/img.svg" />);
    wrapper.unmount();
    expect(wrapper.instance()).toBeNull();
  });
});
