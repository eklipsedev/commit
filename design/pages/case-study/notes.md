# Case study template

Structured fields on the `project` document (Case study group):

1. **Hero media** — image/GIF **or** Mux video (muted looping background)
2. **Project name** (h5) + **type** (categories, tagline style, inline) + **Headline** (h1)
3. **Overview** — fixed “Project Overview” tagline + rule; right-half portable text body + two-column services (references to shared `service` docs)
4. **Media grid** — array of rows: full width, two columns, or **video** (cover + play); `1.25rem` gap
5. **Testimonials** — array of existing testimonials (1 = stand-alone, 2+ = slider); optional color overrides from Commit brand or this project’s brand palette
6. **Project brand palette** — custom hex colors for this project (used by testimonial overrides)
7. Prev / next — derived from all projects in Studio drag-order (`orderRank`)
8. **CTA** — site default, custom, or hidden

Card fields (title, categories, thumbnail, summary) still drive work cards and the line under the hero.

**Work index:** 2-col cards section uses **All projects (Studio order)** so newly published projects appear automatically; reorder under Projects in Studio.

Video uses Mux (`sanity-plugin-mux-input` + `@mux/mux-player-react`).
