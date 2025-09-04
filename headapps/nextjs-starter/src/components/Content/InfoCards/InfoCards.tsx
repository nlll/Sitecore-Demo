/* eslint-disable*/
import React from 'react';
import {
  ComponentParams,
  ComponentRendering,
  Field,
  ImageField,
  Text,
  Image,
  LinkField,
  Link as JssLink,
} from '@sitecore-jss/sitecore-jss-nextjs';
import styles from './InfoCards.module.scss';

interface InfoCardsProps {
  rendering: ComponentRendering & { params: ComponentParams };
  params: ComponentParams;
  fields: {
    infoCards: InfoCardProps[];
  };
}

type InfoCardProps = {
  fields: {
    heading: Field<string>;
    description: Field<string>;
    image: ImageField;
    link: LinkField;
  };
};

const InfoCard = ({ fields }: InfoCardProps) => {
   console.log('Promos', fields);
  return (
    <div className={styles.infoCard}>
      <Image field={fields.image} className={styles.image} />
      <Text field={fields.heading} className={styles.title} tag="h3" />
      <Text field={fields.description} className={styles.description} tag="p" />
        {fields.link && (
          <JssLink
            field={fields.link}
            href={fields.link.value.href}
            title={fields.link.value.text}
            className={styles.link}
          />
        )}
      {/* <Link field={fields.link} className={styles.link}></Link> */}
    </div>
  );
};

export const Default = (props: InfoCardsProps): JSX.Element => {
  return (
    <div className={styles.root}>
      <div className={styles.cardList}>
        {props.fields.infoCards &&
          props.fields.infoCards.length > 0 &&
          props.fields.infoCards.map((card, index) => (
            <InfoCard key={index} fields={card.fields} />
          ))}
      </div>
    </div>
  );
};
