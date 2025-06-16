import React from 'react';
import { LinkField, RichText, RichTextField } from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentParams, ComponentRendering } from '@sitecore-jss/sitecore-jss-nextjs';
import styles from './VideoWithText.module.scss';
import cx from 'classnames';

interface Fields {
  text: RichTextField;
  videoUrl: LinkField;
}

interface VideoWithTextProps {
  rendering: ComponentRendering & { params: ComponentParams };
  params: ComponentParams;
  fields: Fields;
}

export const Default = (props: VideoWithTextProps): JSX.Element => {
  const text = props.fields ? (
    <RichText field={props.fields.text} tag="p" />
  ) : (
    <span className="is-empty-hint">Rich text</span>
  );

  const videoUrl = props?.fields.videoUrl?.value.href || '';

  return (
    <div className={styles.root}>
      <div className={styles.panel}>
        <div className={cx(styles.textCol, styles.col)}>{text}</div>
        <div className={cx(styles.mediaCol, styles.col)}>
          <iframe src={videoUrl} />
        </div>
      </div>
    </div>
  );
};
