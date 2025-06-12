import React from 'react';
import {
  Field,
  ImageField,
  NextImage as JssImage,
  LinkField,
} from '@sitecore-jss/sitecore-jss-nextjs';

interface Fields {
  Slides: ImageField & { metadata?: { [key: string]: unknown } };
  ImageCaption: Field<string>;
  TargetUrl: LinkField;
}

interface HeroSliderProps {
  params: { [key: string]: string };
  fields: Fields;
}

export const Default = (props: HeroSliderProps): JSX.Element => {
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8 slider-pc">
          <JssImage field={props.fields.Slides} />
        </div>
      </div>
    </div>
  );
};
