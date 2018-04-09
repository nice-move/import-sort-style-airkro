import {
  IComparatorFunction,
  IMatcherFunction,
  IStyleAPI,
  IStyleItem
} from 'import-sort-style';

const setSeparator = { separator: true };

const isDataModule: IMatcherFunction = imported =>
  Boolean(
    imported.moduleName.match(/\.(json|yaml|yml|toml|tml|xml|txt|ini|md)$/)
  );

const isStyleModule: IMatcherFunction = imported =>
  Boolean(imported.moduleName.match(/\.(s?css|less|postcss|pcss)$/));

const isImageModule: IMatcherFunction = imported =>
  Boolean(imported.moduleName.match(/\.(jpe?g|png|svg)$/));

const isSiblingModule: IMatcherFunction = imported =>
  Boolean(imported.moduleName.match(/^\.\//));

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
    or,
    startsWithLowerCase,
    startsWithUpperCase,
    unicode
  } = styleApi;

  const sortNamedMembers = alias(unicode);

  const isModule = (name: string) =>
    moduleName((moduleName: string) => moduleName === name);

  const oneOfModule = (modules: string[]) =>
    moduleName((moduleName: string) => modules.indexOf(moduleName) > -1);

  const aboutModule = (name: string) =>
    and(
      moduleName((moduleName: string) => moduleName.indexOf(name) > -1),
      isAbsoluteModule
    );

  return [
    {
      // import "./foo"
      match: and(
        hasNoMember,
        isRelativeModule,
        not(isStyleModule),
        not(isDataModule),
        not(isImageModule)
      ),
      sort: [dotSegmentCount]
    },
    setSeparator,
    {
      // import "foo"
      match: and(
        hasNoMember,
        isAbsoluteModule,
        not(isStyleModule),
        not(isDataModule),
        not(isImageModule),
        not(aboutModule('moment')),
        not(aboutModule('echarts'))
      )
    },
    setSeparator,
    {
      // import fs from "fs"
      // import path from "path"
      sortNamedMembers,
      match: isNodeModule,
      sort: moduleName(naturally)
    },
    setSeparator,
    {
      // import fs from "fs-extra"
      sortNamedMembers,
      match: oneOfModule(['fs-extra', 'serialport', 'electron']),
      sort: moduleName(naturally)
    },
    setSeparator,
    {
      // Useful base library
      sortNamedMembers,
      match: or(
        oneOfModule([
          'ajv',
          'axios',
          'classnames',
          'echarts',
          'flat',
          'immutable',
          'lodash',
          'luxon',
          'md5',
          'moment',
          'qs'
        ]),
        aboutModule('lodash')
      ),
      sort: moduleName(naturally)
    },
    {
      // import "moment-duration-format"
      sortNamedMembers,
      match: or(aboutModule('moment'), aboutModule('echarts'))
    },
    setSeparator,
    {
      // import Webpack from "webpack"
      sortNamedMembers,
      match: isModule('webpack')
    },
    {
      // import HtmlWebpackPlugin from 'html-webpack-plugin'
      sortNamedMembers,
      match: aboutModule('webpack'),
      sort: moduleName(naturally)
    },
    setSeparator,
    {
      // import React from "react"
      // import Vue from "vue"
      sortNamedMembers,
      match: oneOfModule(['react', 'vue']),
      sort: moduleName(naturally)
    },
    {
      // import PropTypes from "prop-types"
      // import ReactDOM from "react-dom"
      sortNamedMembers,
      match: oneOfModule(['prop-types', 'react-dom']),
      sort: moduleName(naturally)
    },
    {
      // import {...} from "react-router"
      sortNamedMembers,
      match: oneOfModule(['react-router', 'vue-router']),
      sort: moduleName(naturally)
    },
    {
      // import {...} from "react-router-dom"
      // import {...} from "vue-router-sync"
      sortNamedMembers,
      match: or(aboutModule('react-router'), aboutModule('vue-router')),
      sort: moduleName(naturally)
    },
    {
      // import {...} from "redux"
      sortNamedMembers,
      match: oneOfModule(['redux', 'vuex']),
      sort: moduleName(naturally)
    },
    {
      // import {...} from "redux-saga"
      sortNamedMembers,
      match: or(aboutModule('redux'), aboutModule('vuex')),
      sort: moduleName(naturally)
    },
    {
      // import {...} from "react-modal"
      // import {...} from "vue-table"
      sortNamedMembers,
      match: and(
        or(aboutModule('react'), aboutModule('vue')),
        isAbsoluteModule
      ),
      sort: moduleName(naturally)
    },
    setSeparator,
    {
      // Popular UI Toolkit/Library in China
      sortNamedMembers,
      match: oneOfModule([
        'antd',
        'ant-design-pro',
        'antd-mobile',
        'element-react',
        'element-ui',
        'iview',
        'material-ui',
        'mint-ui',
        'react-uwp',
        'reactstrap',
        'semantic-ui-react',
        'vant',
        'vonic',
        'vux',
        'zent'
      ]),
      sort: moduleName(naturally)
    },
    setSeparator,
    {
      // import foo from "bar"
      sortNamedMembers,
      match: and(
        isAbsoluteModule,
        not(isStyleModule),
        not(isDataModule),
        not(isImageModule)
      ),
      sort: moduleName(naturally)
    },
    setSeparator,
    {
      // import … from "../foo";
      sortNamedMembers,
      match: and(
        isRelativeModule,
        not(isSiblingModule),
        not(isDataModule),
        not(isImageModule),
        not(isStyleModule)
      ),
      sort: [dotSegmentCount, moduleName(naturally)]
    },
    setSeparator,
    {
      // import … from "./foo";
      sortNamedMembers,
      match: and(
        isRelativeModule,
        isSiblingModule,
        not(isDataModule),
        not(isImageModule),
        not(isStyleModule)
      ),
      sort: moduleName(naturally)
    },
    setSeparator,
    {
      // import data from "./data.json";
      match: isDataModule,
      sort: [dotSegmentCount, moduleName(naturally)]
    },
    setSeparator,
    {
      // import "./style.css";
      match: isStyleModule
    },
    setSeparator,
    {
      // import image from "./image.jpg";
      match: isImageModule,
      sort: [dotSegmentCount, moduleName(naturally)]
    },
    setSeparator
  ];
};
