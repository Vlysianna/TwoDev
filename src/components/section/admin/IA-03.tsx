import IA03Section from "@/components/section/IA-03";


export default function IA03({id_result}: {id_result: string}) {
  return (
    <IA03Section isAssessee={false} isAdmin={true} id_result={id_result} />
  )
}