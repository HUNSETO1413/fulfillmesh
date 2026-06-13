// Module-resolution hook used only by the test suite.
//
// `src/lib/api.ts` imports the bare specifier "next/server", which Next's own
// bundler resolves but Node's plain ESM loader does not (the next package ships
// no "exports" map, so a file extension is required: "next/server.js"). This
// hook rewrites that one specifier so the real api.ts can be imported and
// unit-tested without spinning up Next or a bundler.

export async function resolve(specifier, context, nextResolve) {
  if (specifier === "next/server") {
    return nextResolve("next/server.js", context);
  }
  return nextResolve(specifier, context);
}
