export const formatDate = (
	date: string
) => {
	const dateObj = new Date(date);
	return dateObj.toLocaleDateString("id-ID", {
		day: "numeric",
		month: "short",
		hour: "2-digit",
		minute: "2-digit",
	});
};
