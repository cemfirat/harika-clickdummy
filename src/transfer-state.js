export const transferState = Object.freeze({
  schemaVersion: 1,

  // UIkit-aligned theme baseline:
  // Standard UIkit -> Harika -> optional customer theme.
  uiBaselineClickdummyCommit: "bb84e431eee6085847b46a26abef29e4ec928b2b",

  // Set only after a later clickdummy UI delta has been intentionally ported
  // to production Harika and the resulting Harika commit is known.
  lastPromotion: null
});
