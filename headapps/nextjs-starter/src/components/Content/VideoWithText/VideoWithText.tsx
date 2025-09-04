import React from 'react';
import { LinkField, RichText, RichTextField, 
  ImageField,
  NextImage as JssImage,
  Link as JssLink,
 } from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentParams, ComponentRendering } from '@sitecore-jss/sitecore-jss-nextjs';
import styles from './VideoWithText.module.scss';
import cx from 'classnames';

interface Fields {
  text:RichTextField;
  videoUrl:LinkField;
  foodUrl:LinkField;
  imageDq:ImageField;
  text2:RichTextField;
  text3:RichTextField;
  text4:RichTextField;
}

interface VideoWithTextProps {
  rendering: ComponentRendering & { params: ComponentParams };
  params: ComponentParams;
  fields: Fields;
}

export const Default = (props: VideoWithTextProps): JSX.Element => {
//  const videoHref = props.fields?.videoUrl?.value?.href ?? '';
//  const isVideoUrlValid = typeof videoHref === 'string' && videoHref.trim() !== '';
const Image = () => <JssImage field={props.fields.imageDq} className={styles.image} />;
  return (
    <div className={styles.root}>
      <div className={styles.panel}>
        <div className={cx(styles.mediaCol, styles.col)}>
          <div className={styles.image}>
          <Image/>
      </div>
       {props.fields.foodUrl && (
          <JssLink
            field={props.fields.foodUrl}
            href={props.fields.foodUrl.value.href}
            title={props.fields.foodUrl.value.text}
            className={styles.foodLink}
          />
        )}
          {/* {isVideoUrlValid && (
            <iframe
              src={videoHref}
              title="Video Content"
              width="100%"
              height="315"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )} */}
        </div>
         <div className={cx(styles.textCol, styles.col)}>
          <div className={styles.text}>
          <RichText field={props.fields.text} />
          </div>
        <div className={styles.text2}>
          <RichText field={props.fields.text2} />
        </div>
        <div className={styles.text3}>
          <RichText field={props.fields.text3} />
        </div>  
        <div className={styles.text4}>
         <RichText field={props.fields.text4} />
        </div>  
        <div className={styles.textLink}>
               {props.fields.videoUrl && (
          <JssLink
            field={props.fields.videoUrl}
            href={props.fields.videoUrl.value.href}
            title={props.fields.videoUrl.value.text}
            className={styles.videoUrl}
          />
        )} 
            </div>
        </div>
      </div>
    </div>
  );
};
