/* eslint-disable*/
import React from 'react';
import {
  ImageField,
  NextImage as JssImage,
  RichText,
  Link as JssLink,
  LinkField,
  Field,
  Text,
  ComponentParams,
  ComponentRendering,
  useSitecoreContext,
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
      heading?: TextField
}
 
export const Default = (props: CustomSliderProps) : JSX.Element=> {
 
  const Image = () => <JssImage field={props.fields.backgroundImage} className={styles.image} />;
  console.log('FIELDS', props.fields.backgroundImage);
  return (
    
  //  <div className={styles.slide}>
      <section className={styles.imageContainer}>
      <div className={styles.image}>
          <Image/>
      </div>
      <div className={styles.content}>
       <h2><Text field={props.fields.heading} className={styles.title} /></h2> 
        <p><Text field={props.fields.subHeading} className={styles.title} /></p>
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
