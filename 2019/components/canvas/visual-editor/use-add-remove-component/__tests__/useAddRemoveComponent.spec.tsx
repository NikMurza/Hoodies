import * as React from 'react';
import { renderHook, act } from '@testing-library/react-hooks'
import useAddRemoveComponents from '../useAddRemoveComponent'

describe('UseAddRemoveComponent hook', () => {
  it('UseAddRemoveComponent works corretly', () => {
    const { result } = renderHook(useAddRemoveComponents);
    expect(Object.keys(result.current.components).length).toBe(0);
    const data = {
      id: 1, 
      component: (<div />)
    };

    act(() => {
      result.current.onShapeAddComponent(data);
    });
    expect(Object.keys(result.current.components).length).toBe(1);
    expect(result.current.components[data.id]).toBe(data.component);

    act(() => {
        result.current.onShapeRemoveComponent(data.id);
    });
    expect(Object.keys(result.current.components).length).toBe(0);
  });
};
