export const transferState = Object.freeze({
  schemaVersion: 1,

  // Initial UI-lab checkpoint. Changes after this commit are considered
  // clickdummy UI experiments until a later promotion records a new checkpoint.
  uiBaselineClickdummyCommit: "7ca420830f0512d9a701f1136e9cdcc0c2209754",

  // Set only after a clickdummy UI delta has been intentionally ported to
  // production Harika and the target Harika commit is known.
  lastPromotion: null
});
