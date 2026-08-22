export const site = {
  brand: 'KR',
  name: 'Király Róbert',
  role: 'Web- és játékfejlesztés',
  location: 'Szabadka, Szerbia',
  coordinates: '46.100°N / 19.665°E',
}

export interface NavLink {
  href: string
  label: string
  index: string
}

export const navLinks: NavLink[] = [
  { href: '#about', label: 'Rólam', index: '01' },
  { href: '#skills', label: 'Készségek', index: '02' },
  { href: '#projects', label: 'Projektek', index: '03' },
  { href: '#contact', label: 'Kapcsolat', index: '04' },
]

export const hero = {
  eyebrow: 'Személyes portfólió // 2026',
  firstName: 'Király',
  lastName: 'Róbert',
  tagline:
    'Informatika szakos hallgató, aki modern webalkalmazásokkal és játékfejlesztéssel szeretne valódi értéket építeni.',
  intro:
    'A technológia világában már középiskolás éveim óta folyamatosan bővítem a tudásomat, és olyan projektekben szeretek dolgozni, ahol a design, a funkcionalitás és a gyakorlati megoldások együtt jelennek meg.',
}

export const cvUrl = '/kiraly_robert_cv.pdf'

export const about = {
  index: '01',
  eyebrow: 'Profil',
  heading: 'Rövid bemutatkozás',
  lead: 'Informatika szakos hallgató vagyok a Szabadkai Műszaki Szakfőiskolán, és az a célom, hogy a front-end és a termékfelépítés területén egyre erősebb, megbízhatóbb munkákat hozzak létre.',
  body: 'Már középiskolás éveim óta folyamatosan építem a technikai alapjaimat, és olyan munkákat keresek, ahol a tanulás, a gyakorlati kivitelezés és a csapatmunka egyszerre van jelen.',
  educationLabel: 'Tanulmányok',
  fileId: 'EDU_FILE_01',
}

export interface EducationItem {
  period: string
  school: string
  field: string
}

export const education: EducationItem[] = [
  {
    period: '2019–23',
    school: 'Ivan Sarić Műszaki Iskola',
    field: 'Információs technológiák elektrotechnikusa',
  },
  {
    period: '2023–',
    school: 'Szabadkai Műszaki Szakfőiskola',
    field: 'Informatika',
  },
]

export const skillsSection = {
  index: '02',
  eyebrow: 'Rendszerek',
  heading: 'Használt technológiák',
}

export const skills = [
  'HTML / CSS',
  'JavaScript',
  'React / React Native',
  'Python',
  'C / C#',
  'SQL',
  'Expo',
]

export const projectsSection = {
  index: '03',
  eyebrow: 'Nyilvántartás',
  heading: 'Projektek és tapasztalat',
}

export type FileKind = 'Projekt' | 'Tapasztalat'

export interface ProjectFile {
  kind: FileKind
  title: string
  description?: string
  tags?: string[]
  meta?: string[]
}

export const projects: ProjectFile[] = [
  {
    kind: 'Projekt',
    title: 'DnD-Site',
    description: 'Modern webalkalmazás D&D 5e karakterek létrehozásához és kezeléséhez.',
    tags: ['Vite', 'Supabase'],
  },
  {
    kind: 'Projekt',
    title: 'Mepper-Pill',
    description:
      'Minimalista, underground stílusú ételfutár alkalmazás, amelyet jelenleg Palicson használnak.',
    tags: ['Vite', 'Supabase', 'React', 'TypeScript'],
  },
  {
    kind: 'Tapasztalat',
    title: 'Studio Present',
    description: 'Front-End Gyakornok',
    meta: ['2 hét', '2023'],
  },
  {
    kind: 'Tapasztalat',
    title: 'Mustard Seed Credo Ltd.',
    description: 'Code Analytics',
    meta: ['2 hónap', '2025'],
  },
]

export const contactSection = {
  index: '04',
  eyebrow: 'Kommunikáció',
  heading: 'Elérhetőség',
  ctaEyebrow: 'Válaszidő: általában < 24h',
  ctaTitle: 'Dolgozzunk együtt.',
  ctaText:
    'Nyitott vagyok gyakornoki pozíciókra, egyetemi projektekre és front-end kihívásokra. Írd meg, miről van szó, és felveszem veled a kapcsolatot.',
  statusLabel: 'Rendszer: elérhető',
  panelId: 'COMM_FILE_04',
  panelLabel: 'Csatornák',
  cvChannel: { id: 'CHN_03', label: 'Önéletrajz', value: 'kiraly_robert_cv.pdf' },
}

export interface Channel {
  id: string
  label: string
  value: string
  href: string
}

export const channels: Channel[] = [
  { id: 'CHN_01', label: 'E-mail', value: 'kiralyrobert2004@gmail.com', href: 'mailto:kiralyrobert2004@gmail.com' },
  { id: 'CHN_02', label: 'Telefon', value: '+381 63 395 603', href: 'tel:+38163395603' },
]
