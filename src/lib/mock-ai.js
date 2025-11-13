const mockAI = {
  summarizeExperiment(exp) {
    const moods = ['堅調', '挑戦中', '好感触'];
    const tagsPool = ['販促', '宿泊', '地域連携', 'DX', '集客', '顧客体験'];
    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
    return {
      summaryAI: `${exp.title}は${pick(moods)}。仮説「${exp.hypothesis || '---'}」に対し、顧客反応は${['高め', '横ばい', '改善余地'][Math.floor(Math.random() * 3)]}です。`,
      nextActionAI: [1, 2, 3].map((i) => `${exp.title}向けフォロー${i}：${pick(['SNS告知強化', '現地ヒアリング', '価格テスト'])}`),
      tags: Array.from({ length: 3 }, () => pick(tagsPool))
    };
  },
  nextThreeActions(state) {
    const suggestions = [
      { title: '観光事業者と協業ミーティング', reason: '宿泊プランの共同販売を検討', cta: '打ち合わせ日程を調整' },
      { title: '週末マルシェ出店の結果共有', reason: '学びをPlanに反映', cta: 'レポートをまとめる' },
      { title: '次の補助金ドラフト整理', reason: '締切まで1週間', cta: '必要資料を棚卸し' },
      { title: 'OTAサイトの口コミ返信', reason: '顧客満足度向上', cta: 'テンプレートを下書き' },
      { title: '地域メディアへPR送付', reason: '夏休み集客を狙う', cta: 'ドラフトメールを送る' }
    ];
    return suggestions.slice(0, 3);
  },
  reply(message) {
    const text = (message || '').trim();
    const randomPick = (options) => options[Math.floor(Math.random() * options.length)];
    if (!text) {
      return 'まずは聞きたいテーマを教えてください。許認可、融資、実験計画などにも応えます。';
    }
    if (text.includes('許認')) {
      const templates = [
        '許認可対応のToDoです。1) 必要書類の棚卸し 2) 役所との事前相談 3) 取得後の運用体制メモをまとめましょう。',
        '許認可準備ステップを提案します。① 手続きフローの可視化 ② 必要資料の期限逆算 ③ 担当者ごとの役割を決めましょう。',
        '許認可タスクを3点に整理しました。A. 管轄部署への確認 B. 施設・図面の最新版共有 C. 提出前のセルフチェックリスト整備です。'
      ];
      return randomPick(templates);
    }
    if (text.includes('融資')) {
      const templates = [
        '融資準備の基本セットです。1) 最新のPL/BS 2) 事業計画書 3) 資金繰り表を整備し、次の一手として面談の想定問答を作りましょう。',
        '融資に向けたドキュメントは「直近決算」「資金繰り表」「担保説明資料」の3点を。次は金融機関との打診スケジュールを固めましょう。',
        '融資対応で揃えたいのは、A. 直近の試算表 B. 設備投資計画 C. 返済計画。次はシミュレーションを用意して面談準備です。'
      ];
      return randomPick(templates);
    }
    const templates = [
      '実験データはPLのどこに反映するかを決めましょう。粗利と販促費のインパクトを追記すると、次の意思決定がしやすくなります。',
      '実験結果は仮説ごとに整理し、PLでは売上と費用のどこへ反映させるかをメモ化しましょう。翌週の会議で提案しやすくなります。',
      '実験サイクルから得た学びは、PLの販管費内訳とROIコメント欄に追記しておくと、数字の説得力が高まります。'
    ];
    return randomPick(templates);
  }
};

export function scoreFunding(profile, program, kpiRecords, permitTasks) {
  const today = new Date();
  const daysUntil = Math.ceil((new Date(program.deadline) - today) / (1000 * 60 * 60 * 24));
  let score = 0;
  if (program.region === profile.region) score += 25;
  if (!program.industry || program.industry === profile.industry) score += 25;
  if (program.stage === profile.stage) score += 15;
  if ((profile.headcount || 0) >= 1) score += 10;
  if (daysUntil <= 60) score += 5;
  const recent = kpiRecords.slice(-2);
  if (recent.length === 2) {
    if ((recent[1].revenue || 0) > (recent[0].revenue || 0)) score += 10;
  }
  const anyProgress = Object.values(permitTasks).some((tasks) => tasks.some((task) => task.status !== 'Todo'));
  if (anyProgress) score += 10;
  return Math.min(score, 100);
}

export default mockAI;
