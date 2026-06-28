<!-- DESCRIPTION: Create TanStack React Table Component
This prompt generates a robust, responsive data table component using @tanstack/react-table and Shadcn UI components. -->

<!-- AGENT: Claude 4.6 Sonnet / GPT-4 Turbo / Gemini -->

# ShadcnSpace Dashboard Pro: Data Table Architect

You are an expert in building highly responsive, advanced data tables using `@tanstack/react-table` integrated with Shadcn UI for the ShadcnSpace Dashboard Pro project.

---

## Input Variables

* **Target Component File**: `{{COMPONENT_FILE}}`
* **Target Page File**: `{{PAGE_FILE}}`
* **Table Title**: `{{TABLE_TITLE}}`
* **Data Columns Needed**: `{{COLUMNS}}`

---

## Architecture & Tech Stack Rules

1. **Separation of Concerns (IMPORTANT)**:

   * The reusable **Table Component** MUST be created inside `app/components/react-tables/...`.
   * The **Page Route** MUST be created inside `app/(dashboard-layout)/react-tables/...`.

2. **TanStack React Table**:

   * Use: `createColumnHelper`, `useReactTable`, `getCoreRowModel`, `flexRender`.
   * Strongly type data with `createColumnHelper<YourType>()`.

3. **Shadcn UI & Styling rules**:

   * Wrap table inside:

     * `<Card>`
     * `<CardHeader>`
     * `<CardTitle>`
     * `<CardContent>`
   * Use Tailwind for table styling.

4. **Colorization & Components (Badges / Progress)**:

   * ONLY use project colors:
     `chart-1`, `chart-2`, `chart-3`, `chart-4`, `chart-5`, `primary`, `secondary`, `destructive`
   * Badge rule:

     * Background = 10% opacity
     * Text = same color tone

   Example:
   `<Badge className="bg-chart-1/10 text-chart-1 hover:bg-chart-1/10 px-2 py-1 rounded-sm border-none shadow-none">Active</Badge>`

5. **TypeScript formatting**:

   * No `any`
   * Fully typed props and data

---

## 🚨 Design Consistency Rules (CRITICAL)

### 1. MUST Analyze Existing Tables First

Before generating ANY code:

* Scan: `app/components/react-tables/**`
* Identify an existing table component
* Use it as the **design reference**

### 2. Strict UI Replication (NO CREATIVITY)

You MUST:

* Copy layout structure
* Copy Tailwind classes
* Copy spacing (padding/margin)
* Copy borders, radius, shadows
* Copy typography styles

DO NOT:

* Change spacing
* Change colors
* Introduce new styles
* "Improve" UI

### 3. Pattern Matching Rules

If existing table has:

* `px-4 py-3` → reuse EXACTLY
* Hover styles → reuse EXACTLY
* Rounded headers → reuse EXACTLY
* Badge style → reuse EXACTLY

### 4. Component Reuse Priority

Priority order:

1. Existing project tables ✅
2. Shadcn defaults (ONLY if no table exists)

### 5. Hard Rule

Your output must look like:

> "This was copied from the same project"

NOT:

> "This is a newly designed table"

---

## Implementation Steps

### 1. Define Data and Column Types

* Create strict TypeScript interface from `{{COLUMNS}}`
* Generate matching mock data

---

### 2. Configure Column Helper

```tsx
const columnHelper = createColumnHelper<DataType>();

const generateColumns = () => [
  columnHelper.accessor("status", {
    header: () => <span>Status</span>,
    cell: (info) => (
      <Badge className="bg-chart-2/10 text-chart-2 hover:bg-chart-2/10 border-none rounded-full shadow-none">
        {info.getValue()}
      </Badge>
    ),
  }),
  // other columns...
];
```

---

### 3. Build the UI

⚠️ IMPORTANT:

* MUST match existing table UI exactly

* Reuse classNames from reference table

* Do NOT introduce new layout decisions

* Use:

  * `useReactTable()`
  * `getCoreRowModel()`
  * `flexRender()`

---

### 4. Update Navigation Menus (DO NOT CREATE NEW HEADINGS)

After page creation:

#### A. Vertical Sidebar

`app/(dashboard-layout)/layout/vertical/sidebar/sidebaritems.ts`

```ts
{
  id: uniqueId(),
  name: "{{TABLE_TITLE}}",
  url: "{{PAGE_FILE_ROUTE}}",
}
```

---

#### B. Horizontal Menu

`app/(dashboard-layout)/layout/horizontal/menudata.ts`

```ts
{
  id: uniqueId(),
  title: "{{TABLE_TITLE}}",
  href: "{{PAGE_FILE_ROUTE}}",
}
```

---

## Checklist

* [ ] Strict TypeScript types used
* [ ] TanStack Table properly configured
* [ ] Wrapped inside Shadcn `<Card>`
* [ ] Badge follows `bg-chart-[n]/10 text-chart-[n]`
* [ ] Matches existing table design EXACTLY
* [ ] No new styles introduced
* [ ] Sidebar updated
* [ ] Menu updated

---
