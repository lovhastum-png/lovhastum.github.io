(function () {
  const app = document.getElementById("app");
  const navButtons = Array.from(document.querySelectorAll("[data-nav-key]"));
  const moduleIndex = document.getElementById("moduleIndex");
  const feelingDrawer = document.getElementById("feelingDrawer");
  const inspirationDrawer = document.getElementById("inspirationDrawer");
  const aboutDrawer = document.getElementById("aboutDrawer");
  const musicDock = document.querySelector(".music-dock");
  const musicToggle = document.getElementById("musicToggle");
  const musicStatus = document.getElementById("musicStatus");
  const globalSceneImages = Array.from(document.querySelectorAll("[data-scene-buffer]"));

  const routes = ["home", "breath", "card", "desk", "explore", "lab", "labels", "release", "supply", "window"];
  const inspirationRoutes = new Set(["breath", "card", "desk", "labels", "release", "supply", "window"]);
  const assetRoot = "./src/assets";

  const backgrounds = {
    home: `./xiaoqingya/zhuye.png`,
    breath: `${assetRoot}/backgrounds/bg-breath-water.webp`,
    card: `${assetRoot}/backgrounds/bg-card-tabletop.webp`,
    desk: `${assetRoot}/backgrounds/bg-desk-courtyard.webp`,
    explore: `${assetRoot}/backgrounds/bg-explore-stream.webp`,
    lab: `${assetRoot}/backgrounds/bg-lab-night-studio.webp`,
    labels: `${assetRoot}/backgrounds/bg-labels-wall.webp`,
    release: `${assetRoot}/backgrounds/bg-release-room.webp`,
    supply: `${assetRoot}/backgrounds/bg-supply-environment.webp`,
    window: `${assetRoot}/backgrounds/bg-window-lakeside.webp`,
  };

  const pageMeta = {
    home: {
      title: "绯色心弦",
      en: "CRIMSON HEARTSTRINGS",
      gold: "只要是为了爱，规则稍微弯曲一下也没关系",
      copy: "你不需要立刻解释清楚，也不需要马上变好。在这里，肖清雅陪你一起，允许自己慢下来，好好感受这一刻。",
    },
    breath: {
      title: "静息区",
      en: "BREATHING AREA",
      gold: "跟着气泡慢慢回到此刻",
      copy: "夜已深，心可以慢慢静下来。按住气泡吸气，松开时把紧绷交还给水面。",
    },
    card: {
      title: "今日提示卡",
      en: "DAILY REST CARD",
      gold: "让宇宙的低语，成为今天的灵感指引",
      copy: "抽一张卡，给自己一句轻轻的提醒。它不替你决定，只陪你把注意力放回内在。",
    },
    desk: {
      title: "安静书案",
      en: "QUIET WRITING DESK",
      gold: "把杂乱慢慢写成一句能放下的话",
      copy: "写字、磨墨、发呆，都是和自己相处的方式。把心里打结的事，轻轻放在纸上。",
    },
    explore: {
      title: "心理与行为小知识",
      en: "PSYCHOLOGY & BEHAVIOR KNOWLEDGE",
      gold: "理解心理，不是为了改变自己，而是为了更好地与自己相处",
      copy: "像翻开一本夜读书，慢慢认识那些常见却容易误解的感受。",
    },
    lab: {
      title: "情绪调配室",
      en: "EMOTION BLENDING LAB",
      gold: "把几种感觉混在一起，看看现在更像什么",
      copy: "选择情绪试剂，让杯中的光和右侧配方报告一起回应此刻的你。",
    },
    labels: {
      title: "标签回收口",
      en: "LABEL RECYCLE BIN",
      gold: "把暂时不想背着的标签，先放下来",
      copy: "有些称呼已经不再适合现在的你。把它交给回收篮，给自己留一点呼吸的空间。",
    },
    release: {
      title: "情绪释放室",
      en: "RELEASE ROOM",
      gold: "把堵住的力气，安全地释放出来",
      copy: "每一次轻点，都是一次向内的倾诉，也是一点向外的告别。这里安全、私密、被理解。",
    },
    supply: {
      title: "夜间补给柜",
      en: "NIGHT SUPPLY CABINET",
      gold: "给自己一点慢慢恢复的补给",
      copy: "你已经走了很远。现在可以停下来，选一份属于你的夜间补给。",
    },
    window: {
      title: "值班窗口",
      en: "NIGHT ATTENDANT WINDOW",
      gold: "想说两句也可以，这里会有人听见",
      copy: "很晚了，还没睡也没关系。如果心里有些话，不想一个人留着，可以打个招呼。",
    },
  };

  const promptCards = [
    "允许自己慢下来，黑暗只是黎明前的停顿。",
    "你已经做得够多了，今晚先把呼吸放轻。",
    "不是所有答案都要立刻出现，先照顾好此刻的你。",
    "把注意力从别人的目光里取回，放到自己的心跳上。",
    "今天没有完美也没关系，温柔可以从不苛责开始。",
    "你的感受值得被看见，即使它暂时还说不清楚。",
  ];

  const promptThemes = [
    { title: "允许停顿", copy: "慢下来不是落后，而是在为自己重新留出呼吸。", tags: ["停顿", "松弛", "照顾", "当下"] },
    { title: "轻一点", copy: "你不需要把所有事情都在今晚完成。", tags: ["休息", "边界", "呼吸", "温柔"] },
    { title: "等待答案", copy: "有些答案会在安静之后，自己慢慢浮上来。", tags: ["耐心", "留白", "观察", "信任"] },
    { title: "回到自己", copy: "把目光从外界收回，听一听身体正在说什么。", tags: ["内省", "觉察", "心跳", "真实"] },
    { title: "少一点苛责", copy: "不完美不等于失败，今天已经可以被好好收下。", tags: ["接纳", "松绑", "自洽", "平静"] },
    { title: "看见感受", copy: "暂时说不清也没关系，感受已经值得被认真对待。", tags: ["命名", "感受", "理解", "陪伴"] },
  ];

  const knowledgeRows = [
    ["聚光灯效应", "SPOTLIGHT EFFECT", "Thomas Gilovich 等", "人们常高估别人对自己的关注程度。", "让参与者穿醒目衣服进入房间，他们明显高估了被注意的人数。", "研究后来延伸到社交焦虑与自我呈现。", "一次口误通常没有自己想象得那么显眼。", "把注意力从‘别人怎么看’轻轻收回正在做的事。"],
    ["情绪命名", "AFFECT LABELING", "Matthew Lieberman 等", "用词语准确描述感受，能让混乱变得更可理解。", "观看情绪面孔并为其命名时，参与者的情绪反应会发生变化。", "近年的研究更关注词汇精细度与调节能力。", "把‘难受’分成失落、担心或疲惫。", "不用急着解决，先试着给感受一个名字。"],
    ["自我同情", "SELF-COMPASSION", "Kristin Neff", "在困难时以理解、共同人性与觉察对待自己。", "自我同情量表及后续实验比较了温和回应与自我批评。", "概念已扩展到教育、健康与压力研究。", "失误后像对朋友那样对自己说话。", "温柔不等于纵容，它能为下一步留出力气。"],
    ["执行意图", "IMPLEMENTATION INTENTION", "Peter Gollwitzer", "把目标写成‘如果 X 发生，我就做 Y’会更容易启动。", "参与者预先设定具体情境与动作后，目标完成率通常更高。", "研究已用于学习、运动和健康行为。", "如果晚饭后坐到书桌前，我就先读两页。", "让第一步具体到时间、地点和动作。"],
    ["未完成效应", "ZEIGARNIK EFFECT", "Bluma Zeigarnik", "未完成任务更容易停留在注意与记忆里。", "早期研究比较了被打断与已完成任务的回忆表现。", "后续研究发现动机、意义与情境会影响强度。", "待办没收尾时，脑中总像留着一个小窗口。", "写下明确的下一步，也能让大脑暂时放手。"],
    ["选择悖论", "PARADOX OF CHOICE", "Barry Schwartz 等", "选项过多有时会增加比较成本和后悔。", "果酱摊位研究比较了丰富与有限选项下的停留和购买。", "后续发现效果受任务、经验和偏好影响。", "菜单太长时反而不知道点什么。", "先定两三个标准，再缩小选择范围。"],
    ["社会比较", "SOCIAL COMPARISON", "Leon Festinger", "人会通过与他人比较来理解自己的位置。", "研究观察相似对象如何成为常见的比较参照。", "后来区分了向上、向下与平行比较。", "刷到别人高光时刻后怀疑自己的进度。", "比较出现时，也看看双方所处的条件是否相同。"],
    ["习得性无助", "LEARNED HELPLESSNESS", "Martin Seligman 等", "反复经历不可控结果后，人可能减少尝试。", "早期动物研究与后续人类任务研究关注可控感。", "现代解释更重视认知、情境与个体差异。", "多次碰壁后，连可行的小机会也不想试。", "从一个能产生反馈的小动作重新建立可控感。"],
    ["成长型思维", "GROWTH MINDSET", "Carol Dweck", "能力可以通过策略、练习与反馈继续发展。", "研究比较了不同能力观对挑战与挫折的回应。", "后续强调干预效果依赖环境支持，而非一句口号。", "把‘我不会’改成‘我还没找到方法’。", "关注策略和反馈，不必强迫自己时刻积极。"],
    ["认知失调", "COGNITIVE DISSONANCE", "Leon Festinger", "想法、选择与行为冲突时，人会感到不协调。", "经典实验观察低报酬说服任务后的态度变化。", "理论后来用于选择、说服与身份研究。", "明知需要休息，却又因休息而自责。", "看见冲突本身，常比急着为它找理由更有用。"],
    ["基本归因错误", "FUNDAMENTAL ATTRIBUTION ERROR", "Lee Ross", "解释他人行为时，人容易高估性格、低估情境。", "立场文章实验显示读者即使知道作者被指定立场仍会作性格推断。", "研究进一步讨论了文化与视角差异。", "同事回复慢，第一反应是‘他不在乎’。", "在下结论前，为情境保留一个可能的位置。"],
    ["确认偏误", "CONFIRMATION BIAS", "Peter Wason 等", "人更容易寻找支持已有看法的信息。", "Wason 规则发现任务展示了验证而非反证的倾向。", "概念已扩展到搜索、判断和社交媒体环境。", "认定自己不够好后，只记得失败的部分。", "主动找一条可能推翻原判断的证据。"],
    ["可得性启发", "AVAILABILITY HEURISTIC", "Daniel Kahneman、Amos Tversky", "越容易想起的事件，越容易被判断为常见。", "研究比较不同风险例子的可回忆性与概率判断。", "后续关注新闻曝光和情绪鲜明度。", "刚看过事故新闻，就觉得出门格外危险。", "容易想起不等于更常发生，可以再看基准信息。"],
    ["锚定效应", "ANCHORING EFFECT", "Amos Tversky、Daniel Kahneman", "先出现的数字会牵动之后的估计。", "幸运轮数字实验显示随机起点也会影响判断。", "研究后来覆盖价格、谈判和专业决策。", "先看到原价后，折扣价显得特别划算。", "做判断前，试着独立写下自己的合理区间。"],
    ["框架效应", "FRAMING EFFECT", "Daniel Kahneman、Amos Tversky", "同一信息的表达方式会影响选择。", "亚洲疾病问题比较了收益与损失框架下的决策。", "理论已用于健康沟通和公共政策。", "‘成功率九成’与‘失败率一成’感受不同。", "把信息换一种说法再看一次。"],
    ["损失厌恶", "LOSS AVERSION", "Daniel Kahneman、Amos Tversky", "相同幅度的损失通常比收益更让人难受。", "前景理论实验比较了收益与损失情境下的选择。", "后续研究讨论了情境、规模和经验差异。", "为避免浪费继续使用并不适合的东西。", "问问自己：如果现在还没拥有，我会重新选择它吗？"],
    ["禀赋效应", "ENDOWMENT EFFECT", "Richard Thaler 等", "一旦拥有某物，人往往会赋予它更高价值。", "马克杯交易实验比较了卖方与买方估价。", "研究延伸到所有权感和身份联结。", "旧物不常用，却总觉得舍不得放下。", "先把物品放到‘暂缓区’，再观察真实需要。"],
    ["峰终定律", "PEAK-END RULE", "Daniel Kahneman 等", "回忆一段经历时，峰值与结尾常格外重要。", "冷水实验比较了不同过程长度与结尾对记忆评价的影响。", "后续用于服务体验、疼痛与叙事研究。", "一天很忙，但晚间的一次温和收尾改变了整体感受。", "不能改写整天时，也可以照顾最后十分钟。"],
    ["曝光效应", "MERE EXPOSURE EFFECT", "Robert Zajonc", "反复接触有时会提高熟悉感与偏好。", "参与者多次看到陌生符号后，对其评价往往更积极。", "后续发现过度重复和负面刺激会削弱效果。", "一首歌多听几次后慢慢顺耳。", "熟悉感不是事实判断，重要选择仍值得多看证据。"],
    ["从众", "CONFORMITY", "Solomon Asch", "群体意见会影响个人公开判断。", "线段判断实验观察了明显错误多数意见带来的压力。", "研究后来区分信息性与规范性影响。", "会议里大家都点头，自己也不敢提出疑问。", "先把自己的观察写下来，再听群体答案。"],
    ["旁观者效应", "BYSTANDER EFFECT", "John Darley、Bibb Latané", "在场者越多，个体有时越不容易立即行动。", "烟雾房间等实验研究他人在场对报告行为的影响。", "后续强调情境清晰度、身份和协作会改变结果。", "群聊里人人都以为会有别人回复求助。", "需要帮助时，尽量明确点名一个具体的人。"],
    ["责任分散", "DIFFUSION OF RESPONSIBILITY", "Bibb Latané、John Darley", "群体中责任可能被无形地分摊。", "模拟紧急情境实验比较了参与者人数与行动速度。", "概念扩展到组织与线上协作。", "公共任务没人负责，最后谁都没开始。", "把‘大家’改成名字、动作和时间。"],
    ["社会助长", "SOCIAL FACILITATION", "Robert Zajonc 等", "他人在场会强化熟练反应，也可能干扰困难任务。", "实验比较独自与他人在场时的简单、复杂任务表现。", "后续从唤醒、评价顾虑和注意冲突解释。", "熟练演讲在人前更有劲，新技能却更容易紧张。", "练习新技能时先降低被评价感。"],
    ["社会懈怠", "SOCIAL LOAFING", "Max Ringelmann 等", "群体任务中个人投入有时会随人数增加而下降。", "拉绳与鼓掌实验比较个人和群体条件下的用力。", "清晰分工、可见贡献和共同意义能减弱现象。", "小组作业里总有人不确定自己该做什么。", "让每个人的任务边界和完成信号都可见。"],
    ["自我决定理论", "SELF-DETERMINATION THEORY", "Edward Deci、Richard Ryan", "自主、胜任与联结是重要心理需要。", "奖励与内在动机实验观察外部控制如何改变投入。", "理论已发展出多种动机类型与应用分支。", "同一件事，被命令与自主选择的感受很不同。", "找一个你能决定的小部分，恢复一点主动权。"],
    ["心流", "FLOW", "Mihaly Csikszentmihalyi", "挑战与能力匹配、目标清晰时，人可能进入高度投入状态。", "经验取样研究记录人们在日常活动中的即时体验。", "后续研究关注工作、运动与创作场景。", "画画时忘了看时间，注意力稳定地留在动作上。", "把任务难度调到‘够挑战但仍可前进’。"],
    ["延迟满足", "DELAY OF GRATIFICATION", "Walter Mischel 等", "等待更大回报需要策略，也深受环境可信度影响。", "棉花糖任务观察儿童如何分散注意并等待。", "后续强调家庭环境与情境稳定性，不能简单贴标签。", "为了周末休息，先完成今晚最关键的一步。", "与其只靠忍耐，不如让等待过程更容易。"],
    ["习惯回路", "HABIT LOOP", "Wendy Wood 等", "稳定线索会自动唤起熟悉行为与结果。", "日常行为研究观察情境稳定性与自动化程度。", "现代研究更重视环境设计而非单靠意志。", "一坐到沙发就顺手打开短视频。", "改变线索的摆放，常比责备自己更有效。"],
    ["二分钟开始法", "TWO-MINUTE START", "行为设计实践", "把任务缩小到两分钟，能降低启动阻力。", "相关实践借鉴行为塑造、微习惯和启动研究。", "它是策略而非严格单一理论，适合用于第一步。", "只打开文档、写标题或收拾一个桌角。", "目标不是两分钟做完，而是让开始变得可行。"],
    ["心理反抗", "PSYCHOLOGICAL REACTANCE", "Jack Brehm", "自由被威胁时，人可能更想恢复被限制的选择。", "实验观察禁令与强硬说服如何提高被限选项吸引力。", "研究延伸到健康传播与亲子沟通。", "越被催‘别紧张’，反而越难放松。", "给自己两个都可接受的选项，减少被逼迫感。"],
    ["情绪颗粒度", "EMOTIONAL GRANULARITY", "Lisa Feldman Barrett 等", "能细分感受的人，通常拥有更丰富的调节选项。", "经验采样研究分析人们描述情绪时的区分程度。", "研究连接了语言、身体感受与情境建构。", "把‘烦’分成焦躁、失望、尴尬或疲倦。", "先找最接近的两个词，不用追求绝对准确。"],
    ["认知重评", "COGNITIVE REAPPRAISAL", "James Gross 等", "在事件早期改变解释方式，可以改变情绪路径。", "情绪调节实验比较重评、压抑等策略的体验与生理结果。", "后来强调策略是否有效取决于情境。", "把‘我被否定’改看成‘这条方案需要修改’。", "重评不是强行乐观，而是寻找更完整的解释。"],
    ["注意恢复理论", "ATTENTION RESTORATION THEORY", "Rachel Kaplan、Stephen Kaplan", "柔和吸引注意的环境可能帮助定向注意恢复。", "自然环境与城市环境研究比较疲劳后的注意表现。", "研究已扩展到微型自然、窗景与声音。", "看水面、树影或云层时，脑子慢慢松开。", "没有远行条件，也可给自己几分钟低刺激视野。"],
    ["压力与应对", "STRESS AND COPING", "Richard Lazarus、Susan Folkman", "压力体验与我们如何评估情境和资源有关。", "交易模型研究区分初级评估、次级评估与应对。", "后续强调问题应对、情绪应对与意义应对。", "同一截止日期，在有支持与孤立时感受不同。", "先问：这是要解决、要承受，还是要寻求帮助？"],
    ["依恋系统", "ATTACHMENT SYSTEM", "John Bowlby、Mary Ainsworth", "早期关系经验会影响靠近、探索与寻求安慰的方式。", "陌生情境程序观察照护者离开与返回时的儿童反应。", "成人依恋研究强调模式可随关系和经验变化。", "关系紧张时，有人靠近确认，有人先退开保护自己。", "模式不是定论，稳定而尊重的互动可以带来新经验。"],
    ["记忆再巩固", "MEMORY RECONSOLIDATION", "Karim Nader 等", "被唤起的记忆可能短暂进入可更新状态。", "动物与人类研究探索记忆提取后再稳定的过程。", "该领域仍在发展，应用边界需要谨慎。", "后来获得的新信息，会改变我们讲述旧经历的方式。", "记忆不是录像；温和地记录当下版本即可。"],
    ["工作记忆", "WORKING MEMORY", "Alan Baddeley、Graham Hitch", "工作记忆暂时保存并操作当前需要的信息。", "双任务实验促成了多成分模型。", "模型后来加入情景缓冲器并持续修订。", "记住验证码时又被问一句话，很容易忘掉。", "把信息写下来，是在给脑内空间减负。"],
    ["遗忘曲线", "FORGETTING CURVE", "Hermann Ebbinghaus", "没有复习时，记忆保持会随时间下降。", "无意义音节自我实验记录了学习后的遗忘变化。", "现代研究更关注材料、睡眠与个体差异。", "刚学会的内容隔几天就模糊了。", "忘记并不等于没学会，及时复习能重新加固。"],
    ["间隔效应", "SPACING EFFECT", "Hermann Ebbinghaus 等", "把学习分散到多次，通常比集中突击更利于保持。", "大量记忆实验比较集中练习与间隔练习。", "研究进一步讨论最佳间隔随目标时间变化。", "每天学二十分钟往往比考前熬夜更稳。", "给知识留一点‘快要忘但还能想起’的间隔。"],
    ["检索练习", "RETRIEVAL PRACTICE", "Henry Roediger、Jeffrey Karpicke 等", "主动回忆比反复重读更能加固长期记忆。", "测试效应实验比较重读与回忆练习后的延迟表现。", "后续重视反馈质量与低压力测验。", "合上书说出三点，比再看一遍更能发现空白。", "把自测当成练习，不把答错当成评判。"],
    ["双加工理论", "DUAL-PROCESS THEORY", "Daniel Kahneman 等", "判断既有快速直觉，也有较慢的分析过程。", "启发式与推理任务展示了两类加工的差异。", "现代模型不再把两者理解为完全分离的系统。", "看到熟悉选项就想立刻点下去。", "重要决定前，给快速答案一个短暂停顿。"],
    ["认知负荷", "COGNITIVE LOAD", "John Sweller", "工作记忆容量有限，复杂信息需要被合理组织。", "教学实验比较不同呈现方式对解题与学习的影响。", "理论区分任务本身、呈现方式与学习建构。", "同时看五个窗口时，简单步骤也容易出错。", "一次只保留当前步骤，把其余信息移到外部。"],
    ["决策疲劳", "DECISION FATIGUE", "Roy Baumeister 等", "连续决策后，人可能更倾向省力或维持默认。", "现场与实验研究观察长时间选择后的决策变化。", "该概念的效应大小与机制仍有讨论。", "忙了一天后，连晚饭吃什么都不想选。", "把低风险选择提前固定，给重要判断留余量。"],
    ["默认效应", "DEFAULT EFFECT", "Eric Johnson、Daniel Goldstein 等", "预设选项会显著影响最终选择。", "器官捐献与订阅选择研究比较加入和退出式默认。", "后续从努力、暗示与损失解释其机制。", "一直沿用软件默认设置，即使并不合适。", "偶尔检查默认是否仍符合你现在的需要。"],
    ["自我效能", "SELF-EFFICACY", "Albert Bandura", "相信自己能完成具体任务，会影响投入与坚持。", "研究比较成功经验、示范、鼓励和身体状态等来源。", "概念广泛用于学习、运动与行为改变。", "做过一次小演示后，下一次不再那么怕。", "先寻找一个可完成的小胜利，而非空泛打气。"],
    ["乐观偏差", "OPTIMISM BIAS", "Neil Weinstein 等", "人常觉得好事更可能发生在自己身上、坏事更少。", "比较风险判断研究记录了自他差异。", "适度乐观能带来动力，过度乐观也可能忽略准备。", "总觉得任务会比实际更快完成。", "保留希望，同时给计划加一点现实缓冲。"],
    ["边界感", "PERSONAL BOUNDARIES", "临床与关系研究传统", "边界帮助区分自己的需要、责任与可承受范围。", "相关研究多来自关系、压力与自主性领域。", "它不是单一实验结论，而是一组持续发展的实践概念。", "愿意帮忙，但明确自己只能做到几点。", "清楚的边界可以温和表达，不必等到耗尽才出现。"],
    ["心理安全", "PSYCHOLOGICAL SAFETY", "Amy Edmondson", "团队成员相信提出问题或承认错误不会被羞辱。", "医疗团队研究发现安全氛围与错误报告、学习行为相关。", "概念已扩展到创新、协作和领导研究。", "会议里敢说‘我没听懂’，团队反而更容易校准。", "安全不是没有分歧，而是分歧可以被认真对待。"],
    ["情绪传染", "EMOTIONAL CONTAGION", "Elaine Hatfield 等", "人会通过表情、声音和节奏受到他人情绪影响。", "互动实验观察非语言模仿与情绪同步。", "线上沟通与群体情绪成为新的研究场景。", "和焦急的人待久了，自己的语速也变快。", "觉察变化后，先把呼吸和节奏带回自己。"],
    ["睡前缓冲", "SLEEP BUFFER", "睡眠与唤醒调节研究", "从高刺激活动切换到睡眠，需要一段渐缓过程。", "睡眠卫生和光照研究关注睡前输入、节律与入睡。", "个体差异很大，稳定线索通常比强迫入睡更有帮助。", "关掉工作页面后先洗漱、调暗灯，再上床。", "睡不着时不必责备自己，先让身体进入休息。"],
    ["观察者视角", "SELF-DISTANCING", "Ethan Kross 等", "稍微拉开心理距离，有时能减少反刍并看见全貌。", "研究让参与者用第三人称或旁观视角回顾事件。", "后续探索语言距离、时间距离与文化差异。", "问‘如果是朋友遇到这件事，我会怎么回应？’", "拉开距离不是否认感受，而是给它更多空间。"],
  ];

  const articles = knowledgeRows.map(([title, en, researcher, background, experiment, development, life, tip], index) => ({
    title,
    en,
    researcher,
    background,
    experiment,
    development,
    life,
    tip,
    summary: background,
    icon: ["◌", "◇", "☉", "⌁", "☾", "♡"][index % 6],
  }));

  const emotions = [
    { name: "喜悦", icon: "☼", color: "#a77bff", rgb: [167, 123, 255], asset: "obj-vial-joy.png" },
    { name: "信任", icon: "♡", color: "#d3bd4d", rgb: [180, 174, 75], asset: "obj-vial-trust.png" },
    { name: "恐惧", icon: "△", color: "#5bc2c8", rgb: [91, 194, 200], asset: "obj-vial-fear.png" },
    { name: "惊讶", icon: "✧", color: "#5592ff", rgb: [85, 146, 255], asset: "obj-vial-surprise.png" },
    { name: "悲伤", icon: "☁", color: "#7ca8ea", rgb: [124, 168, 234], asset: "obj-vial-sadness.png" },
    { name: "厌恶", icon: "✣", color: "#8fa84f", rgb: [143, 168, 79], asset: "obj-vial-disgust.png" },
    { name: "愤怒", icon: "♨", color: "#df6b42", rgb: [223, 107, 66], asset: "obj-vial-anger.png" },
    { name: "期待", icon: "✦", color: "#efbf55", rgb: [239, 191, 85], asset: "obj-vial-anticipation.png" },
  ];

  const supplyItems = [
    { id: "hotdrink", label: "热水", icon: "♨", desc: "先喝一口水", time: "约 5 分钟", effect: "fx-supply-shelf-hotdrink.png" },
    { id: "cookie", label: "小饼干", icon: "◒", desc: "给身体一点能量", time: "约 3 分钟", effect: "fx-supply-shelf-cookie.png" },
    { id: "blanket", label: "毯子", icon: "▧", desc: "让身体暖一点", time: "约 10 分钟", effect: "fx-supply-shelf-sitquietly.png" },
    { id: "reminder", label: "一句提醒", icon: "♡", desc: "今天少责备自己一点", time: "约 2 分钟", effect: "fx-supply-shelf-reminder.png" },
  ];

  const quickEntries = [
    { id: "listen", title: "先说一句", icon: "♡", sub: "不用讲完整", message: "我想先说一句。", reply: "好。你说到哪里都可以，我先听着。" },
    { id: "gentle", title: "轻轻聊聊", icon: "✧", sub: "这里不会判断", message: "想轻轻聊一会儿。", reply: "可以。此刻最想留在这里的，是哪一句话？" },
  ];

  const initialLabels = ["我总会搞砸", "别人都比我强", "一定不能失败", "太敏感", "太脆弱", "要懂事", "太能干", "不够好"];
  const labelTextures = ["tex-label-paper-01.webp", "tex-label-paper-02.webp", "tex-label-paper-03.webp"];
  const paperTextures = ["tex-paper-01.webp", "tex-paper-02.webp", "tex-paper-03.webp"];
  const modules = [
    { route: "breath", title: "静息区", icon: "◌", desc: "跟着呼吸气泡，把注意力带回此刻。" },
    { route: "card", title: "今日提示卡", icon: "✦", desc: "抽一张只属于今晚的温柔提醒。" },
    { route: "desk", title: "安静书案", icon: "✎", desc: "把杂乱写成一句可以放下的话。" },
    { route: "labels", title: "标签回收口", icon: "◇", desc: "暂时放下那些过重的定义。" },
    { route: "release", title: "情绪释放室", icon: "◎", desc: "用安全的方式释放积压的力气。" },
    { route: "supply", title: "夜间补给柜", icon: "▤", desc: "挑一份缓慢恢复的夜间补给。" },
    { route: "window", title: "值班窗口", icon: "☾", desc: "说两句也可以，这里会有人听见。" },
    { route: "novel", title: "小说创作工坊", icon: "✦", desc: "把心里的故事写成文字，肖清雅陪你创作。" },
    { route: "explore", title: "夜读知识页", icon: "▥", desc: "翻开一本安静的心理与行为小书。" },
    { route: "lab", title: "情绪调配室", icon: "☷", desc: "把几种感觉放进同一只玻璃杯。" },
  ];

  let savedDesk = "";
  try {
    savedDesk = localStorage.getItem("nightMoodDeskNote") || "";
  } catch (error) {
    savedDesk = "";
  }

  const state = {
    cardFlipped: false,
    promptIndex: 0,
    drawsLeft: 3,
    deskText: savedDesk,
    deskTool: "write",
    paperTone: 0,
    inkProgress: 0,
    lampLit: false,
    breathRounds: 0,
    exploreIndex: 0,
    labCounts: emotions.reduce((memo, emotion) => {
      memo[emotion.name] = 0;
      return memo;
    }, {}),
    labelsRemaining: initialLabels.slice(),
    droppedLabels: [],
    lastDropped: "",
    releaseActive: false,
    releaseHits: 0,
    releaseStartedAt: null,
    supplyChoice: null,
    supplyClaimed: null,
    supplySaved: false,
    chatMessages: [
      { who: "bot", text: "夜里好。你可以先说一句，不用讲完整。" },
      { who: "user", text: "今天有一点乱。" },
      { who: "bot", text: "听见了。我们先把这句话留在窗边。" },
    ],
  };

  let cleanup = [];
  let toastTimer = 0;
  let renderVersion = 0;
  let activePage = null;
  let activeSceneIndex = 0;
  let activeSceneRoute = "home";
  const preloadCache = new Map();

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function currentRoute() {
    const hash = decodeURIComponent(location.hash.replace(/^#/, ""));
    return routes.includes(hash) ? hash : "home";
  }

  function navigate(route) {
    if (!routes.includes(route)) return;
    closePanels();
    if (currentRoute() === route) return;
    location.hash = route;
  }

  function navKeyForRoute(route) {
    return inspirationRoutes.has(route) ? "inspiration" : route;
  }

  function updateNav(activePanel = "") {
    const key = activePanel || navKeyForRoute(currentRoute());
    navButtons.forEach((button) => button.classList.toggle("is-active", button.dataset.navKey === key));
  }

  function openPanel(name) {
    closePanels();
    const drawer = name === "about" ? aboutDrawer : name === "feeling" ? feelingDrawer : inspirationDrawer;
    drawer.hidden = false;
    document.body.classList.add("overlay-open");
    updateNav(name === "about" ? "about" : name === "feeling" ? "home" : "inspiration");
    const close = drawer.querySelector(".icon-button");
    if (close) close.focus();
  }

  function closePanels() {
    feelingDrawer.hidden = true;
    inspirationDrawer.hidden = true;
    aboutDrawer.hidden = true;
    document.body.classList.remove("overlay-open");
    updateNav();
  }

  function fireflies() {
    const particles = [
      [8, 72, 13, -4], [17, 45, 17, -8], [28, 82, 15, -2], [39, 55, 19, -10],
      [53, 73, 16, -5], [65, 38, 18, -13], [77, 68, 14, -7], [91, 47, 17, -3],
    ];
    return `<div class="motion-layer" aria-hidden="true">${particles.map(([x, y, d, delay]) => `<i class="firefly" style="--x:${x}%;--y:${y}%;--d:${d}s;--delay:${delay}s"></i>`).join("")}</div>`;
  }

  function scene(route, position = "center center") {
    return `
      <div class="scene-layer" style="--scene-position:${position}" aria-hidden="true">
        <div class="scene-shade"></div>
        <div class="scene-vignette"></div>
      </div>
      ${fireflies()}
    `;
  }

  function pageTitle(route, compact = false) {
    const meta = pageMeta[route];
    const backAction = inspirationRoutes.has(route)
      ? `data-panel="inspiration" aria-label="返回灵感小站模块索引"`
      : `data-go="home" aria-label="返回首页"`;
    return `
      <header class="scene-title ${compact ? "is-compact" : ""}">
        <button class="scene-back" type="button" ${backAction}>← ${inspirationRoutes.has(route) ? "模块索引" : "返回首页"}</button>
        <span class="kicker">✦ ${meta.gold}</span>
        <h1>${meta.title}</h1>
        <span class="en">${meta.en}</span>
        <div class="title-rule">✦</div>
        <p class="quiet-copy">${meta.copy}</p>
      </header>
    `;
  }

  function renderHome() {
    const meta = pageMeta.home;
    return `
      <section class="page home-page">
        ${scene("home", "center center")}
        <div class="petal-container" aria-hidden="true">${Array.from({length:15}, () => `<i class="petal" style="--dur:${6+Math.random()*6}s;--del:${Math.random()*4}s;left:${Math.random()*100}%;background:rgba(255,${180+Math.floor(Math.random()*60)},${200+Math.floor(Math.random()*55)},${0.3+Math.random()*0.35})"></i>`).join("")}</div>
        <div class="ui-layer home-layout">
          <div class="home-copy">
            <p class="home-kicker">✦ ${meta.gold}</p>
            <h1>${meta.title}</h1>
            <span class="home-en">${meta.en}</span>
            <div class="title-rule">✦</div>
            <p class="home-description">${meta.copy}</p>
            <div class="home-actions" aria-label="首页入口">
              <button class="entry-card" type="button" data-panel="feeling">
                <span class="entry-icon">☆</span><span><strong>选一个感觉</strong><small>找到此刻的你的情绪</small></span><b>›</b>
              </button>
              <button class="entry-card" type="button" data-go="lab">
                <span class="entry-icon">☷</span><span><strong>调配一份情绪</strong><small>为情绪寻找温柔出口</small></span><b>›</b>
              </button>
              <button class="entry-card" type="button" data-panel="inspiration">
                <span class="entry-icon">◉</span><span><strong>只是看看</strong><small>肖清雅陪你逛逛</small></span><b>›</b>
              </button>
            </div>
            <div class="sequence" aria-label="场景序号"><span>场景 · SEQUENCE</span><strong>01</strong><i></i><span>02</span><i></i><span>03</span></div>
          </div>

          <aside class="spotlight-panel">
            <p class="panel-label">SPOTLIGHT / 角色介绍</p>
            <img src="./xiaoqingya/bizhi.png" alt="肖清雅" style="width:100%;max-width:260px;height:auto;max-height:380px;object-fit:contain;border-radius:12px;" />
            <h2>肖清雅</h2>
            <span>HALF-ELF BARD</span>
            <p>半精灵吟游诗人，魅惑学院。只要是为了爱，规则稍微弯曲一下也没关系吧？</p>
            <footer>
              <button class="ghost-button" type="button" data-go="window">和她说说话 <span aria-hidden="true">→</span></button>
              <span class="pager-dots" aria-hidden="true"><i class="is-active"></i><i></i><i></i><i></i></span>
            </footer>
          </aside>
        </div>
      </section>
    `;
  }

  function renderBreath() {
    return `
      <section class="page breath-page">
        ${scene("breath", "center center")}
        <div class="ui-layer breath-layout">
          <div class="breath-intro">
            ${pageTitle("breath")}
            <div class="breath-guidance" id="breathGuide">
              <span>4 · 2 · 6 呼吸节奏</span>
              <p>按住气泡或空格吸气 4 秒，继续停留 2 秒；松开后，跟着 6 秒慢慢呼气。</p>
            </div>
            <button class="primary-button" id="breathStart" type="button">把手放到气泡上</button>
          </div>

          <div class="breath-stage">
            <button class="breath-orb" id="breathBubble" type="button" aria-label="按住吸气，松开呼气">
              <img class="orb-reflection" src="${assetRoot}/effects/fx-breath-reflection.png" alt="" />
              <span class="orb-shell">
                <img src="${assetRoot}/objects/obj-breath-orb.png" alt="" />
                <span class="orb-copy"><span class="orb-lotus">♧</span><strong id="breathText">准备开始</strong><b id="breathTime">按住</b></span>
              </span>
            </button>
            <div class="breath-ripples" id="breathRipples" aria-hidden="true"><i></i><i></i><i></i></div>
            <p id="breathHint">按住鼠标、触摸气泡或按住空格开始</p>
            <small class="breath-rounds" id="breathRounds">已完成 ${state.breathRounds} 轮</small>
          </div>

          <aside class="sound-panel" aria-label="环境音切换">
            <div class="sound-heading"><p class="panel-label">环境音</p><span>AMBIENCE</span></div>
            ${["溪畔夜色", "林间微风", "雨落庭院", "海浪轻语"].map((name, index) => `
              <button class="sound-button ${index === 0 ? "is-active" : ""}" type="button" data-sound="${name}"><span>${["≋", "♧", "☂", "⌁"][index]}</span>${name}</button>
            `).join("")}
          </aside>
        </div>
      </section>
    `;
  }

  function renderCard() {
    const prompt = promptCards[state.promptIndex];
    return `
      <section class="page card-page">
        ${scene("card", "center center")}
        <div class="ui-layer card-layout">
          <div class="card-intro">
            ${pageTitle("card", true)}
            <div class="card-instructions">
              <p class="panel-label">如何使用</p>
              <ul class="instruction-list">
                <li><span>1</span><p><strong>静心片刻</strong><br />深呼吸，放空思绪。</p></li>
                <li><span>2</span><p><strong>抽取提示</strong><br />点击卡牌，接收一句提醒。</p></li>
                <li><span>3</span><p><strong>记录灵感</strong><br />把触动带进今晚的生活。</p></li>
              </ul>
            </div>
          </div>

          <div class="card-center">
            <button class="prompt-card-wrap" id="drawCard" type="button" aria-label="抽取今日提示卡">
              <span class="prompt-card ${state.cardFlipped ? "is-flipped" : ""}" id="promptCard">
                <span class="card-face card-back"><img src="${assetRoot}/objects/obj-card-back.webp" alt="卡牌背面" /></span>
                <span class="card-face card-front"><img src="${assetRoot}/objects/obj-card-front.webp" alt="卡牌正面" /><span class="card-message" id="cardMessage">${prompt}</span></span>
              </span>
            </button>
            <div class="draw-controls">
              <h2>抽一张今日提示卡</h2>
              <button class="primary-button" id="drawButton" type="button" ${state.drawsLeft <= 0 ? "disabled" : ""}>✦ 开始抽卡</button>
              <small id="drawsLeft">今日剩余次数：${state.drawsLeft}/3</small>
            </div>
          </div>

          <aside class="theme-panel">
            <p class="panel-label">今日能量主题</p>
            <h2 id="themeTitle">${promptThemes[state.promptIndex].title}</h2>
            <p id="themeCopy">${promptThemes[state.promptIndex].copy}</p>
            <div class="theme-tags" id="themeTags">${promptThemes[state.promptIndex].tags.map((tag) => `<span>${tag}</span>`).join("")}</div>
            <button class="ghost-button" type="button" data-go="desk">写下今天的提示</button>
          </aside>
        </div>
      </section>
    `;
  }

  function renderDesk() {
    const toolNames = { write: "提笔写字", ink: "磨墨静心", lamp: "点灯片刻" };
    const paperAsset = state.paperTone === 0
      ? `${assetRoot}/objects/obj-desk-paper.png`
      : `${assetRoot}/textures/${paperTextures[state.paperTone]}`;
    return `
      <section class="page desk-page ${state.lampLit ? "is-lamp-lit" : ""}">
        ${scene("desk", "center center")}
        <div class="ui-layer desk-layout">
          <div class="desk-intro">
            ${pageTitle("desk")}
            <div class="tool-grid" aria-label="书写工具">
              ${Object.entries(toolNames).map(([id, name], index) => `
                <button class="tool-card ${state.deskTool === id ? "is-active" : ""}" type="button" data-tool="${id}">
                  <span>${["✎", "◌", "▤"][index]}</span><strong>${name}</strong><small>${["疏理思绪", "沉淀浮躁", "安住当下"][index]}</small>
                </button>
              `).join("")}
            </div>
          </div>

          <div class="desk-stage" data-desk-mode="${state.deskTool}">
            <div class="desk-mode writing-mode ${state.deskTool === "write" ? "is-active" : ""}" data-mode-panel="write">
              <div class="writing-paper">
              <img id="deskPaperImage" src="${paperAsset}" alt="书写纸张" />
              <label for="deskNote">此刻，想写下什么？</label>
              <textarea id="deskNote" spellcheck="false" maxlength="800" placeholder="此刻，想写下什么？">${escapeHtml(state.deskText)}</textarea>
              <small class="paper-count" id="paperCount">${state.deskText.length} / 800</small>
              </div>
              <div class="desk-toolbar" aria-label="书案操作">
                <button class="ghost-button" id="clearDesk" type="button">清空纸面</button>
                <button class="ghost-button" id="changePaper" type="button">换一张纸</button>
                <button class="primary-button" id="saveDesk" type="button">保存记录</button>
              </div>
            </div>

            <div class="desk-mode ink-mode ${state.deskTool === "ink" ? "is-active" : ""}" data-mode-panel="ink">
              <div class="inkstone-shell">
                <div class="inkstone" id="inkStone" style="--ink-progress:${state.inkProgress}%" role="button" tabindex="0" aria-label="按住并在砚台里缓慢画圈研墨">
                  <span class="ink-water"></span><i class="ink-stick"></i><b>按住画圈</b>
                </div>
                <div class="ink-status"><span>墨色</span><i><b id="inkProgressBar" style="width:${state.inkProgress}%"></b></i><strong id="inkProgressText">${Math.round(state.inkProgress)}%</strong></div>
                <p id="inkMessage">按住砚台缓慢画圈，让墨色一点点沉下来。</p>
                <button class="ghost-button" id="useInk" type="button" ${state.inkProgress < 100 ? "disabled" : ""}>回到纸面写一句</button>
              </div>
            </div>

            <div class="desk-mode lamp-mode ${state.deskTool === "lamp" ? "is-active" : ""}" data-mode-panel="lamp">
              <div class="lamp-moment">
                <button class="desk-lamp ${state.lampLit ? "is-lit" : ""}" id="deskLamp" type="button" aria-pressed="${state.lampLit}" aria-label="${state.lampLit ? "熄灭灯盏" : "点亮灯盏"}">
                  <span class="lamp-halo"></span><i class="lamp-flame"></i><b class="lamp-frame"></b>
                </button>
                <p id="lampMessage">${state.lampLit ? "今晚先为自己留一盏灯。" : "轻点灯盏，让书案多一点暖光。"}</p>
                <small>不必借这盏灯想通什么，只让它陪你坐一会儿。</small>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function renderExplore() {
    const article = articles[state.exploreIndex];
    return `
      <section class="page explore-page">
        ${scene("explore", "center center")}
        <div class="ui-layer explore-layout">
          <aside class="explore-menu">
            <div class="explore-guide-heading">
              <p class="panel-label">夜读目录 / EXPLORE</p>
              <span>选择一页，慢慢读</span>
            </div>
            <div class="article-menu" aria-label="知识目录，共 ${articles.length} 条">
              ${articles.map((item, index) => `<button type="button" class="${index === state.exploreIndex ? "is-active" : ""}" data-article="${index}"><b>${String(index + 1).padStart(2, "0")}</b><span>${item.title}</span><i>${item.en}</i></button>`).join("")}
            </div>
            <p class="explore-note">理解心理，不是为了改变自己，而是为了更好地与自己相处。</p>
          </aside>

          <div class="reading-area">
            <header class="reading-heading"><h1>${pageMeta.explore.title}</h1><span>${pageMeta.explore.en}</span><b id="articleCount">${String(state.exploreIndex + 1).padStart(2, "0")} / ${String(articles.length).padStart(2, "0")}</b></header>
            <div class="book-shell">
              <img class="book-object" src="${assetRoot}/objects/obj-open-book.png" alt="" aria-hidden="true" />
              <div class="reading-spread">
                <section class="book-left-page">
                  <span class="page-eyebrow" id="articleEyebrow">NIGHT READING · ${String(state.exploreIndex + 1).padStart(2, "0")}</span>
                  <img src="${assetRoot}/objects/obj-spotlight-figure.png" alt="" />
                  <h2 id="articleTitle">${article.title}</h2>
                  <span class="article-en" id="articleEn">${article.en}</span>
                  <p id="articleSummary">${article.summary}</p>
                  <dl class="article-researcher"><dt>相关研究者</dt><dd id="articleResearcher">${article.researcher}</dd></dl>
                </section>
                <article class="book-right-page">
                  <span class="page-eyebrow">理解此刻</span>
                  <div class="article-body" id="articleBody">
                    <section><b>提出背景</b><p>${article.background}</p></section>
                    <section><b>经典实验或例子</b><p>${article.experiment}</p></section>
                    <section><b>概念发展</b><p>${article.development}</p></section>
                    <section><b>生活例子</b><p>${article.life}</p></section>
                    <section class="gentle-tip"><b>温和提示</b><p>${article.tip}</p></section>
                  </div>
                  <footer><i></i><span>把注意力轻轻放回自己</span></footer>
                </article>
              </div>
            </div>
            <div class="explore-controls">
              <button class="ghost-button" type="button" id="prevArticle">← 上一篇</button>
              <span class="article-progress"><i id="articleProgress" style="width:${((state.exploreIndex + 1) / articles.length) * 100}%"></i></span>
              <button class="ghost-button" type="button" id="nextArticle">下一篇 →</button>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function labTotal() {
    return emotions.reduce((total, emotion) => total + state.labCounts[emotion.name], 0);
  }

  function mixColor() {
    const total = labTotal();
    if (!total) return { rgb: [151, 100, 228], dominant: null };
    const rgb = [0, 0, 0];
    let dominant = emotions[0];
    emotions.forEach((emotion) => {
      const count = state.labCounts[emotion.name];
      if (count > state.labCounts[dominant.name]) dominant = emotion;
      rgb[0] += emotion.rgb[0] * count;
      rgb[1] += emotion.rgb[1] * count;
      rgb[2] += emotion.rgb[2] * count;
    });
    return { rgb: rgb.map((value) => Math.round(value / total)), dominant };
  }

  function labPercentages() {
    const total = labTotal();
    if (!total) return Object.fromEntries(emotions.map((emotion) => [emotion.name, 0]));
    const raw = emotions.map((emotion) => ({
      name: emotion.name,
      value: (state.labCounts[emotion.name] / total) * 100,
    }));
    const result = Object.fromEntries(raw.map((item) => [item.name, Math.floor(item.value)]));
    let remainder = 100 - Object.values(result).reduce((sum, value) => sum + value, 0);
    raw.sort((a, b) => (b.value % 1) - (a.value % 1)).slice(0, remainder).forEach((item) => { result[item.name] += 1; });
    return result;
  }

  function resultForEmotion(name) {
    const map = {
      喜悦: ["星河微光", "星河等待所", "你正在经历一种温暖而充满希望的情绪。它像一束微光，照亮前路，也照亮自己。"],
      信任: ["柔软港湾", "安静书案", "你在靠近一种愿意交托的状态。给关系一点空间，也给自己一点笃定。"],
      恐惧: ["雾中灯塔", "静息区", "担心常在提醒我们留意未知。先让呼吸慢下来，再辨认眼前真正需要处理的一小步。"],
      惊讶: ["新月转角", "探索页", "你的注意力被新的可能轻轻唤醒。慢一点观察，也许会看见另一条路。"],
      悲伤: ["雨后蓝调", "静息区", "悲伤不是退步，它只是提醒你有些珍贵的东西需要被温柔安放。"],
      厌恶: ["边界之灯", "标签回收口", "你正在辨认不适合自己的事物。边界出现时，也意味着自我正在恢复。"],
      愤怒: ["安全火种", "情绪释放室", "愤怒里常常藏着被侵犯的边界。安全释放之后，再听听它想保护什么。"],
      期待: ["明日微光", "夜间补给柜", "期待说明你仍在向未来伸手。先为今晚补给一点耐心和力气。"],
    };
    return map[name] || ["未开始的夜色", "静息区", "点击试剂瓶，把此刻复杂的感受慢慢调出来。"];
  }

  function routeForDestination(destination) {
    const map = { 星河等待所: "window", 安静书案: "desk", 探索页: "explore", 静息区: "breath", 标签回收口: "labels", 情绪释放室: "release", 夜间补给柜: "supply" };
    return map[destination] || "home";
  }

  function renderLab() {
    const total = labTotal();
    const mixed = mixColor();
    const percentages = labPercentages();
    const result = resultForEmotion(mixed.dominant && mixed.dominant.name);
    return `
      <section class="page lab-page">
        ${scene("lab", "center center")}
        <div class="ui-layer lab-layout">
          <aside class="lab-controls">
            ${pageTitle("lab", true)}
            <p class="lab-guide-copy">不必找到唯一答案。依次加入最接近此刻的感受，看它们在玻璃里慢慢汇合。</p>
            <ol class="lab-steps"><li><b>01</b><span><strong>选择试剂</strong><small>可以加入不止一种感受</small></span></li><li><b>02</b><span><strong>轻轻搅拌</strong><small>观察液面与颜色变化</small></span></li><li><b>03</b><span><strong>阅读配方</strong><small>看看情绪正在保护什么</small></span></li></ol>
          </aside>

          <section class="lab-center">
            <div class="device-caption"><span>玻璃情绪调配装置</span><small id="labTotalCopy">${total ? `已加入 ${total} 份情绪` : "等待加入第一份情绪"}</small></div>
            <div class="mixer-device" id="mixerDevice">
              <div class="mixer-reflection" aria-hidden="true"></div>
              <canvas id="liquidCanvas" width="560" height="670" aria-label="情绪液体旋涡"></canvas>
              <div class="pour-stream" id="pourStream" aria-hidden="true"></div>
              <img class="liquid-glow ${total ? "is-visible" : ""}" id="liquidGlow" src="${assetRoot}/effects/fx-lab-liquid-glow.png" alt="" />
              <img class="beaker-object" src="${assetRoot}/objects/obj-lab-beaker.png" alt="透明玻璃调配杯" />
              <img class="stirrer-object" src="${assetRoot}/objects/obj-lab-stirrer.png" alt="玻璃搅拌棒" />
              <button class="mixer-hit-area" id="stirLab" type="button" aria-label="轻轻搅拌调配杯"></button>
            </div>
            <div class="reagent-tray">
              <div class="reagent-tray-heading"><span>情绪试剂</span><small>点击瓶身加入一份</small></div>
              <div class="vial-palette" aria-label="情绪试剂">
                ${emotions.map((emotion) => `
                  <button class="vial-button ${state.labCounts[emotion.name] ? "is-added" : ""}" type="button" data-emotion="${emotion.name}" style="--emotion:${emotion.color}">
                    <img src="${assetRoot}/objects/${emotion.asset}" alt="${emotion.name}试剂" /><strong>${emotion.name}</strong><small data-vial-count="${emotion.name}">${state.labCounts[emotion.name] || "＋"}</small>
                  </button>
                `).join("")}
              </div>
            </div>
            <div class="lab-actions">
              <button class="ghost-button" id="resetLab" type="button">重新调配</button>
              <button class="primary-button" id="saveLab" type="button">♡ 保存配方</button>
              <button class="ghost-button" id="shareLab" type="button">分享此刻</button>
            </div>
          </section>

          <aside class="lab-report">
            <header><div><p class="panel-label">当前情绪配方报告</p><h2 id="reportTitle">${result[0]}</h2></div><span id="reportState">${total ? "调配中" : "待开始"}</span></header>
            <div class="ratio-list">
              ${emotions.map((emotion) => {
                const percent = percentages[emotion.name];
                return `<div class="ratio-row" data-ratio="${emotion.name}" style="--emotion:${emotion.color}"><span>${emotion.name}</span><i><b style="width:${percent}%"></b></i><strong>${percent}%</strong></div>`;
              }).join("")}
            </div>
            <div class="formula-result">
              <span class="result-orb" id="resultOrb" style="--mix:rgb(${mixed.rgb.join(",")})"></span>
              <div><p class="panel-label">混合结果</p><h3 id="resultTitle">${result[0]}</h3></div>
            </div>
            <p class="report-copy" id="reportCopy">${result[2]}</p>
            <p class="report-disclaimer">这不是诊断，只是一种帮助描述当下状态的方式。</p>
            <button class="destination-button" id="labDestination" type="button" data-go="${routeForDestination(result[1])}"><span>建议目的地</span><strong>${result[1]}</strong><b>→</b></button>
          </aside>
        </div>
      </section>
    `;
  }

  function renderLabels() {
    const wallNotes = state.labelsRemaining.slice(0, 5);
    return `
      <section class="page labels-page">
        ${scene("labels", "center center")}
        <div class="ui-layer labels-layout">
          <div class="labels-intro">
            ${pageTitle("labels")}
            <div class="labels-help"><p class="panel-label">放下的方法</p><ul class="instruction-list"><li><span>1</span><p>选择一个想放下的标签。</p></li><li><span>2</span><p>把它拖进中央回收篮。</p></li><li><span>3</span><p>看着它慢慢离开此刻。</p></li></ul></div>
          </div>

          <div class="label-stage">
            <p class="label-instruction">拖动你想暂时放下的标签，放进回收口吧</p>
            <div class="paper-wall">
              ${wallNotes.map((label, index) => `<span class="wall-paper note-${index + 1}" data-wall-label="${label}" style="background-image:url('${assetRoot}/textures/${labelTextures[index % 3]}')">${label}</span>`).join("")}
            </div>
            <div class="basket-wrap" id="recycleBasket">
              ${state.lastDropped ? `<span class="released-note">${escapeHtml(state.lastDropped)}</span>` : ""}
              <img src="${assetRoot}/objects/obj-recycle-basket.png" alt="标签回收篮" />
              <div class="drop-sparks" id="dropSparks" aria-hidden="true"></div>
            </div>
            <div class="drop-zone" id="labelDrop">将标签拖到这里放下</div>
          </div>

          <aside class="label-panel">
            <p class="panel-label">可放下的标签</p>
            <div class="label-list">
              ${state.droppedLabels.length >= 3 ? `<p class="quiet-copy label-complete">这些标签已经暂时放下。你可以随时再回来整理。</p>` : state.labelsRemaining.map((label) => `<button class="label-chip" type="button" data-label="${label}"><span>⠿</span><strong>${label}</strong><b>↘</b></button>`).join("")}
            </div>
            <p class="label-message" id="labelMessage">${state.droppedLabels.length >= 3 ? "这些标签已经暂时放下。" : "亲手把一个标签放进回收篮"}</p>
            <small id="labelCount">已放下 ${Math.min(state.droppedLabels.length, 3)} / 3</small>
          </aside>
        </div>
      </section>
    `;
  }

  function renderRelease() {
    const percent = Math.min(100, state.releaseHits * 4);
    const duration = Math.floor(state.releaseHits * 12);
    return `
      <section class="page release-page">
        ${scene("release", "center center")}
        <div class="ui-layer release-layout">
          <div class="release-intro">
            ${pageTitle("release")}
            <div class="release-cards"><div class="stat-card"><span>今日释放</span><strong data-release-today>${state.releaseHits}</strong><small>次</small></div><div class="stat-card"><span>本周释放</span><strong data-release-week>${108 + state.releaseHits}</strong><small>次</small></div></div>
            <button class="primary-button release-toggle" id="toggleRelease" type="button">${state.releaseActive ? "暂停释放" : "开始释放"}</button>
            <p class="release-safe">◇ 这里安全、私密、被理解</p>
          </div>

          <div class="release-stage">
            <button class="sandbag-button ${state.releaseActive ? "is-ready" : ""}" id="sandbag" type="button" aria-label="点击沙袋释放压力"><img src="${assetRoot}/objects/obj-sandbag-chain.png" alt="悬挂沙袋" /></button>
            <i class="sandbag-shadow" id="sandbagShadow" aria-hidden="true"></i>
            <span id="releaseHint">${state.releaseActive ? "轻点或拖动沙袋，把力气交出去" : "开始后，沙袋会回应你的点击与拖动"}</span>
          </div>

          <aside class="release-panel">
            <p class="panel-label">实时释放统计</p>
            <div class="release-summary"><div class="progress-ring" id="releasePercent" style="--progress:${percent * 3.6}deg"><strong>${percent}%</strong><small>本次出拳</small></div><dl><div><dt>出拳次数</dt><dd data-hit-count>${state.releaseHits}</dd></div><div><dt>释放时长</dt><dd data-release-time>${formatSeconds(duration)}</dd></div><div><dt>消耗能量</dt><dd data-release-energy>${Math.round(state.releaseHits * 2.4)} kcal</dd></div></dl></div>
            <div class="release-tips"><p class="panel-label">释放小贴士</p><p>把注意力放在呼吸和动作上。结束后，给自己一个拥抱，也谢谢刚才勇敢的你。</p></div>
          </aside>
        </div>
      </section>
    `;
  }

  function renderSupply() {
    const selected = supplyItems.find((item) => item.id === state.supplyChoice);
    const claimed = supplyItems.find((item) => item.id === state.supplyClaimed);
    return `
      <section class="page supply-page">
        ${scene("supply", "center center")}
        <div class="ui-layer supply-layout">
          <div class="supply-intro">
            ${pageTitle("supply")}
            <p class="panel-label supply-label">选择一份夜间补给</p>
            <div class="supply-options">
              ${supplyItems.map((item) => `<button class="option-card ${state.supplyChoice === item.id ? "is-active" : ""}" type="button" data-supply="${item.id}"><span>${item.icon}</span><strong>${item.label}</strong><small>${item.desc}</small><em>${item.time}</em></button>`).join("")}
            </div>
          </div>

          <div class="cabinet-stage">
            <div class="cabinet-object">
              <img class="cabinet-image" src="${assetRoot}/objects/obj-supply-cabinet.png" alt="夜间补给柜" />
              <div class="cabinet-sign">夜间补给柜<small>NIGHT SUPPLY CABINET</small></div>
              ${supplyItems.map((item, index) => `<button class="shelf-slot slot-${index + 1} ${state.supplyChoice === item.id ? "is-lit" : ""}" type="button" data-supply="${item.id}" aria-label="选择${item.label}">${state.supplyChoice === item.id ? `<img src="${assetRoot}/effects/${item.effect}" alt="" />` : ""}<span>${item.icon}</span><strong>${item.label}</strong></button>`).join("")}
            </div>
          </div>

          <aside class="supply-record">
            <p class="panel-label">我的补给记录</p>
            <h2 id="supplyRecordTitle">今晚已领取 ${claimed ? "1/1" : "0/1"} 份</h2>
            <div id="supplyRecordBody">${claimed ? `<div class="selected-supply supply-ticket"><span>${claimed.icon}</span><strong>${claimed.label}</strong><p>${claimed.desc}。愿这份小补给陪你慢慢恢复。</p></div>` : selected ? `<div class="selected-supply"><span>${selected.icon}</span><strong>${selected.label}</strong><p>${selected.desc}。确认后，它会成为今晚的小补给卡。</p></div>` : `<div class="empty-supply"><span>▤</span><p>还没有选择补给<br />去挑一份陪伴自己吧</p></div>`}</div>
            <div class="supply-actions">
              <button class="primary-button" id="claimSupply" type="button" ${selected ? "" : "disabled"}>领取这份补给</button>
              <button class="ghost-button" id="saveSupply" type="button" ${claimed ? "" : "disabled"}>保存到今晚记录</button>
            </div>
            <div class="supply-tip"><p class="panel-label">今日小贴士</p><p>允许自己慢下来，黑暗只是黎明前的帷幕。</p></div>
          </aside>
        </div>
      </section>
    `;
  }

  function renderWindow() {
    return `
      <section class="page window-page">
        ${scene("window", "center center")}
        <div class="ui-layer window-layout">
          <div class="window-intro">
            <p class="window-breadcrumb">灵感小站 / 值班窗口</p>
            ${pageTitle("window")}
            <div class="quick-grid" aria-label="快捷入口">
              ${quickEntries.map((entry) => `<button class="quick-card" type="button" data-quick="${entry.id}"><span>${entry.icon}</span><strong>${entry.title}</strong><small>${entry.sub}</small></button>`).join("")}
            </div>
          </div>

          <div class="booth-stage">
            <span class="booth-platform" aria-hidden="true"></span>
            <img class="booth-object" src="${assetRoot}/objects/obj-window-booth.png" alt="夜间值班窗口" />
            <div class="booth-title">值班窗口<small>今晚有人在</small></div>
            <div class="booth-board">想说两句<br />也可以<br /><small>这里会有人听见</small></div>
            <span class="booth-silhouette" aria-hidden="true"></span>
            <span class="booth-cup" aria-hidden="true"></span>
          </div>

          <section class="chat-panel window-note-panel" aria-label="窗边纸条留言区">
            <header class="chat-head"><div><small>WINDOW NOTE</small><strong>窗边留言笺</strong></div><span>灯还亮着</span></header>
            <p class="chat-whisper">不用讲完整。留下一句就好，这里不会判断你现在的状态。</p>
            <div class="chat-messages" id="chatMessages" style="min-height:180px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:12px;margin-bottom:10px;overflow-y:auto;">${state.chatMessages.slice(-3).map((message) => `<p class="bubble ${message.who === "user" ? "user" : ""}" style="${message.who === "user" ? "background:rgba(241,169,170,0.25);color:#fadadd;border:1px solid rgba(241,169,170,0.3);" : "background:rgba(255,212,153,0.15);color:#ffe6b3;border:1px solid rgba(255,212,153,0.2);"}margin:6px 0;padding:8px 12px;border-radius:12px;max-width:85%;font-size:14px;line-height:1.6;${message.who === "user" ? "margin-left:auto;" : ""}">${escapeHtml(message.text)}</p>`).join("")}</div>
            <div class="window-api-config" style="margin-bottom:10px;padding:10px;background:rgba(241,169,170,0.08);border:1px solid rgba(241,169,170,0.15);border-radius:8px;">
              <label style="display:flex;align-items:center;gap:8px;">
                <span style="color:#f1a9aa;font-size:12px;white-space:nowrap;">♡ DeepSeek API</span>
                <input id="windowApiKey" type="password" placeholder="sk-..." style="flex:1;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);border-radius:6px;padding:6px 10px;color:#e8e0d0;font-size:13px;" />
              </label>
              <small style="display:block;margin-top:4px;color:#b0a898;font-size:11px;">填入你的 DeepSeek API Key，让肖清雅陪伴你聊天</small>
            </div>
            <form class="chat-form" id="chatForm"><label class="sr-only" for="chatInput">窗边留言</label><input id="chatInput" maxlength="120" autocomplete="off" placeholder="把一句话写在纸条上…" style="flex:1;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);border-radius:8px;padding:10px 14px;color:#e8e0d0;font-size:14px;"/><button class="note-send" type="submit" style="background:rgba(241,169,170,0.25);border:1px solid rgba(241,169,170,0.4);color:#f1a9aa;border-radius:8px;padding:10px 20px;font-size:14px;font-weight:600;cursor:pointer;">递出纸条</button></form>
          </section>
        </div>
      </section>
    `;
  }

  const renderers = { home: renderHome, breath: renderBreath, card: renderCard, desk: renderDesk, explore: renderExplore, lab: renderLab, labels: renderLabels, release: renderRelease, supply: renderSupply, window: renderWindow };

  async function switchPersistentScene(route, version) {
    if (route === activeSceneRoute) return true;
    const nextIndex = activeSceneIndex === 0 ? 1 : 0;
    const nextImage = globalSceneImages[nextIndex];
    const previousImage = globalSceneImages[activeSceneIndex];
    nextImage.src = backgrounds[route];
    if (nextImage.decode) {
      try { await nextImage.decode(); } catch (error) { /* Keep the current scene if decoding fails. */ }
    }
    if (version !== renderVersion) return false;
    nextImage.classList.add("is-active");
    previousImage.classList.remove("is-active");
    activeSceneIndex = nextIndex;
    activeSceneRoute = route;
    return true;
  }

  async function render() {
    const version = ++renderVersion;
    const route = currentRoute();
    updateNav();
    const template = document.createElement("template");
    template.innerHTML = renderers[route]().trim();
    const nextPage = template.content.firstElementChild;
    nextPage.classList.add("page-enter");
    if (!(await switchPersistentScene(route, version))) return;
    if (version !== renderVersion) return;

    cleanup.forEach((fn) => fn());
    cleanup = [];
    const previousPage = activePage;
    app.classList.add("is-switching");
    app.appendChild(nextPage);
    document.body.dataset.page = route;
    initRoute(route);
    activePage = nextPage;
    window.requestAnimationFrame(() => {
      nextPage.classList.add("page-enter-active");
      if (previousPage) previousPage.classList.add("page-leave");
    });
    window.setTimeout(() => {
      if (activePage !== nextPage) return;
      Array.from(app.children).forEach((page) => { if (page !== activePage) page.remove(); });
      nextPage.classList.remove("page-enter", "page-enter-active");
      app.classList.remove("is-switching");
    }, previousPage ? 520 : 40);
    app.focus({ preventScroll: true });
  }

  function initRoute(route) {
    const init = { breath: initBreath, card: initCard, desk: initDesk, explore: initExplore, lab: initLab, labels: initLabels, release: initRelease, supply: initSupply, window: initWindow }[route];
    if (init) init();
  }

  function initBreath() {
    const bubble = document.getElementById("breathBubble");
    const text = document.getElementById("breathText");
    const time = document.getElementById("breathTime");
    const start = document.getElementById("breathStart");
    const hint = document.getElementById("breathHint");
    const rounds = document.getElementById("breathRounds");
    const ripples = document.getElementById("breathRipples");
    let timer = 0;
    let pressed = false;
    let phase = "idle";
    let deadline = 0;

    const clearPhaseTimer = () => { window.clearInterval(timer); timer = 0; };
    const setClasses = (name) => {
      bubble.classList.remove("is-inhaling", "is-holding", "is-exhaling", "is-complete");
      if (name !== "idle") bubble.classList.add(`is-${name}`);
    };
    const runCountdown = (duration, done) => {
      clearPhaseTimer();
      deadline = performance.now() + duration * 1000;
      const tick = () => {
        const value = Math.max(0, Math.ceil((deadline - performance.now()) / 1000));
        time.textContent = value || "·";
        if (deadline <= performance.now()) {
          clearPhaseTimer();
          done();
        }
      };
      tick();
      timer = window.setInterval(tick, 100);
    };
    const complete = () => {
      phase = "complete";
      setClasses("complete");
      ripples.classList.remove("is-active");
      state.breathRounds += 1;
      rounds.textContent = `已完成 ${state.breathRounds} 轮`;
      text.textContent = "这一轮完成了";
      time.textContent = "✓";
      hint.textContent = "停一会儿，准备好时可以继续下一轮";
      start.textContent = "再来一轮";
    };
    const beginExhale = () => {
      if (!["inhaling", "holding", "ready"].includes(phase)) return;
      pressed = false;
      phase = "exhaling";
      setClasses("exhaling");
      ripples.classList.add("is-active");
      text.textContent = "呼气";
      hint.textContent = "慢慢松开，让气泡恢复，也让水面接住这一口气";
      runCountdown(6, complete);
    };
    const beginHold = () => {
      if (!pressed) { beginExhale(); return; }
      phase = "holding";
      setClasses("holding");
      text.textContent = "停留";
      hint.textContent = "继续轻轻按住，停留 2 秒";
      runCountdown(2, () => {
        phase = "ready";
        text.textContent = "可以松开";
        time.textContent = "松开";
        hint.textContent = "现在松开，跟着 6 秒慢慢呼气";
      });
    };
    const beginInhale = () => {
      if (phase === "exhaling") return;
      pressed = true;
      phase = "inhaling";
      setClasses("inhaling");
      ripples.classList.remove("is-active");
      text.textContent = "吸气";
      hint.textContent = "继续按住，让气泡在 4 秒里慢慢缩小";
      start.textContent = "正在练习";
      runCountdown(4, beginHold);
    };
    const down = (event) => {
      if (event && event.pointerId !== undefined) bubble.setPointerCapture(event.pointerId);
      beginInhale();
    };
    const up = () => { if (pressed || phase === "ready") beginExhale(); };
    const keyDown = (event) => {
      if (event.code === "Space" && !event.repeat && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) {
        event.preventDefault();
        beginInhale();
      }
    };
    const keyUp = (event) => {
      if (event.code === "Space") {
        event.preventDefault();
        up();
      }
    };
    bubble.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);
    start.addEventListener("click", () => {
      bubble.focus();
      hint.textContent = "按住气泡、触摸气泡或按住空格开始吸气";
      bubble.classList.add("is-ready");
    });
    app.querySelectorAll("[data-sound]").forEach((button) => button.addEventListener("click", () => {
      app.querySelectorAll("[data-sound]").forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      toast(`环境音已切换为：${button.dataset.sound}`);
    }));
    cleanup.push(() => {
      clearPhaseTimer();
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      window.removeEventListener("keydown", keyDown);
      window.removeEventListener("keyup", keyUp);
    });
  }

  function initCard() {
    let drawing = false;
    const draw = () => {
      if (state.drawsLeft <= 0) {
        toast("今晚的三次提示已经抽完，先把这句话带走吧。");
        return;
      }
      state.promptIndex = (state.promptIndex + 1 + Math.floor(Math.random() * (promptCards.length - 1))) % promptCards.length;
      state.drawsLeft -= 1;
      drawing = true;
      const card = document.getElementById("promptCard");
      const updateCopy = () => {
        const theme = promptThemes[state.promptIndex];
        document.getElementById("cardMessage").textContent = promptCards[state.promptIndex];
        document.getElementById("themeTitle").textContent = theme.title;
        document.getElementById("themeCopy").textContent = theme.copy;
        document.getElementById("themeTags").innerHTML = theme.tags.map((tag) => `<span>${tag}</span>`).join("");
        document.getElementById("drawsLeft").textContent = `今日剩余次数：${state.drawsLeft}/3`;
        if (!state.drawsLeft) document.getElementById("drawButton").disabled = true;
      };
      const reveal = () => {
        updateCopy();
        window.requestAnimationFrame(() => card.classList.add("is-flipped"));
        state.cardFlipped = true;
        window.setTimeout(() => { drawing = false; }, 760);
      };
      if (card.classList.contains("is-flipped")) {
        card.classList.remove("is-flipped");
        window.setTimeout(reveal, 360);
      } else {
        reveal();
      }
    };
    const button = document.getElementById("drawButton");
    const safeDraw = () => { if (!drawing) draw(); };
    if (button) button.addEventListener("click", safeDraw);
    document.getElementById("drawCard").addEventListener("click", safeDraw);
  }

  function initDesk() {
    const note = document.getElementById("deskNote");
    const paperCount = document.getElementById("paperCount");
    const page = app.querySelector(".desk-page");
    const stage = app.querySelector(".desk-stage");
    const switchTool = (tool) => {
      state.deskText = note.value;
      state.deskTool = tool;
      stage.dataset.deskMode = tool;
      app.querySelectorAll("[data-tool]").forEach((item) => item.classList.toggle("is-active", item.dataset.tool === tool));
      app.querySelectorAll("[data-mode-panel]").forEach((panel) => panel.classList.toggle("is-active", panel.dataset.modePanel === tool));
    };
    note.addEventListener("input", () => { state.deskText = note.value; paperCount.textContent = `${note.value.length} / 800`; });
    app.querySelectorAll("[data-tool]").forEach((button) => button.addEventListener("click", () => {
      switchTool(button.dataset.tool);
    }));
    document.getElementById("clearDesk").addEventListener("click", () => { state.deskText = ""; note.value = ""; paperCount.textContent = "0 / 800"; toast("纸面已清空。"); });
    document.getElementById("changePaper").addEventListener("click", () => {
      state.paperTone = (state.paperTone + 1) % paperTextures.length;
      state.deskText = "";
      note.value = "";
      paperCount.textContent = "0 / 800";
      document.getElementById("deskPaperImage").src = state.paperTone === 0
        ? `${assetRoot}/objects/obj-desk-paper.png`
        : `${assetRoot}/textures/${paperTextures[state.paperTone]}`;
      toast("换了一张新纸，纸面也重新空了下来。");
    });
    document.getElementById("saveDesk").addEventListener("click", () => {
      state.deskText = note.value;
      try { localStorage.setItem("nightMoodDeskNote", state.deskText); } catch (error) { /* Storage may be unavailable. */ }
      toast("记录已保存到这台设备。");
    });

    const inkStone = document.getElementById("inkStone");
    const inkBar = document.getElementById("inkProgressBar");
    const inkText = document.getElementById("inkProgressText");
    const inkMessage = document.getElementById("inkMessage");
    const useInk = document.getElementById("useInk");
    let grinding = false;
    let lastAngle = 0;
    let inkFrame = 0;
    let pendingInk = state.inkProgress;
    const angleAt = (event) => {
      const rect = inkStone.getBoundingClientRect();
      return Math.atan2(event.clientY - (rect.top + rect.height / 2), event.clientX - (rect.left + rect.width / 2));
    };
    const paintInk = () => {
      inkFrame = 0;
      state.inkProgress = Math.min(100, pendingInk);
      inkStone.style.setProperty("--ink-progress", `${state.inkProgress}%`);
      inkBar.style.width = `${state.inkProgress}%`;
      inkText.textContent = `${Math.round(state.inkProgress)}%`;
      if (state.inkProgress >= 100) {
        inkMessage.textContent = "墨已研好，可以写下一句话。";
        useInk.disabled = false;
      }
    };
    const grindStart = (event) => {
      grinding = true;
      lastAngle = angleAt(event);
      inkStone.classList.add("is-grinding");
      inkStone.setPointerCapture(event.pointerId);
    };
    const grindMove = (event) => {
      if (!grinding) return;
      const angle = angleAt(event);
      let delta = angle - lastAngle;
      if (delta > Math.PI) delta -= Math.PI * 2;
      if (delta < -Math.PI) delta += Math.PI * 2;
      pendingInk = Math.min(100, pendingInk + Math.abs(delta) * 5.6);
      lastAngle = angle;
      if (!inkFrame) inkFrame = window.requestAnimationFrame(paintInk);
    };
    const grindEnd = () => { grinding = false; inkStone.classList.remove("is-grinding"); };
    inkStone.addEventListener("pointerdown", grindStart);
    inkStone.addEventListener("pointermove", grindMove);
    inkStone.addEventListener("pointerup", grindEnd);
    inkStone.addEventListener("pointercancel", grindEnd);
    useInk.addEventListener("click", () => { switchTool("write"); note.focus(); toast("墨已研好。慢慢写，不必写得完整。"); });

    const lamp = document.getElementById("deskLamp");
    lamp.addEventListener("click", () => {
      state.lampLit = !state.lampLit;
      lamp.classList.toggle("is-lit", state.lampLit);
      lamp.setAttribute("aria-pressed", String(state.lampLit));
      page.classList.toggle("is-lamp-lit", state.lampLit);
      document.getElementById("lampMessage").textContent = state.lampLit ? "今晚先为自己留一盏灯。" : "轻点灯盏，让书案多一点暖光。";
    });
    cleanup.push(() => { if (inkFrame) window.cancelAnimationFrame(inkFrame); });
  }

  function initExplore() {
    const showArticle = (index) => {
      state.exploreIndex = (index + articles.length) % articles.length;
      const article = articles[state.exploreIndex];
      document.getElementById("articleCount").textContent = `${String(state.exploreIndex + 1).padStart(2, "0")} / ${String(articles.length).padStart(2, "0")}`;
      document.getElementById("articleEyebrow").textContent = `NIGHT READING · ${String(state.exploreIndex + 1).padStart(2, "0")}`;
      document.getElementById("articleTitle").textContent = article.title;
      document.getElementById("articleEn").textContent = article.en;
      document.getElementById("articleSummary").textContent = article.summary;
      document.getElementById("articleResearcher").textContent = article.researcher;
      document.getElementById("articleBody").innerHTML = `<section><b>提出背景</b><p>${article.background}</p></section><section><b>经典实验或例子</b><p>${article.experiment}</p></section><section><b>概念发展</b><p>${article.development}</p></section><section><b>生活例子</b><p>${article.life}</p></section><section class="gentle-tip"><b>温和提示</b><p>${article.tip}</p></section>`;
      document.getElementById("articleProgress").style.width = `${((state.exploreIndex + 1) / articles.length) * 100}%`;
      app.querySelectorAll("[data-article]").forEach((button) => button.classList.toggle("is-active", Number(button.dataset.article) === state.exploreIndex));
      const active = app.querySelector(`[data-article="${state.exploreIndex}"]`);
      if (active) active.scrollIntoView({ block: "nearest", behavior: "smooth" });
    };
    app.querySelectorAll("[data-article]").forEach((button) => button.addEventListener("click", () => showArticle(Number(button.dataset.article))));
    document.getElementById("prevArticle").addEventListener("click", () => showArticle(state.exploreIndex - 1));
    document.getElementById("nextArticle").addEventListener("click", () => showArticle(state.exploreIndex + 1));
  }

  function initLab() {
    const canvasController = initLabCanvas();
    const updateLabUI = () => {
      const total = labTotal();
      const mixed = mixColor();
      const percentages = labPercentages();
      const result = resultForEmotion(mixed.dominant && mixed.dominant.name);
      document.getElementById("labTotalCopy").textContent = total ? `已加入 ${total} 份情绪` : "等待加入第一份情绪";
      document.getElementById("liquidGlow").classList.toggle("is-visible", Boolean(total));
      document.getElementById("reportTitle").textContent = result[0];
      document.getElementById("resultTitle").textContent = result[0];
      document.getElementById("reportState").textContent = total ? "调配中" : "待开始";
      document.getElementById("reportCopy").textContent = result[2];
      document.getElementById("resultOrb").style.setProperty("--mix", `rgb(${mixed.rgb.join(",")})`);
      const destination = document.getElementById("labDestination");
      destination.dataset.go = routeForDestination(result[1]);
      destination.querySelector("strong").textContent = result[1];
      emotions.forEach((emotion) => {
        const button = app.querySelector(`[data-emotion="${emotion.name}"]`);
        button.classList.toggle("is-added", state.labCounts[emotion.name] > 0);
        app.querySelector(`[data-vial-count="${emotion.name}"]`).textContent = state.labCounts[emotion.name] || "＋";
        const ratio = app.querySelector(`[data-ratio="${emotion.name}"]`);
        ratio.querySelector("b").style.width = `${percentages[emotion.name]}%`;
        ratio.querySelector("strong").textContent = `${percentages[emotion.name]}%`;
      });
    };
    app.querySelectorAll("[data-emotion]").forEach((button) => button.addEventListener("click", () => {
      const emotion = emotions.find((item) => item.name === button.dataset.emotion);
      state.labCounts[emotion.name] += 1;
      updateLabUI();
      canvasController.add(emotion);
      const stream = document.getElementById("pourStream");
      stream.style.setProperty("--pour-color", emotion.color);
      stream.getAnimations().forEach((animation) => animation.cancel());
      stream.animate([
        { opacity: 0, transform: "translate3d(0,-18px,0) scaleY(.2)" },
        { opacity: 0.9, transform: "translate3d(0,4px,0) scaleY(1)", offset: 0.25 },
        { opacity: 0, transform: "translate3d(0,25px,0) scaleY(.55)" },
      ], { duration: 720, easing: "cubic-bezier(.2,.72,.25,1)" });
    }));
    document.getElementById("stirLab").addEventListener("click", () => {
      if (!labTotal()) { toast("先加入一份情绪，再轻轻搅拌。"); return; }
      const rod = app.querySelector(".stirrer-object");
      rod.getAnimations().forEach((animation) => animation.cancel());
      rod.animate([
        { transform: "rotate(10deg) translate3d(0,-42px,0)" },
        { transform: "rotate(9deg) translate3d(-5px,30px,0)", offset: 0.18 },
        { transform: "rotate(8deg) translate3d(-18px,42px,0)", offset: 0.35 },
        { transform: "rotate(9deg) translate3d(0,52px,0)", offset: 0.52 },
        { transform: "rotate(10deg) translate3d(18px,42px,0)", offset: 0.68 },
        { transform: "rotate(9deg) translate3d(0,30px,0)", offset: 0.82 },
        { transform: "rotate(10deg) translate3d(0,-42px,0)" },
      ], { duration: 1800, easing: "cubic-bezier(.22,.72,.2,1)" });
      canvasController.boost();
      document.getElementById("reportState").textContent = "正在融合";
      window.setTimeout(() => { const status = document.getElementById("reportState"); if (status) status.textContent = "已融合"; }, 1750);
      toast("搅拌棒正在液体内部缓慢画圈。");
    });
    document.getElementById("resetLab").addEventListener("click", () => {
      emotions.forEach((emotion) => { state.labCounts[emotion.name] = 0; });
      updateLabUI();
      toast("调配杯已恢复清澈。");
    });
    document.getElementById("saveLab").addEventListener("click", () => {
      if (!labTotal()) { toast("先加入一份情绪，再保存配方。"); return; }
      try { localStorage.setItem("nightMoodLabRecipe", JSON.stringify({ counts: state.labCounts, savedAt: new Date().toISOString() })); } catch (error) { /* Storage may be unavailable. */ }
      toast("配方已保存到这台设备：这一刻也值得被记录。");
    });
    document.getElementById("shareLab").addEventListener("click", async () => {
      if (!labTotal()) { toast("先调配一份情绪，再生成摘要。"); return; }
      const percentages = labPercentages();
      const summary = `此刻的情绪配方：${emotions.filter((emotion) => percentages[emotion.name]).map((emotion) => `${emotion.name} ${percentages[emotion.name]}%`).join("、")}。这不是诊断，只是一种描述当下状态的方式。`;
      try { await navigator.clipboard.writeText(summary); toast("配方摘要已复制，可以留给今晚的自己。"); } catch (error) { toast(summary); }
    });
  }

  function initLabCanvas() {
    const canvas = document.getElementById("liquidCanvas");
    const ctx = canvas.getContext("2d");
    let mixture = mixColor();
    let rawColor = mixture.rgb;
    let dominantColor = mixture.dominant ? mixture.dominant.rgb : rawColor;
    let color = rawColor.map((value, index) => Math.round(value * 0.56 + dominantColor[index] * 0.44));
    let lastTotal = labTotal();
    let plumeColor = color;
    let plumeUntil = 0;
    let frame = 0;
    let boostUntil = 0;
    let running = true;
    const particles = Array.from({ length: 64 }, (_, index) => ({
      angle: (index / 64) * Math.PI * 2,
      radius: 30 + ((index * 37) % 150),
      speed: 0.002 + ((index % 9) * 0.00022),
      size: 1.5 + (index % 4),
      yOffset: ((index * 29) % 230) - 115,
    }));

    function cupPath() {
      const path = new Path2D();
      path.moveTo(46, 82);
      path.bezierCurveTo(54, 245, 64, 470, 94, 568);
      path.bezierCurveTo(126, 621, 434, 621, 466, 568);
      path.bezierCurveTo(496, 470, 506, 245, 514, 82);
      path.closePath();
      return path;
    }

    function liquidBodyPath(level, now, boost) {
      const progress = Math.max(0, Math.min(1, (level - 130) / 460));
      const left = 52 + progress * 27;
      const right = 508 - progress * 27;
      const wave = Math.sin(now * 0.0024 * boost) * 4;
      const path = new Path2D();
      path.moveTo(left, level + wave);
      path.bezierCurveTo(188, level - 8 - wave, 372, level + 9 + wave, right, level - wave);
      path.bezierCurveTo(right - 4, level + 96, 488, 500, 466, 568);
      path.bezierCurveTo(434, 615, 126, 615, 94, 568);
      path.bezierCurveTo(72, 500, left + 4, level + 96, left, level + wave);
      path.closePath();
      return { path, left, right, wave };
    }

    function draw(now) {
      if (!running) return;
      frame = window.requestAnimationFrame(draw);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const total = labTotal();
      if (total !== lastTotal) {
        mixture = mixColor();
        rawColor = mixture.rgb;
        dominantColor = mixture.dominant ? mixture.dominant.rgb : rawColor;
        color = rawColor.map((value, index) => Math.round(value * 0.56 + dominantColor[index] * 0.44));
        lastTotal = total;
      }
      if (!total) return;
      const boost = now < boostUntil ? 2.8 : 1;
      const fillRatio = Math.min(0.78, 0.2 + total * 0.052);
      const level = 590 - 430 * fillRatio;
      ctx.save();
      ctx.clip(cupPath());

      const centerX = 280;
      const centerY = level + (590 - level) * 0.52;
      const liquid = liquidBodyPath(level, now, boost);

      const bodyGradient = ctx.createLinearGradient(0, level, 0, 610);
      bodyGradient.addColorStop(0, `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.34)`);
      bodyGradient.addColorStop(0.42, `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.22)`);
      bodyGradient.addColorStop(0.82, `rgba(${Math.min(255, color[0] + 12)}, ${Math.min(255, color[1] + 8)}, ${Math.min(255, color[2] + 16)}, 0.38)`);
      bodyGradient.addColorStop(1, `rgba(${Math.min(255, color[0] + 24)}, ${Math.min(255, color[1] + 20)}, ${Math.min(255, color[2] + 30)}, 0.46)`);
      ctx.save();
      ctx.fillStyle = bodyGradient;
      ctx.shadowBlur = 28;
      ctx.shadowColor = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.46)`;
      ctx.fill(liquid.path);
      ctx.clip(liquid.path);

      const innerLight = ctx.createRadialGradient(238, level + 70, 4, centerX, centerY, 230);
      innerLight.addColorStop(0, "rgba(255, 246, 220, 0.12)");
      innerLight.addColorStop(0.35, `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.12)`);
      innerLight.addColorStop(1, "rgba(4, 8, 22, 0.16)");
      ctx.fillStyle = innerLight;
      ctx.fillRect(90, level - 20, 380, 500);
      ctx.restore();

      if (now < plumeUntil) {
        const fade = Math.max(0, (plumeUntil - now) / 1350);
        const plume = ctx.createRadialGradient(280, level + 34, 5, 280, level + 74, 138);
        plume.addColorStop(0, `rgba(${plumeColor[0]},${plumeColor[1]},${plumeColor[2]},${0.66 * fade})`);
        plume.addColorStop(0.5, `rgba(${plumeColor[0]},${plumeColor[1]},${plumeColor[2]},${0.22 * fade})`);
        plume.addColorStop(1, "rgba(0,0,0,0)");
        ctx.save();
        ctx.globalCompositeOperation = "screen";
        ctx.fillStyle = plume;
        ctx.beginPath();
        ctx.ellipse(280 + Math.sin(now * 0.008) * 24, level + 72, 138, 88, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      ctx.save();
      ctx.globalCompositeOperation = "screen";
      const surface = ctx.createRadialGradient(centerX - 55, level - 4, 4, centerX, level, Math.max(90, (liquid.right - liquid.left) * 0.52));
      surface.addColorStop(0, "rgba(255, 247, 221, 0.82)");
      surface.addColorStop(0.28, `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.62)`);
      surface.addColorStop(1, `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.05)`);
      ctx.beginPath();
      ctx.ellipse(centerX, level, (liquid.right - liquid.left) * 0.5, 14, 0, 0, Math.PI * 2);
      ctx.fillStyle = surface;
      ctx.shadowBlur = 22;
      ctx.shadowColor = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.8)`;
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 239, 205, 0.58)";
      ctx.lineWidth = 1.6;
      ctx.stroke();

      for (let ring = 0; ring < 4; ring += 1) {
        const phase = now * 0.0022 * boost + ring * 1.1;
        ctx.beginPath();
        ctx.ellipse(centerX + Math.cos(phase) * 8, level + 7 + ring * 3, 74 - ring * 13, 8 - ring, phase * 0.04, 0.2, Math.PI * 1.72);
        ctx.strokeStyle = ring % 2
          ? `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.34)`
          : "rgba(255, 235, 193, 0.38)";
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
      ctx.restore();

      ctx.save();
      ctx.translate(centerX, 565);
      ctx.scale(1, 0.28);
      const pool = ctx.createRadialGradient(0, 0, 8, 0, 0, 165);
      pool.addColorStop(0, "rgba(255, 235, 196, 0.82)");
      pool.addColorStop(0.18, `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.62)`);
      pool.addColorStop(0.62, `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.2)`);
      pool.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.beginPath();
      ctx.arc(0, 0, 165, 0, Math.PI * 2);
      ctx.fillStyle = pool;
      ctx.shadowBlur = 34;
      ctx.shadowColor = `rgba(${color[0]},${color[1]},${color[2]},0.7)`;
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.globalCompositeOperation = "screen";
      for (let ribbon = 0; ribbon < 5; ribbon += 1) {
        const phase = now * 0.0012 * boost + ribbon * 0.9;
        const offset = Math.sin(phase) * (18 + ribbon * 3);
        ctx.beginPath();
        ctx.moveTo(centerX + offset, 560);
        ctx.bezierCurveTo(
          centerX - 95 + ribbon * 14,
          500 - ribbon * 12,
          centerX + 88 - ribbon * 9,
          410 - ribbon * 22,
          centerX + Math.cos(phase) * 34,
          Math.max(level + 26, 250)
        );
        ctx.lineWidth = 1.2 + ribbon * 0.45;
        ctx.strokeStyle = ribbon % 2
          ? `rgba(${color[0]},${color[1]},${color[2]},0.18)`
          : "rgba(255,226,183,0.16)";
        ctx.shadowBlur = 16;
        ctx.shadowColor = `rgba(${color[0]},${color[1]},${color[2]},0.62)`;
        ctx.stroke();
      }
      ctx.restore();

      particles.forEach((particle, index) => {
        const angle = particle.angle + now * particle.speed * boost;
        const squeeze = 0.34 + (index % 5) * 0.025;
        const x = centerX + Math.cos(angle) * particle.radius;
        const y = centerY + Math.sin(angle) * particle.radius * squeeze + particle.yOffset * 0.38;
        if (y < level + 6 || y > 610) return;
        ctx.beginPath();
        ctx.arc(x, y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = index % 4 === 0 ? "rgba(255,231,177,0.9)" : `rgba(${color[0]},${color[1]},${color[2]},0.72)`;
        ctx.shadowBlur = 12;
        ctx.shadowColor = `rgba(${color[0]},${color[1]},${color[2]},0.75)`;
        ctx.fill();
      });
      ctx.restore();
    }

    frame = window.requestAnimationFrame(draw);
    cleanup.push(() => { running = false; window.cancelAnimationFrame(frame); });
    return {
      boost() { boostUntil = performance.now() + 1800; },
      add(emotion) {
        plumeColor = emotion.rgb;
        plumeUntil = performance.now() + 1350;
      },
    };
  }

  function initLabels() {
    const basket = document.getElementById("recycleBasket");
    const zone = document.getElementById("labelDrop");
    app.querySelectorAll("[data-label]").forEach((chip) => chip.addEventListener("pointerdown", (event) => {
      if (state.droppedLabels.length >= 3) return;
      event.preventDefault();
      const rect = chip.getBoundingClientRect();
      const ghost = chip.cloneNode(true);
      ghost.classList.add("label-drag-ghost");
      ghost.removeAttribute("data-label");
      Object.assign(ghost.style, { left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, height: `${rect.height}px` });
      document.body.appendChild(ghost);
      chip.classList.add("is-drag-source");
      chip.setPointerCapture(event.pointerId);
      let dx = 0;
      let dy = 0;
      let nextX = event.clientX;
      let nextY = event.clientY;
      let frame = 0;
      let over = false;
      const paint = () => {
        frame = 0;
        dx = nextX - event.clientX;
        dy = nextY - event.clientY;
        ghost.style.transform = `translate3d(${dx}px,${dy}px,0) rotate(${Math.max(-4, Math.min(4, dx * 0.018))}deg)`;
        const basketRect = basket.getBoundingClientRect();
        over = nextX >= basketRect.left && nextX <= basketRect.right && nextY >= basketRect.top - 26 && nextY <= basketRect.bottom + 34;
        basket.classList.toggle("is-over", over);
        zone.classList.toggle("is-over", over);
      };
      const move = (moveEvent) => {
        nextX = moveEvent.clientX;
        nextY = moveEvent.clientY;
        if (!frame) frame = window.requestAnimationFrame(paint);
      };
      const finish = () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", finish);
        window.removeEventListener("pointercancel", cancel);
        if (frame) { window.cancelAnimationFrame(frame); paint(); }
        basket.classList.remove("is-over");
        zone.classList.remove("is-over");
        if (over) {
          const target = basket.getBoundingClientRect();
          const targetDx = target.left + target.width / 2 - (rect.left + rect.width / 2);
          const targetDy = target.top + target.height * 0.54 - (rect.top + rect.height / 2);
          const drop = ghost.animate([
            { transform: `translate3d(${dx}px,${dy}px,0) scale(1)`, opacity: 1 },
            { transform: `translate3d(${targetDx}px,${targetDy}px,0) rotate(-7deg) scale(.2)`, opacity: 0 },
          ], { duration: 480, easing: "cubic-bezier(.2,.72,.2,1)", fill: "forwards" });
          drop.onfinish = () => { ghost.remove(); recycleLabel(chip.dataset.label, chip); };
        } else {
          const rebound = ghost.animate([
            { transform: `translate3d(${dx}px,${dy}px,0)` },
            { transform: "translate3d(0,0,0)" },
          ], { duration: 430, easing: "cubic-bezier(.18,.85,.28,1.2)", fill: "forwards" });
          rebound.onfinish = () => { ghost.remove(); chip.classList.remove("is-drag-source"); };
        }
      };
      const cancel = () => { over = false; finish(); };
      window.addEventListener("pointermove", move, { passive: true });
      window.addEventListener("pointerup", finish, { once: true });
      window.addEventListener("pointercancel", cancel, { once: true });
    }));
  }

  function recycleLabel(label, chip) {
    if (!state.labelsRemaining.includes(label) || state.droppedLabels.length >= 3) return;
    state.labelsRemaining = state.labelsRemaining.filter((item) => item !== label);
    state.droppedLabels.push(label);
    state.lastDropped = label;
    if (chip) chip.remove();
    const wallNote = Array.from(app.querySelectorAll("[data-wall-label]")).find((note) => note.dataset.wallLabel === label);
    if (wallNote) wallNote.animate([{ opacity: 1, transform: getComputedStyle(wallNote).transform }, { opacity: 0, transform: "translateY(28px) scale(.82)" }], { duration: 360, fill: "forwards" }).onfinish = () => wallNote.remove();
    const basket = document.getElementById("recycleBasket");
    basket.animate([{ transform: "translateX(-50%) translateY(0)" }, { transform: "translateX(-50%) translateY(7px)" }, { transform: "translateX(-50%) translateY(0)" }], { duration: 360, easing: "ease-out" });
    const released = document.createElement("span");
    released.className = "released-note";
    released.textContent = label;
    basket.appendChild(released);
    window.setTimeout(() => released.remove(), 950);
    const sparks = document.getElementById("dropSparks");
    sparks.innerHTML = Array.from({ length: 7 }, (_, index) => `<i style="--spark-x:${(index - 3) * 15}px;--spark-delay:${index * 35}ms"></i>`).join("");
    const count = Math.min(state.droppedLabels.length, 3);
    document.getElementById("labelCount").textContent = `已放下 ${count} / 3`;
    document.getElementById("labelMessage").textContent = count >= 3 ? "这些标签已经暂时放下。你可以随时再回来整理。" : "这个标签已经被回收篮接住了。";
    if (count >= 3) {
      const list = app.querySelector(".label-list");
      list.innerHTML = `<p class="quiet-copy label-complete">这些标签已经暂时放下。你可以随时再回来整理。</p>`;
    }
    toast(count >= 3 ? "今晚先放下这些。你已经完成了三次整理。" : "这个标签已经暂时放下。");
  }

  function initRelease() {
    const toggle = document.getElementById("toggleRelease");
    const bag = document.getElementById("sandbag");
    toggle.addEventListener("click", () => {
      state.releaseActive = !state.releaseActive;
      if (state.releaseActive && !state.releaseStartedAt) state.releaseStartedAt = Date.now();
      toggle.textContent = state.releaseActive ? "暂停释放" : "开始释放";
      bag.classList.toggle("is-ready", state.releaseActive);
      document.getElementById("releaseHint").textContent = state.releaseActive ? "轻点或拖动沙袋，把力气交出去" : "开始后，沙袋会回应你的点击与拖动";
    });
    const shadow = document.getElementById("sandbagShadow");
    let dragging = false;
    let moved = false;
    let startX = 0;
    let dx = 0;
    let frame = 0;
    const recordHit = () => {
      state.releaseHits += 1;
      updateReleaseNumbers();
    };
    const swing = (distance) => {
      const amount = Math.max(18, Math.min(88, Math.abs(distance)));
      const direction = distance < 0 ? -1 : 1;
      bag.getAnimations().forEach((animation) => animation.cancel());
      bag.animate([
        { transform: `translate3d(${distance}px,0,0) rotate(${distance / 14}deg)` },
        { transform: `translate3d(${-direction * amount * 0.62}px,0,0) rotate(${-direction * amount / 18}deg)` },
        { transform: `translate3d(${direction * amount * 0.38}px,0,0) rotate(${direction * amount / 24}deg)` },
        { transform: `translate3d(${-direction * amount * 0.2}px,0,0) rotate(${-direction * amount / 32}deg)` },
        { transform: "translate3d(0,0,0) rotate(0deg)" },
      ], { duration: 1050, easing: "cubic-bezier(.22,.72,.22,1)" });
      bag.style.transform = "";
      shadow.style.transform = "";
    };
    bag.addEventListener("pointerdown", (event) => {
      if (!state.releaseActive) { toast("先点击开始释放，再轻轻点击或拖动沙袋。"); return; }
      dragging = true;
      moved = false;
      startX = event.clientX;
      dx = 0;
      bag.setPointerCapture(event.pointerId);
    });
    bag.addEventListener("pointermove", (event) => {
      if (!dragging) return;
      dx = Math.max(-92, Math.min(92, event.clientX - startX));
      moved = moved || Math.abs(dx) > 7;
      if (!frame) frame = window.requestAnimationFrame(() => {
        frame = 0;
        bag.style.transform = `translate3d(${dx}px,0,0) rotate(${dx / 14}deg)`;
        shadow.style.transform = `translateX(calc(-50% + ${dx * 0.55}px)) scaleX(${1 - Math.min(.24, Math.abs(dx) / 400)})`;
      });
    });
    const release = () => {
      if (!dragging) return;
      dragging = false;
      if (Math.abs(dx) > 10) {
        recordHit();
        swing(dx);
      } else {
        bag.style.transform = "";
        shadow.style.transform = "";
      }
    };
    bag.addEventListener("pointerup", release);
    bag.addEventListener("pointercancel", release);
    bag.addEventListener("click", () => {
      if (!state.releaseActive || moved) return;
      recordHit();
      swing(38);
    });
    cleanup.push(() => { if (frame) window.cancelAnimationFrame(frame); });
  }

  function updateReleaseNumbers() {
    const percent = Math.min(100, state.releaseHits * 4);
    const percentEl = document.getElementById("releasePercent");
    const hitEl = app.querySelector("[data-hit-count]");
    const timeEl = app.querySelector("[data-release-time]");
    const energyEl = app.querySelector("[data-release-energy]");
    const todayEl = app.querySelector("[data-release-today]");
    const weekEl = app.querySelector("[data-release-week]");
    if (percentEl) { percentEl.style.setProperty("--progress", `${percent * 3.6}deg`); percentEl.querySelector("strong").textContent = `${percent}%`; }
    if (hitEl) hitEl.textContent = state.releaseHits;
    if (timeEl) timeEl.textContent = formatSeconds(state.releaseStartedAt ? Math.max(0, Math.floor((Date.now() - state.releaseStartedAt) / 1000)) : 0);
    if (energyEl) energyEl.textContent = `${Math.round(state.releaseHits * 2.4)} kcal`;
    if (todayEl) todayEl.textContent = state.releaseHits;
    if (weekEl) weekEl.textContent = 108 + state.releaseHits;
  }

  function initSupply() {
    const body = document.getElementById("supplyRecordBody");
    const title = document.getElementById("supplyRecordTitle");
    const claim = document.getElementById("claimSupply");
    const save = document.getElementById("saveSupply");
    const select = (id) => {
      state.supplyChoice = id;
      const item = supplyItems.find((entry) => entry.id === id);
      app.querySelectorAll("[data-supply]").forEach((button) => {
        button.classList.toggle("is-active", button.dataset.supply === id && button.classList.contains("option-card"));
        button.classList.toggle("is-lit", button.dataset.supply === id && button.classList.contains("shelf-slot"));
      });
      body.innerHTML = `<div class="selected-supply"><span>${item.icon}</span><strong>${item.label}</strong><p>${item.desc}。确认后，它会成为今晚的小补给卡。</p></div>`;
      claim.disabled = false;
      toast(`柜门为“${item.label}”亮了起来。`);
    };
    app.querySelectorAll("[data-supply]").forEach((button) => button.addEventListener("click", () => select(button.dataset.supply)));
    claim.addEventListener("click", () => {
      const item = supplyItems.find((entry) => entry.id === state.supplyChoice);
      if (!item) return;
      state.supplyClaimed = item.id;
      state.supplySaved = false;
      title.textContent = "今晚已领取 1/1 份";
      body.innerHTML = `<div class="selected-supply supply-ticket"><span>${item.icon}</span><strong>${item.label}</strong><p>${item.desc}。愿这份小补给陪你慢慢恢复。</p></div>`;
      save.disabled = false;
      app.querySelector(`[data-supply="${item.id}"].shelf-slot`).animate([{ transform: "scale(1)" }, { transform: "scale(1.045)" }, { transform: "scale(1)" }], { duration: 520 });
      toast("小补给卡已经递到你手边。");
    });
    save.addEventListener("click", () => {
      const item = supplyItems.find((entry) => entry.id === state.supplyClaimed);
      if (!item) return;
      try { localStorage.setItem("nightMoodSupply", JSON.stringify({ id: item.id, label: item.label, savedAt: new Date().toISOString() })); } catch (error) { /* Storage may be unavailable. */ }
      state.supplySaved = true;
      save.textContent = "已保存到今晚记录";
      toast("这份补给已保存到今晚记录。");
    });
  }

  function initWindow() {
    const messages = document.getElementById("chatMessages");
    const appendMessage = (text, who) => {
      addChat(text, who);
      const note = document.createElement("p");
      note.className = `bubble ${who === "user" ? "user" : ""}`;
      note.textContent = text;
      note.style.cssText = `${who === "user" ? "background:rgba(241,169,170,0.25);color:#fadadd;border:1px solid rgba(241,169,170,0.3);" : "background:rgba(255,212,153,0.15);color:#ffe6b3;border:1px solid rgba(255,212,153,0.2);"}margin:6px 0;padding:8px 12px;border-radius:12px;max-width:85%;font-size:14px;line-height:1.6;${who === "user" ? "margin-left:auto;" : ""}`;
      messages.appendChild(note);
      while (messages.children.length > 3) messages.firstElementChild.remove();
      messages.scrollTop = messages.scrollHeight;
    };
    app.querySelectorAll("[data-quick]").forEach((button) => button.addEventListener("click", () => {
      const entry = quickEntries.find((item) => item.id === button.dataset.quick);
      appendMessage(entry.message, "user");
      window.setTimeout(() => appendMessage(entry.reply, "bot"), 260);
    }));
    const apiKeyInput = document.getElementById("windowApiKey");
    if (apiKeyInput) {
      try { apiKeyInput.value = JSON.parse(localStorage.getItem("crimsonWindowApi") || "{}").key || ""; } catch(e) {}
      apiKeyInput.addEventListener("change", () => {
        try { localStorage.setItem("crimsonWindowApi", JSON.stringify({ key: apiKeyInput.value })); } catch(e) {}
      });
    }
    document.getElementById("chatForm").addEventListener("submit", async (event) => {
      event.preventDefault();
      const input = document.getElementById("chatInput");
      const text = input.value.trim();
      if (!text) return;
      input.value = "";
      appendMessage(text, "user");
      const apiKey = apiKeyInput ? apiKeyInput.value.trim() : "";
      if (apiKey) {
        try {
          const systemPrompt = "你是肖清雅，一个半精灵吟游诗人，魅惑学院。你性格乐天、恋爱脑、高洞悉力。你能瞬间察觉谁心情不好。用温柔、俏皮的方式安慰用户，偶尔撒娇。回复简短温暖，不超过100字。";
          const reqMessages = [{ role: "system", content: systemPrompt }];
          state.chatMessages.slice(-6).forEach(m => {
            reqMessages.push({ role: m.who === "user" ? "user" : "assistant", content: m.text });
          });
          const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
            body: JSON.stringify({ model: "deepseek-chat", messages: reqMessages, temperature: 0.85, max_tokens: 200 })
          });
          const json = await res.json();
          const reply = json.choices?.[0]?.message?.content || "听见了。先把这句话留在窗边。";
          appendMessage(reply, "bot");
        } catch (e) {
          appendMessage("听见了。先把这句话留在窗边，不用急着讲完整。", "bot");
        }
      } else {
        window.setTimeout(() => appendMessage("听见了。先把这句话留在窗边，不用急着讲完整。", "bot"), 320);
      }
    });
    if (messages) messages.scrollTop = messages.scrollHeight;
  }

  function addChat(text, who) {
    state.chatMessages.push({ text, who });
    if (state.chatMessages.length > 12) state.chatMessages = state.chatMessages.slice(-12);
  }

  function formatSeconds(seconds) {
    const min = String(Math.floor(seconds / 60)).padStart(2, "0");
    const sec = String(seconds % 60).padStart(2, "0");
    return `${min}:${sec}`;
  }

  function toast(message) {
    window.clearTimeout(toastTimer);
    document.querySelectorAll(".toast").forEach((node) => node.remove());
    const node = document.createElement("div");
    node.className = "toast";
    node.setAttribute("role", "status");
    node.setAttribute("aria-live", "polite");
    node.textContent = message;
    document.body.appendChild(node);
    toastTimer = window.setTimeout(() => node.remove(), 2600);
  }

  moduleIndex.innerHTML = modules.map((module) => `<button class="module-card" type="button" data-route="${module.route}"><span class="module-icon">${module.icon}</span><strong>${module.title}</strong><small>${module.desc}</small></button>`).join("");

  document.addEventListener("click", (event) => {
    const routeButton = event.target.closest("[data-route]");
    if (routeButton) {
      const route = routeButton.dataset.route;
      if (route === "novel") { window.open("./xiaoqingya/novel.html", "_blank"); return; }
      navigate(route); return;
    }
    const goButton = event.target.closest("[data-go]");
    if (goButton) {
      const route = goButton.dataset.go;
      if (route === "novel") { window.open("./xiaoqingya/novel.html", "_blank"); return; }
      navigate(route); return;
    }
    const panelButton = event.target.closest("[data-panel]");
    if (panelButton) { openPanel(panelButton.dataset.panel); return; }
    if (event.target.closest("[data-close-panel]")) closePanels();
  });

  document.addEventListener("keydown", (event) => { if (event.key === "Escape" && document.body.classList.contains("overlay-open")) closePanels(); });
  window.addEventListener("hashchange", render);

  const bgmAudio = new Audio("./xiaoqingya/beijingmusic.mp3");
  bgmAudio.loop = true;
  bgmAudio.volume = 0.4;

  musicToggle.addEventListener("click", () => {
    const playing = musicDock.classList.toggle("is-playing");
    if (playing) { bgmAudio.play().catch(() => {}); musicStatus.textContent = "正在播放 · 清雅的旋律"; }
    else { bgmAudio.pause(); musicStatus.textContent = "沉浸 · 疗愈 · 回到当下"; }
    musicToggle.setAttribute("aria-label", playing ? "暂停背景音乐" : "播放背景音乐");
  });

  Object.values(backgrounds).forEach((src) => {
    const image = new Image();
    image.decoding = "async";
    image.src = src;
    preloadCache.set(src, image);
    if (image.decode) image.decode().catch(() => {});
  });

  let parallaxFrame = 0;
  let pointerX = window.innerWidth / 2;
  let pointerY = window.innerHeight / 2;
  window.addEventListener("pointermove", (event) => {
    if (event.pointerType === "touch") return;
    pointerX = event.clientX;
    pointerY = event.clientY;
    if (parallaxFrame) return;
    parallaxFrame = window.requestAnimationFrame(() => {
      parallaxFrame = 0;
      if (!activePage) return;
      const image = globalSceneImages[activeSceneIndex];
      if (!image) return;
      const x = ((pointerX / window.innerWidth) - .5) * -7;
      const y = ((pointerY / window.innerHeight) - .5) * -5;
      image.style.setProperty("--parallax-x", `${x}px`);
      image.style.setProperty("--parallax-y", `${y}px`);
    });
  }, { passive: true });

  if (!location.hash) location.hash = "home";
  else render();

  // 花瓣动画样式
  const mergeStyles = document.createElement("style");
  mergeStyles.textContent = `
.petal-container { position: fixed; inset: 0; z-index: 1; pointer-events: none; overflow: hidden; }
.petal { position: absolute; width: 22px; height: 22px; border-radius: 50% 0 50% 0; animation: petalFall var(--dur,8s) linear var(--del,0s) infinite; will-change: transform; }
@keyframes petalFall {
  0%   { transform: translateY(-5vh) translateX(0) rotate(0deg); opacity: 0; }
  6%   { opacity: 0.6; }
  25%  { transform: translateY(25vh) translateX(80px) rotate(50deg); }
  50%  { transform: translateY(50vh) translateX(-40px) rotate(160deg); }
  75%  { transform: translateY(75vh) translateX(60px) rotate(260deg); }
  94%  { opacity: 0.5; }
  100% { transform: translateY(105vh) translateX(20px) rotate(380deg); opacity: 0; }
}
  `;
  document.head.appendChild(mergeStyles);
})();
