export const formatDate = (date?: string | null) => {
	if (!date) return "-";
	try {
		const dateObj = new Date(date);
		if (Number.isNaN(dateObj.getTime())) return "-";
		return new Intl.DateTimeFormat("id-ID", {
			timeZone: "Asia/Jakarta",
			day: "2-digit",
			month: "long",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
			hour12: false,
		}).format(dateObj);
	} catch {
		return "-";
	}
};

// Shared helpers for Jakarta date formatting in US style
const parseIsoLike = (input?: string | null) => {
    if (!input) return null;
    const m = /^(\d{4})-(\d{2})-(\d{2})[T\s](\d{2}):(\d{2})(?::(\d{2}))?/.exec(input);
    if (!m) return null;
    const [, y, mo, d, hh, mm, ss] = m;
    return {
        yyyyNum: Number(y),
        moNum: Number(mo),
        ddNum: Number(d),
        HHNum: Number(hh),
        minNum: Number(mm),
        secNum: Number(ss || '0'),
    };
};

const formatDateJakartaGeneric = (input?: string | null, use12Hour?: boolean) => {
    if (!input) return "-";
    try {
        const pad2 = (n: number) => n.toString().padStart(2, '0');

        const parsed = parseIsoLike(input);
        if (parsed) {
            const { yyyyNum, moNum, ddNum, HHNum, minNum, secNum } = parsed;
            if (use12Hour) {
                const period = HHNum < 12 ? 'AM' : 'PM';
                const hour12 = (HHNum % 12) || 12;
                return `${pad2(moNum)}/${pad2(ddNum)}/${yyyyNum} ${pad2(hour12)}:${pad2(minNum)}:${pad2(secNum)} ${period}`;
            }
            return `${pad2(moNum)}/${pad2(ddNum)}/${yyyyNum} ${pad2(HHNum)}:${pad2(minNum)}:${pad2(secNum)}`;
        }

        const date = new Date(input);
        if (Number.isNaN(date.getTime())) return "-";

        const parts = new Intl.DateTimeFormat('id-ID', {
            timeZone: 'Asia/Jakarta',
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            hour12: Boolean(use12Hour),
        }).formatToParts(date);

        const get = (type: Intl.DateTimeFormatPartTypes) => parts.find(p => p.type === type)?.value || '';
        const mmStr = get('month');
        const ddStr = get('day');
        const yyyyStr = get('year');
        const hour = get('hour');
        const minute = get('minute');
        const second = get('second');
        if (use12Hour) {
            const dayPeriod = get('dayPeriod');
            return `${mmStr}/${ddStr}/${yyyyStr} ${hour}:${minute}:${second} ${dayPeriod}`.trim();
        }
        return `${mmStr}/${ddStr}/${yyyyStr} ${hour}:${minute}:${second}`.trim();
    } catch {
        return '-';
    }
};

// Formats to: MM/DD/YYYY hh:mm:ss AM/PM in Asia/Jakarta (WIB)
export const formatDateJakartaUS12 = (input?: string | null) => {
    return formatDateJakartaGeneric(input, true);
};

// Formats to: MM/DD/YYYY HH:mm:ss (24-hour) in Asia/Jakarta (WIB)
export const formatDateJakartaUS24 = (input?: string | null) => {
    return formatDateJakartaGeneric(input, false);
};