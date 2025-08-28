/* eslint-disable*/
import React, { useState } from 'react';
import {
  ComponentParams,
  ComponentRendering,
  ImageField,
  Link,
  LinkField,
  useSitecoreContext,
} from '@sitecore-jss/sitecore-jss-nextjs';
import styles from './Header.module.scss';
import cx from 'classnames';

type ResultsFieldLink = {
  field: {
    link: {
      value: {
        href?: string;
        className?: string;
        class?: string;
        title?: string;
        target?: string;
        text?: string;
        anchor?: string;
        querystring?: string;
        linktype?: string;
        id?: string;
      };
    };
  };
};

interface Fields {
  data: {
   item:{
      logoLink: { jsonValue: ImageField };
      cta: { jsonValue: LinkField };
      cta2: { jsonValue: LinkField };
      icon_47d42368fcba4b25b2b8e41739b2d2ac: { jsonValue: ImageField };
      currentLocation?: string;
      children: {
        results: Array<ResultsFieldLink>;
      };
   }
  };
}
interface CustomHeaderProps {
  rendering: ComponentRendering & { params: ComponentParams };
  params: ComponentParams;
  fields: Fields;
}

const LOGO_IMAGE_SRC = '/TireHub_Logo.png';
const LOGO_ALT_TEXT = 'TireHub';

export const Default = (props: CustomHeaderProps): JSX.Element => {
  const { sitecoreContext } = useSitecoreContext();
console.log("CTA:", props.fields.data.item);
  return (
    <header className={cx('container', styles.root)}>
      <nav className={styles.nav}>
        {props.fields.data?.item.logoLink ? (
          <a href="/" className={styles.logoLink}>
            <img
              src={props.fields.data.item.logoLink?.jsonValue.value?.src}
              alt={LOGO_ALT_TEXT}
              className={styles.logo}
            />
          </a>
        ) : (
          <a href="/" className={styles.logoLink}>
            <img src={LOGO_IMAGE_SRC} alt={LOGO_ALT_TEXT} className={styles.logo} />
          </a>
        )}
        <div className={cx(styles.primaryNav)}>
          <ul className={styles.primaryNavList}>
            {props.fields.data &&
              props.fields.data.item.children.results.slice(0, 6).map((nav, index) => {
                const linkId = nav.field.link?.value.id?.replace(/[{}]/g, '').toLowerCase();
                const currentId = sitecoreContext?.itemId?.replace(/[{}]/g, '').toLowerCase();
                const isActive = linkId === currentId;
                return (
                  <li
                    key={index}
                    className={cx(styles.primaryNavItem, {
                      [styles.active]: isActive,
                    })}
                  >
                    <Link field={nav.field.link} className={styles.primaryNavLink} />
                  </li>
                );
              })}
          </ul>

        </div>
        <div className={styles.navContainer}>
 {props.fields.data?.item.icon_47d42368fcba4b25b2b8e41739b2d2ac ? (
          <a href="/" className={""}>
            <img
              src={props.fields.data.item.icon_47d42368fcba4b25b2b8e41739b2d2ac.jsonValue.value?.src}
              alt={LOGO_ALT_TEXT}
              className={styles.iconSign}
            />
          </a>
        ) : (
          <a href="/" className={""}>
            <img src={LOGO_IMAGE_SRC} alt={LOGO_ALT_TEXT} className={styles.iconSign} />
          </a>
        )}
          {props.fields.data.item.cta && (
            <Link field={props.fields.data.item.cta.jsonValue} className={styles.ctaButton} />
            
          )}
         
          {props.fields.data.item.cta2 && (
          
            <Link field={props.fields.data.item.cta2.jsonValue} className={styles.ctaButton} />
            
          )}
          </div>
      </nav>
    </header>
  );
};
