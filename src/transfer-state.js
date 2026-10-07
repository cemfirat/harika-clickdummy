export const transferState = Object.freeze({
  schemaVersion: 1,

  // Shared-partial HTML-first UI-lab baseline. Page content remains directly
  // editable in root HTML files; global shell elements live in partials/.
  uiBaselineClickdummyCommit: "84360449ab6dc741212a63800651c75c0564e716",

  // Set only after a later clickdummy UI delta has been intentionally ported
  // to production Harika and the resulting Harika commit is known.
  lastPromotion: null
});
