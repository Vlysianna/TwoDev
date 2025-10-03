export const formatDate = (date?: string | null) => {
	if (!date) return "-";
	try {
		const dateObj = new Date(date);
		if (Number.isNaN(dateObj.getTime())) return "-";
		return dateObj.toLocaleString("id-ID", {
			day: "numeric",
			month: "long",
			hour: "2-digit",
			minute: "2-digit",
			hour12: false,
		});
	} catch {
		return "-";
	}
};
