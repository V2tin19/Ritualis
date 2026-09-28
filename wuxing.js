/**
 * 礼序台 (Ritual Order Platform) · 周礼象数推演核心引擎
 * 遵循周礼观：易为物理，变为体，衡为用；不问是什么，只问怎么变；不补缺口，只通堵塞。
 */

// =============================================================================
// 一、周礼象数与动态动力学数据库 (详考贪生、贪和、通关、反侮)
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
      tanHe: "【天干贪合】：乙庚合金（庚金见乙木相合，刚柔相济，庚贪合乙木而不行克伐）；【地支六合】：辰酉合金、巳申合水。【贪合忘克】：庚金本克甲木，若见乙木透干紧贴，庚贪合乙木，忘克甲木！",
      tanSheng: "【贪生忘克】：金本克木，若见水气通达，金专注于生水，水进而滋润生木。金克木之肃杀化为润生之源。前提是水路畅通无阻！",
      tongGuan: "【金木相战，以水通关】：金木势均力敌对峙，取壬癸水为通关神，金生水、水生木，断点打通，干戈化玉帛。",
      fanWu: "【反克乘侮】：木坚金缺（木过旺而金衰微，金斧削伐反被崩断其刃）；金多火熄（金势过巨，微火不能熔金反被扑灭）。",
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
      tanHe: "【天干贪合】：丙辛合水、丁壬合木（壬水见丁火相合，仁寿化木，壬贪合丁火而忘克丙火）；【地支六合】：子丑合土、申子辰三合水。【贪合忘冲】：子水本冲午火，若逢丑土相合，子丑合绊，贪合忘冲！",
      tanSheng: "【贪生忘克】：水本克火，若见木气通畅，水专注于生木，木进而生火，水克火化为生生之链。前提是木路通畅无阻！",
      tongGuan: "【水火相战，以木通关】：水火两立互不相下，取甲乙寅卯木为通关之神，水生木、木生火，化既济之大功。",
      fanWu: "【反克乘侮】：火炎水涸（火势滔天烈日当空，弱水被瞬间蒸发殆尽）；水多土流（水势如洪峰狂奔，薄土堤坝被冲溃席卷）。",
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
      tanHe: "【天干贪合】：甲己合土（甲木见己土紧贴相合，中正成土，甲贪合己土而忘克戊土）；丁壬合木。【地支六合】：寅亥合木、卯戌合火。【贪合忘克】：乙木本克己土，若见庚金相合，贪合忘克！",
      tanSheng: "【贪生忘克】：木本克土，若见火气旺盛通达，木专注于生火，火进而生土，木克土之穿凿转化为生土之母体。前提是火路畅通！",
      tongGuan: "【木土相战，以火通关】：木土对立僵持，取丙丁巳午火为通关神，木生火、火生土，克战化为温养长养。",
      fanWu: "【反克乘侮】：土重木折（土过于深厚硬实，幼弱之木破土无能反致折枝萎顿）；木多水缩（木盛水虚，水被吸纳耗竭）。",
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
      tanHe: "【天干贪合】：丙辛合水、丁壬合木、戊癸合火。【贪合忘克】：丙火本克庚金，若见辛金相合（丙辛合水），丙贪合辛金而忘克庚金；【地支六合】：午未合土、卯戌合火。【贪合忘冲】：午火冲子水，逢未土相合，贪合忘冲！",
      tanSheng: "【贪生忘克】：火本克金，若局中土气通畅，火专注于生土，土进而润生金，火克金化为温润生息。前提是土路通畅无阻！",
      tongGuan: "【火金相战，以土通关】：火烈金销相争，取湿土（辰丑土）为第一通关神，火生湿土、湿土生金，解燥释暴！燥土（未戌）反脆金，非真通关。",
      fanWu: "【反克乘侮】：金多火熄（金气过巨过于厚实，微火熔金不成，反被寒金吸热扑灭）；火多木焚（子旺母衰，反盗母气）。",
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
      tanHe: "【天干贪合】：甲己合土（己土与甲木相合）、戊癸合火。【贪合忘生】：己土本生辛金，若被甲木紧贴合住，羁绊牵制，无暇生金！【地支六合】：辰酉合金、子丑合土、午未合土。【贪合忘冲】：丑土冲未土，逢子水合丑，贪合忘冲！",
      tanSheng: "【贪生忘克】：土本克水，若局中金气通畅，土专注于生金，金进而生水，土克水转化为开渠导流。前提是金路通畅无阻！",
      tongGuan: "【土水相战，以金通关】：土水相战各不相让，取庚辛申酉金为通关神，土生金、金生水，化阻为泄，江河顺流。",
      fanWu: "【反克乘侮】：水多土流（洪水肆虐冲毁堤岸）；辰土之辨（辰为水库，水旺被同化不克水；经火土烘烤转燥方能制水）。",
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
      tanHe: "【贪合忘克 / 贪合忘生】：甲木见己土相合（甲己合土），甲木贪合己土而忘克戊土；乙木见庚金相合，贪合忘生丙丁之火（贪合忘生）。地支中寅亥合木，亥水贪合寅木，忘冲巳火（贪合忘冲）。",
      tanSheng: "【贪生忘克】：水本克火，局中见木且木路通畅，水贪生木，木再生火。水克火之暴烈完全转化为相生源泉！前提：木路必须通畅无阻，若木被金伐断，水掉头仍直克火。",
      tongGuan: "【水火相战，以木通关】：水火两立，取木通关（水生木，木生火），化水火未济为水火既济。",
      excessive: "【母慈灭子 / 子盗母气】：木多火窒（湿木过稠压灭微火）；子旺母衰（火势太烈狂烧，木体焚毁过速，气机衰竭）。",
      quote: "《滴天髓》：“强木得火，方化其顽；木盛火衰，反致枯槁。”"
    },
    "fire-earth": {
      id: "sheng-fire-earth",
      from: "fire",
      to: "earth",
      title: "火生土 · 紫砂陶钧与物性重塑",
      tagline: "“火非化土 · 乃火性改土性 · 陶成火散得金用”",
      mechanism: "【周礼观核心真相】：传统误以为火生土是火烧成灰变成土。实则火是能量与性质改变者！黏土经窑火高温烧制，去尽游离水、晶格重结晶，出窑冷却后火气已散，无残留火气。土获得金之致密，遇水不溶不化，土得金用！",
      tanHe: "【贪合忘克 / 贪合忘冲】：丙火见辛金相合（丙辛合水），丙贪合辛金而忘克庚金；丁火见壬水相合（丁壬合木），丁贪合壬水而忘去生己土（贪合忘生）。午火本冲子水，见未土相合，贪合忘冲！",
      tanSheng: "【贪生忘克】：木本克土，局中若火通畅，木贪生火，火进而生土，木克土转化为‘木→火→土’之通顺长养。若局中无火，木必直克土造成土崩！",
      tongGuan: "【木土相战，以火通关】：木土对立，取火通关（木生火，火生土），找断点不找缺口，打通火神枢纽。",
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
      tanHe: "【贪合忘生 / 贪合忘冲】：戊土见癸水相合（戊癸合火），戊土贪合癸水而忘去生庚金（贪合忘生）；己土见甲木相合（甲己合土），中正合绊。地支辰酉合金，辰土贪合酉金，忘去克亥子水！",
      tanSheng: "【贪生忘克】：火本克金，局中见土，火贪生土，土进而生金。烈火之暴烈被厚土吸热缓冲，转化为金之结晶温床。若局中无土，金必受火销镕！",
      tongGuan: "【火金相战，以土通关】：火烈金销相战，必须取湿土（辰丑土）通关！辰丑湿土一则泄火，二则生金；若误用未戌燥土，反助火势脆金，非真通关。",
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
      tanHe: "【贪合忘克 / 贪合忘冲】：庚金见乙木相合（乙庚合金），庚金贪合乙木而忘克甲木；辛金见丙火相合（丙辛合水），辛金贪合丙火而忘生壬癸水（贪合忘生）。申巳合水，巳火贪合申金而忘克酉金！",
      tanSheng: "【贪生忘克】：土本克水，局中有金，土贪生金，金进而生水，土之阻水化为金渠导流，流通不息。若无金通关，水即遭重土围困涸竭。",
      tongGuan: "【土水相战，以金通关】：土水相持，取庚辛申酉金为通关神，土生金、金生水，化阻为泄，通关流畅。",
      excessive: "【金多水浊 / 金寒水冷】：三冬金寒，水成坚冰毫无生机，非金不生水，实气机冻结；此时急需丙火融金解冻，水方可奔腾。",
      quote: "《滴天髓》：“金水双清，最喜向阳。金冷水寒，反成冰涸。”"
    },
    "water-wood": {
      id: "water-wood",
      from: "water",
      to: "wood",
      title: "水生木 · 润下滋养与胚萌破土",
      tagline: "“潜藏复发 · 润下通络 · 阴极萌阳”",
      mechanism: "水主闭藏与流动渗透，浸润土层，携带矿物养分穿透种皮胞壁，激发沉睡之生命本元，促使木行自下而上拔节生发。",
      tanHe: "【贪合忘冲 / 贪合忘克】：壬水见丁火相合（丁壬合木），壬贪合丁火而忘克丙火；癸水见戊土相合（戊癸合火），贪合忘生甲乙木（贪合忘生）。亥水合寅木，亥贪合寅而忘冲巳火（贪合忘冲）！",
      tanSheng: "【贪生忘克】：金本克木，局中水旺畅达，金贪生水，水转而滋木，肃杀之金化为生润之露，克意全消！若无水，金刃直戕嫩木。",
      tongGuan: "【金木相战，以水通关】：两神相伐，取壬癸水通关，金生水、水生木，干戈化玉帛。",
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
      tanHe: "【贪合忘克】：丙火见辛金相合（丙辛合水），丙火贪合辛金，忘其克庚金之暴；地支午未合土，午火贪合未土，忘去熔金！",
      tanSheng: "【贪生忘克】：火克金，若局中土气通畅，火专注于生土，土进而生金，火克金的杀伐化为温润生息。前提是土路通畅无阻！若土被木克死或土焦，火直克金。",
      tongguan: "【通关枢纽 · 土】：两神相战，当取土通关！火生土，土生金。特别注意：必须取辰丑湿土！辰丑湿土一则泄火之烈，二则润生金；未戌燥土反助火脆金。",
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
      tanHe: "【贪合忘克】：乙木见庚金相合（乙庚合金），庚金贪合乙木而不行克伐；地支卯戌合火，卯木贪合戌土，忘克丑未之土，亦忘被酉金所冲（贪合忘冲）！",
      tanSheng: "【贪生忘克】：金克木，若局中见水且水路通达，金贪生水，水进而生木，肃杀之金化为甘露泉源。前提：水路畅通无阻！",
      tongguan: "【通关枢纽 · 水】：金木相战，以水通关！金生水，水生木，肃杀之意化为滋养之泉。若水路堵塞（如被土截胡），金必直伤木。",
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
      tanHe: "【贪合忘克】：甲木见己土相合（甲己合土），中正之合，甲木贪合己土，化克为中和承载；地支寅亥合木，寅木贪合亥水，忘去克辰戌之土！",
      tanSheng: "【贪生忘克】：木克土，若火气通达，木贪生火，火进而生土，木克土转化为长养之生力。前提：火路通畅！",
      tongguan: "【通关枢纽 · 火】：木土相持，以火通关！木生火，火生土，木之狂发化为暖火，火以温性化育土性，变克为生！",
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
      tanHe: "【贪合忘克 / 贪合忘冲】：戊土见癸水相合（戊癸合火），老少相投合化为火，戊土贪合癸水，不再筑堤截断；地支子丑合土，丑土贪合子水，忘去冲未土！",
      tanSheng: "【贪生忘克】：土克水，若局中金气通达，土贪生金，金进而生水，土之防守转化为金质管道水渠，流通不息。前提：金路通畅无阻！",
      tongguan: "【通关枢纽 · 金】：土水对战，以金通关！土生金，金生水，土之防守转化为金质管道水渠，导引清流顺畅出海。",
      fanWu: "【反克乘侮 · 水多土流】：狂涛骤至，洪峰破坝，土堤瞬间被冲刷崩解，随流而去。辰土水旺被同化，唯火土烘烤转燥方能制水！",
      quote: "《周礼观·辰土辨析》：“辰土制水有条件：水旺时被同化不能制水；火土合力烘烤辰中癸水，转燥后方能制水！”"
    },
    "water-fire": {
      id: "water-fire",
      from: "water",
      to: "fire",
      title: "水克火 · 降温窒熄与水火既济",
      tagline: "“清寒灭烈 · 潜藏息狂 · 润下胜炎”",
      mechanism: "流体低温高比热直接吸收热源能量，蒸发阻隔氧气扩散，迅速将高温激发态抑制至基态。",
      tanHe: "【贪合忘克 / 贪合忘冲】：壬水见丁火相合（丁壬合木），仁寿之合，水火两情相悦合化为木，克性冰释；地支子辰半合水，子水贪合辰土，忘去冲午火！",
      tanSheng: "【贪生忘克】：水克火，若见木气通畅，水贪生木，木再生火，克局转为温煦顺生。前提：木路通畅无阻！若木被斩断，水火相争两败俱伤。",
      tongguan: "【通关枢纽 · 木】：水火两立，以木通关！水生木，木生火，水之阴润通过草木经络化为生火之源，通畅无阻。",
      fanWu: "【反克乘侮 · 火炎水涸】：烈日炽灼，杯水车薪，水未近烈火已被蒸腾为飞雾虚无。",
      quote: "《周易·既济卦》：“水在火上，既济。君子以思患而预防之。”"
    }
  },

  // 内部五角星交叉枢纽节点（通关与冲合核心）
  nexusPoints: [
    {
      id: "nexus-center",
      name: "混元太极 · 通关总枢",
      color: "#4a3c2c",
      tongguanDesc: "五行生克相交之天枢，变易本体。《滴天髓》：“关内有织女，关外有牛郎，此关若通也，相邀入洞房。”通关不是补缺，是通堵！",
      tanHeDesc: "三合 ＞ 六合 ＞ 冲 ＞ 生克；紧贴 ＞ 隔位 ＞ 遥隔。合能解冲，冲能破合。忌神喜合，喜神忌合。"
    },
    {
      id: "nexus-fire-water",
      name: "水火交界点 (离坎交涉)",
      color: "#2498db",
      tongguanDesc: "水克火与火克金交点。水欲灭火，火欲克金。取【木】通关，水生木、木生火，引水火既济。",
      tanHeDesc: "丁壬合木、丙辛合水。合化成功则改变水火对峙格局，合绊则双方皆发力迟滞。"
    },
    {
      id: "nexus-wood-metal",
      name: "金木交界点 (震兑交涉)",
      color: "#cca300",
      tongguanDesc: "金克木与木克土交点。金伤木而木伤土。取【水】通关，金生水、水生木，化刚革为滋润。",
      tanHeDesc: "乙庚合金、甲己合土。庚贪合乙木则忘克甲，甲贪合己土则忘克戊。"
    },
    {
      id: "nexus-earth-fire",
      name: "火土交界点 (坤离交涉)",
      color: "#c02c2c",
      tongguanDesc: "木克土与火克金交点。取【湿土（辰丑）】通关，泄滔天烈火而生金。燥土（未戌）反助火脆金。",
      tanHeDesc: "午未合土、卯戌合火。火生土之真相：火性散而土性新，陶器成得金用。"
    },
    {
      id: "nexus-water-earth",
      name: "土水交界点 (坎坤交涉)",
      color: "#7d6350",
      tongguanDesc: "土克水与水克火交点。堤防与泛滥之权衡。取【金】通关，土生金、金生水，化阻为泄引流出海。",
      tanHeDesc: "戊癸合火、子丑合土。辰土制水条件：水旺被同化不克水；火土烘烤转燥方能制水。"
    },
    {
      id: "nexus-metal-earth",
      name: "金土交界点 (乾坤交涉)",
      color: "#1ca857",
      tongguanDesc: "火克金与土克水交点。承载转致密之界面。取【水】或【土】调理，化燥焦为润泽。",
      tanHeDesc: "辰酉合金、巳申合水。土多金埋则需甲木疏土；金多水浊则喜丙火照暖。"
    }
  ]
};

// =============================================================================
// 二、SVG 盘面几何演算与渲染 (严格按原图构型)
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
    this.orbitParticles = [];
    this.activeFlowPath = null;
    
    // 当前五行势能权重 (默认中和 50)
    this.energies = {
      wood: 50,
      fire: 50,
      earth: 50,
      metal: 50,
      water: 50
    };

    // 经典原图五方顶点角度 (金在正顶，顺时针各 72 度)
    this.nodePositions = this.calculateNodePositions();
    this.init();
  }

  calculateNodePositions() {
    const angles = {
      metal: -90,              // 顶 (金)
      water: -90 + 72,         // 右偏上 (水) -18°
      wood:  -90 + 72 * 2,     // 右下方 (木) 54°
      fire:  -90 + 72 * 3,     // 左下方 (火) 126°
      earth: -90 + 72 * 4      // 左偏上 (土) 198°
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

    // 默认高亮“土”或者“金”，呈现完整通关与贪和
    this.selectEntity("earth", "element");
  }

  // 1. 外圈顺时针相生弧线（大绿弧与箭头）
  renderShengArcs() {
    const group = document.getElementById("sheng-arcs-group");
    group.innerHTML = "";

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
      
      const arcD = `M ${p1.x} ${p1.y} A ${this.radius} ${this.radius} 0 0 1 ${p2.x} ${p2.y}`;
      
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", arcD);
      path.setAttribute("class", "sheng-arc-path");
      path.setAttribute("id", `arc-${from}-${to}`);
      path.setAttribute("marker-end", "url(#arrow-sheng)");

      path.addEventListener("click", (e) => {
        e.stopPropagation();
        this.selectShengChain(from, to);
      });

      group.appendChild(path);
    });
  }

  // 2. 内部五角星互克射线 (火->金, 金->木, 木->土, 土->水, 水->火)
  renderKeLines() {
    const group = document.getElementById("ke-lines-group");
    group.innerHTML = "";

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

      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", p1.x);
      line.setAttribute("y1", p1.y);
      line.setAttribute("x2", p2.x);
      line.setAttribute("y2", p2.y);
      line.setAttribute("class", `ke-line-path ${item.colorClass}`);
      line.setAttribute("id", `ke-${item.from}-${item.to}`);
      line.setAttribute("marker-end", item.marker);

      line.addEventListener("click", (e) => {
        e.stopPropagation();
        this.selectKeChain(item.from, item.to);
      });

      group.appendChild(line);
    });
  }

  // 3. 内部射线交叉小珠 (实心通关节点)
  renderNexusPoints() {
    const group = document.getElementById("nexus-nodes-group");
    group.innerHTML = "";

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
    const pts = [
      { pt: getIntersection(pos.earth, pos.water, pos.fire, pos.metal), color: "#2498db", id: "nexus-1", name: "水火气冲交点" },
      { pt: getIntersection(pos.earth, pos.water, pos.metal, pos.wood), color: "#1ca857", id: "nexus-2", name: "金木土化交点" },
      { pt: getIntersection(pos.water, pos.fire, pos.metal, pos.wood), color: "#e83628", id: "nexus-3", name: "金木水火交点" },
      { pt: getIntersection(pos.water, pos.fire, pos.wood, pos.earth), color: "#8c7362", id: "nexus-4", name: "水火木土通关交点" },
      { pt: getIntersection(pos.wood, pos.earth, pos.fire, pos.metal), color: "#fed636", id: "nexus-5", name: "木火土金通关交点" },
      { pt: { x: this.centerX, y: this.centerY }, color: "#3e2e1e", r: 10, id: "nexus-center", name: "混元太极通关总枢" }
    ];

    pts.forEach((p, idx) => {
      if (!p.pt) return;
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", p.pt.x);
      circle.setAttribute("cy", p.pt.y);
      circle.setAttribute("r", p.r || 8);
      circle.setAttribute("fill", p.color);
      circle.setAttribute("stroke", "#ffffff");
      circle.setAttribute("stroke-width", "2");
      circle.setAttribute("class", "nexus-node-dot");
      circle.setAttribute("id", p.id);

      circle.addEventListener("click", (e) => {
        e.stopPropagation();
        this.selectNexus(idx, p.name);
      });

      group.appendChild(circle);
    });
  }

  // 4. 外圈【生】字徽标
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

    const labelRadius = this.radius + 18;

    shengArcs.forEach(item => {
      const rad = (item.deg * Math.PI) / 180;
      const cx = this.centerX + labelRadius * Math.cos(rad);
      const cy = this.centerY + labelRadius * Math.sin(rad);

      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.setAttribute("class", "sheng-label-group");
      g.setAttribute("id", `sheng-label-${item.from}-${item.to}`);

      const hitCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      hitCircle.setAttribute("cx", cx);
      hitCircle.setAttribute("cy", cy);
      hitCircle.setAttribute("r", "22");
      hitCircle.setAttribute("class", "sheng-label-bg");

      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", cx);
      text.setAttribute("y", cy);
      text.setAttribute("class", "sheng-label-text");
      text.textContent = "生";

      g.appendChild(hitCircle);
      g.appendChild(text);

      g.addEventListener("click", (e) => {
        e.stopPropagation();
        this.selectShengChain(item.from, item.to);
      });

      group.appendChild(g);
    });
  }

  // 5. 内圈相克【克】字徽标 (原图核心特质)
  renderKeLabels() {
    const group = document.getElementById("ke-labels-group");
    group.innerHTML = "";

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

      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", cx);
      circle.setAttribute("cy", cy);
      circle.setAttribute("r", "16");
      circle.setAttribute("class", "ke-label-bg");
      circle.setAttribute("stroke", item.stroke);

      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", cx);
      text.setAttribute("y", cy);
      text.setAttribute("class", "ke-label-text");
      text.setAttribute("fill", item.textFill);
      text.textContent = "克";

      g.appendChild(circle);
      g.appendChild(text);

      g.addEventListener("click", (e) => {
        e.stopPropagation();
        this.selectKeChain(item.from, item.to);
      });

      group.appendChild(g);
    });
  }

  // 6. 五大原质琉璃主星球 (原位锚定，绝对杜绝位移乱飞)
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
      // 绝对坐标 translate 固定原位
      g.setAttribute("transform", `translate(${pos.x}, ${pos.y})`);

      // 选中有光环
      const halo = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      halo.setAttribute("cx", 0);
      halo.setAttribute("cy", 0);
      halo.setAttribute("r", this.sphereRadius + 7);
      halo.setAttribute("class", "element-halo-ring");

      // 球体本体 (无 CSS 缩放，保证绝对不位移)
      const sphere = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      sphere.setAttribute("cx", 0);
      sphere.setAttribute("cy", 0);
      sphere.setAttribute("r", this.sphereRadius);
      sphere.setAttribute("fill", `url(#grad-${key})`);
      sphere.setAttribute("class", "sphere-body");

      // 经典 Web 拟物白月牙高光 (Sheen)
      const sheen = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
      sheen.setAttribute("cx", -4);
      sheen.setAttribute("cy", -13);
      sheen.setAttribute("rx", this.sphereRadius * 0.65);
      sheen.setAttribute("ry", this.sphereRadius * 0.36);
      sheen.setAttribute("fill", "url(#gloss-sheen)");
      sheen.setAttribute("class", "sphere-sheen");

      // 铭字 (金水木火土)
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", 0);
      text.setAttribute("y", 1);
      text.setAttribute("class", `sphere-label-text ${key === "metal" ? "metal-text" : ""}`);
      text.textContent = data.name;

      g.appendChild(halo);
      g.appendChild(sphere);
      g.appendChild(sheen);
      g.appendChild(text);

      g.addEventListener("click", (e) => {
        e.stopPropagation();
        this.selectEntity(key, "element");
      });

      group.appendChild(g);
    });
  }

  // =============================================================================
  // 三、重构气流粒子：严格循经流转，绝不四处乱飞
  // =============================================================================

  initParticles() {
    this.orbitParticles = [];
    const count = 15; // 严选 15 个纯正气机流光
    for (let i = 0; i < count; i++) {
      this.orbitParticles.push({
        angle: (i / count) * Math.PI * 2,
        speed: 0.008,
        size: 3.5,
        color: "#2ecc71"
      });
    }
  }

  startFlowLoop() {
    const particleGroup = document.getElementById("qi-flow-particles");

    const animate = () => {
      if (this.isFlowing) {
        particleGroup.innerHTML = "";
        
        // 1. 严格在顺时针相生圆环轨道流转（木->火->土->金->水->木）
        this.orbitParticles.forEach(p => {
          p.angle += p.speed;
          if (p.angle > Math.PI * 2) p.angle -= Math.PI * 2;

          // 严格固定在 R = 236 轨道上，绝不出现任何横冲直撞的乱飞
          const x = this.centerX + this.radius * Math.cos(p.angle);
          const y = this.centerY + this.radius * Math.sin(p.angle);

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
  // 四、全景通关与贪和深度呈现 (盘面直显 + 右侧同步)
  // =============================================================================

  // 1. 选中五行主星 (金/水/木/火/土)
  selectEntity(elementKey, type = "element") {
    this.clearHighlights();
    const data = WUXING_DATA.elements[elementKey];
    if (!data) return;

    // 高亮该球体
    const sphere = document.getElementById(`sphere-${elementKey}`);
    if (sphere) sphere.classList.add("active");

    // 高亮四向生克网络
    this.highlightRelatedLinks(elementKey);

    const beShengData = WUXING_DATA.elements[data.beSheng];
    const shengData = WUXING_DATA.elements[data.sheng];
    const beKeData = WUXING_DATA.elements[data.beKe];
    const keData = WUXING_DATA.elements[data.ke];

    // 更新盘面直显【周礼象数·生克通关与贪和明细鉴】
    this.renderInAltarInsight({
      sealText: data.name,
      title: `【${data.name}行本元】· ${data.bagua} · 气机生克通关全景`,
      subTitle: `气机走向：${data.trend}`,
      bannerHtml: `
        <span class="altar-chain-node" style="background:${beShengData.color}; color:${data.beSheng==='metal'?'#333':'#fff'}">${beShengData.name}</span>
        <span class="altar-chain-arrow">生➔</span>
        <span class="altar-chain-node" style="background:${data.color}; color:${elementKey==='metal'?'#333':'#fff'}">${data.name}</span>
        <span class="altar-chain-arrow">生➔</span>
        <span class="altar-chain-node" style="background:${shengData.color}; color:${data.sheng==='metal'?'#333':'#fff'}">${shengData.name}</span>
        <span style="margin: 0 8px; color: #a98056;">|</span>
        <span class="altar-chain-node" style="background:${beKeData.color}; color:#fff">${beKeData.name}</span>
        <span class="altar-chain-arrow" style="color:#c02c2c">克➔</span>
        <span class="altar-chain-node" style="background:${data.color}; color:${elementKey==='metal'?'#333':'#fff'}">${data.name}</span>
        <span class="altar-chain-arrow" style="color:#c02c2c">克➔</span>
        <span class="altar-chain-node" style="background:${keData.color}; color:#fff">${keData.name}</span>
      `,
      gridHtml: `
        <div class="altar-sec-box gold-highlight">
          <div class="altar-sec-tag" style="color:#b8860b">❖【贪生忘克机制与前提】</div>
          <div>${data.tanSheng}</div>
        </div>
        <div class="altar-sec-box red-highlight">
          <div class="altar-sec-tag" style="color:#c02c2c">❖【贪和剖析 (合忘克/忘冲/忘生)】</div>
          <div>${data.tanHe}</div>
        </div>
        <div class="altar-sec-box green-highlight">
          <div class="altar-sec-tag" style="color:#1b7d48">❖【两神对峙 · 通关取用法】</div>
          <div>${data.tongGuan}</div>
        </div>
        <div class="altar-sec-box blue-highlight">
          <div class="altar-sec-tag" style="color:#1a73b5">❖【变局失衡 · 反克乘侮】</div>
          <div>${data.fanWu}</div>
        </div>
      `,
      footerHtml: `<strong>【周礼物性与现代物理】</strong>：${data.physics}`
    });

    // 同步更新右侧面板
    this.updateRightDetailPanel({
      sigil: data.name,
      sigilBg: `radial-gradient(circle at 35% 35%, ${data.color}, ${data.darkColor})`,
      sigilColor: elementKey === "metal" ? "#4a2800" : "#ffffff",
      title: `${data.bagua} · ${data.name}行气机本元`,
      tagline: data.trend,
      typeBadge: "五行本位",
      tiyong: data.tiyong,
      trend: data.trend,
      physics: data.physics,
      interaction: `受【${beShengData.name}】长养；顺生【${shengData.name}】；受【${beKeData.name}】制约；克制裁度【${keData.name}】。`,
      insightTitle: `【${data.name}】之贪和羁绊与通关枢机`,
      insightContent: `
        <p><strong>【贪合忘克 / 贪合忘冲之‘贪和’真相】：</strong></p>
        <p>${data.tanHe}</p>
        <p><strong>【贪生忘克成立之前提】：</strong></p>
        <p>${data.tanSheng}</p>
        <p class="highlight-quote"><strong>【通关取用神断点】：</strong>${data.tongGuan}</p>
      `,
      scripture: data.scripture
    });
  }

  // 2. 选中【生】字或相生弧线
  selectShengChain(fromKey, toKey) {
    this.clearHighlights();
    const chainKey = `${fromKey}-${toKey}`;
    const data = WUXING_DATA.shengChains[chainKey];
    if (!data) return;

    // 高亮弧线与两端球体与生字徽标
    const arc = document.getElementById(`arc-${fromKey}-${toKey}`);
    if (arc) arc.classList.add("active");
    const shengLabel = document.getElementById(`sheng-label-${fromKey}-${toKey}`);
    if (shengLabel) shengLabel.classList.add("active");
    const sphereFrom = document.getElementById(`sphere-${fromKey}`);
    const sphereTo = document.getElementById(`sphere-${toKey}`);
    if (sphereFrom) sphereFrom.classList.add("active");
    if (sphereTo) sphereTo.classList.add("active");

    const fromData = WUXING_DATA.elements[fromKey];
    const toData = WUXING_DATA.elements[toKey];

    // 更新盘面直显明细鉴
    this.renderInAltarInsight({
      sealText: "生",
      title: `【相生长养】· ${data.title}`,
      subTitle: data.tagline,
      bannerHtml: `
        <span class="altar-chain-node" style="background:${fromData.color}; color:${fromKey==='metal'?'#333':'#fff'}">${fromData.name}行</span>
        <span class="altar-chain-arrow" style="font-size:16px; color:#1ca857">══ 顺行相生 ══➔</span>
        <span class="altar-chain-node" style="background:${toData.color}; color:${toKey==='metal'?'#333':'#fff'}">${toData.name}行</span>
      `,
      gridHtml: `
        <div class="altar-sec-box gold-highlight">
          <div class="altar-sec-tag" style="color:#b8860b">❖【贪生忘克机制与前提】</div>
          <div>${data.tanSheng}</div>
        </div>
        <div class="altar-sec-box red-highlight">
          <div class="altar-sec-tag" style="color:#c02c2c">❖【贪和（合忘克 / 合忘生）】</div>
          <div>${data.tanHe}</div>
        </div>
        <div class="altar-sec-box green-highlight">
          <div class="altar-sec-tag" style="color:#1b7d48">❖【相生转化为通关之用】</div>
          <div>${data.tongGuan}</div>
        </div>
        <div class="altar-sec-box blue-highlight">
          <div class="altar-sec-tag" style="color:#1a73b5">❖【母慈灭子 / 子盗母气】</div>
          <div>${data.excessive}</div>
        </div>
      `,
      footerHtml: `<strong>【周礼物理本质】</strong>：${data.mechanism}`
    });

    // 同步更新右侧面板
    this.updateRightDetailPanel({
      sigil: "生",
      sigilBg: "radial-gradient(circle at 35% 35%, #58d68d, #196f3d)",
      sigilColor: "#ffffff",
      title: data.title,
      tagline: data.tagline,
      typeBadge: "相生长养",
      tiyong: data.mechanism,
      trend: `由【${fromData.name}】之动向驱动催化，唤醒【${toData.name}】之生成`,
      physics: data.mechanism,
      interaction: data.excessive,
      insightTitle: "相生流转中的【贪和】与【贪生忘克】详考",
      insightContent: `
        <p><strong>【贪生忘克动力学】：</strong>${data.tanSheng}</p>
        <p><strong>【贪合（贪和）之羁绊】：</strong>${data.tanHe}</p>
        <p class="highlight-quote"><strong>【通关要旨】：</strong>${data.tongGuan}</p>
      `,
      scripture: data.quote
    });
  }

  // 3. 选中【克】字或相克折线
  selectKeChain(fromKey, toKey) {
    this.clearHighlights();
    const chainKey = `${fromKey}-${toKey}`;
    const data = WUXING_DATA.keChains[chainKey];
    if (!data) return;

    const line = document.getElementById(`ke-${fromKey}-${toKey}`);
    if (line) line.classList.add("active");
    const keLabel = document.getElementById(`ke-label-${fromKey}-${toKey}`);
    if (keLabel) keLabel.classList.add("active");
    const sphereFrom = document.getElementById(`sphere-${fromKey}`);
    const sphereTo = document.getElementById(`sphere-${toKey}`);
    if (sphereFrom) sphereFrom.classList.add("active");
    if (sphereTo) sphereTo.classList.add("active");

    const fromData = WUXING_DATA.elements[fromKey];
    const toData = WUXING_DATA.elements[toKey];

    // 更新盘面直显明细鉴
    this.renderInAltarInsight({
      sealText: "克",
      title: `【相克制化】· ${data.title}`,
      subTitle: data.tagline,
      bannerHtml: `
        <span class="altar-chain-node" style="background:${fromData.color}; color:${fromKey==='metal'?'#333':'#fff'}">${fromData.name}行</span>
        <span class="altar-chain-arrow" style="font-size:16px; color:#c02c2c">══ 制化相伐 ══➔</span>
        <span class="altar-chain-node" style="background:${toData.color}; color:${toKey==='metal'?'#333':'#fff'}">${toData.name}行</span>
      `,
      gridHtml: `
        <div class="altar-sec-box gold-highlight">
          <div class="altar-sec-tag" style="color:#b8860b">❖【两神对峙 · 通关取用秘要】</div>
          <div>${data.tongguan}</div>
        </div>
        <div class="altar-sec-box red-highlight">
          <div class="altar-sec-tag" style="color:#c02c2c">❖【贪和羁绊 (贪合忘克 / 忘冲)】</div>
          <div>${data.tanHe}</div>
        </div>
        <div class="altar-sec-box green-highlight">
          <div class="altar-sec-tag" style="color:#1b7d48">❖【贪生忘克 · 化克为生】</div>
          <div>${data.tanSheng}</div>
        </div>
        <div class="altar-sec-box blue-highlight">
          <div class="altar-sec-tag" style="color:#1a73b5">❖【反克乘侮 (失衡反噬)】</div>
          <div>${data.fanWu}</div>
        </div>
      `,
      footerHtml: `<strong>【制约物理真诠】</strong>：${data.mechanism}`
    });

    // 同步更新右侧面板
    this.updateRightDetailPanel({
      sigil: "克",
      sigilBg: "radial-gradient(circle at 35% 35%, #ec7063, #922b21)",
      sigilColor: "#ffffff",
      title: data.title,
      tagline: data.tagline,
      typeBadge: "相克制化",
      tiyong: data.mechanism,
      trend: `以【${fromData.name}】之肃约张力，裁度节制【${toData.name}】之过度泛滥`,
      physics: "能量势能剪切与抑制，防止单一维度熵增失衡。",
      interaction: `${data.fanWu}；${data.tanHe}`,
      insightTitle: "两神相争之【通关】与【贪和】详解",
      insightContent: `
        <p><strong>【两神相战通关神】：</strong>${data.tongguan}</p>
        <p><strong>【贪合忘克之贪和】：</strong>${data.tanHe}</p>
        <p><strong>【贪生忘克化解】：</strong>${data.tanSheng}</p>
        <p class="highlight-quote"><strong>《滴天髓》真诠：</strong>“关内有织女，关外有牛郎，此关若通也，相邀入洞房。”克战非死局，唯寻通关神打通堵塞！</p>
      `,
      scripture: data.quote
    });
  }

  // 4. 选中相克射线交叉小珠 (通关枢纽)
  selectNexus(index, name) {
    this.clearHighlights();
    const nexus = WUXING_DATA.nexusPoints[index] || WUXING_DATA.nexusPoints[0];

    // 更新盘面直显明细鉴
    this.renderInAltarInsight({
      sealText: "枢",
      title: `【通关总枢】· ${nexus.name}`,
      subTitle: "“两神对峙 · 寻断阻之处 · 施通关之用”",
      bannerHtml: `
        <span class="altar-chain-node" style="background:#554433; color:#fffaee">两神对峙</span>
        <span class="altar-chain-arrow" style="color:#d49a00">➔ 取通关神 ➔</span>
        <span class="altar-chain-node" style="background:#1b7d48; color:#fff">气机顺流</span>
      `,
      gridHtml: `
        <div class="altar-sec-box gold-highlight">
          <div class="altar-sec-tag" style="color:#b8860b">❖【通关思维：通堵不补缺】</div>
          <div>${nexus.tongguanDesc}</div>
        </div>
        <div class="altar-sec-box red-highlight">
          <div class="altar-sec-tag" style="color:#c02c2c">❖【冲合博弈：贪和与合化】</div>
          <div>${nexus.tanHeDesc}</div>
        </div>
        <div class="altar-sec-box green-highlight">
          <div class="altar-sec-tag" style="color:#1b7d48">❖【辨辰土之变 (周礼核心)】</div>
          <div>辰为水库，水旺时辰被同化不能制水；火土合力烘烤辰中癸水转燥后方能制水。</div>
        </div>
        <div class="altar-sec-box blue-highlight">
          <div class="altar-sec-tag" style="color:#1a73b5">❖【出厂设置与实时调参】</div>
          <div>命是出厂设置，运是实时调参。气有力而理可参，体质与运势乃动态博弈之实时自洽。</div>
        </div>
      `,
      footerHtml: `<strong>《滴天髓》</strong>：“断阻之处，以通为和。关内有织女，关外有牛郎，此关若通也，相邀入洞房。”`
    });

    // 同步更新右侧面板
    this.updateRightDetailPanel({
      sigil: "枢",
      sigilBg: "radial-gradient(circle at 35% 35%, #85929e, #2e4053)",
      sigilColor: "#f4f6f7",
      title: nexus.name,
      tagline: "“冲合交汇 · 变易机纽 · 象数通关台”",
      typeBadge: "通关枢纽",
      tiyong: "通关之神，调和克战两端。中间若被间阻、刑冲、劫占，皆为关隔；得引用会合之神去其间阻，方为通关。",
      trend: "找断点，不找缺口。不问缺什么，唯打通气机雍滞之节点。",
      physics: "多势能态动态耦合界面，引入中间媒介诱导能量平滑耗散流转。",
      interaction: nexus.tanHeDesc,
      insightTitle: "周礼取用逻辑：辨辰土与通关神意",
      insightContent: `
        <p>《子平真诠》归纳取用五法，通关为其一：“两神对峙，强弱均平，各不相下，须调和之为美，此以通关为用也。”</p>
        <p><strong>【辨辰土之变】：</strong>辰为水库，内藏癸水、乙木、戊土。水旺时辰被同化，顺流不能制水；唯有火土合力烘烤辰中癸水，辰土由湿转燥后，方能制水。此为‘变易优先’在土行内部之极精微细化！</p>
        <p class="highlight-quote"><strong>心法一言：</strong>“愚人以天地文理圣，我以时物文理哲。不问它是什么，只问它在怎么变；不补缺了什么，只通堵在哪里。”</p>
      `,
      scripture: "《滴天髓》：“两气合而成象，象不可破也。五气聚而成形，形不可绝也。断阻之处，以通为和。”"
    });
  }

  // 渲染盘面直显【周礼象数·生克通关与贪和明细鉴】
  renderInAltarInsight(data) {
    const seal = document.getElementById("altar-scroll-seal");
    const title = document.getElementById("altar-scroll-title");
    const sub = document.getElementById("altar-scroll-sub");
    const body = document.getElementById("altar-scroll-body");

    if (seal) seal.textContent = data.sealText;
    if (title) title.textContent = data.title;
    if (sub) sub.textContent = data.subTitle;

    if (body) {
      body.innerHTML = `
        <div class="altar-chain-banner">${data.bannerHtml}</div>
        <div class="altar-section-grid">${data.gridHtml}</div>
        <div class="altar-fullwidth-box">${data.footerHtml}</div>
      `;
    }
  }

  // 同步更新右侧阐微面板
  updateRightDetailPanel(d) {
    const sigil = document.getElementById("entity-sigil");
    if (sigil) {
      sigil.textContent = d.sigil;
      sigil.style.background = d.sigilBg;
      sigil.style.color = d.sigilColor;
    }
    const title = document.getElementById("entity-title");
    if (title) title.textContent = d.title;
    const tag = document.getElementById("entity-tagline");
    if (tag) tag.textContent = d.tagline;
    const badge = document.getElementById("entity-type-badge");
    if (badge) badge.textContent = d.typeBadge;

    const tiyong = document.getElementById("detail-tiyong");
    if (tiyong) tiyong.textContent = d.tiyong;
    const trend = document.getElementById("detail-trend");
    if (trend) trend.textContent = d.trend;
    const physics = document.getElementById("detail-physics");
    if (physics) physics.textContent = d.physics;
    const inter = document.getElementById("detail-interaction");
    if (inter) inter.textContent = d.interaction;

    const inTitle = document.getElementById("insight-title");
    if (inTitle) inTitle.textContent = d.insightTitle;
    const inContent = document.getElementById("insight-content");
    if (inContent) inContent.innerHTML = d.insightContent;

    const scrip = document.getElementById("scripture-text");
    if (scrip) scrip.textContent = d.scripture;

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
    document.querySelectorAll(".sheng-label-group").forEach(el => el.classList.remove("active"));
    document.querySelectorAll(".ke-label-group").forEach(el => el.classList.remove("active"));
  }

  // =============================================================================
  // 五、实战命理推演局模拟 (周礼观乙木烈火断点演练)
  // =============================================================================

  loadZhouliCase() {
    this.clearHighlights();
    this.setEnergies(80, 100, 30, 15, 10);
    
    // 标记断裂链条：火->土, 土->金, 金->水
    document.getElementById("arc-fire-earth").classList.add("broken");
    document.getElementById("arc-earth-metal").classList.add("broken");
    document.getElementById("arc-metal-water").classList.add("broken");

    document.getElementById("current-qiji-status").textContent = "气机阻断 · 火烤土焦 · 金水濒危";
    document.getElementById("current-qiji-status").style.color = "#c0392b";

    this.renderInAltarInsight({
      sealText: "断",
      title: "【实战断点诊断】· 火烤土焦 · 金水濒危",
      subTitle: "乙木双透火极旺 · 断在 火 ➔ 土 ➔ 金 ➔ 水 这一段",
      bannerHtml: `
        <span class="altar-chain-node" style="background:#e83628; color:#fff">火旺成局</span>
        <span class="altar-chain-arrow" style="color:#c02c2c">⚡ 烤焦断裂 ⚡</span>
        <span class="altar-chain-node" style="background:#8c7362; color:#fff">丑土受炙</span>
        <span class="altar-chain-arrow" style="color:#c02c2c">⚡ 生金无源 ⚡</span>
        <span class="altar-chain-node" style="background:#fed636; color:#333">金气衰微</span>
      `,
      gridHtml: `
        <div class="altar-sec-box red-highlight">
          <div class="altar-sec-tag" style="color:#c02c2c">❖【断点病机】</div>
          <div>火势漫天，丑土湿气被双巳夹烤蒸发，转为焦土不能生金；弱金藏而受克，壬水无源坐午被蒸。</div>
        </div>
        <div class="altar-sec-box gold-highlight">
          <div class="altar-sec-tag" style="color:#b8860b">❖【通关枢纽秘解】</div>
          <div>切忌直接盲目“缺水补水、缺金补金”，弱金入烈火立化，弱水泼旺火反激烈炎！唯当取【辰土湿土】通关！</div>
        </div>
      `,
      footerHtml: `<strong>点击“辰土通关调理”按钮</strong>，立即演练辰土泄火、护金、涵水之神功！`
    });

    switchTab("tab-case");
  }

  applyTongguanResolve() {
    this.setEnergies(65, 55, 65, 50, 50);

    document.querySelectorAll(".broken").forEach(el => el.classList.remove("broken"));
    document.querySelectorAll(".sheng-arc-path").forEach(el => el.classList.add("active"));

    document.getElementById("current-qiji-status").textContent = "辰土通关 · 湿土生金涵水 · 气机周流不息";
    document.getElementById("current-qiji-status").style.color = "#27ae60";

    this.renderInAltarInsight({
      sealText: "通",
      title: "【周礼通关成功】· 辰土湿土大显神用",
      subTitle: "以通关为用 · 火泄土润 · 金生水蓄 · 气象一新",
      bannerHtml: `
        <span class="altar-chain-node" style="background:#1ca857; color:#fff">木</span>
        <span class="altar-chain-arrow">➔</span>
        <span class="altar-chain-node" style="background:#e83628; color:#fff">火</span>
        <span class="altar-chain-arrow">➔ 辰土通关 ➔</span>
        <span class="altar-chain-node" style="background:#fed636; color:#333">金</span>
        <span class="altar-chain-arrow">➔</span>
        <span class="altar-chain-node" style="background:#2498db; color:#fff">水</span>
        <span class="altar-chain-arrow">➔ 周流不息</span>
      `,
      gridHtml: `
        <div class="altar-sec-box green-highlight">
          <div class="altar-sec-tag" style="color:#1ca857">❖【通关成效一：泄滔天烈火】</div>
          <div>火生湿土，烈焰热量被辰土大量吸收，火势转为温和。</div>
        </div>
        <div class="altar-sec-box gold-highlight">
          <div class="altar-sec-tag" style="color:#b8860b">❖【通关成效二：润土结晶生金】</div>
          <div>土润则生金，辛庚有依托，金气致密成器。</div>
        </div>
        <div class="altar-sec-box blue-highlight">
          <div class="altar-sec-tag" style="color:#1a73b5">❖【通关成效三：辰为水库涵水】</div>
          <div>辰蓄癸水，阻断强火蒸发，壬癸水有根得滋。</div>
        </div>
        <div class="altar-sec-box red-highlight">
          <div class="altar-sec-tag" style="color:#c02c2c">❖【通关真诠总结】</div>
          <div>通关不是补缺，是通堵——找断点，不找缺口！</div>
        </div>
      `,
      footerHtml: `《滴天髓》：“关内有织女，关外有牛郎，此关若通也，相邀入洞房。”全局气机大衡！`
    });

    switchTab("tab-case");
  }

  setEnergies(w, f, e, m, wa) {
    this.energies = { wood: w, fire: f, earth: e, metal: m, water: wa };
    
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

// 挂载至全局便于调试与联动
if (typeof window !== 'undefined') window.WuxingAltar = WuxingAltar;
if (typeof globalThis !== 'undefined') globalThis.WuxingAltar = WuxingAltar;

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
    altarInstance.selectEntity("earth", "element");
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

  // 运行命理沙盘演练 (安全检查)
  const runSimBtn = document.getElementById("btn-run-case-simulation");
  if (runSimBtn) {
    runSimBtn.addEventListener("click", () => {
      altarInstance.applyTongguanResolve();
    });
  }

  // 辰土通关调理 (安全检查)
  const tgBtn = document.getElementById("btn-tongguan-resolve");
  if (tgBtn) {
    tgBtn.addEventListener("click", () => {
      altarInstance.applyTongguanResolve();
    });
  }

  // 动态滑块绑定
  ["wood", "fire", "earth", "metal", "water"].forEach(key => {
    const slider = document.getElementById(`slider-${key}`);
    if (slider) {
      slider.addEventListener("input", (e) => {
        const val = parseInt(e.target.value, 10);
        document.getElementById(`val-${key}`).textContent = val;
        altarInstance.energies[key] = val;
        altarInstance.updateLiveAnalysis();
      });
    }
  });

  // 初始化命理沙盘
  initBaziSandbox();
});

// =============================================================================
// 七、命理沙盘控制器 (四柱自由输入、经典知识库解读与全盘联动)
// =============================================================================

var lastAnalysisResult = null;

function initBaziSandbox() {
  const gans = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
  const zhis = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

  const pillars = ["year", "month", "day", "hour"];

  // 1. 填充四柱下拉选择框并绑定即时联动
  pillars.forEach(p => {
    const ganSelect = document.getElementById(`sel-${p}-gan`);
    const zhiSelect = document.getElementById(`sel-${p}-zhi`);
    if (ganSelect && zhiSelect) {
      // 若已有 options 则保留并确保包含五行标注
      ganSelect.innerHTML = gans.map(g => `<option value="${g}">${g} (${BAZI_ENGINE.TIANGAN[g].elem==='wood'?'木':BAZI_ENGINE.TIANGAN[g].elem==='fire'?'火':BAZI_ENGINE.TIANGAN[g].elem==='earth'?'土':BAZI_ENGINE.TIANGAN[g].elem==='metal'?'金':'水'})</option>`).join("");
      zhiSelect.innerHTML = zhis.map(z => `<option value="${z}">${z} (${BAZI_ENGINE.DIZHI[z].elem==='wood'?'木':BAZI_ENGINE.DIZHI[z].elem==='fire'?'火':BAZI_ENGINE.DIZHI[z].elem==='earth'?'土':BAZI_ENGINE.DIZHI[z].elem==='metal'?'金':'水'})</option>`).join("");

      // 用户改动任意天干地支，立即自动重新推演
      ganSelect.addEventListener("change", () => runBaziAnalysis());
      zhiSelect.addEventListener("change", () => runBaziAnalysis());
    }
  });

  // 2. 默认填入周礼实战局 (壬午 乙巳 乙丑 丁巳)
  setBaziPillars([
    { gan: "壬", zhi: "午" },
    { gan: "乙", zhi: "巳" },
    { gan: "乙", zhi: "丑" },
    { gan: "丁", zhi: "巳" }
  ]);

  // 3. 典籍名造预设下拉框
  const presetSelect = document.getElementById("bazi-preset-select");
  if (presetSelect) {
    presetSelect.addEventListener("change", (e) => {
      const presetKey = e.target.value;
      const data = BAZI_ENGINE.PRESETS[presetKey];
      if (data) {
        setBaziPillars(data.pillars);
        const textInput = document.getElementById("bazi-text-input");
        if (textInput) textInput.value = data.pillars.map(p => p.gan + p.zhi).join(" ");
        runBaziAnalysis();
      }
    });
  }

  // 4. 自由文本输入解析与回车响应
  const parseBtn = document.getElementById("btn-parse-bazi-text");
  const textInput = document.getElementById("bazi-text-input");

  const doParseText = () => {
    if (!textInput) return;
    const text = textInput.value.trim();
    const cleaned = text.replace(/[,，;；\s]+/g, " ");
    const parts = cleaned.split(" ").filter(s => s.length === 2);
    if (parts.length >= 4) {
      const parsed = parts.slice(0, 4).map(s => ({ gan: s[0], zhi: s[1] }));
      setBaziPillars(parsed);
      runBaziAnalysis();
    } else {
      alert("请输入完整的四柱干支文本，如：甲子 丙寅 己卯 辛未");
    }
  };

  if (parseBtn) {
    parseBtn.addEventListener("click", doParseText);
  }
  if (textInput) {
    textInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        doParseText();
      }
    });
  }

  // 5. 起盘推演按钮
  const analyzeBtn = document.getElementById("btn-analyze-custom-bazi");
  if (analyzeBtn) {
    analyzeBtn.addEventListener("click", () => {
      runBaziAnalysis();
    });
  }

  // 6. 联动注入左侧五行盘按钮
  const syncBtn = document.getElementById("btn-sync-to-altar");
  if (syncBtn) {
    syncBtn.addEventListener("click", () => {
      syncCurrentBaziToAltar();
    });
  }

  // 初次进入自动推演
  runBaziAnalysis();
}

function setBaziPillars(list) {
  const keys = ["year", "month", "day", "hour"];
  list.forEach((p, idx) => {
    const key = keys[idx];
    const ganSelect = document.getElementById(`sel-${key}-gan`);
    const zhiSelect = document.getElementById(`sel-${key}-zhi`);
    if (ganSelect && zhiSelect) {
      ganSelect.value = p.gan;
      zhiSelect.value = p.zhi;
    }
  });
}

function getSelectedBaziPillars() {
  const keys = ["year", "month", "day", "hour"];
  return keys.map(k => ({
    gan: document.getElementById(`sel-${k}-gan`).value,
    zhi: document.getElementById(`sel-${k}-zhi`).value
  }));
}

function runBaziAnalysis() {
  const pillars = getSelectedBaziPillars();
  const result = BAZI_ENGINE.analyzeBazi(pillars);
  lastAnalysisResult = result;

  // 1. 渲染四柱命盘 (十神、干支、五行色、藏干)
  const board = document.getElementById("bazi-display-board");
  if (board) {
    board.innerHTML = result.pillars.map(p => {
      const ganElem = BAZI_ENGINE.TIANGAN[p.gan].elem;
      const zhiElem = BAZI_ENGINE.DIZHI[p.zhi].elem;
      const cangStr = BAZI_ENGINE.DIZHI[p.zhi].cang.map(c => `${c.gan}(${c.role})`).join(" ");

      return `
        <div class="bazi-pillar">
          <div class="pillar-label">${p.label} · <span style="color:#b8860b; font-weight:bold">${p.shishen}</span></div>
          <div class="pillar-gan ${ganElem}">${p.gan}</div>
          <div class="pillar-zhi ${zhiElem}">${p.zhi}</div>
          <div class="pillar-desc" title="地支藏干：${cangStr}">${cangStr}</div>
        </div>
      `;
    }).join("");
  }

  // 2. 渲染五行气机势能比例条
  const meterContainer = document.getElementById("meter-bars-container");
  if (meterContainer) {
    const elemLabels = { wood: "木 (生发)", fire: "火 (宣散)", earth: "土 (承载)", metal: "金 (收敛)", water: "水 (闭藏)" };
    meterContainer.innerHTML = ["wood", "fire", "earth", "metal", "water"].map(key => {
      const val = result.energyMap[key];
      return `
        <div class="meter-bar-item">
          <div class="meter-label">${elemLabels[key]}</div>
          <div class="meter-track">
            <div class="meter-fill ${key}" style="width: ${val}%"></div>
          </div>
          <div class="meter-pct">${val}</div>
        </div>
      `;
    }).join("");
  }

  // 3. 渲染冲合博弈分析 (贪和、合绊、合化)
  const chongheContainer = document.getElementById("chonghe-list-container");
  if (chongheContainer) {
    if (result.chongHeList.length === 0) {
      chongheContainer.innerHTML = `<div class="chonghe-item" style="border-left-color:#27ae60">四柱干支冲合平缓，未现激烈合化与对冲，生克各循其序。</div>`;
    } else {
      chongheContainer.innerHTML = result.chongHeList.map(ch => `
        <div class="chonghe-item">
          <span class="chonghe-type">【${ch.type}】</span>
          <span class="chonghe-pair">${ch.pair}</span>
          <div style="margin-top:2px">${ch.desc}</div>
          <div class="chonghe-tanhe">${ch.tanHe}</div>
        </div>
      `).join("");
    }
  }

  // 4. 变化链条与断点诊断
  const brokenBox = document.getElementById("bazi-broken-status");
  const verdictText = document.getElementById("bazi-verdict-text");
  if (brokenBox) {
    brokenBox.innerHTML = `<strong>气机断点：</strong> 阻断于 <strong>【${result.brokenSection}】</strong> 环节！${result.diagnosisDetail}`;
  }
  if (verdictText) {
    verdictText.innerHTML = `全局日主当令月建为<strong>【${result.yueling}月】</strong>，全盘以<strong>【${BAZI_ENGINE.TIANGAN[result.dayGan].name}】</strong>为本元。气机偏胜于<strong>【${result.maxElem}行】</strong>，最弱于<strong>【${result.minElem}行】</strong>。`;
  }

  // 5. 周礼通关调理方案
  const tgTitle = document.getElementById("bazi-tongguan-title");
  const tgDesc = document.getElementById("bazi-tongguan-desc");
  if (tgTitle) {
    tgTitle.innerHTML = `【 周礼通关神用 · 首取【${result.tongguanName}】通关 】`;
  }
  if (tgDesc) {
    tgDesc.innerHTML = `${result.tongguanAdvice}<br><span style="color:#7a5433">《滴天髓》真诠：<strong>“两气交争，引通为美；不补缺口，唯通关隔。”</strong></span>`;
  }

  // 6. 经典知识库原典指引
  const citationContainer = document.getElementById("classic-citations-container");
  if (citationContainer) {
    citationContainer.innerHTML = result.classicQuotes.map(q => `
      <div class="citation-card">
        <div class="citation-book">❖ ${q.book}</div>
        <div class="citation-text">${q.text}</div>
      </div>
    `).join("");
  }
}

// 联动注入左侧五行大盘
function syncCurrentBaziToAltar() {
  if (!lastAnalysisResult || !altarInstance) return;

  const res = lastAnalysisResult;
  // 注入五行势能
  altarInstance.setEnergies(
    res.energyMap.wood,
    res.energyMap.fire,
    res.energyMap.earth,
    res.energyMap.metal,
    res.energyMap.water
  );

  // 清除旧高亮
  altarInstance.clearHighlights();
  document.querySelectorAll(".broken").forEach(el => el.classList.remove("broken"));

  // 标记断裂链条
  if (res.brokenSection.includes("火") && res.brokenSection.includes("土")) {
    document.getElementById("arc-fire-earth").classList.add("broken");
  }
  if (res.brokenSection.includes("土") && res.brokenSection.includes("金")) {
    document.getElementById("arc-earth-metal").classList.add("broken");
  }
  if (res.brokenSection.includes("金") && res.brokenSection.includes("水")) {
    document.getElementById("arc-metal-water").classList.add("broken");
  }
  if (res.brokenSection.includes("水") && res.brokenSection.includes("木")) {
    document.getElementById("arc-water-wood").classList.add("broken");
  }
  if (res.brokenSection.includes("木") && res.brokenSection.includes("火")) {
    document.getElementById("arc-wood-fire").classList.add("broken");
  }

  // 高亮通关神所在星球
  if (res.tongguanElement && altarInstance.nodePositions[res.tongguanElement]) {
    altarInstance.selectEntity(res.tongguanElement, "element");
  }

  // 状态栏更新
  document.getElementById("current-qiji-status").textContent = `命局注入 · 断在【${res.brokenSection}】 · 取【${res.tongguanName}】通关`;
  document.getElementById("current-qiji-status").style.color = "#c0392b";

  // 大盘下方呈现通关总鉴
  altarInstance.renderInAltarInsight({
    sealText: "通关",
    title: `【自定义命局联动推演】· 断在【${res.brokenSection}】`,
    subTitle: `日元【${res.dayGan}木】· 月令【${res.yueling}】· 最旺【${res.maxElem}】`,
    bannerHtml: `
      <span class="altar-chain-node" style="background:#543922; color:#fff">命局断点</span>
      <span class="altar-chain-arrow" style="color:#c02c2c">➔ 【${res.brokenSection}】 ➔</span>
      <span class="altar-chain-node" style="background:#1ca857; color:#fff">通关首取：${res.tongguanName}</span>
    `,
    gridHtml: `
      <div class="altar-sec-box gold-highlight">
        <div class="altar-sec-tag" style="color:#b8860b">❖【通关诊断】</div>
        <div>${res.diagnosisDetail}</div>
      </div>
      <div class="altar-sec-box red-highlight">
        <div class="altar-sec-tag" style="color:#c02c2c">❖【调理指南】</div>
        <div>${res.tongguanAdvice}</div>
      </div>
    `,
    footerHtml: `<strong>《滴天髓》</strong>：“关内有织女，关外有牛郎，此关若通也，相邀入洞房。”已成功将命盘势能同步至五行大盘！`
  });

  alert(`【周礼象数联动成功】！\n已将当前八字五行势能注入五行盘：\n- 木: ${res.energyMap.wood} | 火: ${res.energyMap.fire} | 土: ${res.energyMap.earth} | 金: ${res.energyMap.metal} | 水: ${res.energyMap.water}\n- 气机断点：${res.brokenSection}\n- 通关首用：${res.tongguanName}\n盘面断裂处已闪烁红光警示，通关主星已激活！`);
}

