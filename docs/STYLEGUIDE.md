# Style Guide

Prefer clear boundaries and ordinary TypeScript over decorative abstraction. Follow nearby code and
keep unrelated refactors out of feature changes.

## Runtime Boundaries

- Browser-only code belongs in `src/`.
- Worker-only code belongs in `server/` or `routes/`.
- `types/` is reserved for contracts consumed by both browser and Worker code. Do not place a local
  component type, route-only schema, or server-only model there.
- Reusable platform-neutral packages must not import application frameworks or bindings.

## Helpers and Abstractions

Create a helper only when it:

- isolates an external boundary such as Pi, an HTTP provider, auth, or PostgreSQL
- gives a real domain operation a useful name
- removes repeated logic in multiple call sites
- makes required cleanup or error translation consistent

Do not create a helper that only renames one expression or has one call site without a boundary reason.
Keep feature-owned logic close to its route or component.

## Errors and Fallbacks

- A `try/catch` must perform explicit recovery, error translation, or resource cleanup.
- Do not catch an error only to return `null`, an empty collection, or a false success state.
- Do not add fallback secrets, bindings, permissions, identifiers, or model configuration.
- Display fallbacks are acceptable when they are deliberate product behavior.
- Streaming code must close or cancel resources on both success and failure.

## Validation and Types

- Validate untrusted input once at the transport boundary with a named schema.
- Pass parsed values inward instead of repeating `typeof` checks or casts.
- Avoid `any`; use `unknown` only at an external boundary and narrow it promptly.
- Let TypeScript infer local values. Add explicit types to exported APIs and serialized contracts.

## Naming

- `PascalCase`: types, classes, and React components
- `camelCase`: functions, variables, methods, and properties
- `UPPER_SNAKE_CASE`: shared policy constants only
- predicates start with `is`, `has`, or `can`
- avoid vague names such as `data`, `info`, `obj`, `temp`, or generic `utils`

## Styling

- Use semantic Tailwind utilities backed by `src/styles/tokens.css`.
- Do not add raw color utilities or bare color literals to application components.
- Prefer Tailwind utilities over inline layout styles.
- Do not change global tokens or fonts as part of a feature-local UI change.

## Review Checklist

- Is each new file owned by the correct runtime boundary?
- Does every helper or abstraction have a real reason to exist?
- Does each `catch` recover, translate, or clean up something specific?
- Is untrusted input validated exactly once?
- Does the UI consume existing semantic tokens and real runtime state?
- Does `pnpm build` stay within the Worker upload limit?
