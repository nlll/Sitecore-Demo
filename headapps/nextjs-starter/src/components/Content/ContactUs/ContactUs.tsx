import React from 'react';
import { LinkField, Link, Text, TextField } from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentParams, ComponentRendering } from '@sitecore-jss/sitecore-jss-nextjs';
import styles from './ContactUs.module.scss';

interface Fields {
  heading: TextField;
  callToAction: LinkField;
}

interface ContactUsProps {
  rendering: ComponentRendering & { params: ComponentParams };
  params: ComponentParams;
  fields: Fields;
}

export const Default = (props: ContactUsProps): JSX.Element => {
  return (
    <div className={styles.root}>
      <div className="row">
        <div className={styles.inner}>
          <div className={styles.contactUs}>
            <Text field={props.fields.heading} className={styles.heading} />
            <div className={styles.cta}>
              <Link field={props.fields.callToAction} className={styles.link} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
