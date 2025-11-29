export const translations = {
  zh: {
    appTitle: "心语 · 智能咨询辅助系统",
    aiPowered: "Gemini AI 驱动",
    newFile: "新建咨询档案",
    clientAlias: "来访者化名/代号",
    placeholderName: "例如：访客 A",
    age: "年龄",
    gender: "性别",
    genderOptions: { male: "男", female: "女", other: "其他", unspecified: "未说明" },
    intakeProblem: "初始主诉 (简述)",
    placeholderProblem: "来访者主要因为什么问题寻求帮助...",
    startSession: "开始咨询会话",
    viewArchives: "查看历史档案",
    
    // Session View
    sessionTimeline: "会话时间轴",
    noRecords: "暂无记录，请开始对话",
    saveProgress: "保存当前进度",
    archiveList: "档案列表",
    realtimeAnalysis: "实时咨询记录与分析",
    currentView: "当前视角",
    modes: { CBT: "认知行为", Psychoanalysis: "动力学", Humanistic: "人本" },
    clientInputLabel: "来访者主述",
    clientInputPlaceholder: "输入来访者话语...",
    analyzing: "分析中...",
    analyzeButton: "AI 智能分析",
    analysisLabel: "分析 & 方案 (可编辑)",
    analysisPlaceholder: "分析内容...",
    planPlaceholder: "干预方案...",
    feedbackPlaceholder: "咨询反馈/备注 (可选)...",
    addToArchive: "存入档案",
    
    // Report View
    reportTitle: "心理咨询个案报告",
    confidential: "CONFIDENTIAL / 机密文档",
    basicInfo: "基本信息",
    visitCount: "咨询次数",
    complaintEval: "主诉与评估",
    aiSummary: "智能执行摘要 (AI)",
    generateSummary: "生成摘要",
    regenerate: "重新生成",
    noSummary: "暂无摘要，请点击生成。",
    sessionDetails: "咨询过程详细记录",
    comprehensivePlan: "综合方案",
    generatePlan: "生成方案",
    back: "返回",
    save: "保存",
    exportPDF: "导出 PDF",
    
    // Archive View
    historyArchives: "历史咨询档案",
    newArchive: "新建档案",
    noArchives: "暂无存档记录",
    archiveHint: "咨询会话保存后将显示在这里",
    loadArchive: "加载此档案",
    confirmDelete: "确定要永久删除此档案吗？",
    confirmLoad: "加载存档将覆盖当前未保存的会话，确定继续吗？",
    confirmNew: "当前会话未保存，确定要新建吗？建议先保存。",
    pleaseEnterName: "请先填写来访者信息",
    saved: "已保存 ✓",
    
    // Mobile Nav
    navSession: "当前会话",
    navReport: "结案报告",
    navArchives: "历史档案",

    // Modals
    editRecord: "编辑会话记录与详细分析",
    clientOriginal: "来访者原话",
    professionalAnalysis: "专业分析",
    interventionPlan: "干预与家庭作业",
    feedbackLabel: "咨询反馈与后续补充信息",
    cancel: "取消",
    saveChanges: "保存更改",
    
    editInfo: "编辑基本信息",
    editComplaint: "编辑主诉与评估",
    editSummary: "编辑智能执行摘要",
    editPlan: "编辑综合干预方案与预后",
    
    // Analysis Display
    analysisResult: "AI 分析",
    interventionResult: "干预建议",
    feedbackResult: "反馈",
    
    // Common
    client: "来访者",
    analyst: "咨询师",
    
    toggleLanguage: "English" 
  },
  en: {
    appTitle: "MindScribe · AI Assistant",
    aiPowered: "Powered by Gemini AI",
    newFile: "New Client Intake",
    clientAlias: "Client Name/Alias",
    placeholderName: "E.g., Client A",
    age: "Age",
    gender: "Gender",
    genderOptions: { male: "Male", female: "Female", other: "Other", unspecified: "N/A" },
    intakeProblem: "Initial Complaint",
    placeholderProblem: "Why is the client seeking help...",
    startSession: "Start Session",
    viewArchives: "View Archives",
    
    // Session View
    sessionTimeline: "Timeline",
    noRecords: "No records yet",
    saveProgress: "Save Progress",
    archiveList: "Archives",
    realtimeAnalysis: "Live Analysis",
    currentView: "Perspective",
    modes: { CBT: "CBT", Psychoanalysis: "Psychodynamic", Humanistic: "Humanistic" },
    clientInputLabel: "Client Input",
    clientInputPlaceholder: "Enter client statement...",
    analyzing: "Analyzing...",
    analyzeButton: "AI Analysis",
    analysisLabel: "Analysis & Plan (Editable)",
    analysisPlaceholder: "Analysis content...",
    planPlaceholder: "Intervention plan...",
    feedbackPlaceholder: "Feedback/Notes (Optional)...",
    addToArchive: "Add to Record",
    
    // Report View
    reportTitle: "Psychological Case Report",
    confidential: "CONFIDENTIAL",
    basicInfo: "Basic Info",
    visitCount: "Session Count",
    complaintEval: "Complaint & Assessment",
    aiSummary: "Executive Summary (AI)",
    generateSummary: "Generate Summary",
    regenerate: "Regenerate",
    noSummary: "No summary generated yet.",
    sessionDetails: "Session Details",
    comprehensivePlan: "Comprehensive Plan",
    generatePlan: "Generate Plan",
    back: "Back",
    save: "Save",
    exportPDF: "Export PDF",
    
    // Archive View
    historyArchives: "Case Archives",
    newArchive: "New Case",
    noArchives: "No archived records",
    archiveHint: "Saved sessions will appear here",
    loadArchive: "Load Case",
    confirmDelete: "Permanently delete this archive?",
    confirmLoad: "Loading will overwrite current unsaved session. Continue?",
    confirmNew: "Current session unsaved. Create new anyway? Suggest saving first.",
    pleaseEnterName: "Please enter client information first",
    saved: "Saved ✓",
    
    // Mobile Nav
    navSession: "Session",
    navReport: "Report",
    navArchives: "Archives",

    // Modals
    editRecord: "Edit Session Record",
    clientOriginal: "Client Statement",
    professionalAnalysis: "Professional Analysis",
    interventionPlan: "Intervention & Homework",
    feedbackLabel: "Feedback & Notes",
    cancel: "Cancel",
    saveChanges: "Save Changes",
    
    editInfo: "Edit Basic Info",
    editComplaint: "Edit Complaint",
    editSummary: "Edit Executive Summary",
    editPlan: "Edit Comprehensive Plan",
    
    // Analysis Display
    analysisResult: "AI Analysis",
    interventionResult: "Intervention",
    feedbackResult: "Feedback",

    // Common
    client: "Client",
    analyst: "Counselor",
    
    toggleLanguage: "中文" 
  }
};