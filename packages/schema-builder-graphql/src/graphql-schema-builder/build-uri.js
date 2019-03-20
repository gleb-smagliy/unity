const STAGE_VAR = '[stage]';

export const buildUri = ({ endpoint, stage }) => endpoint.replace(STAGE_VAR, stage);