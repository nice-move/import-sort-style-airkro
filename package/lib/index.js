"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const setSeparator = { separator: true };
const isStylesModule = imported => Boolean(imported.moduleName.match(/\.(s?css|less|postcss|pcss)$/));
const isImagesModule = imported => Boolean(imported.moduleName.match(/\.(jpe?g|png|svg)$/));
const isSiblingModule = imported => Boolean(imported.moduleName.match(/^\.\//));
const isModule = (name) => (moduleName) => moduleName === name;
const oneOfModule = (modules) => (moduleName) => modules.indexOf(moduleName) > -1;
const aboutModule = (name) => (moduleName) => moduleName.indexOf(name) > -1;
exports.default = (styleApi) => {
    const { alias, and, dotSegmentCount, hasNoMember, hasOnlyDefaultMember, isAbsoluteModule, isNodeModule, isRelativeModule, member, moduleName, naturally, not, or, startsWithLowerCase, startsWithUpperCase, unicode } = styleApi;
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
            match: and(hasNoMember, isAbsoluteModule, not(isStylesModule), not(moduleName(aboutModule('moment'))))
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
            match: moduleName(oneOfModule(['react', 'vue']))
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
            match: moduleName(oneOfModule(['react-router', 'vue-router'])),
            sort: moduleName(naturally)
        },
        {
            sortNamedMembers,
            match: moduleName(aboutModule('react-router')),
            sort: moduleName(naturally)
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
            match: or(moduleName(aboutModule('react')), moduleName(aboutModule('vue'))),
            sort: moduleName(naturally)
        },
        {
            sortNamedMembers,
            match: moduleName(oneOfModule(['antd', 'ant-mobile', 'vant', 'vux']))
        },
        {
            sortNamedMembers,
            match: moduleName(oneOfModule(['axios', 'classnames', 'immutable', 'lodash', 'moment'])),
            sort: moduleName(naturally)
        },
        {
            sortNamedMembers,
            match: moduleName(aboutModule('moment'))
        },
        {
            // import foo from "bar"
            sortNamedMembers,
            match: and(isAbsoluteModule, not(isStylesModule)),
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
            match: isStylesModule
        },
        setSeparator,
        {
            // import image from "./image.jpg";
            sortNamedMembers,
            match: isImagesModule,
            sort: [dotSegmentCount, moduleName(naturally)]
        },
        setSeparator
    ];
};
