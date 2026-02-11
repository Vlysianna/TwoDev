import AK03Section from "@/components/section/AK-03";

export default function AK03({ id_result }: { id_result: string }) {
	return <AK03Section isAssessee={false} isAdmin={true} id_result={id_result} />;
}
