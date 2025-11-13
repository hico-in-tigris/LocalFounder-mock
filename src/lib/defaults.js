export function defaultStartupProfile() {
  return {
    name: '宿泊ロッジ試行プロジェクト',
    termStart: '2025-04-01',
    termEnd: '2028-03-31',
    region: '北海道',
    industry: '宿泊',
    stage: 'Running',
    headcount: 2,
    goal: '地域滞在型宿泊で年間1,000組のファンを獲得'
  };
}

export function defaultExperiments() {
  return [
    {
      id: 'exp-1',
      title: '週末マルシェ販売テスト',
      hypothesis: '地元食材を使った朝食セットは20%追加購入される',
      startDate: '2024-05-01',
      endDate: '2024-05-07',
      cost: 20000,
      revenue: 45000,
      bookings: 15,
      survey: 4,
      status: 'Learned',
      notes: 'アンケート結果を整理して次の仕入れを調整'
    },
    {
      id: 'exp-2',
      title: '平日ワーケーションプラン',
      hypothesis: '平日滞在を15%伸ばせる',
      startDate: '2024-04-15',
      endDate: '2024-05-31',
      cost: 50000,
      revenue: 80000,
      bookings: 10,
      survey: 3,
      status: 'Running',
      notes: '法人向けにヒアリング中'
    },
    {
      id: 'exp-3',
      title: '地元体験ツアー連携',
      hypothesis: '宿泊者の満足度を0.5向上させる',
      startDate: '2024-03-01',
      endDate: '2024-03-31',
      cost: 15000,
      revenue: 25000,
      bookings: 8,
      survey: 5,
      status: 'Completed',
      notes: '協業先の調整済み'
    }
  ];
}

export function defaultFundingPrograms() {
  return [
    { id: 'fund-1', name: '小規模事業者持続化補助金', type: '補助', deadline: '2024-07-15', region: '北海道', industry: '宿泊', stage: 'Running', link: '#', tasks: ['事業計画書ドラフト', '見積書収集', '商工会確認'] },
    { id: 'fund-2', name: '観光体験DX推進助成', type: '助成', deadline: '2024-08-20', region: '北海道', industry: '観光体験', stage: 'Running', link: '#', tasks: ['体験メニュー整理', 'DX計画書', '証憑整理'] },
    { id: 'fund-3', name: '地域連携低利融資', type: '融資', deadline: '2024-09-01', region: '北海道', industry: '宿泊', stage: 'Opening予定', link: '#', tasks: ['事業計画', '資金繰り表', '面談資料'] },
    { id: 'fund-4', name: '宿泊施設改装補助', type: '補助', deadline: '2024-06-30', region: '北海道', industry: '宿泊', stage: 'Idea', link: '#', tasks: ['改装計画', '見積書', '安全計画書'] },
    { id: 'fund-5', name: '地域観光スタートアップ加速化助成', type: '助成', deadline: '2024-10-15', region: '北海道', industry: 'IT', stage: 'Running', link: '#', tasks: ['プロトタイプ整理', 'KPI設定', '協業先証明'] }
  ];
}

export function defaultPermitTemplates() {
  return {
    '飲食': [
      { id: 'f-1', name: '食品衛生責任者講習', agency: '保健所', contact: '0120-000-123', documents: '申請書、身分証', fee: 10000, eta: 21, status: 'Todo' },
      { id: 'f-2', name: '飲食店営業許可', agency: '保健所', contact: '0120-000-123', documents: '図面、検査申請', fee: 20000, eta: 45, status: 'Todo' }
    ],
    '宿泊': [
      { id: 's-1', name: '旅館業営業許可', agency: '保健所', contact: '0120-111-234', documents: '申請書、施設図面', fee: 30000, eta: 60, status: 'Todo' },
      { id: 's-2', name: '消防設備検査', agency: '消防署', contact: '0120-567-890', documents: '検査申込書', fee: 15000, eta: 30, status: 'Todo' }
    ]
  };
}

export function defaultPermitTasks() {
  const templates = defaultPermitTemplates();
  return Object.keys(templates).reduce((acc, key) => {
    acc[key] = templates[key].map((item) => ({ ...item }));
    return acc;
  }, {});
}

export function defaultKpiRecords() {
  return [
    { id: 'kpi-1', month: '2024-02', revenue: 120000, guests: 85, bookings: 60, survey: 4.2, hires: 1, community: 3 },
    { id: 'kpi-2', month: '2024-03', revenue: 150000, guests: 92, bookings: 70, survey: 4.4, hires: 1, community: 4 },
    { id: 'kpi-3', month: '2024-04', revenue: 165000, guests: 98, bookings: 75, survey: 4.5, hires: 2, community: 5 }
  ];
}

export function defaultBmcNotes() {
  const keys = ['KeyPartners', 'KeyActivities', 'KeyResources', 'ValuePropositions', 'CustomerRelationships', 'Channels', 'CustomerSegments', 'CostStructure', 'RevenueStreams'];
  return keys.reduce((acc, key) => {
    acc[key] = '';
    return acc;
  }, {});
}

export function defaultPL() {
  const months = ['2024-05', '2024-06', '2024-07', '2024-08', '2024-09', '2024-10'];
  return months.map((month) => ({ month, revenue: 160000, cogs: 60000, opex: 40000 }));
}

export function defaultChatMessages() {
  return [
    { id: 'ai-hello', role: 'ai', text: 'こんにちは！本日の相談テーマはありますか？許認可や融資の準備など何でもどうぞ。' },
    { id: 'you-intro', role: 'you', text: '今週のタスク整理と許認可の段取りを知りたいです。' },
    { id: 'ai-guide', role: 'ai', text: '許認可は書類棚卸し→担当決め→提出準備の順番が効率的ですよ。' }
  ];
}

export function defaultChangeLog() {
  return [
    { id: 'log-1', title: 'BMC更新', detail: '価値提案を「地域回遊ツアー付宿泊」に更新', date: '2024-06-01' },
    { id: 'log-2', title: '実験登録', detail: 'ワーケーションプランABテストを追加', date: '2024-06-05' },
    { id: 'log-3', title: 'PL反映', detail: '実験結果を販促費に反映', date: '2024-06-10' }
  ];
}

export function defaultApprovals() {
  return [
    { id: 'ap-1', item: '旅館業営業許可', owner: '保健所', due: '2024-06-20', status: '提出準備中', progress: 70 },
    { id: 'ap-2', item: '消防設備検査', owner: '消防署', due: '2024-06-25', status: '日程調整', progress: 45 },
    { id: 'ap-3', item: '食品衛生講習', owner: '保健所', due: '2024-07-05', status: '受講予約済', progress: 20 }
  ];
}

export function defaultTasks() {
  return [
    { id: 'task-1', title: '宿泊プラン資料の更新', priority: '高', due: '2024-06-18', owner: '田中', done: false },
    { id: 'task-2', title: '許認可の必要書類整理', priority: '中', due: '2024-06-19', owner: '佐藤', done: false },
    { id: 'task-3', title: '融資面談の想定問答作成', priority: '高', due: '2024-06-22', owner: '高橋', done: true }
  ];
}
