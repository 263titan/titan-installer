# Common Library (`libs/common`)

> Shared utilities, type definitions, logging interfaces, and helpers.

### Core Languages & Runtime

<a href="https://nodejs.org">![Node.js](https://img.shields.io/badge/Node.js-5FA04E?style=for-the-badge&logo=node.js&logoColor=white)</a> <a href="https://pnpm.io">![pnpm](https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white)</a> <a href="https://www.typescriptlang.org">![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)</a>

### Tools

<a href="https://eslint.org">![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)</a> <a href="https://jestjs.io">![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)</a>

## Overview

`libs/common` is the lowest-level shared library in the Titan monorepo. It has no dependencies on other `libs/` packages and provides the building blocks every other package can import safely.

## Contents

### Logging

```ts
import { logger } from '@titan/common/logging';

logger.info('Job submitted', { jobId, deviceId });
logger.error('RIP failed', { error, jobId });
```

The logger forwards to SyncTrace in production and to the console in development.

### Types

```ts
import type { Job, Device, ColorProfile, FontInfo } from '@titan/common/types';
```

### Utilities

```ts
import { generateId, formatBytes, clamp, sleep, retry } from '@titan/common/utils';
import { EventEmitter } from '@titan/common/events';
import { Result, Ok, Err } from '@titan/common/result'; // Railway-oriented result type
```

### Constants

```ts
import { TITAN_VERSION, SUPPORTED_FILE_FORMATS, MAX_JOB_SIZE_BYTES } from '@titan/common/constants';
```

## Development

```bash
pnpm nx build libs-common
pnpm nx test libs-common
```
