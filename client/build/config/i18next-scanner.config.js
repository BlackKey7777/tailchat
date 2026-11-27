const fs = require('fs-extra');
const path = require('path');
const { crc32 } = require('crc');
const esbuild = require('esbuild');

console.log('Scanning Translation in src folder...');

// Languages included in the generated public locales directory.
const lngs = ['zh-CN', 'en-US', 'ru-RU'];

module.exports = {
  input: [
    'web/**/*.{ts,tsx}',
    'shared/**/*.{ts,tsx}',
    '!src/**/*.spec.{js,jsx,ts,tsx}',
    '!web/e2e/**/*.test.{ts,tsx}',
    '!**/node_modules/**',
  ],
  output: './',
  options: {
    debug: false,
    sort: true,
    func: false,
    trans: false,
    lngs,
    defaultLng: 'zh-CN',
    resource: {
      loadPath: './src/shared/i18n/langs/{{lng}}/{{ns}}.json',
      savePath: './src/shared/i18n/langs/{{lng}}/{{ns}}.json',
      jsonIndent: 2,
      lineEnding: '\n',
      endWithEmptyTrans: true,
    },
    removeUnusedKeys: true,
    nsSeparator: false,
    keySeparator: false,
    interpolation: {
      prefix: '{{',
      suffix: '}}',
    },
  },
  transform: async function customTransform(file, enc, done) {
    'use strict';
    const parser = this.parser;
    const content = await fs.readFile(file.path, enc);

    parser.parseFuncFromString(
      content,
      { list: ['lang', 't'] },
      (key, options) => {
        options.defaultValue = key;
        const hashKey = `k${crc32(key).toString(16)}`;
        parser.set(hashKey, options);
      }
    );

    if (path.extname(file.path) === '.tsx') {
      const { code } = await esbuild.transform(content, {
        jsx: 'preserve',
        loader: 'tsx',
      });
      parser.parseTransFromString(
        code,
        { component: 'Trans', i18nKey: 'i18nKey' },
        (key, options) => {
          let sentence = options.defaultValue;
          sentence = sentence.replace(/<(\d+)>{{(\w+)}}<\/\1>/g, '{{$2}}');
          sentence = sentence.replace(/\s+/g, ' ');
          options.defaultValue = sentence;

          const hashKey = `k${crc32(key || sentence).toString(16)}`;
          parser.set(hashKey, options);
        }
      );
    }

    done();
  },
};
