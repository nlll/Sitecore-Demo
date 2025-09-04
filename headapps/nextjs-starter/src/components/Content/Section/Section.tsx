import React from 'react';
import { Field, Text, Placeholder } from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentParams, ComponentRendering } from '@sitecore-jss/sitecore-jss-nextjs';
import styles from './Section.module.scss';

interface Fields {
  Heading: Field<string>;
}

interface SectionProps {
  rendering: ComponentRendering & { params: ComponentParams };
  fields: Fields;
  params: ComponentParams;
}

export const Default = (props: SectionProps): JSX.Element => {
  console.log('Heading', props.fields.Heading);
  return (
    <div className={styles.root}>
      <div className="row justify-content-center">
        <div className="col-md-10">
          <Text field={props.fields.Heading} tag="h1" className={styles.title} />
          <Placeholder name="headless-section" rendering={props.rendering} />
        </div>
      </div>
    </div>
  );
};
