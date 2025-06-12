import React from 'react';
import { Field, RichText as JssRichText } from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentParams, ComponentRendering } from '@sitecore-jss/sitecore-jss-nextjs';

interface Fields {
  Text: Field<string>;
  VideoUrl: Field<string>;
}

interface VideoWithTextProps {
  rendering: ComponentRendering & { params: ComponentParams };
  params: ComponentParams;
  fields: Fields;
}

export const Default = (props: VideoWithTextProps): JSX.Element => {
  const text = props.fields ? (
    <JssRichText field={props.fields.Text} />
  ) : (
    <span className="is-empty-hint">Rich text</span>
  );
  const videoUrl = props?.fields.VideoUrl?.value || '';

  return (
    <div className="container">
      <div className="row cont-1">
        <div className="col text">
          <div className="component-content">{text}</div>
        </div>
        <div className="col video">
          <iframe src={videoUrl} width="100%" height="100%" frameBorder="0"></iframe>
        </div>
      </div>
    </div>
  );
};
