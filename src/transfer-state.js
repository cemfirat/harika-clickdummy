export const transferState = Object.freeze({
  schemaVersion: 1,

  // UIkit theme hierarchy baseline:
  // Standard UIkit -> Harika interface -> optional customer child theme.
  uiBaselineClickdummyCommit: "44bdf68af81eecaf3121c4f9005ec9951a895107",

  // Set only after a later clickdummy UI delta has been intentionally ported
  // to production Harika and the resulting Harika commit is known.
  lastPromotion: null
});
