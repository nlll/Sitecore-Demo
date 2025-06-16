import React from 'react';
import {
  ComponentParams,
  ComponentRendering,
  Link,
  RichText,
  LinkField,
  RichTextField,
} from '@sitecore-jss/sitecore-jss-nextjs';
import styles from './CustomFooter.module.scss';

type ResultsFieldLink = {
  field: {
    link: LinkField;
  };
};

interface Fields {
  data: {
    datasource: {
      address: { jsonValue: RichTextField };
      copyRight?: { jsonValue: RichTextField };
      children: {
        results: Array<ResultsFieldLink>;
      };
    };
  };
}

interface CustomFooterProps {
  rendering: ComponentRendering & { params: ComponentParams };
  params: ComponentParams;
  fields: Fields;
}

export const Default = (props: CustomFooterProps): JSX.Element => {
  return (
    <footer className={styles.root}>
      <nav className={styles.footerNav}>
        <div className="container">
          <ul className={styles.footerLinks}>
            {props.fields.data.datasource.children &&
              props.fields.data.datasource.children.results.length > 0 &&
              props.fields.data.datasource.children.results.map((nav, index) => (
                <li key={index}>
                  <Link field={nav.field.link} className={styles.link} />
                  {props.fields.data.datasource.children.results &&
                    index < props.fields.data.datasource.children.results.length - 1 && (
                      <span className={styles.separator}>-</span>
                    )}
                </li>
              ))}
          </ul>
          {props.fields.data.datasource.address && (
            <div className="footer-address">
              <RichText field={props.fields.data.datasource.address.jsonValue} />
            </div>
          )}
        </div>
      </nav>
      {props.fields.data.datasource.copyRight && (
        <div className={styles.copyRight}>
          <RichText field={props.fields.data.datasource.copyRight.jsonValue} />
        </div>
      )}
    </footer>
  );
};
