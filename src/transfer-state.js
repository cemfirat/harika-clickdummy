export const transferState = Object.freeze({
  schemaVersion: 1,

  // HTML-first UI-lab baseline. Each Harika area is now directly editable
  // as a root HTML file; JavaScript is behavior-only.
  uiBaselineClickdummyCommit: "117621532bac10e9937b4c70a6e2e79517ef535e",

  // Set only after a later clickdummy UI delta has been intentionally ported
  // to production Harika and the resulting Harika commit is known.
  lastPromotion: null
});
