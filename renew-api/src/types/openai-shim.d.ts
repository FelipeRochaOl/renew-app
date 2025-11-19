// Temporary shim to satisfy TS Server in some editor setups.
// The project compiles and openai includes its own types; this avoids TS2307 in LS.
declare module "openai";
