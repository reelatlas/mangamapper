

## Rework Section Icons with Hover States

Currently `SectionHeader` takes a single `icon` prop used for both the default state and the trailing hover icons. We need to support two different icons: one for default state, one for hover.

### Changes to `src/pages/About.tsx`

**1. Update imports** — Replace current icons with the new ones:
- Remove: `Zap, Target, HelpCircle, Code, MessageSquare, Heart`
- Add: `Shell, Snail, Cloud, Zap, Goal, Sprout, TreeDeciduous, Bot, Rocket, Heart, Rabbit`
- Note: Lucide has `Target` but for "bow-arrow" we'll check — Lucide doesn't have `BowArrow`, so we may need to use an alternative. Let me verify... Lucide does not have a bow-arrow icon. Closest options: `Crosshair`, `Focus`, or `Swords`. Actually, looking again at lucide-react icons, there's no exact "bow-arrow". I'll flag this to the user.

**2. Update `SectionHeader` component** — Accept two icon props:
```tsx
const SectionHeader = ({ icon: Icon, hoverIcon: HoverIcon, label }: { icon: LucideIcon; hoverIcon: LucideIcon; label: string }) => (
```
- Default state: show `Icon` (fades out on hover as it does now)
- The trailing hover icons (cyan/purple/pink triple) will use `HoverIcon` instead of `Icon`

**3. Update each section's `SectionHeader` usage:**

| Section | `icon` | `hoverIcon` |
|---|---|---|
| welcome | `Shell` | `Snail` |
| features | `Cloud` | `Zap` |
| pain_points_solved | *bow-arrow alternative* | `Goal` |
| why_build | `Sprout` | `TreeDeciduous` |
| built_with | `Bot` | `Rocket` |
| feedback | `Sprout` | `TreeDeciduous` |
| support | `Heart` | `Rabbit` |

### Note on "bow-arrow"
Lucide doesn't have a `BowArrow` icon. I'll need your input on an alternative — options include `Crosshair`, `Swords`, `Target`, or `Locate`. Or we can check if a newer version has it.

