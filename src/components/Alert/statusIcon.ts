import { CheckCircleFillIcon, InfoFillIcon, WarningFillIcon, XCircleFillIcon } from '../../icons';

/** Alert · Toast의 종류별 상태 아이콘(info-fill · check-circle-fill · warning-fill · x-circle-fill). */
export const STATUS_ICON = { information: InfoFillIcon, success: CheckCircleFillIcon, warning: WarningFillIcon, error: XCircleFillIcon } as const;
