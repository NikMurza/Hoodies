import * as React from 'react';
import { createPortal } from 'react-dom';
import * as _ from 'lodash';
import {
  ContextMenuItem,
  VisualEditorActionCallback,
  VisualEditorActions,
  VisualEditorContextMenuIdentity,
  VisualEditorIdentity,
} from '@common/components/lib/types/visual-editor';
import ContextMenuAdvance, {
  IContextMenuAdvanceItem,
} from '@common/components/lib/controls/context-menu-advance/ContextMenuAdvance';
import './ContextMenu.less';

interface Props<T extends unknown = unknown> {
  id: string;
  x: number;
  y: number;
  items: ContextMenuItem<T>[];
  onAction?: VisualEditorActionCallback;
}

interface IContextItemData {
  key: string;
  action?: VisualEditorActions;
  item?: IContextMenuAdvanceItem;
}

const cssPrefix = 'visual-canvas';

const ContextMenu: React.FC<Props> = (props: Props): JSX.Element => {
  const { id, x, y, items, onAction } = props;

  const transformItem = (item: ContextMenuItem) => ({
    caption: item?.name,
    iconPath: item?.icon,
    divider: item?.divider,
    action: item?.action,
    items: item?.items && _.map(item?.items, transformItem),
    payload: item?.payload,
  });

  const transformItems = (items: ContextMenuItem[]) => _.map(items, transformItem);

  const onItemClick = (
    _0: React.MouseEvent<HTMLDivElement, MouseEvent>,
    data: IContextItemData,
  ): void => {
    onAction<VisualEditorContextMenuIdentity>(VisualEditorActions.ContextMenu, {
      contextMenuId: '',
    });

    const item: IContextMenuAdvanceItem = data?.item;
    if (!item) {
      return;
    }

    onAction<ContextMenuItem & VisualEditorIdentity>(data?.action, {
      id,
      name: item?.caption as string,
      payload: item?.payload,
    });
  };

  const renderContextMenu = (contextMenu: ContextMenuItem[]): JSX.Element => {
    const items: IContextMenuAdvanceItem[] = transformItems(contextMenu);

    return (
      <div
        key={id}
        className={`${cssPrefix}__context-menu-wrapper`}
        style={{
          top: y,
          left: x,
        }}
      >
        <ContextMenuAdvance
          id={id}
          className={`${cssPrefix}__context-menu-advanced`}
          usePortal={false}
          data={{ items, onItemClick }}
        />
      </div>
    );
  };

  const createContentMenu = (): JSX.Element => {
    if (!(items?.length > 0)) {
      return null;
    }

    return createPortal(renderContextMenu(items), document.body);
  };

  return createContentMenu();
};

ContextMenu.defaultProps = {
  items: [],
  onAction: (): void => undefined,
};

export default ContextMenu;
