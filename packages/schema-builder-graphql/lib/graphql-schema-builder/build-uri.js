"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildUri = void 0;
const STAGE_VAR = '[stage]';

const buildUri = ({
  endpoint,
  stage
}) => endpoint.replace(STAGE_VAR, stage);

exports.buildUri = buildUri;