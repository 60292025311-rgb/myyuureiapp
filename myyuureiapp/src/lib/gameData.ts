// ============================================================
//  ゲームデータ定義  『爆弾：九つの尻尾』
// ============================================================

/** プレイヤーの心の形を表すパラメーター */
export interface PlayerStats {
  ethics: number;      // 倫理値    -10 〜 +10
  empathy: number;     // 共感値    -10 〜 +10
  logic: number;       // 論理値    -10 〜 +10
  courage: number;     // 胆力値    -10 〜 +10
}

export const INITIAL_STATS: PlayerStats = {
  ethics: 0,
  empathy: 0,
  logic: 0,
  courage: 0,
};

// ============================================================
//  選択肢の型
// ============================================================
export interface Choice {
  id: string;
  text: string;
  effect: Partial<PlayerStats>;
  reactionText?: string; // タゴサクの反応（短文）
}

// ============================================================
//  通常質問の型
// ============================================================
export interface Question {
  id: number;
  tagosakuText: string;   // タゴサクのセリフ
  choices: Choice[];
}

// ============================================================
//  爆弾クイズの型
// ============================================================
export interface BombQuiz {
  id: "BOMB";
  tagosakuIntro: string;  // 出題前のセリフ
  quizText: string;       // 長文謎解き
  correctAnswer: string;  // 正解キーワード（部分一致でOK）
  hintText: string;       // ヒント
  successReaction: string;
  failureReaction: string;
  timeLimitSeconds: number;
}

// ============================================================
//  エンディングの型
// ============================================================
export interface Ending {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  mindShape: string;      // 心の形の診断名
  mindShapeDesc: string;  // 診断の説明
  color: string;          // テーマカラー (tailwind class)
}

// ============================================================
//  9つの質問データ
// ============================================================
export const QUESTIONS: Question[] = [
  // Q1
  {
    id: 1,
    tagosakuText:
      "……刑事さん。あなたは川を歩いていた。\n対岸に子供が溺れている。\nしかし川を渡れば、あなたの大切な日記帳が濡れてしまう。\n……さあ、どうしますか？",
    choices: [
      {
        id: "1a",
        text: "迷わず川に飛び込んで子供を助ける",
        effect: { ethics: +2, empathy: +2, courage: +1 },
        reactionText: "……即答ですか。清々しいほど正しい。でも、本当に？",
      },
      {
        id: "1b",
        text: "日記帳を岸に置いてから川に入る",
        effect: { ethics: +1, empathy: +1, logic: +2 },
        reactionText: "なるほど。合理的だ。あなたは損失を計算してから動く人だ。",
      },
      {
        id: "1c",
        text: "助けを呼んで自分は岸で待つ",
        effect: { ethics: 0, empathy: -1, logic: +1 },
        reactionText: "……声を上げるだけ。体は動かさない。ふーん。",
      },
      {
        id: "1d",
        text: "日記帳を持ったまま川に入る",
        effect: { ethics: +1, empathy: +2, logic: -1, courage: +2 },
        reactionText: "ははは。欲張りだ。でも、一番人間らしい。",
      },
    ],
  },

  // Q2
  {
    id: 2,
    tagosakuText:
      "では次の問いです。\nあなたは無人島に漂着した。\n一緒にいるのは赤の他人の老人と、あなたの飼い犬だ。\n食料は二人と一匹では足りない。誰かが犠牲にならなければ……\n老人は黙って海を見ている。\n……あなたはどうする？",
    choices: [
      {
        id: "2a",
        text: "三者で平等に分け、運を天に任せる",
        effect: { ethics: +2, empathy: +1, logic: -1 },
        reactionText: "公平……ね。でも全員死ぬかもしれない。それでも公平ですか？",
      },
      {
        id: "2b",
        text: "犬を……処分して、老人と二人で生き延びる",
        effect: { ethics: -1, empathy: -2, logic: +3, courage: +1 },
        reactionText: "冷静だ。論理的だ。…あなたは何を切り捨てることができる人間だ。",
      },
      {
        id: "2c",
        text: "老人に一人で逝くよう説得する",
        effect: { ethics: -3, empathy: -1, logic: +1, courage: -1 },
        reactionText: "……それを言葉にできる人間ですか。あなたは。",
      },
      {
        id: "2d",
        text: "自分が食べる分を老人と犬に譲る",
        effect: { ethics: +3, empathy: +3, courage: +2, logic: -1 },
        reactionText: "……自己犠牲。美しい。でも、それは本当に勇気ですか？逃げでは？",
      },
    ],
  },

  // Q3
  {
    id: 3,
    tagosakuText:
      "刑事さん、あなたは壁に向かって落書きをする子供を見つけた。\nその子の顔には薄い笑みが浮かんでいる。\n……その笑みは、何に見えますか？",
    choices: [
      {
        id: "3a",
        text: "楽しそうな、ただの子供の笑顔",
        effect: { empathy: +2, logic: -1 },
        reactionText: "……あなたには悪意が見えない。それは幸福か、鈍感か。",
      },
      {
        id: "3b",
        text: "誰かに怒ってほしい、SOSの笑顔",
        effect: { empathy: +3, ethics: +1 },
        reactionText: "深読みしすぎ……かもしれない。でも、あなたは他者の痛みを探す人だ。",
      },
      {
        id: "3c",
        text: "悪意のある、挑発的な笑顔",
        effect: { logic: +2, empathy: -2 },
        reactionText: "先入観。ふふ。あなたは他人を信じていない。",
      },
      {
        id: "3d",
        text: "空虚な、何も考えていない笑顔",
        effect: { logic: +1, ethics: -1, empathy: -1 },
        reactionText: "……虚無を見るんですか。それはあなた自身の投影では？",
      },
    ],
  },

  // Q4
  {
    id: 4,
    tagosakuText:
      "少し趣向を変えましょう。\nあなたは今夜、夢を見た。\n夢の中のあなたは、ある人を手にかけた。\n目が覚めて——あなたはまず何を感じますか？",
    choices: [
      {
        id: "4a",
        text: "強烈な罪悪感と嫌悪感",
        effect: { ethics: +2, empathy: +1 },
        reactionText: "良心がある。……でも夢だけでそこまで揺れるとは、脆い心だ。",
      },
      {
        id: "4b",
        text: "なんとも思わない。ただの夢だ",
        effect: { logic: +2, empathy: -1 },
        reactionText: "理性的……いや、感情の切り離しが上手すぎる。",
      },
      {
        id: "4c",
        text: "不思議な解放感",
        effect: { ethics: -2, courage: +1, empathy: -1 },
        reactionText: "……正直な人だ。その解放感が何から来ているのか、分かりますか？",
      },
      {
        id: "4d",
        text: "相手が誰だったか確かめたくなる",
        effect: { logic: +3, ethics: -1 },
        reactionText: "ふふふ……刑事さんらしい。夢の中でも捜査をする気ですか。",
      },
    ],
  },

  // Q5
  {
    id: 5,
    tagosakuText:
      "刑事さん——あなたは長い間、ある事実を隠していたとしましょう。\n誰にも言えない、小さな嘘を。\nその嘘が今、露見しそうになっている。\n……あなたはどうしますか？",
    choices: [
      {
        id: "5a",
        text: "自分から白状する",
        effect: { ethics: +3, courage: +2 },
        reactionText: "……正直者。でも、それが本当に勇気なのか、ただの恐怖なのか。",
      },
      {
        id: "5b",
        text: "さらに巧みな嘘で隠蔽する",
        effect: { ethics: -3, logic: +2, courage: -1 },
        reactionText: "嘘に嘘を重ねる。あなたはそれができる人間だ。……素晴らしい。",
      },
      {
        id: "5c",
        text: "黙って証拠を隠滅する",
        effect: { ethics: -2, logic: +1, empathy: -2, courage: -1 },
        reactionText: "行動する人だ。でも、その行動の向かう先は……",
      },
      {
        id: "5d",
        text: "開き直って、嘘だったと笑い飛ばす",
        effect: { ethics: -1, courage: +3, empathy: -1 },
        reactionText: "……厚かましい。でも、それが一番傷つかない生き方かもしれない。",
      },
    ],
  },

  // Q6
  {
    id: 6,
    tagosakuText:
      "さあ、折り返しです。\nあなたの目の前に、二つの扉がある。\n左の扉の向こうには「真実」がある。\n右の扉の向こうには「平和」がある。\nどちらか一方しか選べない。\n……あなたは？",
    choices: [
      {
        id: "6a",
        text: "左——真実を選ぶ",
        effect: { logic: +2, ethics: +1, empathy: -1 },
        reactionText: "真実が欲しい人だ。……たとえそれが、あなたを壊すとしても？",
      },
      {
        id: "6b",
        text: "右——平和を選ぶ",
        effect: { empathy: +2, ethics: +1, logic: -1 },
        reactionText: "平和を望む……穏やかな人だ。でも、偽りの平和でもいいんですか？",
      },
      {
        id: "6c",
        text: "どちらも選ばず、扉を蹴破って第三の道を探す",
        effect: { courage: +3, logic: +1, ethics: -1 },
        reactionText: "ははは！！反逆者だ！！あなたは面白い。ひどく面白い。",
      },
      {
        id: "6d",
        text: "迷いすぎて、その場に座り込む",
        effect: { empathy: +1, courage: -2, ethics: +1 },
        reactionText: "……動けない。それも、一つの答えですよ。",
      },
    ],
  },

  // Q7
  {
    id: 7,
    tagosakuText:
      "刑事さん、あなたは大切な人を失った直後だとします。\nそのとき、見知らぬ人があなたに「大丈夫ですか」と声をかけてきた。\n……あなたはどう返しますか？",
    choices: [
      {
        id: "7a",
        text: "「大丈夫です」と笑って答える",
        effect: { ethics: 0, empathy: -1, courage: +1 },
        reactionText: "……強がり。あなたは弱さを見せることが怖い人だ。",
      },
      {
        id: "7b",
        text: "黙って首を横に振る",
        effect: { empathy: +1, courage: -1 },
        reactionText: "言葉にできない。……それが正直というものです。",
      },
      {
        id: "7c",
        text: "「関係ない人に言ってどうなる」と突き放す",
        effect: { empathy: -3, ethics: -1, courage: +1 },
        reactionText: "……孤独を選ぶ人だ。誰かの善意すら信じられない。",
      },
      {
        id: "7d",
        text: "その人の手を握って、泣く",
        effect: { empathy: +3, ethics: +1, courage: +1 },
        reactionText: "……他者に委ねられる人。それは弱さではない。と、私は思いますよ。",
      },
    ],
  },

  // Q8
  {
    id: 8,
    tagosakuText:
      "もう少しです、刑事さん。\n世界に一つだけボタンがある。\n押せば、現在生きている人間の半数が無作為に消える代わりに、\n残った半数は永遠に戦争のない世界で生きられる。\n……あなたはそのボタンを押しますか？",
    choices: [
      {
        id: "8a",
        text: "押す",
        effect: { logic: +3, ethics: -3, empathy: -2, courage: +2 },
        reactionText: "……押せる人がいた。あなたは神になれる人間だ。恐ろしい。",
      },
      {
        id: "8b",
        text: "押さない",
        effect: { ethics: +2, empathy: +2, logic: -1 },
        reactionText: "押さない。……では今ある苦しみを、あなたは引き受けるんですね。",
      },
      {
        id: "8c",
        text: "ボタンを壊す",
        effect: { ethics: +1, courage: +3, logic: +1 },
        reactionText: "選択肢そのものを拒否する。……それが一番難しいことかもしれない。",
      },
      {
        id: "8d",
        text: "誰か他の人に委ねる",
        effect: { ethics: 0, empathy: -1, courage: -3, logic: +1 },
        reactionText: "……決断を逃げる。あなたは責任を持てない人間ですか？違う、怖いだけだ。",
      },
    ],
  },

  // Q9（最終質問）
  {
    id: 9,
    tagosakuText:
      "……最後の質問です。\nこれが終わったら、あなたは私をどうするつもりですか。\n刑事さん。",
    choices: [
      {
        id: "9a",
        text: "法に従って、正式に逮捕する",
        effect: { ethics: +3, logic: +2 },
        reactionText: "……秩序の人。あなたは最後まで刑事でいることを選ぶ。",
      },
      {
        id: "9b",
        text: "証拠がなければ何もできない",
        effect: { logic: +3, ethics: 0, courage: -1 },
        reactionText: "現実的だ。……でもそれで、本当に納得できますか？",
      },
      {
        id: "9c",
        text: "私の手で、ここで終わらせる",
        effect: { ethics: -3, courage: +3, empathy: -1 },
        reactionText:
          "……ふふふ。そうですか。ならば——私も、あなたに覚悟を見せましょう。",
      },
      {
        id: "9d",
        text: "……あなたが何者なのか、まだ理解できていない",
        effect: { empathy: +1, logic: -1, courage: -1 },
        reactionText: "そうですか。……では、私のことは、忘れてください。ふふ。",
      },
    ],
  },
];

// ============================================================
//  爆弾クイズ（Q5の後に出題）
// ============================================================
export const BOMB_QUIZ: BombQuiz = {
  id: "BOMB",
  tagosakuIntro:
    "……さて。\n心理テストは、ここで一旦中断です。\n\n刑事さん、あなたには今から、本当の仕事をしてもらいます。\n\n私は今日、この街のどこかに爆発物を仕掛けました。\nあなたに場所を当ててもらわなければ——誰かが死ぬ。\n\n解いてみせてください。",

  quizText: `【爆弾の在り処】

以下の文章を読み、爆発物が仕掛けられた場所を答えよ。

―――――――――――――――――――――――――――

「太陽が最初に顔を出す場所で、私は眠っている。

 鉄の鳥たちが列をなして空を渡り、
 その翼の影が大地を撫でていく。

 私の眠る場所は——
  ・人々が夢を買う場所の隣
  ・時を刻む鐘が、朝と夜に二度だけ鳴る場所
  ・地下ではなく、地上。しかし屋根の下
  ・緑の匂いがする、石畳の上

 ヒントをもう一つ。
 そこには毎朝、白い煙が立ち上る。
 人々は列をなして、その煙の向こうに消えていく。

 ……分かりましたか？　刑事さん。」

―――――――――――――――――――――――――――

※「鉄の鳥たちが列をなす」場所とは？
※「人々が夢を買う場所」とは、どこを指すか？
※「白い煙の向こうに消えていく」とは、どういう状況か？`,

  correctAnswer: "駅",  // 「えき」「駅」「station」どれでも正解
  hintText:
    "ヒント：「鉄の鳥 = 電車」「夢を買う = チケット売り場・宝くじ？」「白い煙の向こうへ消える = ホームから電車に乗る」……全てを繋ぎ合わせると？",
  successReaction:
    "……正解です。\n\n刑事さん。\nあなたは、今日だけは——優秀だった。\n\n爆発物の解除コードを教えましょう。\n【0-9-2-9】\n……その数字の意味は、自分で考えてください。",
  failureReaction:
    "……残念です。\n\n時間切れ、あるいは——不正解。\n\nどこかで、何かが壊れた音がした気がしますね。\n刑事さん、あなたは今日、何かを守れなかった。",
  timeLimitSeconds: 120,
};

// ============================================================
//  エンディング定義
// ============================================================
export const ENDINGS: Record<string, Ending> = {
  // 爆弾成功 × 高倫理
  HERO: {
    id: "HERO",
    title: "END：正義の番人",
    subtitle: "爆発は阻止された",
    description:
      "あなたは最後まで刑事であり続けた。\nタゴサクの罠も、心の揺さぶりも、全てを受け止めながら——あなたは正解を導き出した。\n爆発物は解除され、街は今日も普通に息をしている。\n\nタゴサクはただ静かに笑った。\n「……また会いましょう、刑事さん。」",
    mindShape: "堅固な正八面体",
    mindShapeDesc:
      "あなたの心は正しく、強く、そして少し頑固だ。揺れても崩れない。しかし、その硬さが時に他者を傷つけることを忘れずに。",
    color: "text-blue-400",
  },

  // 爆弾成功 × 低倫理
  DARK_HERO: {
    id: "DARK_HERO",
    title: "END：影の救済者",
    subtitle: "爆発は阻止された——しかし",
    description:
      "あなたは爆発を止めた。\nしかし、その過程であなたが選んだ答えは——決して清廉ではなかった。\n目的のためなら手段を選ばない。\nその選択が正しかったのか、誰にも分からない。\n\nタゴサクは去り際に囁いた。\n「……あなたと私は、似ている。」",
    mindShape: "歪んだ五芒星",
    mindShapeDesc:
      "あなたの心には鋭い刃がある。正義と悪の境界線が曖昧で、しかし誰よりも結果を出す。その危うさを、誰かに見ていてもらえ。",
    color: "text-purple-400",
  },

  // 爆弾失敗 × 高倫理
  TRAGIC: {
    id: "TRAGIC",
    title: "END：善意の敗北",
    subtitle: "爆発は——止められなかった",
    description:
      "あなたは正しかった。\n選んだ答えも、示した姿勢も、全て誠実だった。\nしかし謎は解けなかった。時間が足りなかった。\n\n遠くで、低い音が響いた。\n\nタゴサクはもういない。\nあなたは、ただ煙を見ていた。\n正しい人間が報われない夜がある——これはそういう話だ。",
    mindShape: "美しい、しかし砕けた円",
    mindShapeDesc:
      "あなたの心は純粋で、他者への愛に満ちている。しかし、善意だけでは世界は救えない。その痛みを知ったとき、あなたは本当に強くなる。",
    color: "text-amber-400",
  },

  // 爆弾失敗 × 低倫理
  ABYSS: {
    id: "ABYSS",
    title: "END：深淵",
    subtitle: "全てが終わった",
    description:
      "爆発は止まらなかった。\nそして、あなたが今日示した心の形は——深く、暗い穴に似ていた。\n\nタゴサクは最後に言った。\n「……あなたは、私よりも深いところにいる。」\n\n自分が怖くなったとき、誰かに会いに行け。\nそれがこの物語の、唯一の結論だ。",
    mindShape: "底のない螺旋",
    mindShapeDesc:
      "あなたの心は複雑に歪んでいる。悪意というより、深い疲れと不信感。その螺旋から抜け出すために必要なのは、一人の他者との正直な対話かもしれない。",
    color: "text-red-500",
  },
};

// ============================================================
//  エンディング判定ロジック
// ============================================================
export function determineEnding(
  stats: PlayerStats,
  bombSuccess: boolean
): Ending {
  const totalEthics = stats.ethics + stats.empathy;

  if (bombSuccess && totalEthics >= 2) return ENDINGS.HERO;
  if (bombSuccess && totalEthics < 2) return ENDINGS.DARK_HERO;
  if (!bombSuccess && totalEthics >= 2) return ENDINGS.TRAGIC;
  return ENDINGS.ABYSS;
}

// ============================================================
//  爆弾クイズの正解判定
// ============================================================
export function checkBombAnswer(answer: string): boolean {
  const normalized = answer.trim().toLowerCase();
  // 「駅」「えき」「station」「eki」を正解とする
  return (
    normalized.includes("駅") ||
    normalized.includes("えき") ||
    normalized.includes("eki") ||
    normalized.includes("station")
  );
}

// クイズが出題されるタイミング（この質問IDの後）
export const BOMB_QUIZ_AFTER_QUESTION = 5;
