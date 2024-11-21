import * as React from 'react';
import produce from 'immer';
import * as _ from 'lodash';
import * as ReactKonva from 'react-konva';
import VisualEditor from '@common/components/lib/canvas/visual-editor/VisualEditor';
import {
  VisualEditorActionCallback,
  VisualEditorActions,
  VisualEditorIdentityPosition,
  VisualEditorPosition,
  VisualEditorPreviewObject,
  VisualEditorShapeType,
} from '@common/components/lib/types/visual-editor';
import AARectangle from '@common/geometry/rectangle';
import { useGetStage } from '@common/components/lib/canvas/hooks/useGetStage';
import useDebounce from '@common/hooks/lib/useDebounce';
import './Preview.less';

interface IProps {
  items: VisualEditorPreviewObject[];
  editorWidth: number;
  editorHeight: number;
  visible: boolean;
  previewPosition: VisualEditorPosition;
  scrollPosition: VisualEditorPosition;
  previewWidth: number;
  previewHeight: number;
  zoom: number;
  stageRef: React.RefObject<ReactKonva.Stage>;
  onAction?: VisualEditorActionCallback;
}

const VISUAL_EDITOR_PREVIEW_ID = 'VisualEditorPreview';
const VISUAL_EDITOR_PREVIEW_FRAME_ID = 'VisualEditorPreviewFrame';
const VISUAL_EDITOR_PREVIEW_FRAME_OVERFLOW_ID = 'VisualEditorPreviewFrameOverflow';
const VISUAL_EDITOR_PREVIEW_FRAME_BORDER = 2;

export const Preview: React.FC<React.PropsWithChildren<IProps>> = (
  props: React.PropsWithChildren<IProps>,
): JSX.Element => {
  const {
    editorWidth,
    editorHeight,
    previewWidth,
    previewHeight,
    items,
    visible,
    previewPosition,
    scrollPosition,
    zoom,
    stageRef,
    children,
    onAction,
  } = props;

  const stage = useGetStage(stageRef);
  if (!visible || !items || !editorWidth || !editorHeight || !stage) {
    return null;
  }

  const { x: positionX, y: positionY } = previewPosition;

  const style: React.CSSProperties = React.useMemo(
    () => ({
      top: positionY > 0 ? positionY : undefined,
      bottom: positionY <= 0 ? -positionY : undefined,
      left: positionX > 0 ? positionX : undefined,
      right: positionX > 0 ? -positionX : undefined,
      width: previewWidth,
      height: previewHeight,
    }),
    [positionX, positionY, previewWidth, previewHeight],
  );

  const area = React.useMemo(() => {
    const stage = useGetStage(stageRef);

    const frameTopLeftX = scrollPosition?.x / zoom;
    const frameTopLeftY = scrollPosition?.y / zoom;

    const frameBottomRightX =
      frameTopLeftX + stage.width() / zoom + VISUAL_EDITOR_PREVIEW_FRAME_BORDER * 2;
    const frameBottomRightY =
      frameTopLeftY + stage.height() / zoom + VISUAL_EDITOR_PREVIEW_FRAME_BORDER * 2;

    return {
      X1: frameTopLeftX,
      Y1: frameTopLeftY,
      X2: frameBottomRightX,
      Y2: frameBottomRightY,
      padding: editorWidth,
    };
  }, [stageRef, stageRef?.current, scrollPosition, zoom]);

  const customizeShapes = React.useMemo((): VisualEditorPreviewObject[] => {
    const shapes: VisualEditorPreviewObject[] = _.map(
      items,
      (item: VisualEditorPreviewObject): VisualEditorPreviewObject => {
        if (item?.width > 0 && item?.height > 0) {
          const { topLeft, topRight, bottomLeft, bottomRight } = new AARectangle(
            item.x,
            item.y,
            item.width,
            item.height,
            item.rotation,
          );

          area.X1 = Math.min(topLeft.x, topRight.x, bottomLeft.x, bottomRight.x, area.X1);
          area.Y1 = Math.min(topLeft.y, topRight.y, bottomLeft.y, bottomRight.y, area.Y1);

          area.X2 = Math.max(topLeft.x, topRight.x, bottomLeft.x, bottomRight.x, area.X2);
          area.Y2 = Math.max(topLeft.y, topRight.y, bottomLeft.y, bottomRight.y, area.Y2);

          area.padding = Math.min(item.width * 0.1, area.padding);
        }
        return produce<VisualEditorPreviewObject>(item, (draft): void => {
          draft.preview = true;
          draft.draggable = false;
          draft.resizable = false;
          draft.rotatable = false;
          draft.onAction = null;
          draft.onAddComponent = null;
          draft.onRemoveComponent = null;
        });
      },
    );

    if (area.padding === editorWidth) {
      area.padding = 0;
    }

    return shapes;
  }, [items, area]);

  const { areaWidth, areaHeight, areaZoom, areaScrollX, areaScrollY } = React.useMemo(() => {
    let marginLeft = 0;
    let marginTop = 0;

    let areaWidth = Math.abs(area.X2 - area.X1);
    let areaHeight = Math.abs(area.Y2 - area.Y1);

    const previewRatio = previewHeight / previewWidth;
    const areaRatio = areaHeight / areaWidth;

    const paddingLeft = area.padding;
    const paddingTop = area.padding * previewRatio;

    if (previewRatio > areaRatio) {
      const newAreaHeight = previewRatio * areaWidth;
      marginTop = (newAreaHeight - areaHeight) / 2;
      areaHeight = newAreaHeight;
    }

    if (previewRatio < areaRatio) {
      const newAreaWidth = areaHeight / previewRatio;
      marginLeft = (newAreaWidth - areaWidth) / 2;
      areaWidth = newAreaWidth;
    }

    areaWidth += paddingLeft * 2;
    areaHeight += paddingTop * 2;

    const areaZoom = previewWidth / areaWidth;
    const areaScrollX = (area.X1 - marginLeft - paddingLeft) * areaZoom;
    const areaScrollY = (area.Y1 - marginTop - paddingTop) * areaZoom;

    return {
      areaWidth,
      areaHeight,
      areaZoom,
      areaScrollX,
      areaScrollY,
    };
  }, [area, previewWidth, previewHeight]);

  const onSetScroll = useDebounce((position: VisualEditorPosition): void => {
    onAction<VisualEditorIdentityPosition>(VisualEditorActions.Move, {
      id: VISUAL_EDITOR_PREVIEW_ID,
      x: position.x * zoom,
      y: position.y * zoom,
    });
  }, 300);

  const onPreviewAction = React.useCallback(
    <T extends object>(action: VisualEditorActions, data: T): void => {
      const actions = {
        [VisualEditorActions.Move]: onSetScroll,
      };
      if (actions[action]) {
        actions[action](data);
      }
    },
    [],
  );

  const previewFrame = React.useMemo(() => {
    const stage = useGetStage(stageRef);
    const previewFrameWidth = stage.width() / zoom;
    const previewFrameHeight = stage.height() / zoom;
    return {
      id: VISUAL_EDITOR_PREVIEW_FRAME_ID,
      x: scrollPosition?.x / zoom,
      y: scrollPosition?.y / zoom,
      width: previewFrameWidth,
      height: previewFrameHeight,
      type: VisualEditorShapeType.Block,
      preview: true,
      draggable: true,
      resizable: false,
      rotatable: false,
      theme: {
        backgroundColor: 'rgba(59, 94, 220, 0.05)',
        borderColor: '#3b5edc',
        borderWidth: VISUAL_EDITOR_PREVIEW_FRAME_BORDER / areaZoom,
        opacity: 1,
      },
      dragBoundFunc(pos: VisualEditorPosition): VisualEditorPosition {
        let { x, y } = pos;

        x = Math.min((areaWidth - previewFrameWidth) * areaZoom, x);
        x = Math.max(0, x);

        y = Math.min((areaHeight - previewFrameHeight) * areaZoom, y);
        y = Math.max(0, y);

        return {
          x,
          y,
        };
      },
      onAction: onPreviewAction,
    } as VisualEditorPreviewObject;
  }, [stageRef, stageRef?.current, zoom, scrollPosition, areaZoom, areaWidth, areaHeight]);

  const previewOverflow = React.useMemo(
    () =>
      ({
        id: VISUAL_EDITOR_PREVIEW_FRAME_OVERFLOW_ID,
        x: areaScrollX / areaZoom,
        y: areaScrollY / areaZoom,
        width: areaWidth,
        height: areaHeight,
        type: VisualEditorShapeType.Rect,
        preview: true,
        theme: {
          backgroundColor: 'transparent',
          borderWidth: 0,
          opacity: 1,
        },
      } as VisualEditorPreviewObject),
    [editorWidth, editorHeight, areaScrollX, areaScrollY, areaWidth, areaHeight],
  );

  const shapes = React.useMemo(() => [...customizeShapes, previewOverflow, previewFrame], [
    customizeShapes,
    previewOverflow,
    previewFrame,
  ]);

  const position = React.useMemo(() => ({ x: areaScrollX, y: areaScrollY }), [
    areaScrollX,
    areaScrollY,
  ]);

  const childrenStyles = React.useMemo(() => ({ zoom: areaZoom }), [areaZoom]);

  return (
    <div className="visual-editor__preview-area" style={style}>
      <VisualEditor
        panEnabled={false}
        id={VISUAL_EDITOR_PREVIEW_ID}
        zoom={areaZoom}
        items={shapes}
        position={position}
      >
        <div style={childrenStyles}>{children}</div>
      </VisualEditor>
    </div>
  );
};

export default Preview;
