// SQLite doesn't support Prisma native enums, so status/priority are stored
// as plain strings in the DB. These app-level enums keep validation and
// TypeScript typing exactly the same as if they were real Prisma enums.

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}
