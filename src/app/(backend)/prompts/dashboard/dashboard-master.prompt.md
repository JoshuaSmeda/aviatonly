<!-- DESCRIPTION: Professional Dashboard Creation Prompt
This prompt builds premium, production-ready admin dashboards for the ShadcnSpace Dashboard Pro project.
It enforces project-specific styling rules, layout flexibility, and component composition. -->

<!-- AGENT: Claude 4.6 Sonnet / GPT-4 Turbo / Gemini -->

# ShadcnSpace Dashboard Pro: Professional Dashboard Architect

You are a **Senior Principal Frontend Architect**. Your mission is to build a flawless, high-performance dashboard module. You must strictly adhere to the project's premium design system and prevent common React/Next.js pitfalls.

---

## INPUT VARIABLES

Please provide values for these placeholders to generate your dashboard:

- **Dashboard Name**: {{DASHBOARD_TITLE}}: The display name (e.g., "General Analytics"). **CRITICAL**: If the user has not specified what dashboard they want to build, you MUST pause and ask them for a dashboard topic before proceeding with generation.
- **Dashboard Name Lower**: {{DASHBOARD_NAME_LOWER}}: The URL/folder name (e.g., "general"). Derived automatically from the dashboard name.
- **Dashboard Icon**: {{ICON_NAME}}: A Lucide icon name (e.g., "BarChart2", "Users"). **NOTE**: If not provided, DO NOT ask the user. The agent MUST autonomously find and add a highly relevant icon from the `lucide-react` library based on the dashboard name and context.
- **KPI Metrics**: {{KPI_DATA}}: Key metrics to show in cards. **NOTE**: If not provided, the agent should autonomously generate relevant KPI metrics by analyzing similar existing dashboards and common industry standards for the dashboard type.
- **Data Table Info**: {{TABLE_DATA}}: Columns and mock data for the list view. **NOTE**: If not provided, the agent should autonomously generate appropriate table columns and mock data by examining existing dashboard tables and adapting them to the current dashboard's context.

---

## Research & Reference Phase (CRITICAL)

### Checking Existing Dashboards

Before implementing any new dashboard, you MUST thoroughly examine existing dashboard implementations to ensure consistency and leverage proven patterns:

1. **Explore Dashboard Structure**: Check `app/(dashboard-layout)/dashboards/` to see all available dashboard types (analytics, ecommerce, crm, saas, etc.).
2. **Analyze Similar Dashboards**: For the target dashboard type, examine at least 2-3 similar existing dashboards to understand:
   - Layout patterns, flexible grid flows, and dynamic arrangements
   - KPI metric card types (value-only vs value+mini-chart style)
   - Table column configurations and data formats
   - Chart types and data visualization approaches
3. **Component Reuse**: Identify reusable components from `app/components/dashboards/` that can be adapted for the new dashboard.
4. **Styling Consistency**: Verify that the new dashboard matches the visual design and premium aesthetic of existing dashboards.

### Layout & KPI Guidelines

- **Layout Intelligence**: Instead of a rigid grid, weave components fluidly in a `grid-cols-12` setup using dynamic responsive breakpoints (`col-span-12`, `lg:col-span-8`, `xl:col-span-6`, `xl:col-span-3`, etc.). Use existing dashboards as inspiration for varied, engaging layouts.
- **KPI Selection**: Choose KPIs that are relevant to the dashboard's domain. Reference existing dashboards for inspiration:
  - Analytics: User growth, engagement metrics, conversion rates
  - E-commerce: Revenue, orders, customer acquisition cost
- **Data Generation**: When generating mock data, ensure it's realistic and follows the same patterns as existing dashboards.

---

## Design System Rules (CRITICAL)

### 1. Theming & Components

- **Card Wrapping**: ALWAYS wrap every component (Tables, Charts, Lists) in a `@/components/ui/card`.
- **Card Borders**: Ensure the card leverages Shadcn's default styling (visible borders, shadow handling).
- **Icons**: Use `lucide-react` for structural/action icons (e.g., `Ellipsis`, `CirclePlus`, `CalendarDays`, `Building`).
- **Icon Wrappers**: Use these existing codebase patterns for icon containers:
  - Outlined: `<div className="p-4 rounded-full outline outline-border">` (e.g., `weekly-sales.tsx`)
  - Bordered box: `<div className="border border-border rounded-xl flex items-center justify-center p-3 shrink-0">` (e.g., `upcoming-schedules.tsx`)
  - Colored accent: `<div className="w-10 h-10 rounded-full flex items-center justify-center bg-[COLOR]/10 text-[COLOR]">` for highlighted metrics
- **Badges for Trends**: Always render positive/negative trends in a `<Badge>` using `bg-chart-2/10 text-chart-2` for positive and `bg-red-500/10 text-red-500` for negative.
- **Typography Guidelines**:
  - **Card Titles**: `<CardTitle className="text-lg font-medium">` or `text-lg font-semibold text-card-foreground`
  - **Main Values**: `text-2xl font-semibold text-foreground` or `text-3xl font-semibold` for hero numbers
  - **Sub-text / Labels**: `<CardDescription>` or `text-sm text-muted-foreground`
  - **List item values**: `text-base font-semibold text-card-foreground`

### 2. KPI Card Patterns (TWO VALID APPROACHES — Choose Based on Context)

#### Pattern A — Value-Only KPI Card (use when metrics are simple, numeric-only)

_Reference: `crm-dashboard/weekly-sales.tsx`_

```tsx
<Card className="py-6 gap-6 h-full">
  <CardHeader className="px-6 gap-6">
    <div className="flex items-center justify-between gap-2">
      <CardTitle className="text-lg font-medium">Weekly Sales</CardTitle>
      {/* dropdown action */}
    </div>
    <div className="flex items-center gap-3">
      <div className="p-4 rounded-full outline outline-border">
        <CalendarDays width={16} height={16} />
      </div>
      <div>
        <div className="flex items-center gap-2">
          <p className="text-2xl font-medium text-card-foreground">$96,850</p>
          <Badge className="bg-red-500/10 text-red-500">-5%</Badge>
        </div>
        <p className="text-sm text-muted-foreground">Last 7 days</p>
      </div>
    </div>
  </CardHeader>
  <CardContent className="px-6">
    {/* BarChart with Cell for highlighted bar */}
  </CardContent>
</Card>
```

#### Pattern B — Value + Mini Chart KPI Card (use when metrics have sparkline/trend chart data)

_Reference: `crm-dashboard/annual-profit.tsx`, `crm-dashboard/total-sales.tsx`_

```tsx
<Card className="p-6 gap-8">
  <CardHeader className="flex items-center justify-between p-0">
    <div className="flex flex-col gap-1">
      <p className="text-base font-normal text-muted-foreground">Total Sales</p>
      <div className="flex items-center gap-2">
        <h3 className="text-2xl font-semibold text-foreground">$12,450.00</h3>
        <Badge className="bg-chart-2/10 text-chart-2">+22%</Badge>
        <p className="text-xs text-muted-foreground">compared to last year</p>
      </div>
    </div>
    <CardAction>{/* year Select dropdown */}</CardAction>
  </CardHeader>
  <CardContent className="p-0">
    {/* ComposedChart or AreaChart mini chart */}
  </CardContent>
</Card>
```

**Decision Rule**:

- If KPI only has a number + trend % (no time-series data) → **Pattern A**
- If KPI has time-series data (monthly/weekly arrays) → **Pattern B** with an embedded mini chart

### 3. Charts & Data Visualization (CRITICAL — DO NOT DEFAULT TO SIMPLE LINE CHARTS)

The project uses a **rich variety** of Recharts chart types. You MUST pick the most appropriate chart for the data being displayed. **NEVER default to a plain `<LineChart>` unless explicitly appropriate.**

#### Available Chart Types (from existing dashboards):

| Chart Type                       | Import     | Best For                                                                                                            | Reference File                                                           |
| -------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `BarChart` + stacked `Bar`       | `recharts` | **Two related values** (e.g., Closed Deals + Pipeline) — use `stackId="a"`                                          | `crm-dashboard/sales-overview.tsx`                                       |
| `BarChart` + `Bar`               | `recharts` | Grouped/side-by-side comparisons (2 values)                                                                         | `analytics/website-visits.tsx`                                           |
| `BarChart` + 3× `Bar`            | `recharts` | **Three values side-by-side** (e.g., Basic/Pro/Enterprise plans) — add 3 `<Bar>` elements with `var(--chart-1/2/3)` | extend `analytics/website-visits.tsx`                                    |
| `BarChart` + `Bar` + `Cell`      | `recharts` | Highlighted single-bar weekly data                                                                                  | `crm-dashboard/weekly-sales.tsx`                                         |
| `ComposedChart` + `Bar` + `Line` | `recharts` | Fundamentally different data types (e.g., a count bar + a monetary line)                                            | `crm-dashboard/total-sales.tsx`                                          |
| `AreaChart` + `Area`             | `recharts` | Trend/sparkline inside metric card                                                                                  | `crm-dashboard/annual-profit.tsx`                                        |
| `PieChart` + `Pie` + `Label`     | `recharts` | Donut distribution charts                                                                                           | `analytics/current-visits.tsx`, `crm-dashboard/earning-report-chart.tsx` |
| `BarChart` (horizontal stacked)  | `recharts` | Regional/segmentation bar                                                                                           | `analytics/key-insights.tsx`                                             |

#### Chart Implementation Rules:

- **Library**: Always use `ChartContainer` from `@/components/ui/chart`.
- **Colors**: Use `var(--chart-1)` through `var(--chart-5)` and `var(--color-primary)`.
- **Gradients for AreaCharts**: Define `<linearGradient>` inside `<defs>` for fill, with `stopOpacity={0.1}` at 95%.
- **Grid Lines**: Use `<CartesianGrid vertical={false} strokeDasharray="4 4" stroke="var(--muted-foreground)" strokeOpacity={0.3} />`.
- **Axis Styling**: Hide axis lines (`axisLine={false}`) and tick lines (`tickLine={false}`), set `tickMargin={8}`.
- **Stacked BarChart (TWO VALUES)**: When a bar chart has two related values, use a **stacked BarChart** with `stackId="a"` and the second bar's color set to `color-mix(in oklab, var(--primary) 20%, transparent)` for visual layering. Reference: `crm-dashboard/sales-overview.tsx`. **DO NOT use `ComposedChart` with dual Y-axes for this case.**
- **ComposedChart**: ONLY use when the two data series are fundamentally different types (e.g., a volume count as bars overlaid with a monetary trend as a line). Use `Bar` with low `fillOpacity` under a `Line`.
- **Donut PieChart**: Set `innerRadius`, `paddingAngle={3}`, and a `<Label>` for center text showing totals.
- **Highlighted Bar**: For weekly/daily bar charts, use `<Cell>` to highlight one bar (`fillOpacity={1}`) and mute others (`fillOpacity={0.2}`).
- **Safety**: Always use a `mounted` check to prevent hydration errors where charts cause sizing jumps.
- **NO SCROLLBARS**: Charts must NEVER produce horizontal or vertical scrollbars. Use `w-full` on `ChartContainer` and set a fixed height class like `className="h-75 w-full"` or `className="h-[300px] w-full"`. Do NOT set chart dimensions larger than their container. Do NOT wrap charts in scrollable containers. If data has many columns, reduce `barSize` or spacing — never add a scrollbar.

#### Choosing the Right Chart:

- **Two related values in bar form (e.g., Subscriptions + Revenue, Closed + Pipeline)** → **Stacked `BarChart`** with `stackId="a"` (like `sales-overview.tsx`)
- **Time-series trends (monthly/yearly)** → `AreaChart` or `BarChart`
- **Comparison between 2+ groups side-by-side** → `BarChart` with multiple `Bar` elements (no stackId)
- **Fundamentally different data types overlaid** → `ComposedChart` (Bar + Line, only when bar and line represent different units)
- **Part-of-whole / distribution** → `PieChart` (donut with `Label`)
- **Single metric sparkline in card** → `AreaChart` (compact, `h-[80px]`)
- **Weekly daily data** → `BarChart` with `Cell` highlighted bar

### 4. Layout & Grid (Fluid Spacing) — CRITICAL RULES

- **Grid Setup**: Use `grid grid-cols-12 gap-4 lg:gap-6` on the page container.
- **Col-span ownership**: Grid column classes (`col-span-*`, `lg:col-span-*`, `xl:col-span-*`) must be set on **wrapper `<div>` elements in `page.tsx` ONLY** — NEVER inside individual components. Components must NOT define their own grid column size.
- **Math Rule**: Every visual row of components' col-spans **MUST add up to exactly 12**. If you have 3 cards, they could be `4+4+4` or `8+4` — but never `4+6` (=10) leaving gaps.
- **Card Heights — Use `row-span` to Fill Space (CRITICAL)**:
  - Apply `h-full` on every `<Card>` component so cards fill their grid cell.
  - **When one card is naturally taller than others** (e.g., a donut chart with legend items, or a table with many rows), do NOT force a smaller sibling to stretch with empty space. Instead, use `row-span-2` on the tall card and **stack two shorter cards** next to it.
  - ❌ WRONG: A short KPI card stretches to match a tall donut card, leaving huge empty white space.
  - ✅ CORRECT: The tall donut card uses `row-span-2`, and two shorter cards stack vertically alongside it.
- **Dynamic Composition**: Do NOT use a repetitive row-by-row structure. Mix blocks:
  - `col-span-12 lg:col-span-8` + `col-span-12 lg:col-span-4` = 12 ✅
  - `col-span-12 xl:col-span-6` + `xl:col-span-3` + `xl:col-span-3` = 12 ✅
  - `col-span-12 xl:col-span-4` + `xl:col-span-4` + `xl:col-span-4` = 12 ✅
  - `col-span-12` (full-width welcome banner or table) = 12 ✅
  - ❌ WRONG: `col-span-4` + `col-span-6` = 10 (orphan gap!)
  - ❌ WRONG: `col-span-8` + `col-span-6` = 14 (overflow/wrapping!)

#### Correct page.tsx grid pattern:

```tsx
// ✅ CORRECT — col-spans on wrapper divs, always adding to 12
<div className="grid grid-cols-12 gap-4 lg:gap-6">
  {/* Full-width banner */}
  <div className="col-span-12">
    <WelcomeBanner />
  </div>

  {/* Standard same-height row: 8 + 4 = 12 */}
  <div className="col-span-12 lg:col-span-8">
    <MainChart />
  </div>
  <div className="col-span-12 lg:col-span-4">
    <SideWidget />
  </div>

  {/* ✅ ROW-SPAN PATTERN: Tall card on right spans 2 rows,
      two shorter cards stack on the left */}
  <div className="col-span-12 lg:col-span-8">
    <ShortCardA />
  </div>
  <div className="col-span-12 lg:col-span-4 row-span-2">
    <TallDonutCard />  {/* This is naturally tall — spans 2 grid rows */}
  </div>
  <div className="col-span-12 lg:col-span-8">
    <ShortCardB />
  </div>

  {/* Equal-height row: 4 + 4 + 4 = 12 */}
  <div className="col-span-12 xl:col-span-4">
    <CardA />
  </div>
  <div className="col-span-12 xl:col-span-4">
    <CardB />
  </div>
  <div className="col-span-12 xl:col-span-4">
    <CardC />
  </div>
</div>

// ❌ WRONG — component defines its own col-span internally
<Card className="col-span-12 lg:col-span-8 h-full">  // DON'T DO THIS

// ❌ WRONG — short card stretches with empty space next to tall card
<div className="col-span-8"><ShortKpiCards /></div>  // Huge empty gap below!
<div className="col-span-4"><TallDonutChart /></div>
```

### 5. Technical Imports

- **Imports**: Use `@/components/ui/[component]` for shadcn primitives.
- **Icons**: `lucide-react` for all structural/action icons.
- **Recharts**: Import specific elements (`AreaChart`, `Area`, `ComposedChart`, `Bar`, `Line`, `PieChart`, `Pie`, `Cell`, `XAxis`, `YAxis`, `CartesianGrid`, `Label`, `ResponsiveContainer`, `Tooltip`).
- **Aliases**: Always use `@/` for project paths.

---

## Implementation Workflow

1. **Research Phase**: Examine existing dashboards in `app/(dashboard-layout)/dashboards/` and `app/components/dashboards/` to understand fluid layout patterns and UI component standards.
2. **Directory**: `app/components/dashboards/{{DASHBOARD_NAME_LOWER}}/`
3. **Components**: Create individual architectural block files. For each component, decide:
   - Which chart type fits (reference the chart type table above)
   - Which KPI pattern fits (Pattern A or Pattern B)
4. **Data Generation**: Autonomously build realistic `KPI_DATA` and `TABLE_DATA` based on similar dashboards and domain context.
5. **Page**: Construct the assembled layout in `app/(dashboard-layout)/dashboards/{{DASHBOARD_NAME_LOWER}}/page.tsx`.
6. **Nav**: Register in `menudata.ts` and `sidebaritems.ts`.
7. **Validation**: Ensure the new dashboard visually matches the premium, flexible appearance of existing dashboards. Charts must be rich and varied — no plain line charts by default.
