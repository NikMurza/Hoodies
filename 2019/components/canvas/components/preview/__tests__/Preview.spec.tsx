import Preview, { PreviewProps } from '@common/components/lib/canvas/components/preview/Preview';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import * as React from 'react';

describe('Preview component', () => {
  const methods = {
    clone: () => ({
      toDataURL(): string {
        return 'base64imagedata';
      },
    }),
  };

  const props: PreviewProps = {
    position: {
      x: 10,
      y: 20,
    },
    stageSize: {
      width: 1000,
      height: 500,
    },
    workspaceSize: {
      width: 2000,
      height: 1000,
    },
    cloneRef: {
      current: {
        clone: methods.clone,
      },
    },
  };
  it('renders correctly', () => {
    const onCloneSpy = spyOn(methods, 'clone');

    const wrapper = shallow(<Preview {...props} />);

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
