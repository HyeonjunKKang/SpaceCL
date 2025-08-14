// src/common/db/mysql-error-code.ts
export enum MySqlErrorCode {
  DuplicateEntry = 'ER_DUP_ENTRY', // 중복 키
  NotNullViolation = 'ER_BAD_NULL_ERROR', // NOT NULL 위반
  ForeignKeyNotFound = 'ER_NO_REFERENCED_ROW_2', // FK 대상 없음
  ForeignKeyConstraint = 'ER_ROW_IS_REFERENCED_2', // FK 참조 중
  DataTooLong = 'ER_DATA_TOO_LONG', // 데이터 길이 초과
  TruncatedWrongValue = 'ER_TRUNCATED_WRONG_VALUE',
  CheckConstraintViolated = 'ER_CHECK_CONSTRAINT_VIOLATED',
}
