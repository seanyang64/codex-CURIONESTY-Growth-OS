(function () {
  const STORAGE_KEY = "curionesty-growth-os-mvp-v1";
  const CREDIT_INITIAL_SCORE = 100;
  const studentStatuses = ["好奇在读", "毕业", "离开", "成都新生社区在读", "深圳新生社区在读"];
  const activeStudentStatuses = studentStatuses.filter((status) => status.includes("在读"));

  const navItems = [
    { id: "dashboard", label: "工作台", icon: "01" },
    { id: "students", label: "学生", icon: "02" },
    { id: "motivation", label: "成长记录", icon: "03" },
    { id: "courses", label: "课程日历", icon: "04" },
    { id: "attendance", label: "信用", icon: "05" },
    { id: "gpa", label: "成绩", icon: "06" },
    { id: "reports", label: "报告", icon: "07" },
    { id: "import", label: "管理设置", icon: "08" }
  ];

  const defaultCreditRules = [
    { id: "rule_week_clean", label: "整周无违约且请假不超过3课时", points: 7 },
    { id: "rule_day_clean", label: "单日无违约申请加分", points: 1 },
    { id: "rule_public_service_month", label: "日拱一卒：公共服务月结", points: 15 },
    { id: "rule_skill_share_month", label: "日拱一卒：技能练习并主动分享月结", points: 12 },
    { id: "rule_skill_month", label: "日拱一卒：技能练习月结", points: 10 },
    { id: "rule_self_manage_month", label: "日拱一卒：自我管理进步月结", points: 8 },
    { id: "rule_service_2", label: "社区服务 2分项目", points: 2 },
    { id: "rule_service_5", label: "社区服务/阅读写作 5分项目", points: 5 },
    { id: "rule_fast_restore", label: "快速加分成功：恢复至80分", points: 0 },
    { id: "rule_revival_restore", label: "复活成功：恢复至100分", points: 0 },
    { id: "rule_late", label: "迟到", points: -2 },
    { id: "rule_late_15", label: "迟到15分钟以上", points: -5 },
    { id: "rule_late_60", label: "迟到1小时以上", points: -10 },
    { id: "rule_absent", label: "无故缺席/迟到90分钟以上", points: -15 },
    { id: "rule_sleep", label: "课堂长时间睡觉", points: -10 },
    { id: "rule_task_personal", label: "个人任务未按时提交", points: -2 },
    { id: "rule_task_team", label: "重要任务/团队任务未按时提交", points: -5 },
    { id: "rule_device_minor", label: "电子设备无关使用，经提醒仍持续", points: -2 },
    { id: "rule_device_serious", label: "电子设备无关使用严重", points: -5 },
    { id: "rule_contract_minor", label: "卫生/借阅/厨房等一般违约", points: -2 },
    { id: "rule_power_off", label: "离开公共区域未关电器", points: -2 },
    { id: "rule_garbage", label: "垃圾分类违规", points: -5 },
    { id: "rule_noise", label: "休息时段扰民风险，经提醒再犯", points: -2 },
    { id: "rule_outing", label: "远距离外出/脱队未报备", points: -5 },
    { id: "rule_fast_fail", label: "快速加分违约额外扣分", points: -10 }
  ];

  const defaultCreditPolicy = `# 信用积分规则 2.6

一、每学期初始信用分 100 分，信用分数低，意味着你有过不恰当的失信行为。
原则上，信用分代表了你在好奇学习社区里可被人信赖的程度，好奇无法为信用分低的人链接资源或工作机会。

二、信用分增加。信用累积靠的是漫长的点滴。

1. 一整周无违约行为，且当周请假不超过 3 课时，信用分 +7。
如果只有周中的某几天无违约，可以按一天 1 分，自主统计，周六前找生活老师单独申请加分。

2. “日拱一卒”，连续一个月每天都坚持自己承诺的行为，鼓励通过大群公开打卡，申请获得大量加分：
① 持续的、每天都要做的公共服务，月结 15 分；
② 自己热爱的技能上的练习和提升，并坚持分享自己的行动和感受，月结 12 分；
③ 自己热爱的技能上的练习和提升，但没有太多主动的分享，月结 10 分；
④ 自我管理上的进步，如坚持早睡、早起等，月结 8 分。

3. 通过服务社区、提升自我，获取加分。每项任务，每人每学期有 1 次加分机会（部分任务需要提前申请）。项目将视具体情况调整，由生活老师和项目负责人考核，合格后予以加分。

2 分项目：
- 检查玉林市井卫生，每周需求 1 次。
- 解决 1 处公共卫生的死角，如住宿区洗手池积尘、地漏堵塞的杂物等。
- 发每日播报 1 次。每周需求 3 次。
- 协助摄影 0.5 节课，出优质照片 20 张。每周需求 4 次。（精益创业、运动通识、戏剧、极限飞盘、各种项目选修……）
- 当课程助教。如学科有需要，每门课每位同学可申请 1 次。
- 其他社区服务事务，每位同学每周可申请 1 次，如管理并携带白板等。

5 分项目：
- 组织并监督大家清理、复原使用后的公共空间或其他暂用的空间（摆放桌椅 / 物品归位 / 垃圾带走）。每周需求 1 次。
- 阅读本学期所选必读书目之外的书籍 2 本。
- 写原创书评或影评一篇，得到公众号征用。发布上限为 3 篇。

快速加分（一周内合理请假不超过 3 次）：
- 信用积分在 70 分以下的同学，可申请一次“快速加分”。申请后，在接下来的一周内不能有任何一种违约。
- 违约一次，快速加分自动取消，并在原本扣分基础上额外扣 10 分，且在复活阶段扣分达到 20 分则算失败。
- 如果一周内做到了承诺，则积分恢复至 80 分。

其他明确声明与信用积分有关的制度（如卫生奖惩机制）也会带来信用分的增加，请留意。

三、信用分减少。信用减少，一次就很严重。

1. 迟到一次 -2。迟到 15 分钟以上 -5。迟到 1 小时以上 -10。无故缺席 -15。迟到 90 分钟以上视为无故缺席。课堂上长时间睡觉 -10。
2. 未按照时间约定提交任务：个人任务，每次每项 -2；重要任务或团队任务，每次每项 -5。
3. 上课期间持续使用电子设备做无关课程的事情，授课老师可提醒一次，若多次不听劝阻，视严重程度 -2 或 -5。
4. 卫生分工不完成、图书借阅不归还、厨房使用油烟大等违约行为，每次每项 -2。
5. 离开公共区域时不关空调、灯等电器，每次每项 -2，并额外罚款 50 元；若无法确定责任人，则相关人员一起平摊。一周之内连续 3 天没有再违规，退还押金，否则不退回。（每人每学期仅 3 次退还押金的机会。）
6. 关于人走断电，鼓励同学之间互相提醒，互相帮忙随手关灯关空调。帮助同学的行为，鼓励跟生活老师申请加分，核实过后，视情况加分。（每位同学每周可申请 1 次）
7. 住宿区域及用餐区域不按要求做垃圾分类被举报者，每人每次 -5。
8. 住宿区域在休息时段（中午 12:00-15:00，晚上 21:00-次日早晨 9:00）交谈、娱乐声音太大有扰民风险的，提醒 2 次，当天再犯者，每人每次 -2。引起周边居民反馈或举报的，直接劝离好奇的住宿区。
9. 在校期间，个人远距离（>3 公里）外出不向任何老师报备者，或者团体出行时脱离大部队行动且不报备者，每人每次 -5。
10. 未尽事宜，视具体情况结合社区公约裁定。

四、信用分影响活动参与

1. 信用分在 110 分以下，不能享受信用积分福利。
2. 信用分 90 分以下，不可申请长期的替代性学习项目。
3. 信用分在 70 分以下，上课期间需要将手机放入停机坪。
4. 信用分在 50 分以下，晚上 23:00 之后需要把电子产品（手机、iPad、笔记本电脑）放入自律屋（男生暂时由生活老师代为保管）。
5. 信用分在 30 分以下，强制进入复活赛，如复活失败则暂时取消好奇学习社区学生资格。

五、信用基金

信用基金的来源：违约行为导致的罚金或扣除的押金。
信用基金的用途：一半用于教师集体活动，一半用于学生信用奖金池（每学期一次，由信用积分前三的同学按照分数比例分配奖金）。

六、信用分数福利

信用分数越高，在某些相应的奖学金评选中优先考虑，以下福利需主动申请，和生活老师及做事课负责老师报备。
信用分在 110 分以上，有优先打饭权、和嘉宾共进午餐、优先参与某些做事课项目。
信用分在 120 分以上，可申请通宵自习 3 次。活动范围在学生活动空间，需注意音量。
信用分在 130 分以上，有直接换除生活老师所属宿舍外的同性别宿舍的机会 1 次、免交作业的机会 1 次。
信用积分 150 分以上，可以自荐或直接任命一人成为“一日社长”。

七、公示

自 2024 年秋季学期起，每两周公示一次，公示后立即执行相应效果。信用积分在 30 分以下的同学，同学期内有且仅有一次复活机会，复活期将持续两周。复活期内，若扣分不超过 30 分，则顺利复活，积分复原至 100 分；反之，则复活失败，需被停学至少两周，返校需重新提出入学申请，并且通过学习社区全职老师全体同意。复活期内若出现频繁请假的情况，则复活期顺延，重新计算。

八、奖学金

1. 每学期额度为 1.5 万，获得资格如下：就读半年以上，每学期请假次数不超过 5 次（不允许跟老师求情），GPA 平均 3.0 以上、信用积分 147 分以上（平均 80% 以上）。
2. 其他突出表现：
a. 设计及创意奖学金：详细要求另做说明。
b. 突出表现奖学金：在自己感兴趣领域持续付出精力、时间与努力并产出优异成果（能够被好奇当作有效的成长案例对外讲述的）。`;

  const defaultAcademies = [
    { id: "academy_red", color: "red", name: "红学院" },
    { id: "academy_yellow", color: "yellow", name: "黄学院" },
    { id: "academy_blue", color: "blue", name: "蓝学院" },
    { id: "academy_green", color: "green", name: "绿学院" }
  ];

  const studentExportFields = [
    { key: "studentNo", label: "学号" },
    { key: "name", label: "中文名" },
    { key: "englishName", label: "英文名" },
    { key: "age", label: "年龄" },
    { key: "program", label: "当前项目" },
    { key: "academy", label: "学院" },
    { key: "status", label: "状态" },
    { key: "tags", label: "标签" },
    { key: "notes", label: "备注" },
    { key: "gpa", label: "GPA" },
    { key: "credit", label: "信用积分" }
  ];

  const sampleData = {
    students: [
      {
        id: "stu_1",
        name: "林一舟",
        englishName: "Leo",
        studentNo: "C2026001",
        age: "13",
        program: "好奇学习社区",
        academyId: "academy_blue",
        status: "好奇在读",
        tags: "阅读强、项目型学习",
        notes: "适合通过项目任务带动表达。"
      },
      {
        id: "stu_2",
        name: "陈夏",
        englishName: "Summer",
        studentNo: "C2026002",
        age: "15",
        program: "好奇学习社区",
        academyId: "academy_red",
        status: "好奇在读",
        tags: "需要情绪支持、通识讨论活跃",
        notes: "公开表达前需要更清晰的安全感。"
      }
    ],
    courses: [
      {
        id: "course_1",
        name: "通识：城市如何生长",
        center: "通识中心",
        path: "通识",
        teacher: "Bo",
        ruleOwner: "Bo",
        dailyWeight: 60,
        finalWeight: 40,
        startAt: "2026-06-08T10:00",
        endAt: "2026-06-08T11:30",
        attributes: ["通识课程", "必修课程"],
        description: "通过城市案例理解空间、阶层、公共生活。"
      },
      {
        id: "course_2",
        name: "阅读：少年与世界",
        center: "通识中心",
        path: "阅读",
        teacher: "May",
        ruleOwner: "May",
        dailyWeight: 70,
        finalWeight: 30,
        startAt: "2026-06-11T14:00",
        endAt: "2026-06-11T15:30",
        attributes: ["必读书", "通识选修"],
        description: "读书会、摘录、观点表达和写作输出。"
      }
    ],
    motivation: [
      {
        id: "mot_1",
        studentId: "stu_1",
        teacher: "Bo",
        scene: "课堂",
        statusTone: "正向出现",
        dimensions: ["好奇"],
        tags: "主动提问、深入追问",
        fact: "在城市主题讨论中追问为什么不同街区的公共空间差异很大，并把问题连接到自己住过的社区。",
        suggestion: "下次让他准备一个 3 分钟街区观察分享，把好奇延展成表达。",
        followUp: false,
        createdAt: new Date().toISOString()
      },
      {
        id: "mot_2",
        studentId: "stu_2",
        teacher: "May",
        scene: "游戏",
        statusTone: "需要支持",
        dimensions: ["勇气", "觉悟"],
        tags: "面对失败、自我反思",
        fact: "游戏失败后先沉默了几分钟，随后愿意留下参与复盘，并说自己刚才没有听完队友建议。",
        suggestion: "下一次游戏复盘提前给她一个简短发言位置，帮助她把反思说出来。",
        followUp: true,
        createdAt: new Date().toISOString()
      }
    ],
    attendance: [],
    creditRules: defaultCreditRules,
    academies: defaultAcademies,
    holidays: [],
    grades: [
      {
        id: "grade_1",
        studentId: "stu_1",
        courseId: "course_1",
        teacher: "Bo",
        term: "2026 春季",
        dailyScore: 88,
        finalScore: 90,
        score: 89,
        credit: 1,
        countsGpa: true,
        comment: "能够主动提出问题，并把概念与真实城市经验连接起来。下一步需要练习更结构化地表达观点。",
        artifact: "城市观察笔记",
        createdAt: new Date().toISOString()
      }
    ],
    imports: []
  };

  let state = normalizeState(loadState());
  let activeView = "dashboard";
  let searchTerm = "";
  let editingStudentId = null;
  let editingAcademyId = null;
  let editingCreditRuleId = null;
  let editingCourseId = null;
  let selectedStudentStatuses = new Set(activeStudentStatuses);
  let selectedStudentAcademies = new Set();
  let selectedReportStatuses = new Set(activeStudentStatuses);
  let selectedReportAcademies = new Set();
  let selectedMotivationStatuses = new Set(activeStudentStatuses);
  let selectedMotivationAcademies = new Set();
  let selectedCourseStatuses = new Set(activeStudentStatuses);
  let selectedCourseAcademies = new Set();
  let selectedCreditStatuses = new Set(activeStudentStatuses);
  let selectedCreditAcademies = new Set();
  let selectedGradeStatuses = new Set(activeStudentStatuses);
  let selectedGradeAcademies = new Set();
  let calendarCursor = new Date();
  let showLunarCalendar = true;

  function loadState() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(sampleData);
    try {
      return JSON.parse(raw);
    } catch {
      return structuredClone(sampleData);
    }
  }

  function normalizeState(data) {
    return {
      students: data.students || [],
      courses: data.courses || [],
      motivation: data.motivation || [],
      attendance: data.attendance || [],
      creditRules: data.creditRules?.length ? data.creditRules : structuredClone(defaultCreditRules),
      academies: data.academies?.length ? data.academies : structuredClone(defaultAcademies),
      holidays: data.holidays || [],
      creditPolicy: data.creditPolicy || defaultCreditPolicy,
      grades: data.grades || [],
      imports: data.imports || []
    };
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function id(prefix) {
    return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  }

  function $(selector, root = document) {
    return root.querySelector(selector);
  }

  function $all(selector, root = document) {
    return Array.from(root.querySelectorAll(selector));
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function csvEscape(value) {
    const text = String(value ?? "");
    if (/[",\n\r\t]/.test(text)) return `"${text.replaceAll('"', '""')}"`;
    return text;
  }

  function parseDelimited(text) {
    const delimiter = text.includes("\t") ? "\t" : ",";
    const rows = [];
    let row = [];
    let cell = "";
    let quoted = false;

    for (let index = 0; index < text.length; index += 1) {
      const char = text[index];
      const next = text[index + 1];
      if (quoted) {
        if (char === '"' && next === '"') {
          cell += '"';
          index += 1;
        } else if (char === '"') {
          quoted = false;
        } else {
          cell += char;
        }
      } else if (char === '"') {
        quoted = true;
      } else if (char === delimiter) {
        row.push(cell.trim());
        cell = "";
      } else if (char === "\n") {
        row.push(cell.trim());
        rows.push(row);
        row = [];
        cell = "";
      } else if (char !== "\r") {
        cell += char;
      }
    }
    row.push(cell.trim());
    rows.push(row);
    return rows.filter((item) => item.some(Boolean));
  }

  function downloadText(filename, text, type = "text/csv;charset=utf-8") {
    const blob = new Blob([text], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function formatDate(iso) {
    if (!iso) return "未记录时间";
    return new Intl.DateTimeFormat("zh-CN", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    }).format(new Date(iso));
  }

  function getStudent(studentId) {
    return state.students.find((student) => student.id === studentId);
  }

  function getCourse(courseId) {
    return state.courses.find((course) => course.id === courseId);
  }

  function getAcademy(academyId) {
    return state.academies.find((academy) => academy.id === academyId);
  }

  function academyClass(academy) {
    return academy ? `academy-${academy.color}` : "academy-none";
  }

  function normalizeStudentStatus(status) {
    if (studentStatuses.includes(status)) return status;
    if (status === "毕业") return "毕业";
    if (["离开", "暂停", "结营", "退出"].includes(status)) return "离开";
    return "好奇在读";
  }

  function scoreToPoint(score) {
    const numeric = Number(score);
    if (Number.isNaN(numeric)) return 0;
    if (numeric >= 97) return 4.0;
    if (numeric >= 93) return 3.9;
    if (numeric >= 90) return 3.7;
    if (numeric >= 87) return 3.3;
    if (numeric >= 83) return 3.0;
    if (numeric >= 80) return 2.7;
    if (numeric >= 77) return 2.3;
    if (numeric >= 73) return 2.0;
    if (numeric >= 70) return 1.7;
    if (numeric >= 67) return 1.3;
    if (numeric >= 63) return 1.0;
    return 0;
  }

  function calculateGpa(studentId) {
    const grades = state.grades.filter((grade) => grade.studentId === studentId && grade.countsGpa);
    const credits = grades.reduce((sum, grade) => sum + Number(grade.credit || 1), 0);
    if (!credits) return { gpa: null, count: 0, credits: 0 };
    const weighted = grades.reduce((sum, grade) => {
      return sum + scoreToPoint(grade.score) * Number(grade.credit || 1);
    }, 0);
    return {
      gpa: (weighted / credits).toFixed(2),
      count: grades.length,
      credits
    };
  }

  function calculateCourseScore(course, dailyScore, finalScore) {
    const daily = Number(dailyScore);
    const final = finalScore === "" || finalScore === undefined || finalScore === null ? null : Number(finalScore);
    if (Number.isNaN(daily)) return 0;
    if (final === null || Number.isNaN(final)) return Math.round(daily);
    const dailyWeight = Number(course?.dailyWeight ?? 60);
    const finalWeight = Number(course?.finalWeight ?? 40);
    const totalWeight = dailyWeight + finalWeight || 100;
    return Math.round(((daily * dailyWeight) + (final * finalWeight)) / totalWeight);
  }

  function clampWeight(value) {
    const numeric = Number(value);
    if (Number.isNaN(numeric)) return 0;
    return Math.max(0, Math.min(100, Math.round(numeric)));
  }

  function syncCourseWeights(changedField) {
    const dailyInput = $("#dailyWeightInput");
    const finalInput = $("#finalWeightInput");
    if (!dailyInput || !finalInput) return;
    if (changedField === "final") {
      const finalWeight = clampWeight(finalInput.value);
      finalInput.value = finalWeight;
      dailyInput.value = 100 - finalWeight;
      return;
    }
    const dailyWeight = clampWeight(dailyInput.value);
    dailyInput.value = dailyWeight;
    finalInput.value = 100 - dailyWeight;
  }

  function coursePaths(course) {
    if (Array.isArray(course.paths) && course.paths.length) return course.paths;
    if (course.path) return [course.path];
    return [];
  }

  function courseAttributes(course) {
    if (Array.isArray(course.attributes) && course.attributes.length) return course.attributes;
    if (course.attribute) return [course.attribute];
    return [];
  }

  function formatDateTime(value) {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat("zh-CN", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    }).format(date);
  }

  function courseTimeText(course) {
    if (course.startAt && course.endAt) return `${formatDateTime(course.startAt)} - ${formatDateTime(course.endAt)}`;
    if (course.startAt) return formatDateTime(course.startAt);
    return course.schedule || "未排期";
  }

  function formatTime(value) {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat("zh-CN", {
      hour: "2-digit",
      minute: "2-digit"
    }).format(date);
  }

  function sameDate(a, b) {
    return a.getFullYear() === b.getFullYear()
      && a.getMonth() === b.getMonth()
      && a.getDate() === b.getDate();
  }

  function startOfDay(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  }

  function dateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function adminHolidayLabels(date) {
    const day = startOfDay(date);
    return state.holidays
      .filter((holiday) => {
        const start = new Date(`${holiday.startDate || holiday.date}T00:00:00`);
        const end = new Date(`${holiday.endDate || holiday.date || holiday.startDate}T00:00:00`);
        if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return false;
        return day >= startOfDay(start) && day <= startOfDay(end);
      })
      .map((holiday) => holiday.label);
  }

  function hasAdminHoliday(start, end = start) {
    const cursor = new Date(start);
    const last = new Date(end);
    cursor.setHours(0, 0, 0, 0);
    last.setHours(0, 0, 0, 0);
    while (cursor <= last) {
      if (adminHolidayLabels(cursor).length) return true;
      cursor.setDate(cursor.getDate() + 1);
    }
    return false;
  }

  function courseOccursOnDate(course, date) {
    if (!course.startAt) return false;
    const start = new Date(course.startAt);
    const end = course.endAt ? new Date(course.endAt) : start;
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return false;
    const day = startOfDay(date);
    return day >= startOfDay(start) && day <= startOfDay(end);
  }

  function calendarEventTimeText(course, date) {
    if (!course.startAt) return "";
    const start = new Date(course.startAt);
    const end = course.endAt ? new Date(course.endAt) : null;
    if (!end || sameDate(start, end)) {
      return end ? `${formatTime(course.startAt)}-${formatTime(course.endAt)}` : formatTime(course.startAt);
    }
    if (sameDate(date, start)) return `开始 ${formatTime(course.startAt)}`;
    if (sameDate(date, end)) return `结束 ${formatTime(course.endAt)}`;
    return "持续中";
  }

  function calendarColorClass(course) {
    const key = [...courseAttributes(course), course.center, ...coursePaths(course), course.name].filter(Boolean).join("|");
    const paletteSize = 8;
    let hash = 0;
    for (let index = 0; index < key.length; index += 1) {
      hash = (hash + key.charCodeAt(index) * (index + 1)) % paletteSize;
    }
    return `event-color-${hash + 1}`;
  }

  function lunarDateText(date) {
    try {
      return new Intl.DateTimeFormat("zh-CN-u-ca-chinese", {
        month: "long",
        day: "numeric"
      }).format(date);
    } catch {
      return "";
    }
  }

  function holidayLabels(date) {
    const gregorian = `${date.getMonth() + 1}-${date.getDate()}`;
    const lunar = lunarDateText(date).replace("日", "");
    const labels = [];
    const solarFestivals = {
      "1-1": "元旦",
      "5-1": "劳动节",
      "10-1": "国庆"
    };
    const lunarFestivals = {
      "正月1": "春节",
      "正月15": "元宵",
      "五月5": "端午",
      "七月7": "七夕",
      "八月15": "中秋",
      "九月9": "重阳",
      "腊月8": "腊八"
    };
    if (solarFestivals[gregorian]) labels.push(solarFestivals[gregorian]);
    if (lunarFestivals[lunar]) labels.push(lunarFestivals[lunar]);
    return [...labels, ...adminHolidayLabels(date)];
  }

  function recurrenceText(course) {
    if (!course.repeatWeekly) return "";
    return course.repeatUntil ? `每周重复至 ${course.repeatUntil}` : "每周重复";
  }

  function courseOccurrences(course, rangeStart, rangeEnd) {
    if (!course.startAt) return [];
    const courseStart = new Date(course.startAt);
    const rawEnd = course.endAt ? new Date(course.endAt) : courseStart;
    if (Number.isNaN(courseStart.getTime()) || Number.isNaN(rawEnd.getTime())) return [];

    const duration = Math.max(0, rawEnd.getTime() - courseStart.getTime());
    const occurrences = [];
    if (!course.repeatWeekly) {
      if (startOfDay(rawEnd) >= startOfDay(rangeStart) && startOfDay(courseStart) <= startOfDay(rangeEnd)) {
        occurrences.push({ course, start: courseStart, end: rawEnd });
      }
      return occurrences;
    }

    const repeatUntil = course.repeatUntil ? new Date(`${course.repeatUntil}T23:59:59`) : rangeEnd;
    if (Number.isNaN(repeatUntil.getTime())) return [];

    const cursor = new Date(courseStart);
    while (startOfDay(cursor) <= startOfDay(rangeEnd) && cursor <= repeatUntil) {
      const occurrenceEnd = new Date(cursor.getTime() + duration);
      if (startOfDay(occurrenceEnd) >= startOfDay(rangeStart) && startOfDay(cursor) <= startOfDay(rangeEnd) && !hasAdminHoliday(cursor, occurrenceEnd)) {
        occurrences.push({ course, start: new Date(cursor), end: occurrenceEnd });
      }
      cursor.setDate(cursor.getDate() + 7);
    }
    return occurrences;
  }

  function getCreditPoint(record) {
    if (typeof record.points === "number") return record.points;
    const rule = state.creditRules.find((item) => item.label === record.status || item.id === record.ruleId);
    return rule ? Number(rule.points) : 0;
  }

  function calculateCredit(studentId) {
    const records = state.attendance
      .filter((record) => !studentId || record.studentId === studentId)
      .sort((a, b) => String(a.date || "").localeCompare(String(b.date || "")));
    if (!studentId) return records.reduce((sum, record) => sum + getCreditPoint(record), 0);
    return records.reduce((score, record) => {
      if (record.ruleId === "rule_fast_restore") return Math.max(score, 80);
      if (record.ruleId === "rule_revival_restore") return 100;
      return score + getCreditPoint(record);
    }, CREDIT_INITIAL_SCORE);
  }

  function calculateAverageCredit() {
    if (!state.students.length) return 0;
    const total = state.students.reduce((sum, student) => sum + calculateCredit(student.id), 0);
    return Math.round((total / state.students.length) * 10) / 10;
  }

  function creditBand(score) {
    if (score >= 150) return { label: "一日社长候选", tone: "teal", note: "可自荐或任命一人成为一日社长" };
    if (score >= 147) return { label: "奖学金信用达标", tone: "teal", note: "满足奖学金信用门槛，仍需 GPA 和请假条件" };
    if (score >= 130) return { label: "高级福利", tone: "teal", note: "可申请换宿舍机会、免交作业机会" };
    if (score >= 120) return { label: "通宵自习资格", tone: "teal", note: "可申请通宵自习 3 次" };
    if (score >= 110) return { label: "信用福利", tone: "gold", note: "可申请优先打饭、嘉宾午餐、做事课优先机会" };
    if (score >= 90) return { label: "正常观察", tone: "gold", note: "暂不能享受信用积分福利" };
    if (score >= 70) return { label: "学习项目受限", tone: "red", note: "不可申请长期替代性学习项目" };
    if (score >= 50) return { label: "手机停机坪", tone: "red", note: "上课期间需要放入停机坪" };
    if (score >= 30) return { label: "电子产品自律屋", tone: "red", note: "23:00 后电子产品需交由保管" };
    return { label: "复活赛", tone: "red", note: "强制进入复活赛，需重点跟进" };
  }

  function importCreditPolicyRules() {
    defaultCreditRules.forEach((rule) => {
      const existing = state.creditRules.find((item) => item.id === rule.id || item.label === rule.label);
      if (existing) {
        existing.label = rule.label;
        existing.points = rule.points;
      } else {
        state.creditRules.push(structuredClone(rule));
      }
    });
  }

  function matchesSearch(text) {
    if (!searchTerm) return true;
    return String(text).toLowerCase().includes(searchTerm.toLowerCase());
  }

  function renderNav() {
    const nav = $("#nav");
    nav.innerHTML = navItems.map((item) => `
      <button class="nav-button ${item.id === activeView ? "active" : ""}" data-view="${item.id}" type="button">
        <span class="nav-icon">${item.icon}</span>
        <span>${item.label}</span>
      </button>
    `).join("");
  }

  function switchView(viewId) {
    activeView = viewId;
    $all(".view").forEach((view) => {
      view.classList.toggle("active", view.id === `view-${viewId}`);
    });
    const active = $(`#view-${viewId}`);
    $("#pageTitle").textContent = active.dataset.title;
    $("#pageSubtitle").textContent = active.dataset.subtitle;
    renderNav();
    renderAll();
  }

  function fillSelects() {
    const studentOptions = state.students.map((student) => {
      return `<option value="${student.id}">${escapeHtml(student.name)} · ${escapeHtml(student.studentNo)}</option>`;
    }).join("");
    const courseOptions = state.courses.map((course) => {
      return `<option value="${course.id}">${escapeHtml(course.name)}</option>`;
    }).join("");
    const optionalCourseOptions = `<option value="">不关联课程/项目</option>${courseOptions}`;
    const creditRuleOptions = state.creditRules.map((rule) => {
      const points = Number(rule.points);
      const sign = points > 0 ? "+" : "";
      return `<option value="${rule.id}">${escapeHtml(rule.label)} (${sign}${escapeHtml(points)} 分)</option>`;
    }).join("");
    const academyOptions = state.academies.map((academy) => {
      return `<option value="${academy.id}">${escapeHtml(academy.name)}</option>`;
    }).join("");
    const academyOptionsWithNone = `<option value="">无学院</option>${academyOptions}`;

    $all("[data-student-select]").forEach((select) => {
      const current = select.value;
      select.innerHTML = studentOptions || `<option value="">请先新增学生</option>`;
      if (current) select.value = current;
    });
    $all("[data-course-select]").forEach((select) => {
      const current = select.value;
      select.innerHTML = courseOptions || `<option value="">请先新增课程</option>`;
      if (current) select.value = current;
    });
    $all("[data-course-select-optional]").forEach((select) => {
      const current = select.value;
      select.innerHTML = optionalCourseOptions;
      if (current) select.value = current;
    });
    $all("[data-credit-rule-select]").forEach((select) => {
      const current = select.value;
      select.innerHTML = creditRuleOptions || `<option value="">请先新增积分规则</option>`;
      if (current) select.value = current;
    });
    $all("[data-academy-select]").forEach((select) => {
      const current = select.value;
      select.innerHTML = academyOptionsWithNone;
      if (current) select.value = current;
    });
  }

  function renderStats() {
    $("#statStudents").textContent = state.students.length;
    $("#statMotivation").textContent = state.motivation.length;
    $("#statGrades").textContent = state.grades.length;
    $("#statCredit").textContent = calculateAverageCredit();
    $("#statFollowups").textContent = state.motivation.filter((record) => record.followUp).length;
  }

  function emptyIfNeeded(container) {
    if (container.children.length === 0) {
      container.innerHTML = $("#emptyTemplate").innerHTML;
    }
  }

  function syncAcademyFilterSet(filterSet) {
    const available = new Set(["", ...state.academies.map((academy) => academy.id)]);
    if (!filterSet.size) return new Set(available);
    const next = new Set([...filterSet].filter((academyId) => available.has(academyId)));
    return next.size ? next : new Set(available);
  }

  function syncStudentAcademyFilters() {
    selectedStudentAcademies = syncAcademyFilterSet(selectedStudentAcademies);
  }

  function syncReportAcademyFilters() {
    selectedReportAcademies = syncAcademyFilterSet(selectedReportAcademies);
  }

  function syncMotivationAcademyFilters() {
    selectedMotivationAcademies = syncAcademyFilterSet(selectedMotivationAcademies);
  }

  function syncCourseAcademyFilters() {
    selectedCourseAcademies = syncAcademyFilterSet(selectedCourseAcademies);
  }

  function syncCreditAcademyFilters() {
    selectedCreditAcademies = syncAcademyFilterSet(selectedCreditAcademies);
  }

  function syncGradeAcademyFilters() {
    selectedGradeAcademies = syncAcademyFilterSet(selectedGradeAcademies);
  }

  function filteredSortedStudents(statusSet, academySet) {
    return state.students
      .filter((student) => statusSet.has(normalizeStudentStatus(student.status)))
      .filter((student) => academySet.has(student.academyId || ""))
      .sort((a, b) => String(a.studentNo || "").localeCompare(String(b.studentNo || ""), "zh-CN", { numeric: true }));
  }

  function renderStudentStatusFilters() {
    const container = $("#studentStatusFilters");
    if (!container) return;
    container.innerHTML = studentStatuses.map((status) => `
      <label class="check-row">
        <input type="checkbox" value="${escapeHtml(status)}" ${selectedStudentStatuses.has(status) ? "checked" : ""}>
        ${escapeHtml(status)}
      </label>
    `).join("");
  }

  function renderStudentAcademyFilters() {
    const container = $("#studentAcademyFilters");
    if (!container) return;
    syncStudentAcademyFilters();
    const options = [{ id: "", name: "无学院" }, ...state.academies.map((academy) => ({ id: academy.id, name: academy.name }))];
    container.innerHTML = options.map((academy) => `
      <label class="check-row">
        <input type="checkbox" value="${escapeHtml(academy.id)}" ${selectedStudentAcademies.has(academy.id) ? "checked" : ""}>
        ${escapeHtml(academy.name)}
      </label>
    `).join("");
  }

  function renderStudentFilterControls(statusSelector, academySelector, statusSet, academySet) {
    const statusContainer = $(statusSelector);
    const academyContainer = $(academySelector);
    if (!statusContainer || !academyContainer) return;
    statusContainer.innerHTML = studentStatuses.map((status) => `
      <label class="check-row">
        <input type="checkbox" value="${escapeHtml(status)}" ${statusSet.has(status) ? "checked" : ""}>
        ${escapeHtml(status)}
      </label>
    `).join("");
    const academies = [{ id: "", name: "无学院" }, ...state.academies.map((academy) => ({ id: academy.id, name: academy.name }))];
    academyContainer.innerHTML = academies.map((academy) => `
      <label class="check-row">
        <input type="checkbox" value="${escapeHtml(academy.id)}" ${academySet.has(academy.id) ? "checked" : ""}>
        ${escapeHtml(academy.name)}
      </label>
    `).join("");
  }

  function renderReportFilters() {
    const statusContainer = $("#reportStatusFilters");
    const academyContainer = $("#reportAcademyFilters");
    if (!statusContainer || !academyContainer) return;
    syncReportAcademyFilters();
    statusContainer.innerHTML = studentStatuses.map((status) => `
      <label class="check-row">
        <input type="checkbox" value="${escapeHtml(status)}" ${selectedReportStatuses.has(status) ? "checked" : ""}>
        ${escapeHtml(status)}
      </label>
    `).join("");
    const academies = [{ id: "", name: "无学院" }, ...state.academies.map((academy) => ({ id: academy.id, name: academy.name }))];
    academyContainer.innerHTML = academies.map((academy) => `
      <label class="check-row">
        <input type="checkbox" value="${escapeHtml(academy.id)}" ${selectedReportAcademies.has(academy.id) ? "checked" : ""}>
        ${escapeHtml(academy.name)}
      </label>
    `).join("");
  }

  function renderReportStudentSelect() {
    const select = $("#reportStudent");
    if (!select) return;
    const current = select.value;
    const students = state.students
      .filter((student) => selectedReportStatuses.has(normalizeStudentStatus(student.status)))
      .filter((student) => selectedReportAcademies.has(student.academyId || ""))
      .sort((a, b) => String(a.studentNo || "").localeCompare(String(b.studentNo || ""), "zh-CN", { numeric: true }));
    select.innerHTML = students.length
      ? students.map((student) => `<option value="${student.id}">${escapeHtml(student.name)} · ${escapeHtml(student.studentNo)}</option>`).join("")
      : `<option value="">没有符合筛选的学生</option>`;
    if (current && students.some((student) => student.id === current)) select.value = current;
  }

  function renderMotivationFilters() {
    const statusContainer = $("#motivationStatusFilters");
    const academyContainer = $("#motivationAcademyFilters");
    if (!statusContainer || !academyContainer) return;
    syncMotivationAcademyFilters();
    statusContainer.innerHTML = studentStatuses.map((status) => `
      <label class="check-row">
        <input type="checkbox" value="${escapeHtml(status)}" ${selectedMotivationStatuses.has(status) ? "checked" : ""}>
        ${escapeHtml(status)}
      </label>
    `).join("");
    const academies = [{ id: "", name: "无学院" }, ...state.academies.map((academy) => ({ id: academy.id, name: academy.name }))];
    academyContainer.innerHTML = academies.map((academy) => `
      <label class="check-row">
        <input type="checkbox" value="${escapeHtml(academy.id)}" ${selectedMotivationAcademies.has(academy.id) ? "checked" : ""}>
        ${escapeHtml(academy.name)}
      </label>
    `).join("");
  }

  function motivationStudentMatchesFilters(student) {
    return Boolean(student)
      && selectedMotivationStatuses.has(normalizeStudentStatus(student.status))
      && selectedMotivationAcademies.has(student.academyId || "");
  }

  function renderMotivationStudentSelect() {
    const select = $("#motivationStudentSelect");
    if (!select) return;
    const current = select.value;
    const students = state.students
      .filter(motivationStudentMatchesFilters)
      .sort((a, b) => String(a.studentNo || "").localeCompare(String(b.studentNo || ""), "zh-CN", { numeric: true }));
    select.innerHTML = students.length
      ? students.map((student) => `<option value="${student.id}">${escapeHtml(student.name)} · ${escapeHtml(student.studentNo)}</option>`).join("")
      : `<option value="">没有符合筛选的学生</option>`;
    if (current && students.some((student) => student.id === current)) select.value = current;
  }

  function renderCourseStudentFilters() {
    const statusContainer = $("#courseStatusFilters");
    const academyContainer = $("#courseAcademyFilters");
    if (!statusContainer || !academyContainer) return;
    syncCourseAcademyFilters();
    statusContainer.innerHTML = studentStatuses.map((status) => `
      <label class="check-row">
        <input type="checkbox" value="${escapeHtml(status)}" ${selectedCourseStatuses.has(status) ? "checked" : ""}>
        ${escapeHtml(status)}
      </label>
    `).join("");
    const academies = [{ id: "", name: "无学院" }, ...state.academies.map((academy) => ({ id: academy.id, name: academy.name }))];
    academyContainer.innerHTML = academies.map((academy) => `
      <label class="check-row">
        <input type="checkbox" value="${escapeHtml(academy.id)}" ${selectedCourseAcademies.has(academy.id) ? "checked" : ""}>
        ${escapeHtml(academy.name)}
      </label>
    `).join("");
  }

  function renderCourseStudentPreview() {
    const container = $("#courseStudentPreview");
    if (!container) return;
    const students = state.students
      .filter((student) => selectedCourseStatuses.has(normalizeStudentStatus(student.status)))
      .filter((student) => selectedCourseAcademies.has(student.academyId || ""))
      .sort((a, b) => String(a.studentNo || "").localeCompare(String(b.studentNo || ""), "zh-CN", { numeric: true }));
    container.innerHTML = `
      <div class="muted-text">符合筛选学生：${students.length} 人</div>
      <div class="student-chip-row">
        ${students.slice(0, 18).map((student) => `<span>${escapeHtml(student.name)} · ${escapeHtml(student.studentNo)}</span>`).join("")}
        ${students.length > 18 ? `<span>+${students.length - 18} 人</span>` : ""}
      </div>
    `;
  }

  function renderCreditFilters() {
    syncCreditAcademyFilters();
    renderStudentFilterControls("#creditStatusFilters", "#creditAcademyFilters", selectedCreditStatuses, selectedCreditAcademies);
  }

  function renderCreditStudentSelect() {
    const select = $("#creditStudentSelect");
    if (!select) return;
    const current = select.value;
    const students = filteredSortedStudents(selectedCreditStatuses, selectedCreditAcademies);
    select.innerHTML = students.length
      ? students.map((student) => `<option value="${student.id}">${escapeHtml(student.name)} · ${escapeHtml(student.studentNo)}</option>`).join("")
      : `<option value="">没有符合筛选的学生</option>`;
    if (current && students.some((student) => student.id === current)) select.value = current;
  }

  function creditStudentMatchesFilters(student) {
    return Boolean(student)
      && selectedCreditStatuses.has(normalizeStudentStatus(student.status))
      && selectedCreditAcademies.has(student.academyId || "");
  }

  function renderGradeFilters() {
    syncGradeAcademyFilters();
    renderStudentFilterControls("#gradeStatusFilters", "#gradeAcademyFilters", selectedGradeStatuses, selectedGradeAcademies);
  }

  function renderGradeStudentSelect() {
    const select = $("#gradeStudentSelect");
    if (!select) return;
    const current = select.value;
    const students = filteredSortedStudents(selectedGradeStatuses, selectedGradeAcademies);
    select.innerHTML = students.length
      ? students.map((student) => `<option value="${student.id}">${escapeHtml(student.name)} · ${escapeHtml(student.studentNo)}</option>`).join("")
      : `<option value="">没有符合筛选的学生</option>`;
    if (current && students.some((student) => student.id === current)) select.value = current;
  }

  function gradeStudentMatchesFilters(student) {
    return Boolean(student)
      && selectedGradeStatuses.has(normalizeStudentStatus(student.status))
      && selectedGradeAcademies.has(student.academyId || "");
  }

  function renderStudents() {
    const list = $("#studentList");
    list.innerHTML = "";
    state.students
      .filter((student) => selectedStudentStatuses.has(normalizeStudentStatus(student.status)))
      .filter((student) => selectedStudentAcademies.has(student.academyId || ""))
      .filter((student) => matchesSearch(`${student.name} ${student.englishName} ${student.studentNo} ${student.tags}`))
      .sort((a, b) => String(a.studentNo || "").localeCompare(String(b.studentNo || ""), "zh-CN", { numeric: true }))
      .forEach((student) => {
        const gpa = calculateGpa(student.id);
        const academy = getAcademy(student.academyId);
        const item = document.createElement("article");
        item.className = "student-item";
        item.innerHTML = `
          <div>
            <div class="item-title">${escapeHtml(student.name)} ${student.englishName ? ` / ${escapeHtml(student.englishName)}` : ""}</div>
            <div class="item-meta">
              <span class="pill teal">${escapeHtml(student.studentNo)}</span>
              <span class="academy-pill ${academyClass(academy)}">${escapeHtml(academy?.name || "未分学院")}</span>
              <span>${escapeHtml(student.program)}</span>
              <span>${escapeHtml(normalizeStudentStatus(student.status))}</span>
              <span>GPA：${gpa.gpa ?? "暂无"}</span>
            </div>
            <p class="muted-text">${escapeHtml(student.tags || "暂无标签")}</p>
          </div>
          <div class="item-actions">
            <button class="secondary-button small-button" data-edit-student="${student.id}" type="button">编辑</button>
            <button class="delete-button" data-delete-student="${student.id}" type="button">删除</button>
          </div>
        `;
        list.append(item);
      });
    emptyIfNeeded(list);
  }

  function renderStudentExportFields() {
    const container = $("#studentExportFields");
    container.innerHTML = studentExportFields.map((field) => `
      <label class="check-row">
        <input type="checkbox" value="${field.key}" checked>
        ${escapeHtml(field.label)}
      </label>
    `).join("");
  }

  function studentFieldValue(student, key) {
    const academy = getAcademy(student.academyId);
    const gpa = calculateGpa(student.id);
    const values = {
      ...student,
      academy: academy?.name || "",
      gpa: gpa.gpa ?? "",
      credit: calculateCredit(student.id)
    };
    return values[key] ?? "";
  }

  function exportStudents() {
    const selected = $all("#studentExportFields input:checked").map((input) => input.value);
    if (!selected.length) {
      window.alert("请至少选择一个导出字段。");
      return;
    }
    const headers = selected.map((key) => studentExportFields.find((field) => field.key === key)?.label || key);
    const rows = state.students.map((student) => selected.map((key) => csvEscape(studentFieldValue(student, key))).join(","));
    const csv = `\uFEFF${headers.map(csvEscape).join(",")}\n${rows.join("\n")}`;
    downloadText(`CURIONESTY-学生名单-${new Date().toISOString().slice(0, 10)}.csv`, csv);
  }

  function downloadStudentTemplate() {
    const headers = ["学号", "中文名", "英文名", "年龄", "当前项目", "学院", "状态", "标签", "备注"];
    const sample = ["C2026003", "示例学生", "Example", "14", "好奇学习社区", state.academies[0]?.name || "红学院", "好奇在读", "阅读强", "这里写备注"];
    const csv = `\uFEFF${headers.map(csvEscape).join(",")}\n${sample.map(csvEscape).join(",")}`;
    downloadText("CURIONESTY-学生导入模板.csv", csv);
  }

  function normalizeHeader(header) {
    const map = {
      "学号": "studentNo",
      "学生编号": "studentNo",
      "中文名": "name",
      "姓名": "name",
      "英文名": "englishName",
      "English Name": "englishName",
      "年龄": "age",
      "当前项目": "program",
      "项目": "program",
      "学院": "academy",
      "学院标签": "academy",
      "状态": "status",
      "标签": "tags",
      "备注": "notes"
    };
    return map[header] || header;
  }

  function academyIdFromName(name) {
    const value = String(name || "").trim();
    if (!value || ["无", "无学院", "未分学院", "none", "None", "-"].includes(value)) return "";
    const found = state.academies.find((academy) => academy.name === value || academy.color === value);
    return found?.id || "";
  }

  function rowsToStudents(rows) {
    if (rows.length < 2) return [];
    const headers = rows[0].map(normalizeHeader);
    return rows.slice(1).map((row) => {
      const item = {};
      headers.forEach((header, index) => {
        item[header] = row[index] || "";
      });
      const status = normalizeStudentStatus(item.status);
      return {
        studentNo: item.studentNo,
        name: item.name,
        englishName: item.englishName || "",
        age: item.age || "",
        program: item.program || "好奇学习社区",
        academyId: ["毕业", "离开"].includes(status) ? "" : academyIdFromName(item.academy),
        status,
        tags: item.tags || "",
        notes: item.notes || ""
      };
    }).filter((student) => student.studentNo && student.name);
  }

  function previewStudentImport(students) {
    const preview = $("#studentImportPreview");
    const newCount = students.filter((student) => !state.students.some((item) => item.studentNo === student.studentNo)).length;
    const updateCount = students.length - newCount;
    preview.innerHTML = `
      <div class="import-summary">
        <strong>识别到 ${students.length} 位学生</strong>
        <span>新增 ${newCount} 位，更新 ${updateCount} 位</span>
        <button class="primary-button small-button" id="confirmStudentImport" type="button">确认导入</button>
      </div>
      <div class="mini-table">
        ${students.slice(0, 8).map((student) => `
          <div>
            <span>${escapeHtml(student.studentNo)}</span>
            <strong>${escapeHtml(student.name)}</strong>
            <span>${escapeHtml(getAcademy(student.academyId)?.name || "未分学院")}</span>
          </div>
        `).join("")}
      </div>
    `;
    $("#confirmStudentImport").addEventListener("click", () => importStudents(students));
  }

  function importStudents(students) {
    students.forEach((student) => {
      const existing = state.students.find((item) => item.studentNo === student.studentNo);
      if (existing) {
        Object.assign(existing, student);
      } else {
        state.students.push({ id: id("stu"), ...student });
      }
    });
    saveState();
    $("#studentImportFile").value = "";
    $("#studentImportPreview").innerHTML = `<div class="empty-state">导入完成：${students.length} 位学生已写入学生档案。</div>`;
    renderAll();
  }

  function renderMotivation() {
    const list = $("#motivationList");
    const recent = $("#recentRecords");
    const followups = $("#followupList");
    list.innerHTML = "";
    recent.innerHTML = "";
    followups.innerHTML = "";

    const records = [...state.motivation].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    records
      .filter((record) => {
        const student = getStudent(record.studentId);
        return motivationStudentMatchesFilters(student)
          && matchesSearch(`${student?.name} ${record.teacher} ${record.scene} ${record.tags} ${record.fact}`);
      })
      .forEach((record) => {
        const element = motivationItem(record);
        list.append(element.cloneNode(true));
        if (recent.children.length < 6) recent.append(element.cloneNode(true));
        if (record.followUp) followups.append(element);
      });

    emptyIfNeeded(list);
    emptyIfNeeded(recent);
    emptyIfNeeded(followups);
  }

  function motivationItem(record) {
    const student = getStudent(record.studentId);
    const wrapper = document.createElement("article");
    wrapper.className = "record-item";
    wrapper.innerHTML = `
      <div class="item-title">${escapeHtml(student?.name || "未知学生")} · ${escapeHtml(record.scene)}</div>
      <div class="item-meta">
        ${record.dimensions.map((dimension) => `<span class="pill teal">${escapeHtml(dimension)}</span>`).join("")}
        <span class="pill ${record.statusTone === "需要支持" ? "gold" : record.statusTone === "明显波动" ? "red" : ""}">${escapeHtml(record.statusTone)}</span>
        <span>${escapeHtml(record.teacher)}</span>
        <span>${formatDate(record.createdAt)}</span>
      </div>
      <p>${escapeHtml(record.fact)}</p>
      <p class="muted-text">行动建议：${escapeHtml(record.suggestion || "暂无")}</p>
    `;
    return wrapper;
  }

  function renderCourses() {
    const list = $("#courseList");
    list.innerHTML = "";
    state.courses
      .filter((course) => matchesSearch(`${course.name} ${course.center} ${coursePaths(course).join(" ")} ${courseAttributes(course).join(" ")} ${course.teacher} ${courseTimeText(course)}`))
      .forEach((course) => {
        const paths = coursePaths(course);
        const attributes = courseAttributes(course);
        const item = document.createElement("article");
        item.className = "record-item";
        item.innerHTML = `
          <div class="item-title">${escapeHtml(course.name)}</div>
          <div class="item-meta">
            <span class="pill teal">${escapeHtml(course.center)}</span>
            ${paths.map((path) => `<span class="pill gold">${escapeHtml(path)}</span>`).join("")}
            ${attributes.map((attribute) => `<span class="pill violet">${escapeHtml(attribute)}</span>`).join("")}
            <span>${escapeHtml(course.teacher || "未设老师")}</span>
            <span>规则：${escapeHtml(course.ruleOwner || course.teacher || "未指定")}</span>
            <span>日常 ${escapeHtml(course.dailyWeight ?? 60)}% / 期末 ${escapeHtml(course.finalWeight ?? 40)}%</span>
            <span>${escapeHtml(courseTimeText(course))}</span>
            ${course.repeatWeekly ? `<span class="pill blue">${escapeHtml(recurrenceText(course))}</span>` : ""}
          </div>
          <div class="item-actions" style="margin-top: 10px;">
            <button class="secondary-button small-button" data-edit-course="${course.id}" type="button">编辑</button>
            <button class="delete-button" data-delete-course="${course.id}" type="button">删除</button>
          </div>
          <p class="muted-text">${escapeHtml(course.description || "暂无说明")}</p>
        `;
        list.append(item);
      });
    emptyIfNeeded(list);
  }

  function renderCalendar() {
    const calendar = $("#calendarList");
    const year = calendarCursor.getFullYear();
    const month = calendarCursor.getMonth();
    const firstDay = new Date(year, month, 1);
    const start = new Date(firstDay);
    start.setDate(1 - firstDay.getDay());
    const monthTitle = new Intl.DateTimeFormat("zh-CN", { year: "numeric", month: "long" }).format(firstDay);
    const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
    const scheduledCourses = state.courses.filter((course) => course.startAt);

    const cells = Array.from({ length: 42 }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      const isOtherMonth = date.getMonth() !== month;
      const isToday = sameDate(date, new Date());
      const lunar = lunarDateText(date);
      const column = (index % 7) + 1;
      const row = Math.floor(index / 7) + 1;
      return `
        <div class="calendar-cell ${isOtherMonth ? "muted" : ""} ${isToday ? "today" : ""}" style="grid-column:${column};grid-row:${row};">
          <div class="calendar-day-number">${date.getDate()}</div>
          ${showLunarCalendar ? `
            <div class="calendar-lunar">${escapeHtml(lunar)}</div>
          ` : ""}
        </div>
      `;
    }).join("");

    const weekSlotCounts = Array(6).fill(0);
    const viewEnd = new Date(start);
    viewEnd.setDate(start.getDate() + 41);
    const holidayEvents = state.holidays.map((holiday) => {
      const holidayStart = new Date(`${holiday.startDate || holiday.date}T00:00:00`);
      const holidayEnd = new Date(`${holiday.endDate || holiday.date || holiday.startDate}T00:00:00`);
      if (Number.isNaN(holidayStart.getTime()) || Number.isNaN(holidayEnd.getTime())) return null;
      return {
        type: "holiday",
        name: holiday.label,
        start: holidayStart,
        end: holidayEnd,
        className: "event-holiday",
        title: `${holiday.label} · ${dateKey(holidayStart)}${sameDate(holidayStart, holidayEnd) ? "" : ` - ${dateKey(holidayEnd)}`}`
      };
    }).filter(Boolean);
    const courseEvents = scheduledCourses.flatMap((course) => courseOccurrences(course, start, viewEnd).map((occurrence) => ({
      type: "course",
      name: course.name,
      start: occurrence.start,
      end: occurrence.end,
      course,
      className: calendarColorClass(course),
      title: `${course.name} · ${courseTimeText(course)}${course.repeatWeekly ? ` · ${recurrenceText(course)}` : ""}`
    })));
    const calendarEvents = [...holidayEvents, ...courseEvents].sort((a, b) => startOfDay(a.start) - startOfDay(b.start));
    const eventBars = calendarEvents.flatMap((eventItem) => {
      const clampedStart = Math.max(startOfDay(eventItem.start), startOfDay(start));
      const clampedEnd = Math.min(startOfDay(eventItem.end), startOfDay(viewEnd));
      if (clampedEnd < startOfDay(start) || clampedStart > startOfDay(viewEnd)) return [];
      const startIndex = Math.round((clampedStart - startOfDay(start)) / 86400000);
      const endIndex = Math.round((clampedEnd - startOfDay(start)) / 86400000);
      const segments = [];
      const startWeek = Math.floor(startIndex / 7);
      const endWeek = Math.floor(endIndex / 7);
      for (let week = startWeek; week <= endWeek; week += 1) {
        const segmentStart = Math.max(startIndex, week * 7);
        const segmentEnd = Math.min(endIndex, week * 7 + 6);
        const slot = Math.min(weekSlotCounts[week]++, 3);
        const segmentDate = new Date(start);
        segmentDate.setDate(start.getDate() + segmentStart);
        segments.push(`
          <div class="calendar-event ${eventItem.className}" style="grid-column:${(segmentStart % 7) + 1} / ${(segmentEnd % 7) + 2};grid-row:${week + 1};--event-slot:${slot};" title="${escapeHtml(eventItem.title)}">
            <span>${eventItem.type === "holiday" ? "假期" : escapeHtml(calendarEventTimeText({ ...eventItem.course, startAt: eventItem.start.toISOString(), endAt: eventItem.end.toISOString() }, segmentDate))}</span>
            <strong>${escapeHtml(eventItem.name)}</strong>
          </div>
        `);
      }
      return segments;
    }).join("");

    calendar.innerHTML = `
      <div class="calendar-toolbar">
        <strong>${escapeHtml(monthTitle)}</strong>
        <div class="calendar-nav">
          <button class="calendar-nav-button" data-calendar-prev type="button" aria-label="上月">‹</button>
          <button class="calendar-today-button" data-calendar-today type="button">今天</button>
          <button class="calendar-nav-button" data-calendar-next type="button" aria-label="下月">›</button>
        </div>
      </div>
      <label class="calendar-toggle">
        <input type="checkbox" data-calendar-lunar ${showLunarCalendar ? "checked" : ""}>
        显示农历 / 传统节假日
      </label>
      <div class="calendar-weekdays">
        ${weekdays.map((day) => `<span>${day}</span>`).join("")}
      </div>
      <div class="calendar-grid">${cells}${eventBars}</div>
    `;
  }

  function renderAttendanceTable() {
    const table = $("#attendanceTable");
    const ruleOptions = state.creditRules.map((rule) => {
      const sign = Number(rule.points) > 0 ? "+" : "";
      return `<option value="${rule.id}">${escapeHtml(rule.label)} (${sign}${escapeHtml(rule.points)} 分)</option>`;
    }).join("");
    const students = filteredSortedStudents(selectedCreditStatuses, selectedCreditAcademies);
    table.innerHTML = students.map((student) => `
      <div class="attendance-row">
        <strong>${escapeHtml(student.name)} · ${escapeHtml(student.studentNo)}</strong>
        <select name="attendance_${student.id}">
          ${ruleOptions || `<option value="">请先新增积分规则</option>`}
        </select>
      </div>
    `).join("");
    emptyIfNeeded(table);
  }

  function renderCreditRules() {
    const list = $("#creditRuleList");
    list.innerHTML = "";
    if (!state.creditRules.length) {
      emptyIfNeeded(list);
      return;
    }
    const ruleCard = (rule) => {
      const points = Number(rule.points);
      return `
        <article class="record-item">
        <div class="student-item" style="border: 0; padding: 0;">
          <div>
            <div class="item-title">${escapeHtml(rule.label)}</div>
            <div class="item-meta">
              <span class="pill ${points < 0 ? "red" : points > 0 ? "teal" : "gold"}">${points > 0 ? "+" : ""}${escapeHtml(points)} 分</span>
            </div>
          </div>
          <div class="item-actions">
            <button class="secondary-button small-button" data-edit-credit-rule="${rule.id}" type="button">编辑</button>
            <button class="delete-button" data-delete-credit-rule="${rule.id}" type="button">删除</button>
          </div>
        </div>
        </article>
      `;
    };
    const primaryRules = state.creditRules.slice(0, 5);
    const hiddenRules = state.creditRules.slice(5);
    list.innerHTML = `
      <div class="rule-featured-list">
        ${primaryRules.map(ruleCard).join("")}
      </div>
      ${hiddenRules.length ? `
        <details class="rule-library-details">
          <summary>展开其他 ${hiddenRules.length} 条规则</summary>
          <div class="rule-library-list">
            ${hiddenRules.map(ruleCard).join("")}
          </div>
        </details>
      ` : ""}
    `;
  }

  function renderCreditPolicy() {
    const view = $("#creditPolicyView");
    const form = $("#creditPolicyForm");
    if (!view || !form) return;
    const content = state.creditPolicy || defaultCreditPolicy;
    const sections = content
      .split(/\n(?=[一二三四五六七八九十]+、|# )/)
      .map((section) => section.trim())
      .filter(Boolean);
    const summaryCards = [
      { title: "初始分", body: "每学期 100 分起算，代表学生在社区中的可信赖程度。" },
      { title: "加分", body: "整周无违约 +7；单日无违约 +1；月结坚持行动 +8 至 +15；服务社区按 2 分或 5 分项目申请。" },
      { title: "扣分", body: "迟到、缺席、任务延期、电子设备无关使用、卫生/公共空间违约等按规则自动扣分。" },
      { title: "影响线", body: "低于 110 无福利；低于 90 限制长期替代学习；低于 70 上课手机停机坪；低于 30 进入复活赛。" },
      { title: "恢复机制", body: "70 分以下可申请快速加分，成功恢复至 80；复活成功恢复至 100。" },
      { title: "公示与奖学金", body: "每两周公示一次；奖学金信用门槛为 147 分以上，并需满足 GPA、请假等条件。" }
    ];
    view.innerHTML = `
      <div class="policy-summary-grid">
        ${summaryCards.map((card) => `
          <article class="policy-summary-card">
            <strong>${escapeHtml(card.title)}</strong>
            <p>${escapeHtml(card.body)}</p>
          </article>
        `).join("")}
      </div>
      <details class="policy-full-details">
        <summary>展开完整信用积分规则 2.6</summary>
        <div class="policy-sections">
          ${sections.map((section) => {
      const [title, ...body] = section.split("\n");
      return `
        <article class="policy-section">
          <h3>${escapeHtml(title.replace(/^#\s*/, ""))}</h3>
          <p>${escapeHtml(body.join("\n")).replaceAll("\n", "<br>")}</p>
        </article>
      `;
    }).join("")}
        </div>
      </details>
    `;
    form.elements.content.value = content;
  }

  function renderCreditAnalytics() {
    const container = $("#creditAnalytics");
    if (!container) return;
    const visibleStudents = filteredSortedStudents(selectedCreditStatuses, selectedCreditAcademies);
    const rows = visibleStudents.map((student) => {
      const score = calculateCredit(student.id);
      return {
        student,
        score,
        records: state.attendance.filter((record) => record.studentId === student.id).length,
        band: creditBand(score)
      };
    }).sort((a, b) => b.score - a.score);
    const average = rows.length
      ? Math.round((rows.reduce((sum, row) => sum + row.score, 0) / rows.length) * 10) / 10
      : 0;
    const highest = rows[0]?.score ?? 0;
    const lowest = rows[rows.length - 1]?.score ?? 0;
    const below90 = rows.filter((row) => row.score < 90).length;
    const below70 = rows.filter((row) => row.score < 70).length;
    const revival = rows.filter((row) => row.score < 30).length;
    const topThree = rows.slice(0, 3);

    container.innerHTML = `
      <div class="stats-grid compact-stats">
        <div class="stat-block"><span>平均分</span><strong>${escapeHtml(average)}</strong></div>
        <div class="stat-block"><span>最高分</span><strong>${escapeHtml(highest)}</strong></div>
        <div class="stat-block"><span>最低分</span><strong>${escapeHtml(lowest)}</strong></div>
        <div class="stat-block"><span>90分以下</span><strong>${below90}</strong></div>
        <div class="stat-block"><span>70分以下</span><strong>${below70}</strong></div>
        <div class="stat-block"><span>复活风险</span><strong>${revival}</strong></div>
      </div>
      <div class="record-list" style="margin-top: 14px;">
        <article class="record-item">
          <div class="item-title">信用积分 2.6 公式</div>
          <div class="item-meta">
            <span class="pill gold">学期初始 100 分</span>
            <span class="pill teal">登记加分项自动累加</span>
            <span class="pill red">登记违约项自动扣减</span>
            <span class="pill gold">快速加分成功恢复至 80</span>
            <span class="pill gold">复活成功恢复至 100</span>
          </div>
          <p class="muted-text">老师日常只选择规则标签；连续一周、月结项目、快速加分、复活等由生活老师或项目负责人审核后登记。</p>
        </article>
        <article class="record-item">
          <div class="item-title">信用基金参考：当前前三名</div>
          <div class="item-meta">
            ${topThree.length ? topThree.map((row, index) => `<span class="pill teal">${index + 1}. ${escapeHtml(row.student.name)} ${escapeHtml(row.score)}分</span>`).join("") : `<span>暂无学生</span>`}
          </div>
        </article>
        ${rows.map((row) => `
          <article class="record-item">
            <div class="student-item" style="border: 0; padding: 0;">
              <div>
                <div class="item-title">${escapeHtml(row.student.name)} · ${escapeHtml(row.score)} 分</div>
                <div class="item-meta">
                  <span class="pill ${row.band.tone}">${escapeHtml(row.band.label)}</span>
                  <span>${row.records} 条加减记录</span>
                  <span>${escapeHtml(row.band.note)}</span>
                </div>
              </div>
            </div>
          </article>
        `).join("")}
      </div>
    `;
  }

  function renderAcademies() {
    const list = $("#academyList");
    list.innerHTML = "";
    state.academies.forEach((academy) => {
      const assignedCount = state.students.filter((student) => student.academyId === academy.id).length;
      const item = document.createElement("article");
      item.className = "record-item";
      item.innerHTML = `
        <div class="student-item" style="border: 0; padding: 0;">
          <div>
            <div class="item-meta">
              <span class="academy-pill ${academyClass(academy)}">${escapeHtml(academy.name)}</span>
              <span>${escapeHtml(academy.color)}</span>
              <span>${assignedCount} 位学生</span>
            </div>
          </div>
          <div class="item-actions">
            <button class="secondary-button small-button" data-edit-academy="${academy.id}" type="button">编辑</button>
            <button class="delete-button" data-delete-academy="${academy.id}" type="button">删除</button>
          </div>
        </div>
      `;
      list.append(item);
    });
    emptyIfNeeded(list);
  }

  function renderHolidays() {
    const list = $("#holidayList");
    if (!list) return;
    list.innerHTML = "";
    [...state.holidays]
      .sort((a, b) => String(a.startDate || a.date).localeCompare(String(b.startDate || b.date)))
      .forEach((holiday) => {
        const start = holiday.startDate || holiday.date;
        const end = holiday.endDate || holiday.date || holiday.startDate;
        const item = document.createElement("article");
        item.className = "record-item";
        item.innerHTML = `
          <div class="student-item" style="border: 0; padding: 0;">
            <div>
              <div class="item-title">${escapeHtml(holiday.label)}</div>
              <div class="item-meta">
                <span class="pill red">${escapeHtml(start)}${end && end !== start ? ` - ${escapeHtml(end)}` : ""}</span>
                <span>重复课程自动跳过</span>
              </div>
            </div>
            <button class="delete-button" data-delete-holiday="${holiday.id}" type="button">删除</button>
          </div>
        `;
        list.append(item);
      });
    emptyIfNeeded(list);
  }

  function setAcademyEditMode(academyId) {
    editingAcademyId = academyId;
    const form = $("#academyForm");
    if (!form) return;
    const submit = $("#academySubmitButton");
    const cancel = $("#cancelAcademyEdit");
    const academy = academyId ? getAcademy(academyId) : null;

    if (!academy) {
      editingAcademyId = null;
      form.reset();
      submit.textContent = "新增学院";
      cancel.hidden = true;
      return;
    }

    form.elements.name.value = academy.name || "";
    form.elements.color.value = academy.color || "red";
    submit.textContent = "保存学院";
    cancel.hidden = false;
  }

  function setCreditRuleEditMode(ruleId) {
    editingCreditRuleId = ruleId;
    const form = $("#creditRuleForm");
    if (!form) return;
    const submit = $("#creditRuleSubmitButton");
    const cancel = $("#cancelCreditRuleEdit");
    const rule = ruleId ? state.creditRules.find((item) => item.id === ruleId) : null;

    if (!rule) {
      editingCreditRuleId = null;
      resetForm(form);
      submit.textContent = "保存规则";
      cancel.hidden = true;
      return;
    }

    form.elements.label.value = rule.label || "";
    form.elements.points.value = rule.points ?? 0;
    submit.textContent = "保存修改";
    cancel.hidden = false;
  }

  function renderAttendance() {
    const list = $("#attendanceList");
    list.innerHTML = "";
    [...state.attendance].reverse().filter((record) => {
      return creditStudentMatchesFilters(getStudent(record.studentId));
    }).slice(0, 12).forEach((record) => {
      const student = getStudent(record.studentId);
      const course = getCourse(record.courseId);
      const points = getCreditPoint(record);
      const item = document.createElement("article");
      item.className = "record-item";
      item.innerHTML = `
        <div class="item-title">${escapeHtml(student?.name || "未知学生")} · ${escapeHtml(record.status)}</div>
        <div class="item-meta">
          <span class="pill ${points < 0 ? "red" : points > 0 ? "teal" : "gold"}">${points > 0 ? "+" : ""}${points} 分</span>
          <span>${escapeHtml(course?.name || "未知课程")}</span>
          <span>${escapeHtml(record.date)}</span>
          <span>${escapeHtml(record.teacher || "未记录老师")}</span>
        </div>
        ${record.note ? `<p class="muted-text">备注：${escapeHtml(record.note)}</p>` : ""}
      `;
      list.append(item);
    });
    emptyIfNeeded(list);
  }

  function renderGrades() {
    const summary = $("#gpaSummary");
    const list = $("#gradeList");
    summary.innerHTML = "";
    list.innerHTML = "";

    filteredSortedStudents(selectedGradeStatuses, selectedGradeAcademies).forEach((student) => {
      if (!matchesSearch(`${student.name} ${student.studentNo}`)) return;
      const gpa = calculateGpa(student.id);
      const item = document.createElement("article");
      item.className = "gpa-item";
      item.innerHTML = `
        <div class="item-title">${escapeHtml(student.name)}</div>
        <div class="gpa-score">${gpa.gpa ?? "--"}</div>
        <div class="item-meta">
          <span>计入课程：${gpa.count}</span>
          <span>学分：${gpa.credits}</span>
        </div>
      `;
      summary.append(item);
    });

    [...state.grades].reverse().forEach((grade) => {
      const student = getStudent(grade.studentId);
      const course = getCourse(grade.courseId);
      if (!gradeStudentMatchesFilters(student)) return;
      if (!matchesSearch(`${student?.name} ${course?.name} ${grade.teacher} ${grade.comment}`)) return;
      const snapshot = grade.ruleSnapshot || {
        ruleOwner: course?.ruleOwner || course?.teacher || grade.teacher,
        dailyWeight: course?.dailyWeight ?? 60,
        finalWeight: course?.finalWeight ?? 40
      };
      const item = document.createElement("article");
      item.className = "record-item";
      item.innerHTML = `
        <div class="item-title">${escapeHtml(student?.name || "未知学生")} · ${escapeHtml(course?.name || "未知课程")}</div>
        <div class="item-meta">
          <span class="pill teal">总评 ${escapeHtml(String(grade.score))} 分</span>
          <span>日常：${escapeHtml(grade.dailyScore ?? grade.score)} 分</span>
          <span>期末：${escapeHtml(grade.finalScore ?? "未填")}</span>
          <span>GPA 点：${scoreToPoint(grade.score).toFixed(1)}</span>
          <span>规则：${escapeHtml(snapshot.ruleOwner)} · 日常 ${escapeHtml(snapshot.dailyWeight)}% / 期末 ${escapeHtml(snapshot.finalWeight)}%</span>
          <span>权重：${escapeHtml(grade.credit)}</span>
          <span>${grade.countsGpa ? "计入 GPA" : "不计入 GPA"}</span>
        </div>
        <p>${escapeHtml(grade.comment)}</p>
        <p class="muted-text">作品：${escapeHtml(grade.artifact || "暂无")}</p>
      `;
      list.append(item);
    });

    emptyIfNeeded(summary);
    emptyIfNeeded(list);
  }

  function renderImports() {
    const list = $("#importList");
    list.innerHTML = "";
    [...state.imports].reverse().forEach((item) => {
      const student = getStudent(item.studentId);
      const node = document.createElement("article");
      node.className = "record-item";
      node.innerHTML = `
        <div class="item-title">${escapeHtml(item.source)} · ${escapeHtml(item.archiveType)}</div>
        <div class="item-meta">
          <span class="pill ${item.status === "待确认" ? "gold" : "teal"}">${escapeHtml(item.status)}</span>
          <span>${escapeHtml(student?.name || "未匹配学生")}</span>
          <span>${formatDate(item.createdAt)}</span>
        </div>
        <p>${escapeHtml(item.summary || "暂无摘要")}</p>
        <p class="muted-text">${escapeHtml(item.link || "暂无链接")}</p>
      `;
      list.append(node);
    });
    emptyIfNeeded(list);
  }

  function generateReport(studentId) {
    const student = getStudent(studentId);
    if (!student) {
      $("#reportOutput").innerHTML = `<div class="empty-state">请先选择学生。</div>`;
      return;
    }

    const motivation = state.motivation.filter((record) => record.studentId === studentId);
    const grades = state.grades.filter((grade) => grade.studentId === studentId);
    const attendance = state.attendance.filter((record) => record.studentId === studentId);
    const academy = getAcademy(student.academyId);
    const gpa = calculateGpa(studentId);
    const creditTotal = calculateCredit(studentId);
    const creditText = attendance.length ? `${creditTotal} 分，${attendance.length} 条加减记录` : `${creditTotal} 分，暂无加减记录`;

    $("#reportOutput").innerHTML = `
      <div class="report-section">
        <h2>${escapeHtml(student.name)} 成长档案草稿</h2>
        <p class="muted-text">学号：${escapeHtml(student.studentNo)} · 项目：${escapeHtml(student.program)} · 状态：${escapeHtml(normalizeStudentStatus(student.status))}</p>
      </div>
      <div class="report-section">
        <h3>基础概览</h3>
        <ul>
          <li>标签：${escapeHtml(student.tags || "暂无")}</li>
          <li>学院：${escapeHtml(academy?.name || "未分学院")}</li>
          <li>GPA：${gpa.gpa ?? "暂无"}，计入课程 ${gpa.count} 门</li>
          <li>信用积分：${escapeHtml(creditText)}</li>
        </ul>
      </div>
      <div class="report-section">
        <h3>动力中心记录</h3>
        ${motivation.length ? `<ul>${motivation.map((record) => `
          <li>${escapeHtml(record.dimensions.join(" / "))}：${escapeHtml(record.fact)} 行动建议：${escapeHtml(record.suggestion || "暂无")}</li>
        `).join("")}</ul>` : `<p class="muted-text">暂无动力记录。</p>`}
      </div>
      <div class="report-section">
        <h3>GPA 与科目评语</h3>
        ${grades.length ? `<ul>${grades.map((grade) => {
          const course = getCourse(grade.courseId);
          const snapshot = grade.ruleSnapshot || {
            ruleOwner: course?.ruleOwner || course?.teacher || grade.teacher,
            dailyWeight: course?.dailyWeight ?? 60,
            finalWeight: course?.finalWeight ?? 40
          };
          return `<li>${escapeHtml(course?.name || "未知课程")}：总评 ${escapeHtml(grade.score)} 分，日常 ${escapeHtml(grade.dailyScore ?? grade.score)}，期末 ${escapeHtml(grade.finalScore ?? "未填")}；规则 ${escapeHtml(snapshot.ruleOwner)} · 日常 ${escapeHtml(snapshot.dailyWeight)}% / 期末 ${escapeHtml(snapshot.finalWeight)}%。${escapeHtml(grade.comment)}</li>`;
        }).join("")}</ul>` : `<p class="muted-text">暂无成绩和科目评语。</p>`}
      </div>
      <div class="report-section">
        <h3>下一步建议</h3>
        <p>${escapeHtml(buildNextSuggestion(motivation, grades))}</p>
      </div>
    `;
  }

  function buildNextSuggestion(motivation, grades) {
    const followups = motivation.filter((record) => record.followUp && record.suggestion);
    if (followups.length) return followups[followups.length - 1].suggestion;
    if (grades.length) return "结合科目评语，选择一个最需要支持的课程维度，安排一次短周期目标和复盘。";
    return "先积累动力中心事实记录，再生成更准确的阶段性行动建议。";
  }

  function renderAll() {
    fillSelects();
    renderStats();
    renderStudentStatusFilters();
    renderStudentAcademyFilters();
    renderReportFilters();
    renderReportStudentSelect();
    renderMotivationFilters();
    renderMotivationStudentSelect();
    renderCourseStudentFilters();
    renderCourseStudentPreview();
    renderCreditFilters();
    renderCreditStudentSelect();
    renderGradeFilters();
    renderGradeStudentSelect();
    renderStudents();
    renderStudentExportFields();
    renderMotivation();
    renderCourses();
    renderCalendar();
    renderAttendanceTable();
    renderCreditPolicy();
    renderCreditRules();
    renderCreditAnalytics();
    renderAcademies();
    renderHolidays();
    renderAttendance();
    renderGrades();
    renderImports();
    setAcademyEditMode(editingAcademyId);
    if (editingCreditRuleId) setCreditRuleEditMode(editingCreditRuleId);
    if (editingCourseId) setCourseEditMode(editingCourseId);
    if (!$("#reportOutput").innerHTML.trim()) {
      $("#reportOutput").innerHTML = `<div class="empty-state">选择学生后生成报告。</div>`;
    }
  }

  function formData(form) {
    return Object.fromEntries(new FormData(form).entries());
  }

  function resetForm(form) {
    form.reset();
    const today = new Date().toISOString().slice(0, 10);
    form.querySelectorAll('input[type="date"]').forEach((dateInput) => {
      dateInput.value = today;
    });
  }

  function setStudentEditMode(studentId) {
    editingStudentId = studentId;
    const form = $("#studentForm");
    const title = $("#studentFormTitle");
    const submit = $("#studentSubmitButton");
    const cancel = $("#cancelStudentEdit");
    const student = studentId ? getStudent(studentId) : null;

    if (!student) {
      editingStudentId = null;
      resetForm(form);
      title.textContent = "新增学生";
      submit.textContent = "保存学生";
      cancel.hidden = true;
      return;
    }

    form.elements.name.value = student.name || "";
    form.elements.englishName.value = student.englishName || "";
    form.elements.studentNo.value = student.studentNo || "";
    form.elements.age.value = student.age || "";
    form.elements.program.value = student.program || "好奇学习社区";
    form.elements.academyId.value = student.academyId || "";
    form.elements.status.value = normalizeStudentStatus(student.status);
    form.elements.tags.value = student.tags || "";
    form.elements.notes.value = student.notes || "";
    title.textContent = `编辑学生：${student.name}`;
    submit.textContent = "保存修改";
    cancel.hidden = false;
  }

  function setCheckedValues(form, name, values) {
    const selected = new Set(values || []);
    $all(`input[name="${name}"]`, form).forEach((input) => {
      input.checked = selected.has(input.value);
    });
  }

  function setCourseEditMode(courseId) {
    editingCourseId = courseId;
    const form = $("#courseForm");
    const title = $("#courseFormTitle");
    const submit = $("#courseSubmitButton");
    const cancel = $("#cancelCourseEdit");
    const course = courseId ? getCourse(courseId) : null;

    if (!course) {
      editingCourseId = null;
      resetForm(form);
      setCheckedValues(form, "paths", ["通识"]);
      setCheckedValues(form, "attributes", []);
      syncCourseWeights("daily");
      title.textContent = "新增课程/项目";
      submit.textContent = "保存课程/项目";
      cancel.hidden = true;
      return;
    }

    form.elements.name.value = course.name || "";
    form.elements.center.value = course.center || "通识中心";
    setCheckedValues(form, "paths", coursePaths(course));
    setCheckedValues(form, "attributes", courseAttributes(course));
    form.elements.teacher.value = course.teacher || "";
    form.elements.startAt.value = course.startAt || "";
    form.elements.endAt.value = course.endAt || "";
    form.elements.repeatWeekly.checked = Boolean(course.repeatWeekly);
    form.elements.repeatUntil.value = course.repeatUntil || "";
    form.elements.ruleOwner.value = course.ruleOwner || course.teacher || "";
    form.elements.dailyWeight.value = course.dailyWeight ?? 60;
    form.elements.finalWeight.value = course.finalWeight ?? 40;
    form.elements.description.value = course.description || "";
    title.textContent = `编辑课程：${course.name}`;
    submit.textContent = "保存修改";
    cancel.hidden = false;
  }

  function setupEvents() {
    $("#nav").addEventListener("click", (event) => {
      const button = event.target.closest("[data-view]");
      if (button) switchView(button.dataset.view);
    });

    $all("[data-jump]").forEach((button) => {
      button.addEventListener("click", () => switchView(button.dataset.jump));
    });

    $("#globalSearch").addEventListener("input", (event) => {
      searchTerm = event.target.value.trim();
      renderAll();
    });

    $("#studentForm").addEventListener("submit", (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      const data = formData(form);
      data.status = normalizeStudentStatus(data.status);
      if (["毕业", "离开"].includes(data.status)) data.academyId = "";
      if (editingStudentId) {
        const student = getStudent(editingStudentId);
        if (student) Object.assign(student, data);
      } else {
        state.students.push({ id: id("stu"), ...data });
      }
      saveState();
      setStudentEditMode(null);
      renderAll();
    });

    $("#cancelStudentEdit").addEventListener("click", () => {
      setStudentEditMode(null);
    });

    $("#studentStatusFilters").addEventListener("change", () => {
      selectedStudentStatuses = new Set($all("#studentStatusFilters input:checked").map((input) => input.value));
      renderStudents();
    });

    $("#studentAcademyFilters").addEventListener("change", () => {
      selectedStudentAcademies = new Set($all("#studentAcademyFilters input:checked").map((input) => input.value));
      renderStudents();
    });

    $("#reportStatusFilters").addEventListener("change", () => {
      selectedReportStatuses = new Set($all("#reportStatusFilters input:checked").map((input) => input.value));
      renderReportStudentSelect();
    });

    $("#reportAcademyFilters").addEventListener("change", () => {
      selectedReportAcademies = new Set($all("#reportAcademyFilters input:checked").map((input) => input.value));
      renderReportStudentSelect();
    });

    $("#motivationStatusFilters").addEventListener("change", () => {
      selectedMotivationStatuses = new Set($all("#motivationStatusFilters input:checked").map((input) => input.value));
      renderMotivationStudentSelect();
      renderMotivation();
    });

    $("#motivationAcademyFilters").addEventListener("change", () => {
      selectedMotivationAcademies = new Set($all("#motivationAcademyFilters input:checked").map((input) => input.value));
      renderMotivationStudentSelect();
      renderMotivation();
    });

    $("#courseStatusFilters").addEventListener("change", () => {
      selectedCourseStatuses = new Set($all("#courseStatusFilters input:checked").map((input) => input.value));
      renderCourseStudentPreview();
    });

    $("#courseAcademyFilters").addEventListener("change", () => {
      selectedCourseAcademies = new Set($all("#courseAcademyFilters input:checked").map((input) => input.value));
      renderCourseStudentPreview();
    });

    $("#creditStatusFilters").addEventListener("change", () => {
      selectedCreditStatuses = new Set($all("#creditStatusFilters input:checked").map((input) => input.value));
      renderCreditStudentSelect();
      renderAttendanceTable();
      renderAttendance();
      renderCreditAnalytics();
    });

    $("#creditAcademyFilters").addEventListener("change", () => {
      selectedCreditAcademies = new Set($all("#creditAcademyFilters input:checked").map((input) => input.value));
      renderCreditStudentSelect();
      renderAttendanceTable();
      renderAttendance();
      renderCreditAnalytics();
    });

    $("#gradeStatusFilters").addEventListener("change", () => {
      selectedGradeStatuses = new Set($all("#gradeStatusFilters input:checked").map((input) => input.value));
      renderGradeStudentSelect();
      renderGrades();
    });

    $("#gradeAcademyFilters").addEventListener("change", () => {
      selectedGradeAcademies = new Set($all("#gradeAcademyFilters input:checked").map((input) => input.value));
      renderGradeStudentSelect();
      renderGrades();
    });

    $("#exportStudentsButton").addEventListener("click", exportStudents);
    $("#downloadStudentTemplate").addEventListener("click", downloadStudentTemplate);
    $("#studentImportFile").addEventListener("change", (event) => {
      const file = event.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const rows = parseDelimited(String(reader.result || "").replace(/^\uFEFF/, ""));
        const students = rowsToStudents(rows);
        if (!students.length) {
          $("#studentImportPreview").innerHTML = `<div class="empty-state">没有识别到有效学生。请确认表格包含“学号”和“中文名/姓名”。</div>`;
          return;
        }
        previewStudentImport(students);
      };
      reader.readAsText(file, "utf-8");
    });

    $("#academyForm").addEventListener("submit", (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      const data = formData(form);
      const name = data.name.trim();
      if (!name) return;
      if (editingAcademyId) {
        const academy = getAcademy(editingAcademyId);
        if (!academy) return;
        academy.name = name;
        academy.color = data.color || academy.color;
      } else {
        state.academies.push({
          id: id("academy"),
          name,
          color: data.color || "red"
        });
      }
      saveState();
      setAcademyEditMode(null);
      renderAll();
    });

    $("#cancelAcademyEdit").addEventListener("click", () => {
      setAcademyEditMode(null);
    });

    $("#motivationForm").addEventListener("submit", (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      const data = formData(form);
      const dimensions = $all('input[name="dimension"]:checked', form).map((input) => input.value);
      state.motivation.push({
        id: id("mot"),
        ...data,
        dimensions: dimensions.length ? dimensions : ["好奇"],
        followUp: Boolean(form.elements.followUp.checked),
        createdAt: new Date().toISOString()
      });
      saveState();
      resetForm(form);
      renderAll();
    });

    $("#courseForm").addEventListener("submit", (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      syncCourseWeights("daily");
      const data = formData(form);
      const paths = $all('input[name="paths"]:checked', form).map((input) => input.value);
      const attributes = $all('input[name="attributes"]:checked', form).map((input) => input.value);
      const dailyWeight = clampWeight(data.dailyWeight);
      const payload = {
        ...data,
        paths: paths.length ? paths : ["通识"],
        path: paths[0] || "通识",
        attributes,
        repeatWeekly: Boolean(form.elements.repeatWeekly.checked),
        repeatUntil: form.elements.repeatUntil.value,
        ruleOwner: data.ruleOwner || data.teacher,
        dailyWeight,
        finalWeight: 100 - dailyWeight
      };
      if (editingCourseId) {
        const course = getCourse(editingCourseId);
        if (course) Object.assign(course, payload);
      } else {
        state.courses.push({ id: id("course"), ...payload });
      }
      saveState();
      setCourseEditMode(null);
      renderAll();
    });

    $("#cancelCourseEdit").addEventListener("click", () => {
      setCourseEditMode(null);
    });

    $("#dailyWeightInput").addEventListener("input", () => {
      syncCourseWeights("daily");
    });

    $("#finalWeightInput").addEventListener("input", () => {
      syncCourseWeights("final");
    });

    $("#creditEntryForm").addEventListener("submit", (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      const data = formData(form);
      const rule = state.creditRules.find((item) => item.id === data.ruleId);
      if (!data.studentId || !data.date || !rule) return;
      state.attendance.push({
        id: id("att"),
        studentId: data.studentId,
        courseId: data.courseId,
        date: data.date,
        teacher: data.teacher,
        ruleId: rule.id,
        status: rule.label,
        points: Number(rule.points),
        note: data.note
      });
      saveState();
      resetForm(form);
      renderAll();
    });

    $("#attendanceForm").addEventListener("submit", (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      const data = formData(form);
      filteredSortedStudents(selectedCreditStatuses, selectedCreditAcademies).forEach((student) => {
        const ruleId = form.elements[`attendance_${student.id}`]?.value;
        const rule = state.creditRules.find((item) => item.id === ruleId);
        if (!rule) return;
        state.attendance.push({
          id: id("att"),
          studentId: student.id,
          courseId: data.courseId,
          date: data.date,
          teacher: data.teacher,
          ruleId: rule.id,
          status: rule.label,
          points: Number(rule.points),
          note: ""
        });
      });
      saveState();
      renderAll();
    });

    $("#creditRuleForm").addEventListener("submit", (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      const data = formData(form);
      const label = data.label.trim();
      const points = Number(data.points);
      if (!label || Number.isNaN(points)) return;
      if (editingCreditRuleId) {
        const rule = state.creditRules.find((item) => item.id === editingCreditRuleId);
        if (!rule) return;
        rule.label = label;
        rule.points = points;
      } else {
        const existing = state.creditRules.find((rule) => rule.label === label);
        if (existing) {
          existing.points = points;
        } else {
          state.creditRules.push({ id: id("rule"), label, points });
        }
      }
      saveState();
      setCreditRuleEditMode(null);
      renderAll();
    });

    $("#cancelCreditRuleEdit").addEventListener("click", () => {
      setCreditRuleEditMode(null);
    });

    $("#creditPolicyForm").addEventListener("submit", (event) => {
      event.preventDefault();
      const content = event.currentTarget.elements.content.value.trim();
      if (!content) return;
      state.creditPolicy = content;
      saveState();
      renderAll();
    });

    $("#resetCreditPolicy").addEventListener("click", () => {
      if (!window.confirm("确定恢复默认信用积分规则 2.6 总则吗？当前管理员修改内容会被覆盖。")) return;
      state.creditPolicy = defaultCreditPolicy;
      saveState();
      renderAll();
    });

    $("#importCreditPolicyRules").addEventListener("click", () => {
      importCreditPolicyRules();
      saveState();
      renderAll();
    });

    $("#holidayForm").addEventListener("submit", (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      const data = formData(form);
      const label = data.label.trim();
      if (!data.startDate || !data.endDate || !label) return;
      let startDate = data.startDate;
      let endDate = data.endDate;
      if (endDate < startDate) [startDate, endDate] = [endDate, startDate];
      const existing = state.holidays.find((holiday) => (holiday.startDate || holiday.date) === startDate && (holiday.endDate || holiday.date || holiday.startDate) === endDate && holiday.label === label);
      if (!existing) state.holidays.push({ id: id("holiday"), startDate, endDate, label });
      saveState();
      resetForm(form);
      renderAll();
    });

    $("#gradeForm").addEventListener("submit", (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      const data = formData(form);
      const course = getCourse(data.courseId);
      if (!data.studentId || !course) return;
      const score = calculateCourseScore(course, data.dailyScore, data.finalScore);
      state.grades.push({
        id: id("grade"),
        ...data,
        dailyScore: Number(data.dailyScore),
        finalScore: data.finalScore === "" ? null : Number(data.finalScore),
        score,
        credit: Number(data.credit || 1),
        countsGpa: Boolean(form.elements.countsGpa.checked),
        ruleSnapshot: {
          ruleOwner: course?.ruleOwner || course?.teacher || data.teacher,
          dailyWeight: Number(course?.dailyWeight ?? 60),
          finalWeight: Number(course?.finalWeight ?? 40)
        },
        createdAt: new Date().toISOString()
      });
      saveState();
      resetForm(form);
      form.elements.countsGpa.checked = true;
      renderAll();
    });

    $("#importForm").addEventListener("submit", (event) => {
      event.preventDefault();
      const data = formData(event.currentTarget);
      state.imports.push({ id: id("imp"), ...data, createdAt: new Date().toISOString() });
      saveState();
      resetForm(event.currentTarget);
      renderAll();
    });

    document.body.addEventListener("click", (event) => {
      if (event.target.closest("[data-calendar-prev]")) {
        calendarCursor = new Date(calendarCursor.getFullYear(), calendarCursor.getMonth() - 1, 1);
        renderCalendar();
        return;
      }

      if (event.target.closest("[data-calendar-next]")) {
        calendarCursor = new Date(calendarCursor.getFullYear(), calendarCursor.getMonth() + 1, 1);
        renderCalendar();
        return;
      }

      if (event.target.closest("[data-calendar-today]")) {
        calendarCursor = new Date();
        renderCalendar();
        return;
      }

      const editStudentButton = event.target.closest("[data-edit-student]");
      if (editStudentButton) {
        setStudentEditMode(editStudentButton.dataset.editStudent);
        switchView("students");
        return;
      }

      const editAcademyButton = event.target.closest("[data-edit-academy]");
      if (editAcademyButton) {
        setAcademyEditMode(editAcademyButton.dataset.editAcademy);
        switchView("students");
        return;
      }

      const editCreditRuleButton = event.target.closest("[data-edit-credit-rule]");
      if (editCreditRuleButton) {
        setCreditRuleEditMode(editCreditRuleButton.dataset.editCreditRule);
        switchView("attendance");
        return;
      }

      const editCourseButton = event.target.closest("[data-edit-course]");
      if (editCourseButton) {
        setCourseEditMode(editCourseButton.dataset.editCourse);
        switchView("courses");
        return;
      }

      const deleteCourseButton = event.target.closest("[data-delete-course]");
      if (deleteCourseButton) {
        const courseId = deleteCourseButton.dataset.deleteCourse;
        const course = getCourse(courseId);
        if (!course) return;
        if (!window.confirm(`确定删除课程/项目“${course.name}”吗？相关历史记录会保留但可能显示为未知课程。`)) return;
        state.courses = state.courses.filter((item) => item.id !== courseId);
        if (editingCourseId === courseId) setCourseEditMode(null);
        saveState();
        renderAll();
        return;
      }

      const deleteAcademyButton = event.target.closest("[data-delete-academy]");
      if (deleteAcademyButton) {
        const academyId = deleteAcademyButton.dataset.deleteAcademy;
        const academy = getAcademy(academyId);
        if (!academy) return;
        const assignedCount = state.students.filter((student) => student.academyId === academyId).length;
        const message = assignedCount
          ? `确定删除“${academy.name}”吗？${assignedCount} 位学生会改为未分学院，学生档案不会被删除。`
          : `确定删除“${academy.name}”吗？`;
        if (!window.confirm(message)) return;
        state.academies = state.academies.filter((item) => item.id !== academyId);
        state.students.forEach((student) => {
          if (student.academyId === academyId) student.academyId = "";
        });
        if (editingAcademyId === academyId) setAcademyEditMode(null);
        saveState();
        renderAll();
        return;
      }

      const ruleButton = event.target.closest("[data-delete-credit-rule]");
      if (ruleButton) {
        const ruleId = ruleButton.dataset.deleteCreditRule;
        const rule = state.creditRules.find((item) => item.id === ruleId);
        if (!rule) return;
        if (!window.confirm(`确定删除积分规则“${rule.label}”吗？历史记录会保留。`)) return;
        state.creditRules = state.creditRules.filter((item) => item.id !== ruleId);
        if (editingCreditRuleId === ruleId) setCreditRuleEditMode(null);
        saveState();
        renderAll();
        return;
      }

      const holidayButton = event.target.closest("[data-delete-holiday]");
      if (holidayButton) {
        state.holidays = state.holidays.filter((item) => item.id !== holidayButton.dataset.deleteHoliday);
        saveState();
        renderAll();
        return;
      }

      const deleteButton = event.target.closest("[data-delete-student]");
      if (!deleteButton) return;
      const studentId = deleteButton.dataset.deleteStudent;
      const student = getStudent(studentId);
      if (!student) return;
      if (!window.confirm(`确定删除 ${student.name} 吗？相关记录会保留但无法匹配学生。`)) return;
      state.students = state.students.filter((item) => item.id !== studentId);
      if (editingStudentId === studentId) setStudentEditMode(null);
      saveState();
      renderAll();
    });

    document.body.addEventListener("change", (event) => {
      const lunarToggle = event.target.closest("[data-calendar-lunar]");
      if (!lunarToggle) return;
      showLunarCalendar = lunarToggle.checked;
      renderCalendar();
    });

    $("#generateReport").addEventListener("click", () => {
      generateReport($("#reportStudent").value);
    });

    $("#printReport").addEventListener("click", () => {
      window.print();
    });

    $("#seedButton").addEventListener("click", () => {
      state = normalizeState(structuredClone(sampleData));
      editingCourseId = null;
      editingCreditRuleId = null;
      saveState();
      renderAll();
    });

    $("#clearButton").addEventListener("click", () => {
      if (!window.confirm("确定清空本地数据吗？这个操作只影响当前浏览器里的 MVP 数据。")) return;
      state = {
        students: [],
        courses: [],
        motivation: [],
        attendance: [],
        creditRules: structuredClone(defaultCreditRules),
        academies: structuredClone(defaultAcademies),
        holidays: [],
        creditPolicy: defaultCreditPolicy,
        grades: [],
        imports: []
      };
      editingCourseId = null;
      editingCreditRuleId = null;
      saveState();
      renderAll();
    });
  }

  function init() {
    renderNav();
    setupEvents();
    resetForm($("#attendanceForm"));
    renderAll();
  }

  init();
})();
