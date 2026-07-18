Offer overlay — shared shell with about overlay.

## Structure

1. **Title** + **snippet** (mono under title)
2. **Body rows** (`overlayRow[]`):
   - `full` — modules span both columns (intros, captions, multi-col string lists)
   - `twoColumn` — independent left/right stacks (asymmetric heights OK)
3. **Modules** inside rows:
   - `overlayLabeledList` — optional label + fragmented line items
   - `overlayText` — body or caption (mono fragmented note)
   - `overlayStringList` — label + items flowing into N columns (Capabilities)
4. **Attributes** (`detailAttributes`) — Flat Fee, Timeline, etc.
5. **Colors** — overlay reuses the card’s `cardBackgroundColor` and `cardHeadingColor` (no separate overlay color fields)

## Layout examples from Figma

| Variant | Body composition |
|---------|------------------|
| Brand & Website | One two-column row: 2 lists left, 2 lists right |
| Brand Strategy | One two-column row: 1 tall list left, 2 stacked lists right |
| Brand Identity | One two-column row: 1 list each side |
| Campaign | One full row: 2 labeled lists + caption note |
| Retainer | Full intro text → full Capabilities string list (2 cols) → details |
