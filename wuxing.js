/**
 * 礼序台 (Ritual Order Platform) · 周礼象数推演核心引擎
 * 遵循周礼观：易为物理，变为体，衡为用；不问是什么，只问怎么变；不补缺口，只通堵塞。
 */

// =============================================================================
// 一、周礼象数与动态动力学数据库
// =============================================================================

const WUXING_DATA = {
  elements: {
    metal: {
      id: "metal",
      name: "金",
      pinyin: "jīn",
      bagua: "兑乾 · 少阴",
      trend: "收敛、致密、从革、肃杀、清冷、固化",
      tiyong: "体为凝练致密，用为从革裁度。非化学冷铁，乃一切由弥散趋向凝聚之变易。",
      physics: "物质相变结晶、冷却固化、密度上升、熵减凝聚；如熔融玻璃冷却成器、深秋水汽凝为白露。",
      sheng: "water",
      ke: "wood",
      beSheng: "earth",
      beKe: "fire",
      color: "#fed636",
      darkColor: "#b8860b",
      scripture: "《尚书·洪范》：“金曰从革。”孔颖达疏：“革，改也。金可改更，从人意而铸为器物也。”"
    },
    water: {
      id: "water",
      name: "水",
      pinyin: "shuǐ",
      bagua: "坎 · 太阴",
      trend: "闭藏、流动、渗透、润下、归根、涵蓄",
      tiyong: "体为流转渗透，用为滋润生发、涵养万有。非死寂之水，乃动态迁移与能量基态之承托。",
      physics: "流体动力、溶解传质、最低势能面趋向、能量潜藏；如严冬万物生机闭藏于地下根系。",
      sheng: "wood",
      ke: "fire",
      beSheng: "metal",
      beKe: "earth",
      color: "#2498db",
      darkColor: "#0f5c9e",
      scripture: "《尚书·洪范》：“水曰润下。”《道德经》：“上善若水，水善利万物而不争，处众人之所恶。”"
    },
    wood: {
      id: "wood",
      name: "木",
      pinyin: "mù",
      bagua: "震巽 · 少阳",
      trend: "生发、扩张、向上、条达、舒展、穿透",
      tiyong: "体为萌发柔韧，用为穿透破滞、向阳伸展。非枯槁之木料，乃生命膨胀克服重力之冲力。",
      physics: "生物能量泵升、负熵流积聚、光合合成、细胞分化扩张；如春雷一动草木破土穿石而出。",
      sheng: "fire",
      ke: "earth",
      beSheng: "water",
      beKe: "metal",
      color: "#1ca857",
      darkColor: "#0e602f",
      scripture: "《尚书·洪范》：“木曰曲直。”朱熹注：“木可曲可直，能顺万物之形而发舒条畅也。”"
    },
    fire: {
      id: "fire",
      name: "火",
      pinyin: "huǒ",
      bagua: "离 · 太阳",
      trend: "宣散、升腾、发热、明亮、热烈、转化",
      tiyong: "体为热能辐射，用为转化物性、去水改性。无根之火易逝，用即散，不残留于器内。",
      physics: "热力学剧烈氧化反应、高能态辐射释放、熵增宣泄；如陶土入窑经火烧结重结晶，火尽土新。",
      sheng: "earth",
      ke: "metal",
      beSheng: "wood",
      beKe: "water",
      color: "#e83628",
      darkColor: "#9e180d",
      scripture: "《尚书·洪范》：“火曰炎上。”《紫砂壶辩论》：“火生土非火化为土，乃火性变土性；火性已散，土性已新。”"
    },
    earth: {
      id: "earth",
      name: "土",
      pinyin: "tǔ",
      bagua: "坤艮 · 阴阳枢纽",
      trend: "承载、转化、缓冲、稳定、稼穑、受纳",
      tiyong: "体为敦厚包容，用为中和四象、通关受化。乃五行运化之基座介质，辨燥湿之变（如辰戌丑未）。",
      physics: "介质界面、热容缓冲带、多孔吸附催化剂；如地壳表层吸收日光、涵养水源、孕育草木矿藏。",
      sheng: "metal",
      ke: "water",
      beSheng: "fire",
      beKe: "wood",
      color: "#8c7362",
      darkColor: "#544336",
      scripture: "《尚书·洪范》：“土爰稼穑。”《周易·坤卦》：“地势坤，君子以厚德载物。”"
    }
  },

  // 相生关系链条深机
  shengChains: {
    "wood-fire": {
      id: "sheng-wood-fire",
      from: "wood",
      to: "fire",
      title: "木生火 · 生发极盛而宣散",
      tagline: "“积阴成阳 · 宣发至热 · 能量升华”",
      mechanism: "木气持续条达扩张，积蓄内部张力与生物能量；当扩张至极、密度与势能达到临界，自发破壳化为光热辐射，故木极生火。",
      tiyong: "以木之实体结构为燃料基底，转化为火之无形辐射。火用毕则木性化灰，转化为土。",
      tanShengWangKe: "【贪生忘克转化】：水克火，局中见木则‘水贪生木，木再生火’。水不仅不灭火，反通过木化为生火之源，克局化为长养！前提是木路通畅，若木被金斩断，则水仍直克火。",
      excessive: "【母慈灭子 / 子盗母气】：木多火窒（湿木过稠压灭微火）；子旺母衰（火势太烈狂烧，木体焚毁过速，气机衰竭）。",
      quote: "《滴天髓》：“强木得火，方化其顽；木盛火衰，反致枯槁。”"
    },
    "fire-earth": {
      id: "sheng-fire-earth",
      from: "fire",
      to: "earth",
      title: "火生土 · 紫砂陶钧与物性重塑",
      tagline: "“火非化土 · 乃火性改土性 · 陶成火散得金用”",
      mechanism: "【周礼观核心辩正】：传统误以为火生土是火烧成灰变成土。实则火是能量与性质改变者！黏土经窑火高温烧制，去尽游离水、晶格重结晶，出窑冷却后火气已散，无残留火气。土获得金之致密，遇水不溶不化，土得金用！",
      tiyong: "体为承载，用为蜕变。火以炎上宣散之性，熔炼陶冶土之性质，赋予承载之物以新的生生之器。",
      tanShengWangKe: "【贪生忘克转化】：木克土，局中若火通畅，木贪生火，火进而生土，木克土转化为‘木→火→土’之通顺转化。若无火，木必直克土。",
      excessive: "【火多土焦 / 火弱土寒】：烈火过燥烤焦薄土，土变焦土不能生金蓄水；火弱则土湿冷僵死，万物不生。",
      quote: "《周礼观·紫砂壶辩论》：“火生土不是火变成了土，是火的性质改变了土的性质。陶器成，火已散，土得金用。”"
    },
    "earth-metal": {
      id: "sheng-earth-metal",
      from: "earth",
      to: "metal",
      title: "土生金 · 承载致密与秀气凝结",
      tagline: "“敦厚蓄藏 · 压力结晶 · 粹华成器”",
      mechanism: "土承载地脉万有，深沉静止，受长期重力与压力作用，气机由松散缓冲转向高度敛缩，矿脉结晶，粹华萃聚，坚实成型为金之从革。",
      tiyong: "土为质朴之母体，金为提炼之精华。以厚重生致密，以稳定孕成器。",
      tanShengWangKe: "【贪生忘克转化】：火克金，局中见土，火贪生土，土再生金。烈火之暴烈被厚土吸热缓冲，转化为金之结晶温床。若局中无土，金必受销镕！",
      excessive: "【土多金埋】：土气过于壅滞肥重，金气深埋九地之下不得出露；须以甲木疏土、或借壬水淘洗淘沙，金方能显耀成器。",
      quote: "《子平真诠》：“土润则生金，土燥则脆金。辰丑湿土生金有力，未戌燥土反脆金。”"
    },
    "metal-water": {
      id: "sheng-metal-water",
      from: "metal",
      to: "water",
      title: "金生水 · 致密冷凝与器纳流水",
      tagline: "“清肃凝露 · 坚固作渠 · 敛极趋润”",
      mechanism: "金性清冷收敛、表面致密光滑；自然界中，冷金遇温热空气凝结水露；同时金可凿井疏渠，铸为鼎彝容器，使流动无羁之水得以纳藏汇聚。",
      tiyong: "以收敛致密引发相变液化；以刚毅器用引导无形之水流向。",
      tanShengWangKe: "【贪生忘克转化】：土克水，局中有金，土贪生金，金进而生水，土之阻水化为金渠导流，流通不息。若无金通关，水即遭重土围困涸竭。",
      excessive: "【金多水浊 / 金寒水冷】：三冬金寒，水成坚冰毫无生机，非金不生水，实气机冻结；此时急需丙火融金解冻，水方可奔腾。",
      quote: "《滴天髓》：“金水双清，最喜向阳。金冷水寒，反成冰涸。”"
    },
    "water-wood": {
      id: "sheng-water-wood",
      from: "water",
      to: "wood",
      title: "水生木 · 润下滋养与胚萌破土",
      tagline: "“潜藏复发 · 润下通络 · 阴极萌阳”",
      mechanism: "水主闭藏与流动渗透，浸润土层，携带矿物养分穿透种皮胞壁，激发沉睡之生命本元，促使木行自下而上拔节生发。",
      tiyong: "以静润动，以藏启生。水为木之津液血脉，赋予木以柔韧与伸展之力。",
      tanShengWangKe: "【贪生忘克转化】：金克木，局中水旺畅达，金贪生水，水转而滋木，肃杀之金化为生润之露，克意全消！若无水，金刃直戕嫩木。",
      excessive: "【水多木漂】：水势滔滔如洪流，木无深根基壤，反被连根拔起漂流无依；需戊土堤防止水，木方能安身立命。",
      quote: "《黄帝内经》：“水生木，木生火，五气更始，各有所先。”"
    }
  },

  // 相克关系链条深机与通关
  keChains: {
    "fire-metal": {
      id: "ke-fire-metal",
      from: "fire",
      to: "metal",
      title: "火克金 · 炎上销熔与冶炼成革",
      tagline: "“烈焰去顽 · 熔金化液 · 变硬为柔”",
      mechanism: "高温热辐射强行打破金属晶格致密结构，由固相转为液相，剥离其收敛肃杀之质。",
      philosophical: "【克之正道】：金非火炼不能成大器鼎钟；但火烈金销，则成杀局。亢则为害，承乃制约。",
      tongguan: "【通关枢纽 · 土】：两神相战，当取土通关！火生土，土生金，烈火之焦被厚土吸收转而生金，克战冰解。若土为燥土（未戌）则通关无力，需湿土（丑辰）解热生金。",
      tanHeWangKe: "【贪合忘克】：丙火见辛金相合（丙辛合水），若地支见水且得月令，化为水象，丙火贪合辛金，忘其克金之暴。",
      fanWu: "【反克乘侮 · 金多火熄】：金气极巨顽厚，微火煅之反被冷金吸收热能扑灭火焰。",
      quote: "《穷通宝鉴》：“火金相战，非土不调；土润生金，火势自泄。”"
    },
    "metal-wood": {
      id: "metal-wood",
      from: "metal",
      to: "wood",
      title: "金克木 · 肃杀裁度与斧斤削伐",
      tagline: "“收敛遏长 · 裁定方圆 · 断其狂茂”",
      mechanism: "致密坚硬之金器具有剪切应力，直接阻断木之纤维细胞输送与外展扩张，使其由漫生无序归于规矩。",
      philosophical: "【克之正道】：良木不经雕琢削伐不成栋梁，以克为成；但金重无情，则伐伤萌芽生机。",
      tongguan: "【通关枢纽 · 水】：金木相战，以水通关！金生水，水生木，肃杀之意化为滋养之泉。若水路堵塞（如被土截胡），金必直伤木。",
      tanHeWangKe: "【贪合忘克】：乙木见庚金相合（乙庚合金），弱木遇庚成仁义之合，庚金贪合乙木而不行克伐。",
      fanWu: "【反克乘侮 · 木坚金缺】：春深木茂，林莽参天，钝金斧钺伐之反被崩断其刃。",
      quote: "《滴天髓》：“金能克木，木坚金缺；木能克土，土重木折。”"
    },
    "wood-earth": {
      id: "wood-earth",
      from: "wood",
      to: "earth",
      title: "木克土 · 根条穿石与疏松通滞",
      tagline: "“破板通滞 · 条达宣畅 · 穿石定根”",
      mechanism: "植物根系向下穿透板结致密之土壤岩隙，打破土行原有的静态封闭，使其结构松散、水气得以渗透流通。",
      philosophical: "【克之正道】：土得木疏方不致死板僵硬；但木旺无节，则土崩土裂，涵水无存。",
      tongguan: "【通关枢纽 · 火】：木土相持，以火通关！木生火，火生土，木之狂发化为暖火，火以温性化育土性，变克为生！",
      tanHeWangKe: "【贪合忘克】：甲木见己土相合（甲己合土），中正之合，甲木贪合己土，化克为中和承载。",
      fanWu: "【反克乘侮 · 土重木折】：土势过于深厚巨固，纤幼之木破土无能，根芽反受窒息折损。",
      quote: "《周易·系辞》：“地道无成而代有终也。”木破土之塞，使代行其用。"
    },
    "earth-water": {
      id: "earth-water",
      from: "earth",
      to: "water",
      title: "土克水 · 筑堤围堰与障塞奔流",
      tagline: "“规矩其流 · 防微杜渐 · 聚散在堤”",
      mechanism: "土颗粒具有多孔介质之毛细吸附与致密堆积阻隔力，修筑堤防截断流体无界限之泛滥扩散。",
      philosophical: "【克之正道】：水无土防则溃泛横流，成为祸患；得土约束乃成江河甘霖；但土重水竭，则生机断绝。",
      tongguan: "【通关枢纽 · 金】：土水对战，以金通关！土生金，金生水，土之防守转化为金质管道水渠，导引清流顺畅出海。",
      tanHeWangKe: "【贪合忘克】：戊土见癸水相合（戊癸合火），老少相投，合化为火，戊土贪合癸水，不再筑堤截断。",
      fanWu: "【反克乘侮 · 水多土流】：狂涛骤至，洪峰破坝，土堤瞬间被冲刷崩解，随流而去。",
      quote: "《周礼观·辰土辨析》：“辰土制水有条件：水旺时被同化不能制水；火土合力烘烤辰中癸水，转燥后方能制水！”"
    },
    "water-fire": {
      id: "water-fire",
      from: "water",
      to: "fire",
      title: "水克火 · 降温窒熄与水火既济",
      tagline: "“清寒灭烈 · 潜藏息狂 · 润下胜炎”",
      mechanism: "流体低温高比热直接吸收热源能量，蒸发阻隔氧气扩散，迅速将高温激发态抑制至基态。",
      philosophical: "【克之正道】：火得水节制方成温煦暖阳，水得火温煦乃免冰凝死寂；水火相交，谓之‘既济’；若两相死斗，则为‘未济’。",
      tongguan: "【通关枢纽 · 木】：水火两立，以木通关！水生木，木生火，水之阴润通过草木经络化为生火之源，通畅无阻。",
      tanHeWangKe: "【贪合忘克】：壬水见丁火相合（丁壬合木），仁寿之合，水火两情相悦合化为木，克性冰释。",
      fanWu: "【反克乘侮 · 火炎水涸】：烈日炽灼，杯水车薪，水未近烈火已被蒸腾为飞雾虚无。",
      quote: "《周易·既济卦》：“水在火上，既济。君子以思患而预防之。”"
    }
  },

  // 内部五角星交叉枢纽节点（通关与冲合核心）
  nexusPoints: [
    {
      id: "nexus-center",
      name: "混元太极 · 通关主枢",
      color: "#4a3c2c",
      desc: "五行生克相交之天枢，变易之本体所在。《滴天髓》：“关内有织女，关外有牛郎，此关若通也，相邀入洞房。”通关不是补缺，是通堵！"
    },
    {
      id: "nexus-fire-water",
      name: "水火交界点 (离坎交涉)",
      color: "#2498db",
      desc: "水克火与火克金之交点。水欲制火，金欲得火，此处之通关重在木神疏导水气生火。"
    },
    {
      id: "nexus-wood-metal",
      name: "金木交界点 (震兑交涉)",
      color: "#cca300",
      desc: "金克木与木克土之交点。金伤木而木伤土，此处通关重在壬癸水神化金润木。"
    },
    {
      id: "nexus-earth-fire",
      name: "火土交界点 (坤离交涉)",
      color: "#c02c2c",
      desc: "木克土与火克金之交点。火性散而土性新，此处辨辰戌丑未燥湿之别。"
    },
    {
      id: "nexus-water-earth",
      name: "土水交界点 (坎坤交涉)",
      color: "#7d6350",
      desc: "土克水与水克火之交点。堤防与泛滥之权衡，金神为泄土生水之第一良剂。"
    },
    {
      id: "nexus-metal-earth",
      name: "金土交界点 (乾坤交涉)",
      color: "#1ca857",
      desc: "火克金与土克水之交点。承载转致密之界面，水火既济之调停者。"
    }
  ]
};

// =============================================================================
// 二、SVG 盘面几何演算与渲染 (严格复刻用户原图)
// =============================================================================

class WuxingAltar {
  constructor(svgId) {
    this.svg = document.getElementById(svgId);
    this.centerX = 340;
    this.centerY = 340;
    this.radius = 236; // 主星轨道半径
    this.sphereRadius = 38; // 琉璃球半径
    this.activeEntity = null;
    this.flowAnimationId = null;
    this.isFlowing = true;
    this.particles = [];
    
    // 当前五行势能权重 (默认中和 50)
    this.energies = {
      wood: 50,
      fire: 50,
      earth: 50,
      metal: 50,
      water: 50
    };

    // 经典原图五方顶点角度 (0度为顶部金，顺时针各 72 度)
    this.nodePositions = this.calculateNodePositions();
    this.init();
  }

  calculateNodePositions() {
    // 顺时针顺序：金(顶) -> 水(右偏上) -> 木(右下) -> 火(左下) -> 土(左偏上)
    const angles = {
      metal: -90,              // 顶
      water: -90 + 72,         // -18°
      wood:  -90 + 72 * 2,     // 54°
      fire:  -90 + 72 * 3,     // 126°
      earth: -90 + 72 * 4      // 198°
    };

    const pos = {};
    for (const [key, deg] of Object.entries(angles)) {
      const rad = (deg * Math.PI) / 180;
      pos[key] = {
        x: this.centerX + this.radius * Math.cos(rad),
        y: this.centerY + this.radius * Math.sin(rad),
        angleDeg: deg
      };
    }
    return pos;
  }

  init() {
    this.renderShengArcs();
    this.renderKeLines();
    this.renderNexusPoints();
    this.renderShengLabels();
    this.renderKeLabels();
    this.renderElementSpheres();
    this.initParticles();
    this.startFlowLoop();

    // 默认高亮“金”
    this.selectEntity("metal", "element");
  }

  // 1. 渲染外圈相生弧线（大绿色圆弧箭头，顺时针）
  renderShengArcs() {
    const group = document.getElementById("sheng-arcs-group");
    group.innerHTML = "";

    // 顺序：金->水, 水->木, 木->火, 火->土, 土->金
    const shengSequence = [
      ["metal", "water"],
      ["water", "wood"],
      ["wood", "fire"],
      ["fire", "earth"],
      ["earth", "metal"]
    ];

    shengSequence.forEach(([from, to]) => {
      const p1 = this.nodePositions[from];
      const p2 = this.nodePositions[to];
      
      // 沿圆弧绘制 (利用 SVG A 指令)
      // 计算顺时针大弧半径
      const arcD = `M ${p1.x} ${p1.y} A ${this.radius} ${this.radius} 0 0 1 ${p2.x} ${p2.y}`;
      
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", arcD);
      path.setAttribute("class", "sheng-arc-path");
      path.setAttribute("id", `arc-${from}-${to}`);
      path.setAttribute("marker-end", "url(#arrow-sheng)");

      path.addEventListener("click", () => {
        this.selectShengChain(from, to);
      });

      group.appendChild(path);
    });
  }

  // 2. 渲染内部五角星相克折线 (原图内部五彩折线与箭头)
  renderKeLines() {
    const group = document.getElementById("ke-lines-group");
    group.innerHTML = "";

    // 原图克线走向：
    // 火 -> 金 (红色)
    // 金 -> 木 (黄色)
    // 木 -> 土 (绿色)
    // 土 -> 水 (灰色)
    // 水 -> 火 (蓝色)
    const keSequence = [
      { from: "fire",  to: "metal", colorClass: "ke-line-fire-metal", marker: "url(#arrow-ke-fire-metal)" },
      { from: "metal", to: "wood",  colorClass: "ke-line-metal-wood", marker: "url(#arrow-ke-metal-wood)" },
      { from: "wood",  to: "earth", colorClass: "ke-line-wood-earth", marker: "url(#arrow-ke-wood-earth)" },
      { from: "earth", to: "water", colorClass: "ke-line-earth-water", marker: "url(#arrow-ke-earth-water)" },
      { from: "water", to: "fire",  colorClass: "ke-line-water-fire",  marker: "url(#arrow-ke-water-fire)" }
    ];

    keSequence.forEach(item => {
      const p1 = this.nodePositions[item.from];
      const p2 = this.nodePositions[item.to];

      // 原图从星球边缘出发向内射入目标球
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", p1.x);
      line.setAttribute("y1", p1.y);
      line.setAttribute("x2", p2.x);
      line.setAttribute("y2", p2.y);
      line.setAttribute("class", `ke-line-path ${item.colorClass}`);
      line.setAttribute("id", `ke-${item.from}-${item.to}`);
      line.setAttribute("marker-end", item.marker);

      line.addEventListener("click", () => {
        this.selectKeChain(item.from, item.to);
      });

      group.appendChild(line);
    });
  }

  // 3. 渲染射线交汇处小实心圆点 (枢纽点)
  renderNexusPoints() {
    const group = document.getElementById("nexus-nodes-group");
    group.innerHTML = "";

    // 几何计算相克五角星的交点：
    // 五角星内交点半径为 R * (3 - sqrt(5)) / 2 或几何求交
    // 此处精确计算直线交点
    const getIntersection = (p1, p2, p3, p4) => {
      const d = (p1.x - p2.x)*(p3.y - p4.y) - (p1.y - p2.y)*(p3.x - p4.x);
      if (Math.abs(d) < 1e-5) return null;
      const t = ((p1.x - p3.x)*(p3.y - p4.y) - (p1.y - p3.y)*(p3.x - p4.x)) / d;
      return {
        x: p1.x + t*(p2.x - p1.x),
        y: p1.y + t*(p2.y - p1.y)
      };
    };

    const pos = this.nodePositions;
    // 几个代表性交点：
    const pts = [
      // 1. 土水线 与 火金线 交点 (原图金木火金交错下方的浅蓝点)
      { pt: getIntersection(pos.earth, pos.water, pos.fire, pos.metal), color: "#2498db", id: "nexus-1", name: "水火气冲交点" },
      // 2. 土水线 与 金木线 交点 (原图偏右浅绿点)
      { pt: getIntersection(pos.earth, pos.water, pos.metal, pos.wood), color: "#1ca857", id: "nexus-2", name: "金木土化交点" },
      // 3. 水火线 与 金木线 交点 (原图右下方红点)
      { pt: getIntersection(pos.water, pos.fire, pos.metal, pos.wood), color: "#e83628", id: "nexus-3", name: "金木水火既济交点" },
      // 4. 水火线 与 木土线 交点 (原图正下灰褐色点)
      { pt: getIntersection(pos.water, pos.fire, pos.wood, pos.earth), color: "#8c7362", id: "nexus-4", name: "水火木土通关交点" },
      // 5. 木土线 与 火金线 交点 (原图左下方黄点)
      { pt: getIntersection(pos.wood, pos.earth, pos.fire, pos.metal), color: "#fed636", id: "nexus-5", name: "木火土金交融交点" },
      // 6. 中心混元极点
      { pt: { x: this.centerX, y: this.centerY }, color: "#3e2e1e", r: 10, id: "nexus-center", name: "混元太极通关总枢" }
    ];

    pts.forEach((p, idx) => {
      if (!p.pt) return;
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", p.pt.x);
      circle.setAttribute("cy", p.pt.y);
      circle.setAttribute("r", p.r || 7.5);
      circle.setAttribute("fill", p.color);
      circle.setAttribute("stroke", "#ffffff");
      circle.setAttribute("stroke-width", "1.5");
      circle.setAttribute("class", "nexus-node-dot");
      circle.setAttribute("id", p.id);

      circle.addEventListener("click", () => {
        this.selectNexus(idx, p.name);
      });

      group.appendChild(circle);
    });
  }

  // 4. 渲染相生弧上的带圆圈【生】字节点
  renderShengLabels() {
    const group = document.getElementById("sheng-labels-group");
    group.innerHTML = "";

    const shengArcs = [
      { from: "metal", to: "water", deg: -90 + 36 },
      { from: "water", to: "wood",  deg: -18 + 36 },
      { from: "wood",  to: "fire",  deg: 54 + 36 },
      { from: "fire",  to: "earth", deg: 126 + 36 },
      { from: "earth", to: "metal", deg: 198 + 36 }
    ];

    // 原图“生”字位于外圆弧稍外侧，半径大约 R + 18
    const labelRadius = this.radius + 18;

    shengArcs.forEach(item => {
      const rad = (item.deg * Math.PI) / 180;
      const cx = this.centerX + labelRadius * Math.cos(rad);
      const cy = this.centerY + labelRadius * Math.sin(rad);

      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.setAttribute("class", "sheng-label-group");
      g.setAttribute("id", `sheng-label-${item.from}-${item.to}`);

      // 隐形交互命中大圆
      const hitCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      hitCircle.setAttribute("cx", cx);
      hitCircle.setAttribute("cy", cy);
      hitCircle.setAttribute("r", "24");
      hitCircle.setAttribute("fill", "transparent");

      // 生字文本
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", cx);
      text.setAttribute("y", cy);
      text.setAttribute("class", "sheng-label-text");
      text.textContent = "生";

      g.appendChild(hitCircle);
      g.appendChild(text);

      g.addEventListener("click", () => {
        this.selectShengChain(item.from, item.to);
      });

      group.appendChild(g);
    });
  }

  // 5. 渲染相克线上带圆圈的【克】字徽标 (原图特征核心！)
  renderKeLabels() {
    const group = document.getElementById("ke-labels-group");
    group.innerHTML = "";

    // 原图克字位于五条克线的黄金分割靠中央位置
    // 火->金: 红圈克
    // 金->木: 黄圈克
    // 木->土: 绿圈克
    // 土->水: 灰圈克
    // 水->火: 蓝圈克
    const keList = [
      { from: "fire",  to: "metal", stroke: "#c02c2c", textFill: "#991b1b", ratio: 0.42 },
      { from: "metal", to: "wood",  stroke: "#cca300", textFill: "#855800", ratio: 0.42 },
      { from: "wood",  to: "earth", stroke: "#1b7d48", textFill: "#0b5229", ratio: 0.42 },
      { from: "earth", to: "water", stroke: "#7d6350", textFill: "#473528", ratio: 0.45 },
      { from: "water", to: "fire",  stroke: "#1a73b5", textFill: "#0c4573", ratio: 0.42 }
    ];

    keList.forEach(item => {
      const p1 = this.nodePositions[item.from];
      const p2 = this.nodePositions[item.to];
      
      const cx = p1.x + (p2.x - p1.x) * item.ratio;
      const cy = p1.y + (p2.y - p1.y) * item.ratio;

      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.setAttribute("class", "ke-label-group");
      g.setAttribute("id", `ke-label-${item.from}-${item.to}`);

      // 外白底圆圈 (带彩色外框)
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", cx);
      circle.setAttribute("cy", cy);
      circle.setAttribute("r", "16");
      circle.setAttribute("class", "ke-label-bg");
      circle.setAttribute("stroke", item.stroke);

      // 内文字“克”
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", cx);
      text.setAttribute("y", cy);
      text.setAttribute("class", "ke-label-text");
      text.setAttribute("fill", item.textFill);
      text.textContent = "克";

      g.appendChild(circle);
      g.appendChild(text);

      g.addEventListener("click", () => {
        this.selectKeChain(item.from, item.to);
      });

      group.appendChild(g);
    });
  }

  // 6. 渲染五大原质琉璃主星球 (原图经典高光拟物球体)
  renderElementSpheres() {
    const group = document.getElementById("element-spheres-group");
    group.innerHTML = "";

    const elements = ["metal", "water", "wood", "fire", "earth"];

    elements.forEach(key => {
      const pos = this.nodePositions[key];
      const data = WUXING_DATA.elements[key];

      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.setAttribute("class", "element-sphere-group");
      g.setAttribute("id", `sphere-${key}`);
      g.setAttribute("transform", `translate(${pos.x}, ${pos.y})`);

      // 1. 球体本体 (使用预设径向渐变)
      const sphere = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      sphere.setAttribute("cx", 0);
      sphere.setAttribute("cy", 0);
      sphere.setAttribute("r", this.sphereRadius);
      sphere.setAttribute("fill", `url(#grad-${key})`);
      sphere.setAttribute("class", "sphere-body");

      // 2. 经典早期 Web 拟物球顶半透明白色高光月牙 (Sheen)
      const sheen = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
      sheen.setAttribute("cx", -4);
      sheen.setAttribute("cy", -13);
      sheen.setAttribute("rx", this.sphereRadius * 0.65);
      sheen.setAttribute("ry", this.sphereRadius * 0.36);
      sheen.setAttribute("fill", "url(#gloss-sheen)");
      sheen.setAttribute("class", "sphere-sheen");

      // 3. 球上铭字 (金水木火土)
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", 0);
      text.setAttribute("y", 1);
      text.setAttribute("class", `sphere-label-text ${key === "metal" ? "metal-text" : ""}`);
      text.textContent = data.name;

      g.appendChild(sphere);
      g.appendChild(sheen);
      g.appendChild(text);

      g.addEventListener("click", () => {
        this.selectEntity(key, "element");
      });

      group.appendChild(g);
    });
  }

  // =============================================================================
  // 三、动态气机流动粒子渲染
  // =============================================================================

  initParticles() {
    this.particles = [];
    const count = 35;
    for (let i = 0; i < count; i++) {
      this.particles.push({
        angle: (i / count) * Math.PI * 2,
        speed: 0.007 + Math.random() * 0.005,
        radiusOffset: (Math.random() - 0.5) * 8,
        size: 2.2 + Math.random() * 2.5,
        color: i % 2 === 0 ? "#2ecc71" : "#f1c40f"
      });
    }
  }

  startFlowLoop() {
    const particleGroup = document.getElementById("qi-flow-particles");

    const animate = () => {
      if (this.isFlowing) {
        particleGroup.innerHTML = "";
        
        this.particles.forEach(p => {
          p.angle += p.speed;
          if (p.angle > Math.PI * 2) p.angle -= Math.PI * 2;

          const r = this.radius + p.radiusOffset;
          const x = this.centerX + r * Math.cos(p.angle);
          const y = this.centerY + r * Math.sin(p.angle);

          const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
          dot.setAttribute("cx", x);
          dot.setAttribute("cy", y);
          dot.setAttribute("r", p.size);
          dot.setAttribute("fill", p.color);
          dot.setAttribute("class", "qi-particle");
          particleGroup.appendChild(dot);
        });
      }
      this.flowAnimationId = requestAnimationFrame(animate);
    };

    animate();
  }

  // =============================================================================
  // 四、交互拾取与右侧阐微台联动
  // =============================================================================

  // 点击单个五行球
  selectEntity(elementKey, type = "element") {
    this.clearHighlights();
    const data = WUXING_DATA.elements[elementKey];
    if (!data) return;

    // 高亮该球体
    const sphere = document.getElementById(`sphere-${elementKey}`);
    if (sphere) sphere.classList.add("active");

    // 高亮该元素相关的生入、生出、克入、克出线条
    this.highlightRelatedLinks(elementKey);

    // 填充右侧【气机象解】面板
    document.getElementById("entity-sigil").textContent = data.name;
    document.getElementById("entity-sigil").style.background = `radial-gradient(circle at 35% 35%, ${data.color}, ${data.darkColor})`;
    document.getElementById("entity-sigil").style.color = elementKey === "metal" ? "#4a2800" : "#ffffff";
    
    document.getElementById("entity-title").textContent = `${data.bagua} · ${data.name}行本元气机`;
    document.getElementById("entity-tagline").textContent = data.trend;
    document.getElementById("entity-type-badge").textContent = "五行本位";

    document.getElementById("detail-tiyong").textContent = data.tiyong;
    document.getElementById("detail-trend").textContent = data.trend;
    document.getElementById("detail-physics").textContent = data.physics;
    
    const beShengName = WUXING_DATA.elements[data.beSheng].name;
    const shengName = WUXING_DATA.elements[data.sheng].name;
    const beKeName = WUXING_DATA.elements[data.beKe].name;
    const keName = WUXING_DATA.elements[data.ke].name;
    
    document.getElementById("detail-interaction").textContent = 
      `受【${beShengName}】长养（${beShengName}生${data.name}）；顺生【${shengName}】（${data.name}生${shengName}）；` +
      `受【${beKeName}】制约节制（${beKeName}克${data.name}）；克制裁度【${keName}】（${data.name}克${keName}）。`;

    document.getElementById("insight-title").textContent = `【${data.name}】之贪生忘克与变易机理`;
    
    // 生成深层贪生忘克解释
    const shengNext = WUXING_DATA.elements[data.sheng].name;
    const keNext = WUXING_DATA.elements[data.ke].name;
    document.getElementById("insight-content").innerHTML = `
      <p><strong>【气机取象心法】：</strong>“不问它是什么，只问它在怎么变”。${data.name}行不是冷硬物料，而是“${data.trend}”的变化总势。</p>
      <p><strong>【贪生忘克动力学】：</strong></p>
      <p>【${data.name}】本能去克制【${keNext}】。但若局中【${shengNext}】畅通有生机，【${data.name}】即专注于生养【${shengNext}】，此谓<strong>“贪生忘克”</strong>，克意自行消弭。</p>
      <p class="highlight-quote"><strong>周礼警训：</strong>贪生忘克的前提是<strong>生路畅通</strong>！若生路被堵（例如无${shengNext}可生、近克截胡、或被合绊），贪生无力，必掉头直伐【${keNext}】。</p>
    `;

    document.getElementById("scripture-text").textContent = data.scripture;

    // 切换到【气机象解】面板
    switchTab("tab-detail");
  }

  // 点击【生】字或相生弧线
  selectShengChain(fromKey, toKey) {
    this.clearHighlights();
    const chainKey = `${fromKey}-${toKey}`;
    const data = WUXING_DATA.shengChains[chainKey];
    if (!data) return;

    // 高亮弧线与两端球体
    const arc = document.getElementById(`arc-${fromKey}-${toKey}`);
    if (arc) arc.classList.add("active");
    const sphereFrom = document.getElementById(`sphere-${fromKey}`);
    const sphereTo = document.getElementById(`sphere-${toKey}`);
    if (sphereFrom) sphereFrom.classList.add("active");
    if (sphereTo) sphereTo.classList.add("active");

    const fromName = WUXING_DATA.elements[fromKey].name;
    const toName = WUXING_DATA.elements[toKey].name;

    // 填充右侧面板
    document.getElementById("entity-sigil").textContent = "生";
    document.getElementById("entity-sigil").style.background = "radial-gradient(circle at 35% 35%, #58d68d, #196f3d)";
    document.getElementById("entity-sigil").style.color = "#ffffff";

    document.getElementById("entity-title").textContent = data.title;
    document.getElementById("entity-tagline").textContent = data.tagline;
    document.getElementById("entity-type-badge").textContent = "相生长养";

    document.getElementById("detail-tiyong").textContent = data.tiyong;
    document.getElementById("detail-trend").textContent = `由【${fromName}】之动向驱动引导，催化唤醒【${toName}】之生成`;
    document.getElementById("detail-physics").textContent = data.mechanism;
    document.getElementById("detail-interaction").textContent = data.excessive;

    document.getElementById("insight-title").textContent = "生机转换与【贪生忘克】详考";
    document.getElementById("insight-content").innerHTML = `
      <p>${data.tanShengWangKe}</p>
      <p class="highlight-quote"><strong>周礼物理观提示：</strong>相生绝非元素物质之转移灌注，而是“性质对性质的作用”（如紫砂陶土受火烧结，陶成火已散，土性已新）。</p>
    `;

    document.getElementById("scripture-text").textContent = data.quote;
    switchTab("tab-detail");
  }

  // 点击【克】字或相克折线
  selectKeChain(fromKey, toKey) {
    this.clearHighlights();
    const chainKey = `${fromKey}-${toKey}`;
    const data = WUXING_DATA.keChains[chainKey];
    if (!data) return;

    const line = document.getElementById(`ke-${fromKey}-${toKey}`);
    if (line) line.classList.add("active");
    const sphereFrom = document.getElementById(`sphere-${fromKey}`);
    const sphereTo = document.getElementById(`sphere-${toKey}`);
    if (sphereFrom) sphereFrom.classList.add("active");
    if (sphereTo) sphereTo.classList.add("active");

    const fromName = WUXING_DATA.elements[fromKey].name;
    const toName = WUXING_DATA.elements[toKey].name;

    document.getElementById("entity-sigil").textContent = "克";
    document.getElementById("entity-sigil").style.background = "radial-gradient(circle at 35% 35%, #ec7063, #922b21)";
    document.getElementById("entity-sigil").style.color = "#ffffff";

    document.getElementById("entity-title").textContent = data.title;
    document.getElementById("entity-tagline").textContent = data.tagline;
    document.getElementById("entity-type-badge").textContent = "相克制化";

    document.getElementById("detail-tiyong").textContent = data.mechanism;
    document.getElementById("detail-trend").textContent = `以【${fromName}】之肃约张力，裁度抑制【${toName}】之过度泛滥`;
    document.getElementById("detail-physics").textContent = data.philosophical;
    document.getElementById("detail-interaction").textContent = `${data.fanWu}；${data.tanHeWangKe}`;

    document.getElementById("insight-title").textContent = "两神对峙与【通关思维】取用";
    document.getElementById("insight-content").innerHTML = `
      <p><strong>【通关取用秘要】：</strong>${data.tongguan}</p>
      <p><strong>【贪合忘克羁绊】：</strong>${data.tanHeWangKe}</p>
      <p class="highlight-quote"><strong>《滴天髓》真诠：</strong>“关内有织女，关外有牛郎，此关若通也，相邀入洞房。”克战不是死敌，唯须寻得其中通关之神，通堵而不补缺！</p>
    `;

    document.getElementById("scripture-text").textContent = data.quote;
    switchTab("tab-detail");
  }

  // 点击交叉枢纽小珠
  selectNexus(index, name) {
    this.clearHighlights();
    const nexus = WUXING_DATA.nexusPoints[index] || WUXING_DATA.nexusPoints[0];

    document.getElementById("entity-sigil").textContent = "枢";
    document.getElementById("entity-sigil").style.background = "radial-gradient(circle at 35% 35%, #85929e, #2e4053)";
    document.getElementById("entity-sigil").style.color = "#f4f6f7";

    document.getElementById("entity-title").textContent = nexus.name;
    document.getElementById("entity-tagline").textContent = "“冲合交汇 · 变易机纽 · 象数通关台”";
    document.getElementById("entity-type-badge").textContent = "通关枢纽";

    document.getElementById("detail-tiyong").textContent = "通关之神，调和克战之两端。中间若被间阻、刑冲、劫占，皆为关隔；得引用会合之神，去其间阻，方为通关。";
    document.getElementById("detail-trend").textContent = "找断点，不找缺口。不问缺什么五行，唯打通气机雍滞之节点。";
    document.getElementById("detail-physics").textContent = "多能级动态耦合界面。当两对立态势均力敌发生震荡时，引入低势能中间媒介诱导能量平滑耗散流转。";
    document.getElementById("detail-interaction").textContent = "冲合优先于生克：三合 ＞ 六合 ＞ 冲 ＞ 生克；紧贴 ＞ 隔位 ＞ 遥隔。合能解冲，冲能破合。";

    document.getElementById("insight-title").textContent = "周礼取用逻辑：辨辰土与通关神意";
    document.getElementById("insight-content").innerHTML = `
      <p>《子平真诠》归纳取用五法，通关为其一：“两神对峙，强弱均平，各不相下，须调和之为美，此以通关为用也。”</p>
      <p><strong>【辨辰土之变】：</strong>辰为水库，内藏癸水、乙木、戊土。水旺时辰被同化，顺流不能制水；唯有火土合力烘烤辰中癸水，辰土由湿转燥后，方能制水。此为‘变易优先’在土行内部之极精微细化！</p>
      <p class="highlight-quote"><strong>心法一言：</strong>“愚人以天地文理圣，我以时物文理哲。不问它是什么，只问它在怎么变；不补缺了什么，只通堵在哪里。”</p>
    `;

    document.getElementById("scripture-text").textContent = "《滴天髓》：“两气合而成象，象不可破也。五气聚而成形，形不可绝也。断阻之处，以通为和。”";
    switchTab("tab-detail");
  }

  // 高亮与某节点相关的所有线
  highlightRelatedLinks(elementKey) {
    const shengFrom = `arc-${elementKey}-${WUXING_DATA.elements[elementKey].sheng}`;
    const shengTo = `arc-${WUXING_DATA.elements[elementKey].beSheng}-${elementKey}`;
    const keFrom = `ke-${elementKey}-${WUXING_DATA.elements[elementKey].ke}`;
    const keTo = `ke-${WUXING_DATA.elements[elementKey].beKe}-${elementKey}`;

    [shengFrom, shengTo, keFrom, keTo].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.add("active");
    });
  }

  clearHighlights() {
    document.querySelectorAll(".element-sphere-group").forEach(el => el.classList.remove("active"));
    document.querySelectorAll(".sheng-arc-path").forEach(el => el.classList.remove("active"));
    document.querySelectorAll(".ke-line-path").forEach(el => el.classList.remove("active"));
  }

  // =============================================================================
  // 五、实战命理推演局模拟 (周礼观乙木烈火断点演练)
  // =============================================================================

  loadZhouliCase() {
    this.clearHighlights();
    // 设定能量：木旺 (80)，火极盛 (100)，丑土受烤 (30)，弱金 (15)，弱水蒸腾 (10)
    this.setEnergies(80, 100, 30, 15, 10);
    
    // 标记断裂链条：火->土, 土->金, 金->水
    document.getElementById("arc-fire-earth").classList.add("broken");
    document.getElementById("arc-earth-metal").classList.add("broken");
    document.getElementById("arc-metal-water").classList.add("broken");

    // 状态栏更新
    document.getElementById("current-qiji-status").textContent = "气机阻断 · 火烤土焦 · 金水濒危";
    document.getElementById("current-qiji-status").style.color = "#c0392b";

    switchTab("tab-case");
  }

  applyTongguanResolve() {
    // 注入辰土通关：
    // 辰土湿土泄火气，生辛金，护癸水！
    this.setEnergies(65, 55, 65, 50, 50);

    // 解除断裂状态
    document.querySelectorAll(".broken").forEach(el => el.classList.remove("broken"));

    // 全盘相生弧线高亮流光
    document.querySelectorAll(".sheng-arc-path").forEach(el => el.classList.add("active"));

    // 状态栏更新
    document.getElementById("current-qiji-status").textContent = "辰土通关 · 湿土生金涵水 · 气机周流不息";
    document.getElementById("current-qiji-status").style.color = "#27ae60";

    alert("【周礼通关成功】：引入辰土湿土！\n1. 泄午巳滔天烈火之势（火生湿土）；\n2. 湿土润泽生金（土生金）；\n3. 辰为水库，阻断蒸发，蓄养壬水；\n4. 木->火->土->金->水 闭环全面畅通！");
  }

  setEnergies(w, f, e, m, wa) {
    this.energies = { wood: w, fire: f, earth: e, metal: m, water: wa };
    
    // 更新滑块界面
    document.getElementById("slider-wood").value = w;
    document.getElementById("val-wood").textContent = w;
    document.getElementById("slider-fire").value = f;
    document.getElementById("val-fire").textContent = f;
    document.getElementById("slider-earth").value = e;
    document.getElementById("val-earth").textContent = e;
    document.getElementById("slider-metal").value = m;
    document.getElementById("val-metal").textContent = m;
    document.getElementById("slider-water").value = wa;
    document.getElementById("val-water").textContent = wa;

    this.updateLiveAnalysis();
  }

  updateLiveAnalysis() {
    const { wood, fire, earth, metal, water } = this.energies;
    
    // 诊断气势
    let bottleneck = "暂无明显阻塞";
    let advice = "气机匀称，生生不息。";
    let equilibrium = "太和中正之象。";

    if (fire > 80 && earth < 40) {
      bottleneck = "火旺土焦，断在【火生土】段，金水无源！";
      advice = "取辰丑湿土通关，泄火润金涵水，切忌生硬直接补水激火。";
      equilibrium = "火多土焦，炎上失控。";
    } else if (wood > 80 && fire < 30) {
      bottleneck = "木旺塞滞无火泄秀，木直克土！";
      advice = "取丙丁火通关，化木生土，化克为生（贪生忘克）。";
      equilibrium = "木重克土，气机偏执。";
    } else if (earth > 80 && metal < 30) {
      bottleneck = "土厚壅滞，厚土埋金，水遭重厄！";
      advice = "取甲木疏土通阻，或引金泄秀导水。";
      equilibrium = "土多金埋，万物板结。";
    } else if (water > 80 && wood < 30) {
      bottleneck = "水势浩瀚无木引流，水直接冲克烈火！";
      advice = "取甲寅风木通关，水生木而木生火，转狂澜为生机。";
      equilibrium = "水多火熄，寒湿泛滥。";
    }

    document.getElementById("live-equilibrium-text").textContent = equilibrium;
    document.getElementById("live-bottleneck-text").textContent = bottleneck;
    document.getElementById("live-advice-text").textContent = advice;
  }
}

// =============================================================================
// 六、界面事件绑定与初始化
// =============================================================================

let altarInstance = null;

function switchTab(tabId) {
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-tab") === tabId);
  });
  document.querySelectorAll(".tab-pane").forEach(pane => {
    pane.classList.toggle("active", pane.id === tabId);
  });
}

function setPreset(w, f, e, m, wa) {
  if (altarInstance) {
    altarInstance.setEnergies(w, f, e, m, wa);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  altarInstance = new WuxingAltar("wuxing-svg");

  // 选项卡切换事件
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const tabId = btn.getAttribute("data-tab");
      switchTab(tabId);
    });
  });

  // 全盘复初按钮
  document.getElementById("btn-reset-wuxing").addEventListener("click", () => {
    document.querySelectorAll(".broken").forEach(el => el.classList.remove("broken"));
    altarInstance.setEnergies(50, 50, 50, 50, 50);
    altarInstance.clearHighlights();
    altarInstance.selectEntity("metal", "element");
    document.getElementById("current-qiji-status").textContent = "周流不息 · 泰和之候";
    document.getElementById("current-qiji-status").style.color = "#27ae60";
  });

  // 气机流转启闭
  document.getElementById("btn-flow-toggle").addEventListener("click", () => {
    altarInstance.isFlowing = !altarInstance.isFlowing;
    document.getElementById("btn-flow-text").textContent = 
      altarInstance.isFlowing ? "停运气机流转" : "启运气机流转";
  });

  // 载入周礼实战局
  document.getElementById("btn-load-case-zhouli").addEventListener("click", () => {
    altarInstance.loadZhouliCase();
  });

  // 运行命理沙盘演练
  document.getElementById("btn-run-case-simulation").addEventListener("click", () => {
    altarInstance.applyTongguanResolve();
  });

  // 辰土通关调理
  document.getElementById("btn-tongguan-resolve").addEventListener("click", () => {
    altarInstance.applyTongguanResolve();
  });

  // 动态滑块绑定
  ["wood", "fire", "earth", "metal", "water"].forEach(key => {
    const slider = document.getElementById(`slider-${key}`);
    slider.addEventListener("input", (e) => {
      const val = parseInt(e.target.value, 10);
      document.getElementById(`val-${key}`).textContent = val;
      altarInstance.energies[key] = val;
      altarInstance.updateLiveAnalysis();
    });
  });
});
