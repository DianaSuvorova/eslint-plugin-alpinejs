import noRawDomAccess from './rules/no-raw-dom-access';
import noUnusedXrefs from './rules/no-unused-xrefs';
import preferTemplateXif from './rules/prefer-template-x-if';

export const rules = {
  'no-raw-dom-access': noRawDomAccess,
  'no-unused-xrefs': noUnusedXrefs,
  'prefer-template-x-if': preferTemplateXif,
};
