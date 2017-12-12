import { IComparatorFunction, IMatcherFunction, IStyleAPI, IStyleItem } from 'import-sort-style';

const setSeparator = { separator: true };

const isStylesModule: IMatcherFunction = imported =>
  Boolean(imported.moduleName.match(/\.(s?css|less|postcss)$/));

const isImagesModule: IMatcherFunction = imported =>
  Boolean(imported.moduleName.match(/\.(jpe?g|png|svg)$/));

const isSiblingModule: IMatcherFunction = imported => Boolean(imported.moduleName.match(/^\.\//));

const isModule = (name: string) => (moduleName: string) => moduleName === name;

const oneOfModule = (modules: string[]) => (moduleName: string) => modules.indexOf(moduleName) > -1;

const aboutModule = (name: string) => (moduleName: string) => moduleName.indexOf(name) > -1;

export default (styleApi: IStyleAPI): IStyleItem[] => {
  const {
    alias,
    and,
    dotSegmentCount,
    hasNoMember,
    hasOnlyDefaultMember,
    isAbsoluteModule,
    isNodeModule,
    isRelativeModule,
    member,
    moduleName,
    naturally,
    not,
    startsWithLowerCase,
    startsWithUpperCase,
    unicode
  } = styleApi;

  const sortNamedMembers = alias(unicode);
  return [
    {
      // import "./foo"
      match: and(hasNoMember, isRelativeModule, not(isStylesModule)),
      sort: [dotSegmentCount]
    },
    setSeparator,
    {
      // import "foo"
      match: and(hasNoMember, isAbsoluteModule, not(moduleName(aboutModule('moment'))))
    },
    setSeparator,
    {
      // import … from "fs";
      // import … from "path";
      sortNamedMembers,
      match: isNodeModule,
      sort: moduleName(naturally)
    },
    setSeparator,
    {
      // import Webpack from "webpack"
      sortNamedMembers,
      match: moduleName(isModule('webpack'))
    },
    {
      sortNamedMembers,
      match: moduleName(aboutModule('webpack')),
      sort: moduleName(naturally)
    },
    setSeparator,
    {
      // import React from "react"
      sortNamedMembers,
      match: moduleName(isModule('react'))
    },
    {
      sortNamedMembers,
      match: moduleName(isModule('prop-types'))
    },
    {
      sortNamedMembers,
      match: moduleName(isModule('react-dom'))
    },
    {
      sortNamedMembers,
      match: moduleName(isModule('react-router-dom'))
    },
    {
      sortNamedMembers,
      match: moduleName(isModule('redux'))
    },
    {
      sortNamedMembers,
      match: moduleName(aboutModule('redux')),
      sort: moduleName(naturally)
    },
    {
      sortNamedMembers,
      match: moduleName(aboutModule('react')),
      sort: moduleName(naturally)
    },
    {
      sortNamedMembers,
      match: moduleName(isModule('antd'))
    },
    {
      sortNamedMembers,
      match: moduleName(
        oneOfModule(['axios', 'classnames', 'immutable', 'lodash', 'moment'])
      ),
      sort: moduleName(naturally)
    },
    {
      sortNamedMembers,
      match: moduleName(aboutModule('moment'))
    },
    {
      // import foo from "bar"
      sortNamedMembers,
      match: isAbsoluteModule,
      sort: moduleName(naturally)
    },
    setSeparator,
    {
      // import … from "./foo";
      // import … from "../foo";
      sortNamedMembers,
      match: and(isRelativeModule, isSiblingModule, not(isImagesModule), not(isStylesModule)),
      sort: [dotSegmentCount, moduleName(naturally)]
    },
    setSeparator,
    {
      // import … from "./foo";
      // import … from "../foo";
      sortNamedMembers,
      match: and(isRelativeModule, not(isSiblingModule), not(isImagesModule), not(isStylesModule)),
      sort: [dotSegmentCount, moduleName(naturally)]
    },
    setSeparator,
    {
      // import "./style.css";
      sortNamedMembers,
      match: isStylesModule,
      sort: [dotSegmentCount]
    },
    setSeparator,
    {
      // import "./image.jpg";
      sortNamedMembers,
      match: isImagesModule,
      sort: [dotSegmentCount, moduleName(naturally)]
    },
    setSeparator
  ];
};
