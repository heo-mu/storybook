import { CheckCircleFillIcon, InfoFillIcon, XCircleFillIcon } from '../../icons';

/** Alert · Toast의 종류별 상태 아이콘(info-fill · check-circle-fill · x-circle-fill). */
export const STATUS_ICON = { information: InfoFillIcon, success: CheckCircleFillIcon, error: XCircleFillIcon } as const;
