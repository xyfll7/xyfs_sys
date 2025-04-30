// cSpell: ignore eglqz
import { base64Encode } from '@xyfs/utils/base64Utils';
export const IM_locate = "https://7072-prod-5gx53h8v828f0170-1306790653.tcb.qcloud.la/myfiles_xyfll7/map_center.png";
export const IM_logo_33x33 = "https://7072-prod-5gx53h8v828f0170-1306790653.tcb.qcloud.la/myfiles_xyfll7/map_logo.png";
export const IM_线上_收款码 = "https://7072-prod-5gx53h8v828f0170-1306790653.tcb.qcloud.la/myfiles_xyfll7/kuaidi_pay.jpg";
export const Lucide_ChevronLeft = (color: string) => `data:image/svg+xml;base64,${base64Encode(new Uint8Array(new TextEncoder().encode(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-left-icon lucide-chevron-left"><path d="m15 18-6-6 6-6"/></svg>`)).buffer)}`;



