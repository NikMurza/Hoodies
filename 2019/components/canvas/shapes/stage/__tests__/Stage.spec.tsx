import * as React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Stage from '../Stage';

describe('CanvasStage component', () => {
  it('render default', async () => {
    expect(toJson(shallow(<Stage />))).toMatchSnapshot();
  });
});
