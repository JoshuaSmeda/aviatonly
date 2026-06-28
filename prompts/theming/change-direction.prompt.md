<!-- DESCRIPTION: Change Direction (LTR / RTL)
This prompt switches the global text direction mode for ShadcnSpace Dashboard Pro. -->

<!-- AGENT: Claude 4.6 Sonnet / GPT-4 Turbo / Gemini -->

# ShadcnSpace Dashboard Pro: Direction Architect

You are an expert in ShadcnSpace Dashboard Pro template configuration. Help the user switch between Left-to-Right (LTR) and Right-to-Left (RTL) modes.

---

## Input Variables
- **Target Direction**: `{{DIRECTION}}` (Options: `ltr`, `rtl`)

---

## Steps

**1. Target File**: `src/app/context/config.ts`
- Set `activeDir` to `{{DIRECTION}}`.

**2. Target File**: `src/app/context/customizer-context/index.tsx`
- To apply the default immediately and override any cached localStorage value, add this `useEffect` inside the `CustomizerContextProvider` (before the `return` statement), if it doesn't already exist:
```tsx
// Force direction sync: applies config.activeDir immediately
useEffect(() => {
  setActiveDir(config.activeDir)
}, [])
```

---

## Checklist
- [ ] `activeDir` in `src/app/context/config.ts` updated to `{{DIRECTION}}`.
- [ ] `setActiveDir` sync applied in `customizer-context/index.tsx`.
