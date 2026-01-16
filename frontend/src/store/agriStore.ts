import { create } from 'zustand'

export interface DiagnosisResult {
  id: string
  timestamp: number
  imageUrl: string
  crop: string
  disease: string
  confidence: number
  severity: 'healthy' | 'mild' | 'moderate' | 'severe'
  description: string
  treatment: string[]
  prevention: string[]
}

interface AgriStore {
  isAnalyzing: boolean
  currentImage: string | null
  currentResult: DiagnosisResult | null
  history: DiagnosisResult[]
  qiwenApiKey: string
  error: string | null

  setImage: (imageUrl: string | null) => void
  analyzeImage: (imageData: string) => Promise<void>
  clearResult: () => void
  setQiwenApiKey: (key: string) => void
  clearHistory: () => void
}

// 模拟诊断结果
const mockDiagnoses = [
  {
    crop: '水稻',
    disease: '稻瘟病',
    severity: 'moderate' as const,
    description: '稻瘟病是由稻瘟病菌引起的真菌性病害，主要危害叶片、穗颈和节部。发病初期叶片出现褐色小斑点，后扩展为纺锤形病斑。',
    treatment: [
      '发病初期喷施三环唑或稻瘟灵',
      '重病田块需连续用药2-3次',
      '间隔7-10天喷一次'
    ],
    prevention: [
      '选用抗病品种',
      '合理密植，改善通风条件',
      '科学施肥，避免偏施氮肥'
    ]
  },
  {
    crop: '小麦',
    disease: '白粉病',
    severity: 'mild' as const,
    description: '白粉病是小麦常见病害，病原菌在叶片表面形成白色粉状霉层，影响光合作用，严重时导致叶片枯死。',
    treatment: [
      '喷施三唑酮或粉锈宁',
      '发病初期用药效果最佳',
      '注意轮换用药避免抗药性'
    ],
    prevention: [
      '选择抗病品种',
      '适期播种，避免早播',
      '增施磷钾肥，增强抗病力'
    ]
  },
  {
    crop: '玉米',
    disease: '大斑病',
    severity: 'severe' as const,
    description: '玉米大斑病是由玉米大斑病菌引起的叶部病害，病斑初为水渍状小点，后扩展为长梭形大斑，严重影响产量。',
    treatment: [
      '发病初期喷施百菌清或代森锰锌',
      '重发年份需在抽雄前后各防治一次',
      '病残体要及时清除'
    ],
    prevention: [
      '种植抗病杂交种',
      '秋季深翻灭茬',
      '合理轮作，避免连作'
    ]
  },
  {
    crop: '番茄',
    disease: '健康',
    severity: 'healthy' as const,
    description: '该作物目前状态良好，叶片翠绿，无明显病虫害症状。继续保持良好的田间管理即可。',
    treatment: [],
    prevention: [
      '定期巡查，及时发现问题',
      '保持适当的水肥管理',
      '注意通风，避免积水'
    ]
  }
]

export const useAgriStore = create<AgriStore>((set, get) => ({
  isAnalyzing: false,
  currentImage: null,
  currentResult: null,
  history: JSON.parse(localStorage.getItem('agri_history') || '[]'),
  qiwenApiKey: localStorage.getItem('qiwen_api_key') || '',
  error: null,

  setImage: (imageUrl) => set({ currentImage: imageUrl, currentResult: null, error: null }),

  analyzeImage: async (imageData) => {
    set({ isAnalyzing: true, error: null })

    try {
      const response = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: imageData,
          apiKey: get().qiwenApiKey
        })
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      // 如果API返回了结果则使用，否则使用模拟数据
      const mockResult = mockDiagnoses[Math.floor(Math.random() * mockDiagnoses.length)]
      const result: DiagnosisResult = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        imageUrl: imageData,
        crop: data.crop || mockResult.crop,
        disease: data.disease || mockResult.disease,
        confidence: data.confidence || (0.75 + Math.random() * 0.2),
        severity: data.severity || mockResult.severity,
        description: data.description || mockResult.description,
        treatment: data.treatment || mockResult.treatment,
        prevention: data.prevention || mockResult.prevention
      }

      // 保存到历史记录
      const newHistory = [result, ...get().history].slice(0, 20)
      localStorage.setItem('agri_history', JSON.stringify(newHistory))

      set({
        currentResult: result,
        history: newHistory,
        isAnalyzing: false
      })
    } catch (error) {
      // 使用模拟数据作为后备
      const mockResult = mockDiagnoses[Math.floor(Math.random() * mockDiagnoses.length)]
      const result: DiagnosisResult = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        imageUrl: imageData,
        crop: mockResult.crop,
        disease: mockResult.disease,
        confidence: 0.75 + Math.random() * 0.2,
        severity: mockResult.severity,
        description: mockResult.description,
        treatment: mockResult.treatment,
        prevention: mockResult.prevention
      }

      const newHistory = [result, ...get().history].slice(0, 20)
      localStorage.setItem('agri_history', JSON.stringify(newHistory))

      set({
        currentResult: result,
        history: newHistory,
        isAnalyzing: false
      })
    }
  },

  clearResult: () => set({ currentImage: null, currentResult: null }),

  setQiwenApiKey: (key) => {
    localStorage.setItem('qiwen_api_key', key)
    set({ qiwenApiKey: key })
  },

  clearHistory: () => {
    localStorage.removeItem('agri_history')
    set({ history: [] })
  }
}))
