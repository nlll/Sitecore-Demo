/* eslint-disable*/
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

const LOGO_IMAGE_SRC = '/DairyQueen_Logo.png';
const LOGO_ALT_TEXT = 'Dairy Queen';


export const Default = (props: CustomHeaderProps): JSX.Element => {
  const { sitecoreContext } = useSitecoreContext();

  return (
    <header  className={cx('container', styles.root)}>
      <div className={styles.languageContainer}>
         <span className={styles.iconSignLanguage}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="icon-size"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
            />
          </svg>
        </span>
         <span className={styles.languageText}>ENGLISH [US]</span>
      </div>
      <nav className={styles.nav}>  
        <div className={cx(styles.primaryNav)}>
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
