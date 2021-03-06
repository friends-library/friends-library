import React from 'react';
import ContentEditable from 'react-contenteditable';

interface Props {
  blurb: string;
  update: (blurb: string) => void;
}

interface EditEvent {
  target: {
    value: string;
  };
}

export default class EditableBlurb extends React.Component<Props> {
  private contentEditable = React.createRef<HTMLDivElement>();

  public render(): JSX.Element {
    const { blurb, update } = this.props;
    return (
      <ContentEditable
        innerRef={this.contentEditable}
        html={blurb}
        style={{ position: `relative`, zIndex: 1 }}
        onChange={(e: EditEvent) => update(e.target.value)}
      />
    );
  }
}
