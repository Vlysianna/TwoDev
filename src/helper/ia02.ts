import api from "./axios";

export const handleViewPDF = async (
  setGeneratingPdf: React.Dispatch<React.SetStateAction<boolean>>,
  scheduleId: string,
  isDownloadable?: boolean,
) => {
  try {
    setGeneratingPdf(true);
    const response = await api.get(`/assessments/ia-02/pdf/${scheduleId}`, {
      responseType: "blob",
    });

    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    if (isDownloadable) {
			const assesseeName = localStorage.getItem("assessee_name") || "";
			const sanitizedName = assesseeName.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_');

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `IA-02_${sanitizedName}_SOAL.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.open(url, "_blank");
    }

    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    console.error("Error viewing PDF:", error);
  } finally {
    setGeneratingPdf(false);
  }
}