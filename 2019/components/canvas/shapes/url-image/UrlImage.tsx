import * as React from 'react';
import { Image } from 'react-konva';
import { KonvaClickEvent } from '../../index';

interface IProps {
  src: string;
  x?: number;
  y?: number;
  offsetX?: number;
  offsetY?: number;
  width?: number;
  height?: number;
  rotation?: number;
  onClick?: (event: any) => void;
  onmouseover?: (event: any) => void;
  onmouseleave?: (event: any) => void;
  onRightClick?: (event: any | KonvaClickEvent) => void;
}

interface IState {
  image: any;
}

class URLImage extends React.PureComponent<IProps, IState> {
  private image = null;

  constructor(props) {
    super(props);
    this.state = {
      image: null,
    };
  }

  public componentDidMount() {
    this.loadImage();
  }

  public componentDidUpdate(oldProps) {
    if (oldProps.src !== this.props.src) {
      this.image.removeEventListener('load', this.handleLoad);
      this.loadImage();
    }
  }

  public componentWillUnmount() {
    this.image.removeEventListener('load', this.handleLoad);
  }

  private loadImage = () => {
    this.image = new (window as any).Image();
    this.image.src = this.props.src;
    this.image.addEventListener('load', this.handleLoad);
  };

  private handleLoad = () => {
    this.setState({
      image: this.image,
    });
  };

  public render() {
    return (
      <Image
        x={this.props.x}
        y={this.props.y}
        offsetX={this.props.offsetX}
        offsetY={this.props.offsetY}
        rotation={this.props.rotation}
        width={this.props.width}
        height={this.props.height}
        image={this.state.image}
        onClick={this.props.onClick}
        onmouseover={this.props.onmouseover}
        onmouseleave={this.props.onmouseleave}
        onContextMenu={this.props.onRightClick}
      />
    );
  }
}

export default URLImage;
