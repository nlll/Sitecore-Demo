import React, { useState } from 'react';
import {
  ComponentParams,
  ComponentRendering,
  ImageField,
  Link,
  LinkField,
} from '@sitecore-jss/sitecore-jss-nextjs';
import styles from './Header.module.scss';
import cx from 'classnames';

type ResultsFieldLink = {
  field: {
    link: LinkField;
  };
};

interface Fields {
  data: {
    datasource: {
      logoLink: { jsonValue: ImageField };
      cta: { jsonValue: LinkField };
      currentLocation?: string;
      children: {
        results: Array<ResultsFieldLink>;
      };
    };
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
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={cx('container', styles.root)}>
      <nav className={styles.nav}>
        {props.fields.data.datasource?.logoLink ? (
          <a href="/" className={styles.logoLink}>
            <img
              src={props.fields.data.datasource.logoLink?.jsonValue.value?.src}
              alt={LOGO_ALT_TEXT}
              className={styles.logo}
            />
          </a>
        ) : (
          <a href="/" className={styles.logoLink}>
            <img src={LOGO_IMAGE_SRC} alt={LOGO_ALT_TEXT} className={styles.logo} />
          </a>
        )}
        <div className={cx(styles.primaryNav, { [styles.menuOpen]: menuOpen })}>
          <ul className={styles.primaryNavList}>
            {props.fields.data.datasource &&
              props.fields.data.datasource.children.results.map((nav, index) => (
                <li key={index} className={styles.primaryNavItem}>
                  <Link field={nav.field.link} className={styles.primaryNavLink} />
                </li>
              ))}
          </ul>
          {props.fields.data.datasource?.cta && (
            <Link field={props.fields.data.datasource.cta.jsonValue} className={styles.ctaButton} />
          )}
        </div>
        <button
          className={cx(styles.menuToggle, {
            [styles.menuOpen]: menuOpen,
          })}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={styles.burgerIcon}></span>
          <span className={styles.burgerIcon}></span>
          <span className={styles.burgerIcon}></span>
        </button>
      </nav>
    </header>
  );
};
