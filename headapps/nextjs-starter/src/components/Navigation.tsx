/* eslint-disable */
import React, { useState } from 'react';
import {
  Link,
  LinkField,
  Text,
  TextField,
  useSitecoreContext,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { useSession } from "next-auth/react";
import createGraphQLClientFactory from '../lib/graphql-client-factory';
import { signOut } from "next-auth/react";

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

const hasRoleAccess = (userRoles: string[] | undefined, itemRoles: string[] | undefined): boolean => {
  // If the item has no roles, everyone can access it
  if (!itemRoles || itemRoles.length === 0) {
    return true;
  }

  // If the user has no roles but item requires roles, deny access
  if (!userRoles || userRoles.length === 0) {
    return false;
  }

  // Check if user has at least one of the required roles
  return itemRoles.some(role => userRoles.includes(role));
};

// Filter navigation items recursively based on user roles
const filterNavigationByRoles = async (items: Fields[], userRoles: string[] | undefined, isAuthenticated: boolean): Promise<Fields[]> => {
  if (!items || items.length === 0) return [];
  
  const homeQuery = process.env.SITECORE_GRAPHQL_HOME_QUERY || "/sitecore/content/demo/demo/Home";

  try {
    // Get all navigation items with their URLs and roles in one query
    const result = await createGraphQLClientFactory().request<{
      item: {
        id: string;
        name: string;
        displayName: string;
        url: {
          path: string;
        };
        allowedRoles?: {
          jsonValue: Array<{
            name: string;
            displayName: string;
          }>;
        };
        children: {
          results: Array<{
            id: string;
            name: string;
            displayName: string;
            url: {
              path: string;
            };
            allowedRoles?: {
              jsonValue: Array<{
                name: string;
                displayName: string;
              }>;
            };
            children: {
              results: Array<{
                id: string;
                name: string;
                displayName: string;
                url: {
                  path: string;
                };
                allowedRoles?: {
                  jsonValue: Array<{
                    name: string;
                    displayName: string;
                  }>;
                };
              }>;
            };
          }>;
        };
      };
    }>(`
      query GetNavigationItems($path: String!, $language: String!) {
        item(path: $path, language: $language) {
          id
          name
          displayName
          url {
            path
          }
          allowedRoles: field(name: "AllowedRoles") {
            jsonValue
          }
          children(includeTemplateIDs: ["0F6E2AA4-FAE6-4ACC-BB74-576E2E0E7055"]) {
            results {
              id
              name
              displayName
              url {
                path
              }
              allowedRoles: field(name: "AllowedRoles") {
                jsonValue
              }
              children(includeTemplateIDs: ["0F6E2AA4-FAE6-4ACC-BB74-576E2E0E7055"]) {
                results {
                  id
                  name
                  displayName
                  url {
                    path
                  }
                  allowedRoles: field(name: "AllowedRoles") {
                    jsonValue
                  }
                }
              }
            }
          }
        }
      }
    `, { path: homeQuery, language: "en" });

    console.log("Navigation items from GraphQL:", result?.item);
    
    if (result?.item) {
      // Create the home item first
      const homeItem: Fields = {
        Id: result.item.id,
        DisplayName: result.item.displayName,
        Title: { value: result.item.displayName },
        NavigationTitle: { value: result.item.name },
        Href: result.item.url?.path || "/",
        Querystring: "",
        Children: [],
        Styles: [],
        Roles: result.item.allowedRoles?.jsonValue?.map(role => role.name) || []
      };
      
      // Process child items as before
      const childItems: Fields[] = result.item.children?.results?.map(item => {
        const roles = item.allowedRoles?.jsonValue?.map(role => role.name) || [];
        const children: Fields[] = item.children?.results?.map(child => {
          const childRoles = child.allowedRoles?.jsonValue?.map(role => role.name) || [];
          
          return {
            Id: child.id,
            DisplayName: child.displayName,
            Title: { value: child.displayName },
            NavigationTitle: { value: child.name },
            Href: child.url?.path || "",
            Querystring: "",
            Children: [],
            Styles: [],
            Roles: childRoles
          };
        }) || [];
        
        return {
          Id: item.id,
          DisplayName: item.displayName,
          Title: { value: item.displayName },
          NavigationTitle: { value: item.name },
          Href: item.url?.path || "",
          Querystring: "",
          Children: children,
          Styles: [],
          Roles: roles
        };
      }) || [];

      // Create array with home item first, then filter children
      let navItems = [homeItem, ...childItems];
      
      // Filter by roles first
      navItems = navItems.filter(item => hasRoleAccess(userRoles, item.Roles));
      
      // Filter out Login item if user is authenticated
      if (isAuthenticated) {
        navItems = navItems.filter(item => !isLoginItem(item));
      }
      
      return navItems;
    }
    return [];
  } catch (error) {
    console.error("Error fetching navigation:", error);
    return [];
  }
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

const getLinkField = (props: NavigationProps): LinkField => ({
  value: {
    href: props.fields.Href,
    title: getLinkTitle(props),
    querystring: props.fields.Querystring,
  },
});

const isLoginItem = (item: Fields): boolean => {
  return item.DisplayName.toLowerCase() === 'login' || 
         item.NavigationTitle?.value?.toString().toLowerCase() === 'login' ||
         item.Title?.value?.toString().toLowerCase() === 'login';
};

const NavigationList = (props: NavigationProps) => {
  const { sitecoreContext } = useSitecoreContext();
  const { data: session } = useSession();
  const userRoles = session?.user?.roles as string[] | undefined; 
  const [active, setActive] = useState(false);
  const level = `level${props.relativeLevel - 1}`;

  let children: JSX.Element[] = [];
  if (props.fields.Children && props.fields.Children.length) {
    const filteredChildren = sitecoreContext?.pageEditing
      ? props.fields.Children
      : props.fields.Children.filter(child => hasRoleAccess(userRoles, child.Roles));
      
    children = filteredChildren.map((element: Fields, index: number) => {
      // Add position classes for each child
      const isFirst = index === 0;
      const isLast = index === filteredChildren.length - 1;
      const isEven = index % 2 === 1;
      const positionClass = `${isEven ? 'even' : 'odd'} ${isFirst ? 'first' : ''} ${isLast ? 'last' : ''}`;
      
      return (
        <NavigationList
          key={`${index}${element.Id}`}
          fields={element}
          handleClick={props.handleClick}
          relativeLevel={props.relativeLevel + 1}
          params={{ ItemPosition: index, IsEven: isEven, IsFirst: isFirst, IsLast: isLast }}
        />
      );
    });
  }

  const itemPosition = props.params?.ItemPosition || 0;
  const isFirst = props.params?.IsFirst || false;
  const isLast = props.params?.IsLast || false;
  const isEven = props.params?.IsEven || false;
  const positionClass = `item${itemPosition} ${isEven ? 'even' : 'odd'} ${isFirst ? 'first' : ''} ${isLast ? 'last' : ''}`;
  const classNameList = `${level} ${positionClass} ${props.fields.Children?.length ? 'submenu' : ''} rel-level${props.relativeLevel}`;

  return (
    <li className={`${classNameList} ${active ? 'active' : ''}`} key={props.fields.Id} tabIndex={0}>
      <div
        className={`navigation-title ${children.length ? 'child' : ''}`}
        onClick={(e) => {
          // Only toggle active state for mobile view
          if (window.innerWidth <= 768) {
            setActive(!active);
          } else {
            // Prevent click on parent items with children in desktop
            if (children.length && props.relativeLevel === 1) {
              e.preventDefault();
            }
          }
        }}
      >
        <Link
          field={getLinkField(props)}
          editable={sitecoreContext.pageEditing}
          onClick={props.handleClick}
        >
          <span>{getNavigationText(props)}</span>
        </Link>
      </div>
      {children.length > 0 ? <ul className="clearfix">{children}</ul> : null}
    </li>
  );
};

export const Default = (props: NavigationProps): JSX.Element => {
  const [isOpenMenu, openMenu] = useState(false);
  const [filteredItems, setFilteredItems] = useState<Fields[]>([]);
  const { sitecoreContext } = useSitecoreContext();
  const { data: session } = useSession();
  const userRoles = session?.user?.roles as string[] | undefined;
  const isAuthenticated = session?.user != null;

  // Add navigation-main-horizontal class to enable dropdown behavior
  const navigationClass = "navigation-main navigation-main-horizontal";
  
  const styles =
    props.params != null
      ? `${props.params.GridParameters ?? ''} ${props?.params?.Styles ?? ''}`.trimEnd()
      : '';
  const id = props.params != null ? props.params.RenderingIdentifier : null;

  // Use useEffect to handle the async filtering
  React.useEffect(() => {
    if (!Object.values(props.fields).length) {
      console.log("Returning early due to empty fields");
      return;
    }

    if (sitecoreContext?.pageEditing) {
      // In editing mode, show all items
      setFilteredItems(Object.values(props.fields).filter(element => element));
    } else {
      // Filter based on roles
      const items = Object.values(props.fields).filter(element => element);
      filterNavigationByRoles(items, userRoles, isAuthenticated)
        .then(result => {
          setFilteredItems(result);
        })
        .catch(error => {
          console.error("Error filtering navigation items:", error);
          // Fallback to unfiltered items
          setFilteredItems(items);
        });
    }
  }, [props.fields, sitecoreContext?.pageEditing, userRoles, session]);

    // Create a logout item if user is authenticated
  const handleLogout = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    signOut();
  };


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

  const list = filteredItems.map((element: Fields, key: number) => {
    // Add position classes for top-level items
    const isFirst = key === 0;
    const isLast = key === filteredItems.length - 1;
    const isEven = key % 2 === 1;
    
    return (
      <NavigationList
        key={`${key}${element.Id}`}
        fields={element}
        handleClick={(event: React.MouseEvent<HTMLElement>) => handleToggleMenu(event, false)}
        relativeLevel={1}
        params={{
          ItemPosition: key,
          IsEven: isEven,
          IsFirst: isFirst, 
          IsLast: isLast
        }}
      />
    );
  });

    if (isAuthenticated && session) {
    const logoutItem = (
      <li className={`level0 item${filteredItems.length} even last rel-level1`} key="logout" tabIndex={0}>
        <div className="navigation-title">
          <a href="#" onClick={handleLogout}>
            <span>Logout</span>
          </a>
        </div>
      </li>
    );
    list.push(logoutItem);
  }

  return (
    <div className={`component navigation ${navigationClass} ${styles}`} id={id ? id : undefined}>
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