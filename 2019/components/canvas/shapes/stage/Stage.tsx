import * as React from 'react';
import './Stage.less';
import { Stage as KStage } from 'react-konva';
import Konva from 'konva';

interface IProps {
  width?: number;
  height?: number;

  onContextMenu?(evt: Konva.KonvaEventObject<PointerEvent>): void;
  onClick?(evt: Konva.KonvaEventObject<MouseEvent>): void;
}

class Stage extends React.Component<IProps> {
  public static defaultProps = {
    width: 0,
    height: 0,
  };

  protected etlRef: React.RefObject<HTMLDivElement>;

  constructor(props) {
    super(props);
    this.etlRef = React.createRef();
  }

  public componentDidMount() {
    this.setCenterScrollPosition();
  }

  public componentDidUpdate(prevProps: IProps) {
    const { width, height } = this.props;
    if ((!prevProps.width && width) || (!prevProps.height && height)) {
      this.setCenterScrollPosition();
    }
  }

  private setCenterScrollPosition() {
    if (this.etlRef.current) {
      const { scrollWidth, scrollHeight, offsetWidth, offsetHeight } = this.etlRef.current;
      this.etlRef.current.scrollTo({
        left: (scrollWidth - offsetWidth) / 2,
        top: (scrollHeight - offsetHeight) / 2,
      });
    }
  }

  public render() {
    const { width, height, onContextMenu, onClick, children } = this.props;
    return (
      <div ref={this.etlRef} className="canvas-stage">
        <KStage
          width={width}
          height={height}
          offsetX={-width / 2}
          offsetY={-height / 2}
          onContextMenu={onContextMenu}
          onClick={onClick}
        >
          {children}
        </KStage>
      </div>
    );
  }
}

export default Stage;
