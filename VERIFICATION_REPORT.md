# TaskForge verification report

Verification scope: source and package files in this archive, inspected in a Linux container on 2026-11-13. This is not a Windows/MySQL end-to-end certification.

## Confirmed

- Root npm workspace manifests and lockfile are present and parse successfully.
- Lockfile version is 3.
- Prisma CLI, Prisma Client, and the MariaDB adapter are all locked to 7.10.1.
- The lockfile includes the Windows x64 Rollup optional package needed by the Vite/Vitest toolchain.
- Prisma schema uses the Prisma 7 `prisma-client` generator and has no legacy `url` or `directUrl` datasource fields.
- Prisma 7 config exists and its TypeScript file passes an isolated TypeScript check against the installed Prisma config types.
- The Prisma runtime adapter uses the MariaDB driver adapter and reads `DATABASE_URL`.
- Client TypeScript check passed.
- Server ESLint passed.
- Client ESLint passed with 0 errors and 2 React Fast Refresh warnings.
- ZIP integrity check passed.
- Local `.env` files, `node_modules`, generated Prisma output, and build artifacts are not included.
- Setup now uses `npm ci` and includes a manually provisioned shadow database configuration for MySQL migrations.

## Not verified in this environment

- Prisma schema validation and Prisma Client generation. The available installed Prisma engine is Windows-only; the Linux schema-engine binary could not be downloaded in this network-restricted environment.
- Server TypeScript typecheck. It cannot complete until Prisma Client is generated; the missing generated client causes the unresolved import and downstream inferred-`any` diagnostics.
- Vitest suites and Vite production build. The available dependency tree lacks the Linux Rollup optional binary. The lockfile does contain the Windows x64 Rollup package for the intended Windows environment.
- MySQL connection, migrations, and live registration/login/workspace/board/task flows. No MySQL server is available in this environment.
- Full online `npm audit` against the current advisory database.

## Security note

The lockfile currently resolves `zod` to 3.25.76. GitHub advisory GHSA-mrhx-c7xc-m3w5 marks Zod versions below 4.6.6 as affected by a high-severity resource-exhaustion issue. The current TaskForge request schemas do not define array schemas and Express limits JSON request bodies to 32 KB, which reduces the described attack surface, but the dependency audit finding remains. Do not describe this lockfile as audit-clean. A Zod 4.6.7 migration should be performed and tested separately before calling the dependency tree fully remediated.

## Windows setup prerequisites

1. Node.js 22.12+ (Node 24 LTS is suitable) and npm 10+.
2. MySQL 8 running locally.
3. Create both `taskforge` and `taskforge_shadow` databases and the runtime/migration users using the SQL in README.md.
4. Configure `DATABASE_URL`, `DIRECT_URL`, `SHADOW_DATABASE_URL`, and a JWT secret in `server/.env`.
5. Run `setup.ps1` from the project root in PowerShell. It installs dependencies, validates/generates Prisma, creates/applies the initial migration, and starts both apps.

The archive is corrected for the issues identified during this review, but the unverified Windows/MySQL steps must pass on the target machine before it can be called fully verified.
