import React, { useState } from 'react';
import {
  Link,
  LinkField,
  Text,
  TextField,
  useSitecoreContext,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { useSession } from "next-auth/react";

interface Fields {
  Id: string;
  DisplayName: string;
  Title: TextField;
  NavigationTitle: TextField;
  Href: string;
  Querystring: string;
  Children: Array<Fields>;
  Styles: string[];
  Roles?: string[]; // Added Roles field to store role requirements
}

type NavigationProps = {
  params?: { [key: string]: string };
  fields: Fields;
  handleClick: (event?: React.MouseEvent<HTMLElement>) => void;
  relativeLevel: number;
};

// Check if a user has access to a navigation item based on roles
const hasRoleAccess = (userRoles: string[] | undefined, itemRoles: string[] | undefined): boolean => {
  // If no roles defined for the item, everyone can access it
  // Log the roles for debugging
  console.log('User roles:', userRoles);
  console.log('Item roles:', itemRoles);

  if (!itemRoles || itemRoles.length === 0) {
    return true;
  }
  
  // If user doesn't have roles but item requires them
  if (!userRoles || userRoles.length === 0) {
    return false;
  }
  
  // Check if user has at least one of the required roles
  return itemRoles.some(role => userRoles.includes(role));
};

// Filter navigation items recursively based on user roles
const filterNavigationByRoles = (items: Fields[], userRoles: string[] | undefined): Fields[] => {
  if (!items || items.length === 0) return [];
  
  console.log(items);

  return items
    .filter(item => hasRoleAccess(userRoles, item.Roles))
    .map(item => ({
      ...item,
      Children: item.Children ? filterNavigationByRoles(item.Children, userRoles) : [],
    }));
};

const getNavigationText = function (props: NavigationProps): JSX.Element | string {
  let text;

  if (props.fields.NavigationTitle) {
    text = <Text field={props.fields.NavigationTitle} />;
  } else if (props.fields.Title) {
    text = <Text field={props.fields.Title} />;
  } else {
    text = props.fields.DisplayName;
  }

  return text;
};

const getLinkField = (props: NavigationProps): LinkField => ({
  value: {
    href: props.fields.Href,
    title: getLinkTitle(props),
    querystring: props.fields.Querystring,
  },
});

export const Default = (props: NavigationProps): JSX.Element => {
  const [isOpenMenu, openMenu] = useState(false);
  const { sitecoreContext } = useSitecoreContext();
  const { data: session } = useSession();
  const userRoles = session?.user?.roles as string[] | undefined;
  
  const styles =
    props.params != null
      ? `${props.params.GridParameters ?? ''} ${props?.params?.Styles ?? ''}`.trimEnd()
      : '';
  const id = props.params != null ? props.params.RenderingIdentifier : null;

  if (!Object.values(props.fields).length) {
    return (
      <div className={`component navigation ${styles}`} id={id ? id : undefined}>
        <div className="component-content">[Navigation]</div>
      </div>
    );
  }

  const handleToggleMenu = (event?: React.MouseEvent<HTMLElement>, flag?: boolean): void => {
    if (event && sitecoreContext?.pageEditing) {
      event.preventDefault();
    }

    if (flag !== undefined) {
      return openMenu(flag);
    }

    openMenu(!isOpenMenu);
  };

  // Filter navigation items based on user roles
  // In editing mode, show all items regardless of roles
  const filteredItems = sitecoreContext?.pageEditing 
    ? Object.values(props.fields).filter(element => element)
    : filterNavigationByRoles(
        Object.values(props.fields).filter(element => element),
        userRoles
      );

  const list = filteredItems.map((element: Fields, key: number) => (
    <NavigationList
      key={`${key}${element.Id}`}
      fields={element}
      handleClick={(event: React.MouseEvent<HTMLElement>) => handleToggleMenu(event, false)}
      relativeLevel={1}
    />
  ));

  return (
    <div className={`component navigation ${styles}`} id={id ? id : undefined}>
      <label className="menu-mobile-navigate-wrapper">
        <input
          type="checkbox"
          className="menu-mobile-navigate"
          checked={isOpenMenu}
          onChange={() => handleToggleMenu()}
        />
        <div className="menu-humburger" />
        <div className="component-content">
          <nav>
            <ul className="clearfix">{list}</ul>
          </nav>
        </div>
      </label>
    </div>
  );
};

const NavigationList = (props: NavigationProps) => {
  const { sitecoreContext } = useSitecoreContext();
  const { data: session } = useSession();
  const userRoles = session?.user?.roles as string[] | undefined;
  
  const [active, setActive] = useState(false);
  const classNameList = `${props?.fields?.Styles.concat('rel-level' + props.relativeLevel).join(
    ' '
  )}`;

  let children: JSX.Element[] = [];
  if (props.fields.Children && props.fields.Children.length) {
    // Filter children based on user roles in normal viewing mode
    const filteredChildren = sitecoreContext?.pageEditing
      ? props.fields.Children
      : filterNavigationByRoles(props.fields.Children, userRoles);
      
    children = filteredChildren.map((element: Fields, index: number) => (
      <NavigationList
        key={`${index}${element.Id}`}
        fields={element}
        handleClick={props.handleClick}
        relativeLevel={props.relativeLevel + 1}
      />
    ));
  }

  return (
    <li className={`${classNameList} ${active ? 'active' : ''}`} key={props.fields.Id} tabIndex={0}>
      <div
        className={`navigation-title ${children.length ? 'child' : ''}`}
        onClick={() => setActive(() => !active)}
      >
        <Link
          field={getLinkField(props)}
          editable={sitecoreContext.pageEditing}
          onClick={props.handleClick}
        >
          {getNavigationText(props)}
        </Link>
      </div>
      {children.length > 0 ? <ul className="clearfix">{children}</ul> : null}
    </li>
  );
};

const getLinkTitle = (props: NavigationProps): string | undefined => {
  let title;
  if (props.fields.NavigationTitle?.value) {
    title = props.fields.NavigationTitle.value.toString();
  } else if (props.fields.Title?.value) {
    title = props.fields.Title.value.toString();
  } else {
    title = props.fields.DisplayName;
  }

  return title;
};