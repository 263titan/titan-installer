# Titan Design System (`libs/ui`)

> Shared React component library and design tokens for all Titan desktop and web applications.

### Core Languages & Runtime

<a href="https://nodejs.org">![Node.js](https://img.shields.io/badge/Node.js-5FA04E?style=for-the-badge&logo=node.js&logoColor=white)</a> <a href="https://pnpm.io">![pnpm](https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white)</a> <a href="https://www.typescriptlang.org">![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)</a>

### Frameworks & Desktop

<a href="https://react.dev">![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)</a> <a href="https://vitejs.dev">![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)</a> <a href="https://electronjs.org">![Electron](https://img.shields.io/badge/Electron-47848F?style=for-the-badge&logo=electron&logoColor=white)</a> <a href="https://storybook.js.org">![Storybook](https://img.shields.io/badge/Storybook-FF4785?style=for-the-badge&logo=storybook&logoColor=white)</a>

### Tools

<a href="https://nx.dev">![Nx](https://img.shields.io/badge/Nx-ACB6C2?style=for-the-badge&logo=nx&logoColor=white)</a>

## Overview

The Titan Design System (`libs/ui`) is the single source of truth for Titan's visual language. Every Titan app — Launcher, PlotSync, PrintSync, FontSync, Production Manager — imports components, tokens, and icons from this library to guarantee a consistent, professional look and feel.

## Contents

### Design Tokens

```ts
// Color palette, typography scale, spacing, border radii, shadows
import { colors, typography, spacing, radius } from '@titan/ui/tokens';
```

### Typography

The typography scale is executed as `--titan-*` CSS custom properties. `ThemeProvider` injects them into `:root` automatically; the base stylesheet (`Typography.css`) is loaded alongside it.

```ts
import { typographyVariables } from '@titan/ui/tokens';
// --titan-font-sans / --titan-font-mono
// --titan-text-xs … --titan-text-3xl
// --titan-weight-* , --titan-leading-* , --titan-tracking-*
```

Apply `.titan-root` to your app container for base type styles (heading hierarchy, code font), or use utilities directly: `.titan-h1`–`.titan-h6`, `.titan-text-xs`–`.titan-text-3xl`, `.titan-weight-*`, `.titan-leading-*`, `.titan-mono`, `.titan-tabular`, `.titan-overline`.


### Components

| Category              | Components                                                                              |
| --------------------- | --------------------------------------------------------------------------------------- |
| Layout                | `AppShell`, `Sidebar`, `Toolbar`, `SplitPane`, `Panel`                                  |
| Navigation            | `TabBar`, `Breadcrumb`, `ContextMenu`, `CommandPalette`                                 |
| Inputs                | `Button`, `IconButton`, `TextInput`, `Select`, `Checkbox`, `Toggle`, `Slider`           |
| Feedback              | `Toast`, `Alert`, `Badge`, `Progress`, `Spinner`, `Skeleton`                            |
| Overlay               | `Modal`, `Dialog`, `Drawer`, `Tooltip`, `Popover`                                       |
| Data Display          | `Table`, `DataGrid`, `Card`, `Stat`, `Tag`, `Avatar`                                    |
| Colour                | `ColorSwatch`, `PaletteEditor`, `ProfilePicker`                                         |
| Job Queue             | `JobCard`, `QueueList`, `StatusDot`, `JobProgress`                                      |
| **Application Shell** | `MenuBar`, `ContextualRibbon`, `LeftToolbar`, `RightDocker`, `BottomPanel`, `StatusBar` |
| **Workspace Shells**  | `PlotSyncShell`, `PrintSyncShell`                                                       |

### Icons

```ts
import { IconPrint, IconCut, IconCloud, IconDevice } from '@titan/ui/icons';
```

## Usage

### Basic Components

```tsx
import { Button, Panel, Toast } from '@titan/ui';

export function MyComponent() {
  return (
    <Panel title="Print Queue">
      <Button variant="primary" onClick={handlePrint}>
        Send to Printer
      </Button>
    </Panel>
  );
}
```

### Application Shell Components

The Titan Production Suite includes a complete application shell system for PlotSync and PrintSync workspaces:

```tsx
import { PlotSyncShell } from '@titan/ui';

export function PlotSyncApp() {
  return (
    <PlotSyncShell workspace="design" onToolSelect={(toolId) => console.log(toolId)}>
      <YourCanvasComponent />
    </PlotSyncShell>
  );
}
```

```tsx
import { PrintSyncShell } from '@titan/ui';

export function PrintSyncApp() {
  return (
    <PrintSyncShell workspace="dtf" onToolSelect={(toolId) => console.log(toolId)}>
      <YourRIPCanvasComponent />
    </PrintSyncShell>
  );
}
```

### Individual Shell Components

You can also use individual shell components for custom layouts:

```tsx
import {
  MenuBar,
  getDefaultTitanMenus,
  ContextualRibbon,
  LeftToolbar,
  getPlotSyncToolGroups,
  RightDocker,
  BottomPanel,
  DefaultStatusBar,
} from '@titan/ui';

export function CustomShell() {
  return (
    <>
      <MenuBar menus={getDefaultTitanMenus()} />
      <ContextualRibbon sections={[]} actions={[]} />
      <div style={{ display: 'flex', flex: 1 }}>
        <LeftToolbar groups={getPlotSyncToolGroups()} activeToolId="select" />
        <div style={{ flex: 1 }}>Your content</div>
        <RightDocker tabs={[]} />
      </div>
      <BottomPanel />
      <DefaultStatusBar {...statusProps} />
    </>
  );
}
```

## Development

```bash
# Start Storybook for component development
pnpm nx storybook libs-ui

# Build the library
pnpm run build

# Run unit tests
pnpm run test -- --testPathPatterns=libs\ui
```

## Engine Integration Guide

The Titan UI shell components are designed to integrate with the Rust engine bindings. Here's how to connect the UI components to the backend engines:

### Rust Engine Bindings

The Titan Production Suite uses the following Rust engines (via N-API):

- **nest-engine**: True-shape nesting optimization
- **titancolor**: Color management and ICC profiles
- **truepath-engine**: Cut-path optimization
- **titan-rip**: Raster image processing
- **titangeometry**: Vector geometry operations
- **plotvision-engine**: Camera alignment and vision
- **titandaemon**: Hardware communication

### Integration Example

```tsx
import { PlotSyncShell, NestingDocker } from '@titan/ui';
import { nestEngine } from '@titan/nest-engine';

export function PlotSyncWithEngineIntegration() {
  const [nestingResult, setNestingResult] = useState(null);

  const handleRunNest = async () => {
    // Call Rust engine via N-API binding
    const result = await nestEngine.optimizeNest({
      rollWidth: 1370,
      clearance: 3,
      margin: 10,
      rotations: [0, 90],
      engineMode: 'balanced',
    });
    setNestingResult(result);
  };

  return (
    <PlotSyncShell workspace="cut">
      <YourCanvas />
      {/* Custom docker with engine integration */}
      <RightDocker
        tabs={[
          {
            id: 'nesting',
            label: 'Nesting',
            content: (
              <NestingDocker
                rollWidth={1370}
                clearance={3}
                margin={10}
                rotations={['0', '90']}
                engineMode="balanced"
                yield={nestingResult?.yield || 0}
                runtime={nestingResult?.runtime || 0}
                partsPlaced={nestingResult?.partsPlaced || 0}
                totalParts={nestingResult?.totalParts || 0}
                onRunNest={handleRunNest}
                onExportReport={() => exportNestingReport(nestingResult)}
                onChange={(field, value) => updateNestingParams(field, value)}
              />
            ),
          },
        ]}
      />
    </PlotSyncShell>
  );
}
```

### Certification Authority Integration

The UI components support certification checks via the `cert-authority` service:

```tsx
import { MenuBar } from '@titan/ui';
import { certAuthority } from '@titan/cert-authority';

// Add certification checks to menu actions
const menus = {
  Certification: [
    {
      id: 'dongle',
      label: 'Dongle/Token Status',
      badge: '🔒',
      action: async () => {
        const status = await certAuthority.checkDongle();
        console.log('Dongle status:', status);
      },
    },
  ],
};
```

### Workspace-Specific Engine Bindings

Each workspace has specific engine integrations:

**PlotSync Design Workspace:**

- `titangeometry`: Vector operations, node editing
- `titancolor`: Color management for vector fills

**PlotSync Cut Workspace:**

- `nest-engine`: True-shape nesting
- `truepath-engine`: Cut trajectory optimization
- `plotvision-engine`: Registration mark detection

**PlotSync Engrave Workspace:**

- `truepath-engine`: Toolpath generation
- `titandaemon`: CNC/laser hardware control

**PrintSync Workspaces:**

- `titan-rip`: Raster image processing
- `titancolor`: Color profile management
- `titandaemon`: Printer communication

### CSS Custom Properties

The UI components use CSS custom properties for theming. Ensure these are defined in your global stylesheet:

```css
:root {
  --titan-bg: #141414;
  --titan-bg-raised: #1e1e1e;
  --titan-bg-overlay: #2a2a2a;
  --titan-border: #333;
  --titan-text: #e0e0e0;
  --titan-text-muted: #888;
  --titan-text-dim: #666;
  --titan-brand: #10b981;
  --titan-brand-light: #0d4d3f;
  --titan-brand-dark: #0d9668;
}
```

## Theming

The design system supports light and dark modes via CSS custom properties:

```ts
import { ThemeProvider } from '@titan/ui';

<ThemeProvider theme="dark">
  <App />
</ThemeProvider>
```
