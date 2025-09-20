import AK02Section from "@/components/section/AK-02";

export default function AK02({ id_result }: { id_result: string }) {
	return <AK02Section isAssessee={false} isAdmin={true} id_result={id_result} id_asesi="" id_asesor="" id_assessment="" />;
}
