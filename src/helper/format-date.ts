export const formatDate = (
	date: string
) => {
	if(!date) return "-";
	try {
		const dateObj = new Date(date);
		return dateObj.toLocaleDateString("id-ID", {
			day: "numeric",
			month: "long",
			hour: "2-digit",
			minute: "2-digit",
			timeZone: 'UTC'
		});
	} catch {
		return "-";
	}
};
