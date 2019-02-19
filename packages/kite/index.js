// @flow
require('@babel/register');
const { getRefPrecursor } = require('./src/publish/ref/index');
const { prepare } = require('./src/publish/prepare');
const { getDocumentMeta, stringifyJob, unstringifyJob } = require('./src/publish/job/utils');
const { getCss, getHtml } = require('./src/publish/pdf/manifest');
const { makePdf } = require('./src/publish/pdf/make');
const { createCommand } = require('./src/publish/cli');
const { createJob, createSpec, createPrecursor } = require('./src/publish/job');
const { epigraph } = require('./src/publish/frontmatter');

module.exports = {
  getRefPrecursor,
  prepare,
  createCommand,
  createJob,
  createSpec,
  createPrecursor,
  getDocumentMeta,
  stringifyJob,
  unstringifyJob,
  epigraph,
  pdf: {
    make: makePdf,
    getCss,
    getHtml,
  },
};
