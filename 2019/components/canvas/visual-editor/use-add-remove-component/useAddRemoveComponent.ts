import * as React from 'react';
import { IMap } from '@common/api/types/map';
import { VisualEditorComponentData } from '@common/components/lib/types/visual-editor';

interface UseAddRemoveComponentsReturn {
  components: IMap<JSX.Element>;
  onShapeAddComponent: (data: VisualEditorComponentData) => void;
  onShapeRemoveComponent: (id: string) => void;
}

/**
 * реализация on[Add|Remove]Component контракта
 */
const useAddRemoveComponents = (): UseAddRemoveComponentsReturn => {
  // для отрисовки доп. компонентов
  const [components, setComponents] = React.useState<IMap<JSX.Element>>({});

  const onShapeAddComponent = React.useCallback((data: VisualEditorComponentData): void => {
    // добавляем компонент на отрисовку
    setComponents((components) => ({ ...components, [data.id]: data.component }));
  }, []);

  const onShapeRemoveComponent = React.useCallback((id: string): void => {
    setComponents((components) => {
      delete components[id];
      return { ...components };
    });
  }, []);

  return { components, onShapeAddComponent, onShapeRemoveComponent };
};

export default useAddRemoveComponents;
