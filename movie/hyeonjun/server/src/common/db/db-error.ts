import { QueryFailedError } from 'typeorm';

export enum DbErrorKind {
  Duplicate = 'duplicate',
  ForeignKey = 'foreign_key',
  NotNull = 'not_null',
  Check = 'check',
  Deadlock = 'deadlock',
  Timeout = 'timeout',
  Connection = 'connection',
  Syntax = 'syntax',
  Data = 'data',
  Unknown = 'unknown',
}

export interface ParsedDbError {
  kind: DbErrorKind;
  code?: string;
  constraint?: string;
  message?: string;
}

export function parseDbError(e: unknown): ParsedDbError {
  if (!(e instanceof QueryFailedError)) {
    return { kind: DbErrorKind.Unknown };
  }

  // 안전한 속성 접근
  const driverError = (e as { driverError?: Record<string, unknown> }).driverError ?? {};
  const code =
    typeof driverError.code === 'string' || typeof driverError.code === 'number'
      ? String(driverError.code)
      : '';
  const message =
    typeof driverError.message === 'string'
      ? driverError.message
      : typeof (e as Error).message === 'string'
        ? (e as Error).message
        : '';
  const constraint =
    typeof (driverError as { constraint?: unknown }).constraint === 'string'
      ? (driverError as { constraint?: string }).constraint
      : undefined;

  // ----- Postgres -----
  if (code === '23505') return { kind: DbErrorKind.Duplicate, code, constraint, message };
  if (code === '23503') return { kind: DbErrorKind.ForeignKey, code, constraint, message };
  if (code === '23502') return { kind: DbErrorKind.NotNull, code, constraint, message };
  if (code === '23514') return { kind: DbErrorKind.Check, code, constraint, message };
  if (code === '40P01') return { kind: DbErrorKind.Deadlock, code, constraint, message };

  // ----- MySQL / MariaDB -----
  if (code === '1062' || code === 'ER_DUP_ENTRY')
    return { kind: DbErrorKind.Duplicate, code, constraint, message };
  if (code === '1452') return { kind: DbErrorKind.ForeignKey, code, constraint, message };
  if (code === '1048') return { kind: DbErrorKind.NotNull, code, constraint, message };
  if (code === '3819') return { kind: DbErrorKind.Check, code, constraint, message };
  if (code === '1213') return { kind: DbErrorKind.Deadlock, code, constraint, message };
  if (code === '1205') return { kind: DbErrorKind.Timeout, code, constraint, message };
  if (code === '1064' || /parse error/i.test(message))
    return { kind: DbErrorKind.Syntax, code, constraint, message };
  if (code === '1292' || code === '1366')
    return { kind: DbErrorKind.Data, code, constraint, message };

  // ----- SQLite -----
  if (code === '19' || code === 'SQLITE_CONSTRAINT') {
    if (/unique/i.test(message)) return { kind: DbErrorKind.Duplicate, code, constraint, message };
    if (/foreign/i.test(message))
      return { kind: DbErrorKind.ForeignKey, code, constraint, message };
    if (/not null/i.test(message)) return { kind: DbErrorKind.NotNull, code, constraint, message };
    if (/check/i.test(message)) return { kind: DbErrorKind.Check, code, constraint, message };
    return { kind: DbErrorKind.Data, code, constraint, message };
  }

  // ----- 메시지 패턴 기반 보강 -----
  if (/unique|duplicate/i.test(message))
    return { kind: DbErrorKind.Duplicate, code, constraint, message };
  if (/foreign key/i.test(message))
    return { kind: DbErrorKind.ForeignKey, code, constraint, message };
  if (/not null/i.test(message)) return { kind: DbErrorKind.NotNull, code, constraint, message };
  if (/deadlock/i.test(message)) return { kind: DbErrorKind.Deadlock, code, constraint, message };
  if (/timeout|timed out/i.test(message))
    return { kind: DbErrorKind.Timeout, code, constraint, message };
  if (/ECONN|refused|closed/i.test(message))
    return { kind: DbErrorKind.Connection, code, constraint, message };

  return { kind: DbErrorKind.Unknown, code, constraint, message };
}
