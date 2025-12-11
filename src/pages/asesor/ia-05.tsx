import { useEffect, useState } from 'react';
import { ChevronLeft, Clock, Loader2, KeyRound } from 'lucide-react';
import NavbarAsesor from '@/components/NavAsesor';
import { useAssessmentParams } from '@/components/AssessmentAsesorProvider';
import api from '@/helper/axios';
import { Link, useNavigate } from 'react-router-dom';
import paths from '@/routes/paths';

interface IA05Option { id: number; option: string }
interface IA05Question { id: number; order: number; question: string; options: IA05Option[] }
interface IA05AssesseeAnswerRow { id: number; answers: { id: number; option: string } }
interface IA05AnswerKeyRow { id: number; answer: { id: number; option: string } }

export default function IA05Assessor() {
  const { id_schedule, id_result, id_asesi } = useAssessmentParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<IA05Question[]>([]);
  const [answersMap, setAnswersMap] = useState<Record<number, number>>({});
  const [answerKeys, setAnswerKeys] = useState<Record<number, IA05AnswerKeyRow['answer']>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id_schedule || !id_result) return;
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const [qRes, aRes, kRes] = await Promise.all([
          api.get(`/assessments/ia-05/questions/${id_schedule}`),
          api.get(`/assessments/ia-05/result/answers/${id_result}`),
          api.get(`/assessments/ia-05/result/answers/keys/${id_schedule}`)
        ]);
        if (cancelled) return;
        const qData: IA05Question[] = qRes.data?.data || [];
        const aData: IA05AssesseeAnswerRow[] = aRes.data?.data || [];
        const kData: IA05AnswerKeyRow[] = kRes.data?.data || [];
        const map: Record<number, number> = {};
        aData.forEach(r => { map[r.id] = r.answers.id; });
        const keyMap: Record<number, IA05AnswerKeyRow['answer']> = {};
        kData.forEach(k => { keyMap[k.id] = k.answer; });
        setQuestions(qData);
        setAnswersMap(map);
        setAnswerKeys(keyMap);
      } catch (e: unknown) {
        if (!cancelled) {
          let message = 'Gagal memuat data';
          if (typeof e === 'object' && e && 'response' in e) {
            const resp = (e as { response?: { data?: { message?: string } } }).response;
            message = resp?.data?.message || message;
          }
          setError(message);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id_schedule, id_result]);

  const totalQuestions = questions.length;
  const answeredCount = questions.filter(q => answersMap[q.id] !== undefined).length;
  const progressPercent = Math.round((answeredCount / (totalQuestions || 1)) * 100);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto">
        <div className="bg-white rounded-lg shadow-sm">
          <NavbarAsesor
            title="Lembar Jawaban Pilihan Ganda"
            icon={<Link to={paths.asesor.assessment.dashboardAsesmenMandiri(id_schedule)}><ChevronLeft size={20} /></Link>}
          />
        </div>

        <main className='m-4'>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-8">
              <div className="flex-1">
                <h2 className="text-sm font-medium text-gray-800 flex items-center gap-2">Skema Sertifikasi ( Okupasi )
                  <span className="text-gray-400 text-xs flex items-center gap-1"><Clock size={14} /> Sewaktu</span>
                </h2>
                <div className="text-xs text-gray-500 mt-1">Asesi ID: <span className="text-gray-800">{id_asesi || '-'}</span> | Result: <span className="text-gray-800">{id_result || '-'}</span></div>
              </div>
              <div className="flex-1 text-left sm:text-right">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2 mt-2 w-full">
                  <span className="text-xs text-gray-500 whitespace-nowrap">Jawaban: {answeredCount} / {totalQuestions}</span>
                  <div className="flex-1 sm:w-28 bg-gray-200 rounded-full h-1.5">
                    <div className="bg-orange-400 h-1.5 rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
                  </div>
                  <span className="text-xs text-gray-500">{progressPercent}%</span>
                </div>
              </div>
            </div>
            <div className="space-y-8">
              {loading && (
                <div className="flex items-center gap-2 text-sm text-gray-500"><Loader2 className="w-4 h-4 animate-spin" /> Memuat data...</div>
              )}
              {!loading && questions.length === 0 && !error && (
                <div className="text-sm text-gray-500">Tidak ada soal.</div>
              )}
              {!loading && questions.map(q => {
                const key = answerKeys[q.id];
                return (
                  <div key={q.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                    <h3 className="font-semibold text-gray-800">Soal {q.order}</h3>
                    <p className="text-gray-700 mb-4 whitespace-pre-line">{q.question}</p>
                    <div className="border border-gray-200 rounded-lg p-4 w-full md:w-[40rem]">
                      <div className="space-y-3">
                        {q.options.map((opt, idx) => {
                          const selected = answersMap[q.id] === opt.id;
                          const isKey = key && key.id === opt.id;
                          const letter = String.fromCharCode(65 + idx);
                          return (
                            <div key={opt.id} className="flex items-center">
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selected ? 'border-orange-500 bg-orange-500' : 'border-gray-300'}`}>{selected && <div className="w-2 h-2 rounded-full bg-white" />}</div>
                              <span className={`ml-3 text-sm px-3 py-2 rounded flex-1 ${selected ? 'bg-orange-100 text-orange-800' : isKey ? 'bg-green-100 text-green-800' : 'bg-gray-50 text-gray-700'}`}>
                                <span className="font-semibold mr-2">{letter}.</span> {opt.option}
                                {isKey && (
                                  <span className="ml-2 inline-flex items-center gap-1 text-xs font-semibold text-green-700"><KeyRound size={14} /> Kunci Jawaban</span>
                                )}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-end mt-8">
              <button
                className="bg-[#E77D35] hover:bg-orange-600 text-white text-sm font-medium px-8 py-2 rounded-md transition-colors duration-200 cursor-pointer"
                onClick={() => navigate(paths.asesor.assessment.ia05c(id_schedule || '', id_asesi || ''))}
                disabled={!id_schedule || !id_asesi}
              >
                Lanjut
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
