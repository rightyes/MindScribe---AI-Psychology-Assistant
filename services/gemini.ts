import { GoogleGenAI } from "@google/genai";
import { AnalysisMode, GeminiResponse, Session, ClientInfo, Language } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to clean Markdown
const cleanText = (text: string): string => {
  if (!text) return "";
  return text
    .replace(/^#{1,6}\s?/gm, "")    // Remove headers
    .replace(/\*\*/g, "")           // Remove bold
    .replace(/^\s*[\*•-]\s/gm, "• ") // Standardize lists
    .replace(/`/g, "")              // Remove code blocks
    .replace(/\[|\]/g, "")          // Remove brackets
    .trim();
};

export const generateSessionAnalysis = async (
  text: string, 
  mode: AnalysisMode,
  lang: Language
): Promise<GeminiResponse> => {
  let promptContext = "";
  
  if (lang === 'zh') {
    if (mode === 'CBT') {
      promptContext = "你是认知行为疗法(CBT)专家。请分析来访者的话语，识别：1. 诱发事件(A) 2. 自动化思维与认知扭曲(B) 3. 情绪行为后果(C) 4. 可能的核心信念。";
    } else if (mode === 'Psychoanalysis') {
      promptContext = "你是精神动力学专家。请分析来访者的话语，识别：1. 潜意识冲突与防御机制 2. 移情/反移情线索 3. 与童年/客体关系的潜在联系。";
    } else if (mode === 'Humanistic') {
      promptContext = "你是人本主义流派专家。请分析来访者的话语，关注：1. 此时此地(Here & Now)的体验 2. 自我概念与真实自我的冲突 3. 来访者的资源与潜能。";
    }
  } else {
    // English Prompts
    if (mode === 'CBT') {
      promptContext = "You are a CBT expert. Analyze the client's statement to identify: 1. Activating Event (A) 2. Automatic Thoughts & Cognitive Distortions (B) 3. Emotional/Behavioral Consequences (C) 4. Potential Core Beliefs.";
    } else if (mode === 'Psychoanalysis') {
      promptContext = "You are a Psychodynamic expert. Analyze the client's statement to identify: 1. Unconscious conflicts and defense mechanisms 2. Transference/Counter-transference clues 3. Potential links to childhood/object relations.";
    } else if (mode === 'Humanistic') {
      promptContext = "You are a Humanistic expert. Analyze the client's statement focusing on: 1. Here & Now experience 2. Conflict between Self-concept and Real Self 3. Client's resources and potential.";
    }
  }

  const prompt = `
    ${promptContext}
    
    Client said: "${text}"
    
    Please output two parts (separated by "---PLAN_SEPARATOR---"):
    Part 1: Detailed professional analysis (bullet points).
    Part 2: Immediate intervention/homework suggestions for this specific segment.
    
    IMPORTANT: Output in ${lang === 'zh' ? 'Simplified Chinese' : 'English'}. Return PURE TEXT only. Do NOT use Markdown formatting (no #, *, **). Keep it clean.
    
    Output Format:
    [Analysis Content]
    ---PLAN_SEPARATOR---
    [Intervention Content]
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const resultText = response.text || "";
    const parts = resultText.split('---PLAN_SEPARATOR---');
    
    if (parts.length === 2) {
      return {
        analysis: cleanText(parts[0].trim()),
        plan: cleanText(parts[1].trim())
      };
    } else {
      return {
        analysis: cleanText(resultText),
        plan: lang === 'zh' ? "未能自动分离方案，请参考分析内容手动填写。" : "Could not separate plan automatically, please see analysis."
      };
    }
  } catch (error) {
    console.error("Analysis generation error:", error);
    return {
      analysis: lang === 'zh' ? "分析生成失败，请重试。" : "Analysis failed, please retry.",
      plan: ""
    };
  }
};

export const generateExecutiveSummary = async (sessions: Session[], clientInfo: ClientInfo, lang: Language): Promise<string> => {
  if (sessions.length === 0) return "";

  const sessionText = sessions.map((s, i) => `Session ${i+1} (${s.mode}): Client said "${s.clientStatement}" -> Analysis: ${s.analysis.substring(0, 100)}... -> Feedback: ${s.feedback || 'None'}`).join('\n');
    
  let prompt = "";
  if (lang === 'zh') {
    prompt = `
      作为资深心理咨询督导，请根据以下多次咨询会话的摘要，撰写一份"高层执行摘要(Executive Summary)"。
      
      来访者基本信息: ${clientInfo.name}, ${clientInfo.age}, ${clientInfo.gender}。
      主诉: ${clientInfo.initialProblem}。
      
      会话记录:
      ${sessionText}
      
      请总结：
      1. 咨询的主要进程与变化。
      2. 核心临床议题的演变。
      3. 对未来预后的专业评估。
      请保持语言精炼、专业，使用纯文本，**不要**使用Markdown格式符号。
    `;
  } else {
    prompt = `
      As a Senior Clinical Supervisor, write an "Executive Summary" based on the following session abstracts.
      
      Client Info: ${clientInfo.name}, ${clientInfo.age}, ${clientInfo.gender}.
      Initial Complaint: ${clientInfo.initialProblem}.
      
      Session Records:
      ${sessionText}
      
      Please summarize:
      1. Major progress and changes in therapy.
      2. Evolution of core clinical issues.
      3. Professional prognosis assessment.
      Keep it professional and concise. Output Pure Text, NO Markdown.
    `;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return cleanText(response.text || "");
  } catch (error) {
    console.error("Summary generation error:", error);
    return lang === 'zh' ? "摘要生成失败。" : "Summary generation failed.";
  }
};

export const generateComprehensivePlan = async (sessions: Session[], clientInfo: ClientInfo, lang: Language): Promise<string> => {
  if (sessions.length === 0) return "";

  const plansText = sessions.map((s, i) => `Session ${i+1} Plan: ${s.plan}`).join('\n');
  
  let prompt = "";
  
  if (lang === 'zh') {
    prompt = `
      作为心理咨询师，请根据以下历次会话的干预方案记录，整理一份最终的"综合干预方案与预后"报告。
      
      来访者: ${clientInfo.name}
      主诉: ${clientInfo.initialProblem}
      
      历次方案记录:
      ${plansText}
      
      请输出包含以下两部分的内容（纯文本，不要Markdown格式，分段清晰）：
      1. 综合干预策略总结（整合主要使用的技术和策略，如CBT的认知重构、暴露疗法等）
      2. 预后评估（根据进展情况预测未来发展，提出后续建议）
    `;
  } else {
    prompt = `
      As a Psychotherapist, compile a "Comprehensive Intervention Plan & Prognosis" based on past session plans.
      
      Client: ${clientInfo.name}
      Complaint: ${clientInfo.initialProblem}
      
      Past Plans:
      ${plansText}
      
      Output two parts (Pure text, No Markdown, clear sections):
      1. Comprehensive Strategy Summary (Integrate techniques used, e.g., CBT restructuring).
      2. Prognosis Assessment (Predict future development based on progress, future recommendations).
    `;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return cleanText(response.text || "");
  } catch (error) {
    console.error("Plan generation error:", error);
    return lang === 'zh' ? "方案生成失败。" : "Plan generation failed.";
  }
};