/** Shared premium light-theme class tokens */

export const GRADIENT_HEADING =
  'bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-indigo-800 to-slate-900'

export const ELEVATED_CARD =
  'bg-white border border-slate-200/60 shadow-lg shadow-slate-200/50 rounded-2xl transition-all duration-300'

export const ELEVATED_CARD_HOVER = 'hover:shadow-xl hover:shadow-slate-300/50 hover:-translate-y-0.5'

export const PRIMARY_BUTTON =
  'inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 border border-indigo-700/20 shadow-md shadow-indigo-200/50 hover:shadow-lg hover:shadow-indigo-300/60 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200'

export const SECONDARY_BUTTON =
  'inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80 shadow-sm hover:shadow transition-all duration-200'

export const GHOST_BUTTON =
  'inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors duration-200'

const TECH_PILL_MAP: Record<string, string> = {
  'Next.js': 'bg-slate-800 text-white border-slate-800',
  Nextjs: 'bg-slate-800 text-white border-slate-800',
  TypeScript: 'bg-blue-50 text-blue-700 border-blue-200',
  JavaScript: 'bg-amber-50 text-amber-700 border-amber-200',
  MongoDB: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Supabase: 'bg-emerald-50 text-emerald-700 border-emerald-300',
  PostgreSQL: 'bg-sky-50 text-sky-700 border-sky-200',
  SQL: 'bg-sky-50 text-sky-700 border-sky-200',
  n8n: 'bg-orange-50 text-orange-700 border-orange-200',
  Vercel: 'bg-slate-100 text-slate-800 border-slate-300',
  Lovable: 'bg-pink-50 text-pink-700 border-pink-200',
  Bolt: 'bg-violet-50 text-violet-700 border-violet-200',
  'Leonardo AI': 'bg-purple-50 text-purple-700 border-purple-200',
  'Cursor IDE': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  Pipedream: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  'MCP Servers': 'bg-teal-50 text-teal-700 border-teal-200',
  LLMs: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200',
  Python: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  React: 'bg-sky-50 text-sky-700 border-sky-200',
  'Tailwind CSS': 'bg-teal-50 text-teal-700 border-teal-200',
}

const PILL_FALLBACKS = [
  'bg-blue-50 text-blue-700 border-blue-200',
  'bg-emerald-50 text-emerald-700 border-emerald-200',
  'bg-purple-50 text-purple-700 border-purple-200',
  'bg-violet-50 text-violet-700 border-violet-200',
  'bg-cyan-50 text-cyan-700 border-cyan-200',
  'bg-rose-50 text-rose-700 border-rose-200',
]

export function getTechPillClass(tech: string, index = 0): string {
  const base = 'px-3 py-1 text-xs font-semibold rounded-full border'
  const mapped = TECH_PILL_MAP[tech]
  if (mapped) return `${base} ${mapped}`
  return `${base} ${PILL_FALLBACKS[index % PILL_FALLBACKS.length]}`
}
