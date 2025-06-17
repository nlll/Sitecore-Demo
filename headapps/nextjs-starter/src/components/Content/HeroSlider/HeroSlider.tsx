import React from 'react';
import {
  ImageField,
  NextImage as JssImage,
  RichText,
  Link as JssLink,
  LinkField,
  Field,
} from '@sitecore-jss/sitecore-jss-nextjs';
import Carousel from 'react-multi-carousel';
import styles from './HeroSlider.module.scss';
import 'react-multi-carousel/lib/styles.css';

interface Fields {
  slides?: SlideProps[];
}

interface HeroSliderProps {
  params: { [key: string]: string };
  fields: Fields;
}

type SlideProps = {
  fields: {
    backgroundImage?: ImageField;
    heading?: Field<string>;
    link?: LinkField;
  };
};

const Slide = ({ fields }: SlideProps) => {
  const Image = () => <JssImage field={fields.backgroundImage} className={styles.image} />;

  return (
    <div className={styles.slide}>
      <div className={styles.imageContainer}>
        <Image />
      </div>
      <div className={styles.content}>
        <RichText field={fields.heading} className={styles.title} />
        {fields.link && (
          <JssLink
            field={fields.link}
            href={fields.link.value.href}
            title={fields.link.value.text}
            className={styles.link}
          />
        )}
      </div>
    </div>
  );
};

export const Default = (props: HeroSliderProps): JSX.Element => {
  JSON.stringify(props, null, 2);
  return (
    <Carousel
      className={styles.carousel}
      autoPlaySpeed={3000}
      arrows={false}
      dotListClass={styles.dotList}
      minimumTouchDrag={25}
      slidesToSlide={1}
      responsive={{
        desktop: {
          breakpoint: { max: Infinity, min: 0 },
          items: 1,
          slidesToSlide: 1,
        },
      }}
      shouldResetAutoplay
      pauseOnHover
      autoPlay
      showDots
      infinite
      ssr
    >
      {props.fields?.slides &&
        props.fields.slides?.length > 0 &&
        props.fields.slides.map((slide, index) => <Slide key={index} fields={slide.fields} />)}
    </Carousel>
  );
};
