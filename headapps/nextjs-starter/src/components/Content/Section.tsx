import React from 'react';
import { Field, Text, Placeholder } from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentParams, ComponentRendering } from '@sitecore-jss/sitecore-jss-nextjs';

interface Fields {
  Heading: Field<string>;
}

interface SectionProps {
  rendering: ComponentRendering & { params: ComponentParams };
  fields: Fields;
  params: ComponentParams;
}

export const Default = (props: SectionProps): JSX.Element => {
  return (
    <div className="container">
      <Text field={props.fields.Heading} tag="h3" className="mt-100 mb-50" />
      <Placeholder name="headless-section" rendering={props.rendering} />
    </div>
  );
};
