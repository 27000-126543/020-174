
import type { ChiefComplaintType, SpeechItem, AgeGroup, AnxietyLevel, SpeechSection } from '@/types';

const generateId = () => Math.random().toString(36).substring(2, 11);

interface SpeechTemplate {
  greeting: string[];
  medical_history: string[];
  pre_exam: string[];
}

const baseSpeeches: Record<ChiefComplaintType, SpeechTemplate> = {
  toothache: {
    greeting: [
      '您好，请坐，我是您的主治医生。',
      '听说您牙齿不太舒服，先别着急，我们慢慢了解一下情况。',
      '您是哪颗牙齿疼呢？可以指给我看看吗？',
    ],
    medical_history: [
      '这种疼痛有多久了？是突然开始的还是慢慢加重的？',
      '是隐隐作痛还是剧烈疼痛？晚上睡觉会不会疼醒？',
      '喝冷的或热的东西时会加重吗？咬东西的时候疼不疼？',
      '之前这颗牙有没有补过或者做过治疗？',
      '最近有没有感冒、熬夜或者压力比较大？',
      '有没有吃过什么止痛药？效果怎么样？',
    ],
    pre_exam: [
      '接下来我先帮您检查一下，看看具体是什么问题。',
      '检查的时候可能会有一点点酸，都是正常的，您不用紧张。',
      '如果有不舒服您就抬左手示意我，我会停下来的。',
      '我们先拍张小牙片，这样能看得更清楚，方便确定治疗方案。',
    ],
  },
  missing_tooth: {
    greeting: [
      '您好，欢迎来就诊，请坐。',
      '听说您有缺牙的困扰，我先了解一下您的情况。',
      '是哪颗牙缺了呢？缺了有多长时间了？',
    ],
    medical_history: [
      '这颗牙是因为什么原因拔掉的呢？',
      '缺牙旁边的牙齿有没有松动或者不舒服的？',
      '您平时吃饭受影响大吗？有没有觉得嚼东西不方便？',
      '之前有没有考虑过镶牙或者种植牙？',
      '您身体怎么样？有没有高血压、糖尿病这些慢性病？',
      '有没有对什么药物过敏的情况？',
    ],
    pre_exam: [
      '我先帮您检查一下口腔情况，看看缺牙区的条件怎么样。',
      '等下可能需要拍个CT，看看骨头的厚度和密度。',
      '检查完我会跟您详细讲解几种修复方案，您可以慢慢了解。',
      '有什么疑问随时可以问我，我们一起选择最适合您的方案。',
    ],
  },
  malocclusion: {
    greeting: [
      '您好，请坐，很高兴为您服务。',
      '您是想了解牙齿矫正的事情对吧？我先了解一下您的想法。',
      '您主要是觉得牙齿哪里不太满意呢？',
    ],
    medical_history: [
      '您是自己想做矫正还是家人建议的？',
      '之前有没有去其他地方咨询过？',
      '您比较在意的是美观问题还是功能问题？',
      '有没有受过外伤或者咬过硬东西？',
      '平时有没有用嘴呼吸、咬铅笔这些习惯？',
      '您身体怎么样？有没有正在服用什么药物？',
    ],
    pre_exam: [
      '接下来我先帮您检查一下牙齿和咬合的情况。',
      '等下我们会拍照片和X光片，还要取个模型做分析。',
      '检查完我会给您出一个详细的矫正方案，包括时间和费用。',
      '矫正的方式有好几种，到时候我会一一跟您介绍。',
    ],
  },
  cleaning: {
    greeting: [
      '您好，欢迎来洗牙，请坐。',
      '您是第一次来我们这里洗牙吗？',
      '平时刷牙有没有出血的情况？',
    ],
    medical_history: [
      '您上次洗牙是什么时候？',
      '刷牙时出血多吗？咬东西的时候牙龈会不会疼？',
      '有没有觉得牙齿有松动或者敏感的情况？',
      '您身体怎么样？有没有高血压、心脏病或者怀孕？',
      '有没有在吃什么特殊的药物？',
    ],
    pre_exam: [
      '我先帮您检查一下牙周情况，看看牙结石多不多。',
      '洗牙的时候可能会有一点点酸和出血，都是正常现象。',
      '洗完牙牙齿可能会有点敏感，一般两三天就好了。',
      '整个过程大概三四十分钟，您有不舒服就抬手告诉我。',
    ],
  },
};

const ageAdjustments: Record<AgeGroup, Partial<SpeechTemplate>> = {
  child: {
    greeting: ['小朋友你好呀~ 今天乖不乖呀？', '来，让叔叔/阿姨看看你的小白牙~'],
  },
  teen: {
    greeting: ['你好，请坐。我先了解一下你的情况。', '不用紧张，我们就是简单聊聊。'],
  },
  adult: {},
  senior: {
    greeting: ['阿姨/叔叔您好，快请坐。', '您慢点儿，我们不着急。'],
    medical_history: ['您血压平时控制得怎么样？', '心脏有没有什么问题？'],
  },
};

const anxietyAdjustments: Record<AnxietyLevel, Partial<SpeechTemplate>> = {
  low: {},
  medium: {
    greeting: ['别紧张，我们先聊聊，了解一下情况再说。', '整个过程我都会跟您说清楚的。'],
  },
  high: {
    greeting: [
      '您别紧张，我们这里很多患者刚开始也和您一样。',
      '我先跟您详细说说每一步是怎么做的，您放心。',
      '如果疼或者不舒服，您随时抬手，我立刻停下来。',
    ],
    pre_exam: [
      '我们先从最轻的开始，您适应一下。',
      '觉得难受我们就休息一下，不着急。',
    ],
  },
};

const firstVisitAdjustments: Partial<SpeechTemplate> = {
  greeting: ['欢迎您来我们门诊，我先给您简单介绍一下我们的流程。', '第一次来没关系，有什么不清楚的您随时问。'],
  pre_exam: ['这是我们的检查室，所有器械都是消过毒的，您放心。'],
};

export function getSpeechesByConditions(
  complaint: ChiefComplaintType,
  ageGroup: AgeGroup | null,
  anxietyLevel: AnxietyLevel | null,
  isFirstVisit: boolean | null
): SpeechItem[] {
  const base = baseSpeeches[complaint];
  let greeting = [...base.greeting];
  let medicalHistory = [...base.medical_history];
  let preExam = [...base.pre_exam];

  if (ageGroup && ageAdjustments[ageGroup]) {
    const adj = ageAdjustments[ageGroup];
    if (adj.greeting) greeting = [...adj.greeting, ...greeting.slice(adj.greeting.length)];
    if (adj.medical_history) medicalHistory = [...medicalHistory, ...adj.medical_history];
    if (adj.pre_exam) preExam = [...preExam, ...adj.pre_exam];
  }

  if (anxietyLevel && anxietyAdjustments[anxietyLevel]) {
    const adj = anxietyAdjustments[anxietyLevel];
    if (adj.greeting) greeting = [...adj.greeting, ...greeting.slice(adj.greeting.length)];
    if (adj.medical_history) medicalHistory = [...medicalHistory, ...adj.medical_history];
    if (adj.pre_exam) preExam = [...preExam, ...adj.pre_exam];
  }

  if (isFirstVisit && firstVisitAdjustments) {
    if (firstVisitAdjustments.greeting) greeting = [...firstVisitAdjustments.greeting, ...greeting];
    if (firstVisitAdjustments.pre_exam) preExam = [...preExam, ...firstVisitAdjustments.pre_exam];
  }

  const toSpeechItems = (items: string[], section: SpeechItem['section']): SpeechItem[] =>
    items.map((content) => ({
      id: generateId(),
      content,
      section,
      tags: [complaint, ageGroup || '', anxietyLevel || ''],
    }));

  return [
    ...toSpeechItems(greeting, 'greeting'),
    ...toSpeechItems(medicalHistory, 'medical_history'),
    ...toSpeechItems(preExam, 'pre_exam'),
  ];
}

export const chiefComplaintOptions: { type: ChiefComplaintType; label: string; icon: string }[] = [
  { type: 'toothache', label: '牙痛', icon: 'tooth' },
  { type: 'missing_tooth', label: '缺牙', icon: 'circle-off' },
  { type: 'malocclusion', label: '牙齿不齐', icon: 'align-vertical-distribute-center' },
  { type: 'cleaning', label: '洗牙咨询', icon: 'sparkles' },
];

export const ageGroupOptions: { value: AgeGroup; label: string }[] = [
  { value: 'child', label: '儿童 (0-12岁)' },
  { value: 'teen', label: '青少年 (13-18岁)' },
  { value: 'adult', label: '成年人 (19-59岁)' },
  { value: 'senior', label: '老年人 (60岁+)' },
];

export const anxietyLevelOptions: { value: AnxietyLevel; label: string }[] = [
  { value: 'low', label: '放松' },
  { value: 'medium', label: '有点紧张' },
  { value: 'high', label: '很紧张' },
];

export const speechSectionLabels: Record<SpeechSection | string, string> = {
  greeting: '开场问候',
  medical_history: '病史追问',
  pre_exam: '检查前说明',
};
