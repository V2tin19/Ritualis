/**
 * 礼序台 (Ritualis) · 四柱八字与周礼象数气机推演引擎
 * 知识库源流：《滴天髓》《穷通宝鉴》《子平真诠》《三命通会》《神峰通考》及《项目周礼观》
 * 核心心法：变易优先、气机取象、冲合优先于生克、找断点通堵而不补缺
 */

const BAZI_ENGINE = (() => {
  // 1. 基础干支五行属性
  const TIANGAN = {
    "甲": { elem: "wood", yinyang: "阳", name: "甲木", desc: "纯阳之木，参天条达，生机勃发" },
    "乙": { elem: "wood", yinyang: "阴", name: "乙木", desc: "少阴之木，柔韧舒展，攀援条荣" },
    "丙": { elem: "fire", yinyang: "阳", name: "丙火", desc: "太阳之火，辉光宣散，普照万方" },
    "丁": { elem: "fire", yinyang: "阴", name: "丁火", desc: "太阴灯烛，温煦昭融，锻金改性" },
    "戊": { elem: "earth", yinyang: "阳", name: "戊土", desc: "城垣厚土，敦厚重载，障塞狂澜" },
    "己": { elem: "earth", yinyang: "阴", name: "己土", desc: "田园湿土，含蓄温润，培木孕金" },
    "庚": { elem: "metal", yinyang: "阳", name: "庚金", desc: "顽钝之金，刚健肃杀，得火成器" },
    "辛": { elem: "metal", yinyang: "阴", name: "辛金", desc: "温润宝玉，秀气清莹，好水淘洗" },
    "壬": { elem: "water", yinyang: "阳", name: "壬水", desc: "江湖巨浪，奔流不羁，浩瀚渗透" },
    "癸": { elem: "water", yinyang: "阴", name: "癸水", desc: "雨露甘霖，潜伏润下，萌发万物" }
  };

  const DIZHI = {
    "子": { elem: "water", yinyang: "阳", cang: [ { gan: "癸", weight: 1.0, role: "本气" } ] },
    "丑": { elem: "earth", yinyang: "阴", cang: [ { gan: "己", weight: 0.6, role: "本气" }, { gan: "辛", weight: 0.2, role: "中气" }, { gan: "癸", weight: 0.2, role: "余气" } ] },
    "寅": { elem: "wood", yinyang: "阳", cang: [ { gan: "甲", weight: 0.6, role: "本气" }, { gan: "丙", weight: 0.3, role: "中气" }, { gan: "戊", weight: 0.1, role: "余气" } ] },
    "卯": { elem: "wood", yinyang: "阴", cang: [ { gan: "乙", weight: 1.0, role: "本气" } ] },
    "辰": { elem: "earth", yinyang: "阳", cang: [ { gan: "戊", weight: 0.6, role: "本气" }, { gan: "乙", weight: 0.2, role: "中气" }, { gan: "癸", weight: 0.2, role: "余气" } ] },
    "巳": { elem: "fire", yinyang: "阴", cang: [ { gan: "丙", weight: 0.6, role: "本气" }, { gan: "庚", weight: 0.3, role: "中气" }, { gan: "戊", weight: 0.1, role: "余气" } ] },
    "午": { elem: "fire", yinyang: "阳", cang: [ { gan: "丁", weight: 0.7, role: "本气" }, { gan: "己", weight: 0.3, role: "中气" } ] },
    "未": { elem: "earth", yinyang: "阴", cang: [ { gan: "己", weight: 0.6, role: "本气" }, { gan: "丁", weight: 0.2, role: "中气" }, { gan: "乙", weight: 0.2, role: "余气" } ] },
    "申": { elem: "metal", yinyang: "阳", cang: [ { gan: "庚", weight: 0.6, role: "本气" }, { gan: "壬", weight: 0.3, role: "中气" }, { gan: "戊", weight: 0.1, role: "余气" } ] },
    "酉": { elem: "metal", yinyang: "阴", cang: [ { gan: "辛", weight: 1.0, role: "本气" } ] },
    "戌": { elem: "earth", yinyang: "阳", cang: [ { gan: "戊", weight: 0.6, role: "本气" }, { gan: "辛", weight: 0.2, role: "中气" }, { gan: "丁", weight: 0.2, role: "余气" } ] },
    "亥": { elem: "water", yinyang: "阴", cang: [ { gan: "壬", weight: 0.7, role: "本气" }, { gan: "甲", weight: 0.3, role: "中气" } ] }
  };

  // 月令当令加权表 (提纲月令司权)
  const YUELING_POWER = {
    "寅": { wood: 1.8, fire: 1.2, earth: 0.6, metal: 0.5, water: 0.9 },
    "卯": { wood: 2.0, fire: 1.3, earth: 0.5, metal: 0.4, water: 0.8 },
    "辰": { earth: 1.5, wood: 1.2, water: 1.2, fire: 0.8, metal: 0.8 }, // 辰为水库湿土
    "巳": { fire: 1.8, earth: 1.3, metal: 1.1, wood: 0.8, water: 0.4 },
    "午": { fire: 2.0, earth: 1.4, wood: 0.7, metal: 0.4, water: 0.3 },
    "未": { earth: 1.6, fire: 1.3, wood: 0.9, metal: 0.7, water: 0.4 }, // 未为木库燥土
    "申": { metal: 1.8, water: 1.3, earth: 0.7, fire: 0.5, wood: 0.4 },
    "酉": { metal: 2.0, water: 1.2, earth: 0.6, fire: 0.4, wood: 0.3 },
    "戌": { earth: 1.6, metal: 1.1, fire: 1.1, water: 0.4, wood: 0.5 }, // 戌为火库燥土
    "亥": { water: 1.8, wood: 1.3, metal: 0.8, fire: 0.4, earth: 0.5 },
    "子": { water: 2.0, wood: 1.2, metal: 0.7, fire: 0.3, earth: 0.4 },
    "丑": { earth: 1.5, water: 1.3, metal: 1.2, wood: 0.6, fire: 0.4 }  // 丑为金库湿土
  };

  // 十神计算
  const SHISHEN_MAP = {
    same_yinyang: { same_elem: "比肩", sheng_me: "偏印", me_sheng: "食神", ke_me: "七杀", me_ke: "偏财" },
    diff_yinyang: { same_elem: "劫财", sheng_me: "正印", me_sheng: "伤官", ke_me: "正官", me_ke: "正财" }
  };

  function getShiShen(dayGan, targetGan) {
    if (!dayGan || !targetGan || !TIANGAN[dayGan] || !TIANGAN[targetGan]) return "本元";
    if (dayGan === targetGan) return "日元";
    const d = TIANGAN[dayGan];
    const t = TIANGAN[targetGan];
    const isSameYinYang = d.yinyang === t.yinyang;
    const cat = isSameYinYang ? SHISHEN_MAP.same_yinyang : SHISHEN_MAP.diff_yinyang;

    if (d.elem === t.elem) return cat.same_elem;
    if (d.elem === "wood" && t.elem === "water") return cat.sheng_me;
    if (d.elem === "fire" && t.elem === "wood") return cat.sheng_me;
    if (d.elem === "earth" && t.elem === "fire") return cat.sheng_me;
    if (d.elem === "metal" && t.elem === "earth") return cat.sheng_me;
    if (d.elem === "water" && t.elem === "metal") return cat.sheng_me;

    if (d.elem === "wood" && t.elem === "fire") return cat.me_sheng;
    if (d.elem === "fire" && t.elem === "earth") return cat.me_sheng;
    if (d.elem === "earth" && t.elem === "metal") return cat.me_sheng;
    if (d.elem === "metal" && t.elem === "water") return cat.me_sheng;
    if (d.elem === "water" && t.elem === "wood") return cat.me_sheng;

    if (d.elem === "wood" && t.elem === "metal") return cat.ke_me;
    if (d.elem === "fire" && t.elem === "water") return cat.ke_me;
    if (d.elem === "earth" && t.elem === "wood") return cat.ke_me;
    if (d.elem === "metal" && t.elem === "fire") return cat.ke_me;
    if (d.elem === "water" && t.elem === "earth") return cat.ke_me;

    return cat.me_ke;
  }

  // 经典名造预设
  const PRESETS = {
    zhouli_case: {
      name: "《项目周礼观》乙木火旺局 (实战断点示范)",
      pillars: [
        { gan: "壬", zhi: "午" },
        { gan: "乙", zhi: "巳" },
        { gan: "乙", zhi: "丑" },
        { gan: "丁", zhi: "巳" }
      ],
      comment: "乙木双透，巳午火势成局极旺；丑土被双巳夹烤，火烤土焦；金弱水蒸。断在火->土->金->水，需辰湿土通关！"
    },
    ditian_water_tongguan: {
      name: "《滴天髓》金木相战·水神通关局 (任铁樵案)",
      pillars: [
        { gan: "庚", zhi: "申" },
        { gan: "甲", zhi: "申" },
        { gan: "庚", zhi: "寅" },
        { gan: "甲", zhi: "申" }
      ],
      comment: "三申冲一寅，天干庚金直伐甲木，金木两神对峙相残。必待运入北方水地，金生水、水生木，引通相战之势！"
    },
    ziping_earth_tongguan: {
      name: "《子平真诠》火金相战·湿土通关局",
      pillars: [
        { gan: "丙", zhi: "申" },
        { gan: "丙", zhi: "申" },
        { gan: "庚", zhi: "申" },
        { gan: "辛", zhi: "巳" }
      ],
      comment: "天干双丙透出，克制庚辛。火金并峙，须取丑辰湿土化火生金，两神不悖，方为通关纯美。"
    },
    qiongtong_wood_tongguan: {
      name: "《穷通宝鉴》水火既济·木神通关局",
      pillars: [
        { gan: "壬", zhi: "子" },
        { gan: "丙", zhi: "午" },
        { gan: "壬", zhi: "戌" },
        { gan: "丙", zhi: "午" }
      ],
      comment: "水火两相对峙，狂波逼烈日，两败俱伤。急需甲寅之木穿引，引水润木，木再生火，化相战为相生。"
    },
    shenfeng_earth_heavy: {
      name: "《神峰通考》厚土埋金·木水通关局",
      pillars: [
        { gan: "丙", zhi: "戌" },
        { gan: "戊", zhi: "戌" },
        { gan: "辛", zhi: "未" },
        { gan: "壬", zhi: "辰" }
      ],
      comment: "满局重重厚土，辛金衰弱深埋地下。取时干壬辰，辰为水库，淘洗金辉，更喜甲木疏土通阻！"
    }
  };

  // 2. 核心分析函数：计算八字五行势能、冲合博弈与周礼通关
  function analyzeBazi(pillars) {
    // pillars: [ {gan, zhi}, {gan, zhi}, {gan, zhi}, {gan, zhi} ] (年、月、日、时)
    const year = pillars[0];
    const month = pillars[1];
    const day = pillars[2];
    const hour = pillars[3];

    const dayGan = day.gan;
    const yueling = month.zhi;
    const yuelingWeight = YUELING_POWER[yueling] || { wood: 1, fire: 1, earth: 1, metal: 1, water: 1 };

    // 计算五行基础能量
    const rawScores = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };

    // 1. 统计天干得分 (每个天干基础权重 10)
    pillars.forEach(p => {
      const g = TIANGAN[p.gan];
      if (g) {
        rawScores[g.elem] += 12;
      }
    });

    // 2. 统计地支藏干得分
    pillars.forEach((p, idx) => {
      const z = DIZHI[p.zhi];
      if (z) {
        // 月令地支地气权重翻倍 (权重 20)
        const baseZhiWeight = (idx === 1) ? 25 : 15;
        z.cang.forEach(item => {
          const g = TIANGAN[item.gan];
          if (g) {
            rawScores[g.elem] += baseZhiWeight * item.weight;
          }
        });
      }
    });

    // 3. 乘月令旺衰系数
    const finalScores = {};
    let totalScore = 0;
    for (const key of ["wood", "fire", "earth", "metal", "water"]) {
      finalScores[key] = rawScores[key] * (yuelingWeight[key] || 1.0);
      totalScore += finalScores[key];
    }

    // 归一化为 10-100 范围的圆盘能量
    const energyMap = {};
    for (const key of ["wood", "fire", "earth", "metal", "water"]) {
      const pct = (finalScores[key] / (totalScore || 1)) * 100;
      // 映射到 15-95 之间
      energyMap[key] = Math.round(Math.min(95, Math.max(15, pct * 2.2)));
    }

    // 4. 冲合博弈分析 (冲合优先于生克)
    const chongHeList = [];

    // 天干五合检测
    const gans = [
      { gan: year.gan, col: "年干" },
      { gan: month.gan, col: "月干" },
      { gan: day.gan, col: "日干" },
      { gan: hour.gan, col: "时干" }
    ];

    const HE_TIANGAN = {
      "甲己": "土", "己甲": "土",
      "乙庚": "金", "庚乙": "金",
      "丙辛": "水", "辛丙": "水",
      "丁壬": "木", "壬丁": "木",
      "戊癸": "火", "癸戊": "火"
    };

    for (let i = 0; i < gans.length; i++) {
      for (let j = i + 1; j < gans.length; j++) {
        const pair = gans[i].gan + gans[j].gan;
        if (HE_TIANGAN[pair]) {
          const isAdjacent = (j === i + 1); // 紧贴
          chongHeList.push({
            type: "天干相合",
            pair: `${gans[i].col}(${gans[i].gan}) 与 ${gans[j].col}(${gans[j].gan}) 相合化【${HE_TIANGAN[pair]}】`,
            desc: isAdjacent ? "【紧贴相合·合力充沛】：双方情意深厚，产生‘贪合忘克’与‘合绊’效应！" : "【遥隔相合·羁绊微弱】：遥合相引，有合意而合力受制。",
            tanHe: `贪和效应：${gans[i].gan}与${gans[j].gan}相合牵绊，各自减弱对外的生克之力。`
          });
        }
      }
    }

    // 地支六合、六冲、三会、三合
    const zhis = [year.zhi, month.zhi, day.zhi, hour.zhi];
    const zhiPairs = [];
    for (let i = 0; i < zhis.length; i++) {
      for (let j = i + 1; j < zhis.length; j++) {
        zhiPairs.push({ p1: zhis[i], p2: zhis[j], i, j });
      }
    }

    const LIU_HE = {
      "子丑": "土", "丑子": "土", "寅亥": "木", "亥寅": "木",
      "卯戌": "火", "戌卯": "火", "辰酉": "金", "酉辰": "金",
      "巳申": "水", "申巳": "水", "午未": "土", "未午": "土"
    };

    const LIU_CHONG = {
      "子午": "水火激荡", "午子": "水火激荡",
      "丑未": "土气相冲", "未丑": "土气相冲",
      "寅申": "金木相战", "申寅": "金木相战",
      "卯酉": "金木相伐", "酉卯": "金木相伐",
      "辰戌": "水火库冲", "戌辰": "水火库冲",
      "巳亥": "水火相激", "亥巳": "水火相激"
    };

    zhiPairs.forEach(p => {
      const k = p.p1 + p.p2;
      if (LIU_HE[k]) {
        chongHeList.push({
          type: "地支六合",
          pair: `${p.p1} 与 ${p.p2} 六合化【${LIU_HE[k]}】`,
          desc: `【六合羁绊】：${p.p1}贪合${p.p2}，合能解冲，贪合忘冲！`,
          tanHe: `${p.p1}合住${p.p2}，若为忌神被合则吉，若为喜神被合则受绊无力。`
        });
      }
      if (LIU_CHONG[k]) {
        chongHeList.push({
          type: "地支六冲",
          pair: `${p.p1} 与 ${p.p2} 相冲 (${LIU_CHONG[k]})`,
          desc: `【气机震荡】：地支相冲如两车相撞，动摇根基。须察有无六合来解冲！`,
          tanHe: `冲能破合，合能解冲。《滴天髓》：“旺者冲衰衰者拔，衰神冲旺旺神发。”`
        });
      }
    });

    // 5. 追踪变化链条与断点 (变易优先原则)
    // 找出最旺的一行与最弱的一行
    let maxElem = "wood";
    let minElem = "wood";
    for (const key of ["wood", "fire", "earth", "metal", "water"]) {
      if (energyMap[key] > energyMap[maxElem]) maxElem = key;
      if (energyMap[key] < energyMap[minElem]) minElem = key;
    }

    const elemNames = { wood: "木", fire: "火", earth: "土", metal: "金", water: "水" };

    // 检查断点
    let brokenSection = "";
    let diagnosisDetail = "";
    let tongguanElement = "";
    let tongguanName = "";
    let tongguanAdvice = "";

    if (maxElem === "fire" && energyMap.earth < 45) {
      brokenSection = "火 ➔ 土 ➔ 金";
      diagnosisDetail = "火势暴烈宣散，局中缺乏温润厚土泄秀，火烈反烤焦燥土，致使金虚受熔，水源干涸！";
      tongguanElement = "earth";
      tongguanName = "湿土 (辰丑土)";
      tongguanAdvice = "【火金相战，以湿土通关】：必须取辰丑湿土为通关之神！一则吸收烈火热量，二则润泽结晶生金，三则蓄养弱水。切忌盲目见金水而直接生硬补救。";
    } else if (maxElem === "wood" && energyMap.fire < 40) {
      brokenSection = "木 ➔ 火 ➔ 土";
      diagnosisDetail = "木气极度膨胀生发无泄，木狂则直接穿凿厚土造成土崩，断在【木生火】这一环！";
      tongguanElement = "fire";
      tongguanName = "丙丁火";
      tongguanAdvice = "【木土相对，以火通关】：必须取火泄木之顽健，木生火、火生土，使木之狂力化为长养温土之功。";
    } else if (maxElem === "metal" && energyMap.water < 40) {
      brokenSection = "金 ➔ 水 ➔ 木";
      diagnosisDetail = "金气肃杀收敛过盛，寒金无水泄秀，肃杀之刃直接劈砍震木，造成木坚金缺之灾！";
      tongguanElement = "water";
      tongguanName = "壬癸水";
      tongguanAdvice = "【金木相残，以水通关】：取水润滑其锋，金生水、水生木，化杀气为甘霖，断点打通。";
    } else if (maxElem === "water" && energyMap.wood < 40) {
      brokenSection = "水 ➔ 木 ➔ 火";
      diagnosisDetail = "水势浩瀚泛滥成灾，无草木根系导流吸纳，洪涛直接扑灭离火，造成水多火灭！";
      tongguanElement = "wood";
      tongguanName = "甲寅风木";
      tongguanAdvice = "【水火相战，以木通关】：必须引木为经络，水生木、木生火，化狂澜为既济之大德。";
    } else if (maxElem === "earth" && energyMap.metal < 40) {
      brokenSection = "土 ➔ 金 ➔ 水";
      diagnosisDetail = "厚土重重板结，土厚埋金，金气受窒息不得显露，水路亦被重土截断塞滞！";
      tongguanElement = "metal";
      tongguanName = "庚辛金 (并配甲木疏土)";
      tongguanAdvice = "【土水对峙，以金通关】：取金穿引，土生金、金生水；并以甲木疏通板结，不补缺物，唯通枢纽！";
    } else {
      brokenSection = `${elemNames[maxElem]} ➔ ${elemNames[minElem]}`;
      diagnosisDetail = `局中以【${elemNames[maxElem]}】最雄旺，【${elemNames[minElem]}】最受制约。气机偏胜于${elemNames[maxElem]}行。`;
      tongguanElement = "earth";
      tongguanName = "通关调和中枢";
      tongguanAdvice = "顺应气机自然走向，观其合化与冲破，引旺相流通为美。";
    }

    // 6. 知识库经典断语调取 (《穷通宝鉴》《滴天髓》《子平真诠》)
    const classicQuotes = getClassicQuotations(dayGan, yueling, maxElem);

    return {
      pillars: [
        { ...year, label: "年柱", ganDesc: TIANGAN[year.gan].name, zhiDesc: DIZHI[year.zhi].elem, shishen: getShiShen(dayGan, year.gan) },
        { ...month, label: "月柱", ganDesc: TIANGAN[month.gan].name, zhiDesc: DIZHI[month.zhi].elem, shishen: getShiShen(dayGan, month.gan) },
        { ...day, label: "日柱", ganDesc: TIANGAN[day.gan].name, zhiDesc: DIZHI[day.zhi].elem, shishen: "日元本主" },
        { ...hour, label: "时柱", ganDesc: TIANGAN[hour.gan].name, zhiDesc: DIZHI[hour.zhi].elem, shishen: getShiShen(dayGan, hour.gan) }
      ],
      dayGan,
      yueling,
      energyMap,
      maxElem,
      minElem,
      chongHeList,
      brokenSection,
      diagnosisDetail,
      tongguanElement,
      tongguanName,
      tongguanAdvice,
      classicQuotes
    };
  }

  // 匹配古籍经典知识库原典
  function getClassicQuotations(dayGan, yueling, maxElem) {
    const quotes = [];
    
    // 《滴天髓》通关章
    quotes.push({
      book: "《滴天髓阐微·通关章》",
      text: "“关内有织女，关外有牛郎，此关若通也，相邀入洞房。天气欲降，地气欲升，欲相俣相和相生也。木土而要火，火金而要土，土水而要金，金木而要水，水火而要木，皆是牛郎织女之有情也。必得引用会合之神去其间阻，乃为通关。”"
    });

    // 《子平真诠》论用神通关
    quotes.push({
      book: "《子平真诠·论用神变化》",
      text: "“八字用神，专求月令。然有两神对峙，强弱均平，各不相下，须调和之为美，此以通关为用也。合能解冲，冲能破合；忌神被合则不能为害，喜神被合则发力受制。”"
    });

    // 《穷通宝鉴》按日干月令调候
    if (dayGan === "乙") {
      quotes.push({
        book: "《穷通宝鉴·论乙木》",
        text: "“三夏乙木，木性枯焦，极喜癸水润泽，然火旺水易涸，尤重湿土以蓄水培根。若支成火局，火炎木焚，非见辰丑之土化火生金蓄水，不能全其生理。”"
      });
    } else if (dayGan === "甲") {
      quotes.push({
        book: "《穷通宝鉴·论甲木》",
        text: "“甲木参天，脱胎要火，春不容金，秋不容土，火炽乘龙，水宕骑虎。地润天和，植立千古。”"
      });
    } else if (dayGan === "庚" || dayGan === "辛") {
      quotes.push({
        book: "《穷通宝鉴·论金》",
        text: "“金长生在巳，旺在酉，墓在丑。夏金气衰，火旺金熔，喜土生之，土润生金，土燥脆金；秋金司令，刚锐肃杀，得火煅炼成器，得水淘洗显秀。”"
      });
    } else if (dayGan === "丙" || dayGan === "丁") {
      quotes.push({
        book: "《穷通宝鉴·论火》",
        text: "“离火炎上，太阳之精。夏火当令，草木皆槁，需湿润之土导其暴烈，金水资其蒸腾。火土相生，土润则秀，火燥则枯。”"
      });
    } else {
      quotes.push({
        book: "《穷通宝鉴·论五行气数》",
        text: "“五行四时之运，相生相制。大抵旺者宜泄宜克，弱者宜生宜扶。两气交争，必取相生之行以通其关，气顺则吉，气阻则殃。”"
      });
    }

    return quotes;
  }

  return {
    TIANGAN,
    DIZHI,
    PRESETS,
    analyzeBazi
  };
})();

if (typeof module !== 'undefined') {
  module.exports = BAZI_ENGINE;
}
