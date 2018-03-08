#!/usr/bin/env node

/* eslint-disable strict */
// Jenkins version of Node dislikes features like let and const outside of strict mode
'use strict';

const argv = require('yargs').argv;
const deepAssign = require('deep-assign');
const fs = require('fs');
const path = require('path');
const svgstore = require('svgstore');

const ICONS_PATH = path.join(__dirname, '..', 'icons');

let options = {
    icons: '**/*.svg',
    dest: 'dist/',
    cwd: '../'
};

if (argv.opts) {
    options.cwd = '../../../../';
    const opts = require(`../../../../${argv.opts}`);

    // deepAssign does not handle arrays, so copy the icon array and delete it from opts before assigning the rest
    options.icons = opts.icons.slice(0);
    if (opts.projectIcons) {options.projectIcons = opts.projectIcons.slice(0);}
    delete opts.icons;
    delete opts.projectIcons;

    options = deepAssign(options, opts);

    // convenience to avoid having file extension in config
    options.icons = options.icons.map(icon => `${icon}.svg`);
    if (options.projectIcons) {options.projectIcons = options.projectIcons.map(icon => `${icon}.svg`);}

    if (!options.dest) {
        throw Error('ffe-icons was given an options object, but no destination for the generated sprite! Update your ' +
            'config file (e.g. icons.json) to include a "dest" property with a path to where you want the generated sprite.');
    }
}


const sprite = svgstore();

fs.readdirSync(ICONS_PATH)
    .filter(fileName => fileName.match(/\.svg$/))
    .filter(fileName => {
        return options.icons === '**/*.svg'
            || options.icons.includes('*.svg')
            || options.icons.includes(fileName.substring(fileName.lastIndexOf('/')));
    })
    .forEach((fileName) => {
        const iconPath = path.join(ICONS_PATH, fileName);
        const iconName = fileName.split('.svg')[0];
        sprite.add(iconName, fs.readFileSync(iconPath), 'utf-8');
    });

if (options.projectIcons) {
    options.projectIcons
        .forEach((fileName) => {
            const iconPath = path.join(fileName);
            const iconName = fileName.split('.svg')[0];
            sprite.add(iconName, fs.readFileSync(iconPath), 'utf-8');
        });
}

fs.writeFileSync(
    path.join(__dirname, options.cwd, options.dest, 'ffe-icons.svg'),
    sprite
);
