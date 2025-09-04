/* eslint-disable*/
import React from 'react';
import {
  ImageField,
  NextImage as JssImage,
  Link as JssLink,
  LinkField,
  Text,
  ComponentParams,
  ComponentRendering,
  TextField
} from '@sitecore-jss/sitecore-jss-nextjs';

import styles from './HeroSlider.module.scss';
import 'react-multi-carousel/lib/styles.css';
interface CustomSliderProps {
  rendering: ComponentRendering & { params: ComponentParams };
  params: ComponentParams;
  fields: HeroProps;
}

interface HeroProps {
      backgroundImage: ImageField;
      link:  LinkField ;
      subHeading?: TextField;
      heading?: TextField;
      headingLine? : TextField;
      subHeadingLine? : TextField;
}
 
export const Default = (props: CustomSliderProps) : JSX.Element=> {
 
  const Image = () => <JssImage field={props.fields.backgroundImage} className={styles.image} />;
  return (
      <section className={styles.imageContainer}>
      <div className={styles.image}>
          <Image/>
      </div>
      <div className={styles.content}>
       <h1><Text field={props.fields.heading} className={styles.title} /></h1> 
        <h1><Text field={props.fields.headingLine} className={styles.title} /></h1> 
        <div><Text field={props.fields.subHeading} className={styles.titleParagraph} /></div>
         <div><Text field={props.fields.subHeadingLine} className={styles.titleParagraph} /></div>
        {props.fields.link && (
          <JssLink
            field={props.fields.link}
            href={props.fields.link.value.href}
            title={props.fields.link.value.text}
            className={styles.link}
          />
        )}
      </div>
   // </section>
  );
};
