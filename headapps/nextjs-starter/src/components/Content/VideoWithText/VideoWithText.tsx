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
  const videoHref = props.fields?.videoUrl?.value?.href ?? '';

  const isVideoUrlValid = typeof videoHref === 'string' && videoHref.trim() !== '';

  return (
    <div className={styles.root}>
      <div className={styles.panel}>
        <div className={cx(styles.textCol, styles.col)}>
          <div className={styles.text}>
            <RichText field={props.fields.text} />
          </div>
        </div>
        <div className={cx(styles.mediaCol, styles.col)}>
          {isVideoUrlValid && (
            <iframe
              src={videoHref}
              title="Video Content"
              width="100%"
              height="315"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>
      </div>
    </div>
  );
};
