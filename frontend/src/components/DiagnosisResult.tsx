import { motion } from 'framer-motion'
import { DiagnosisResult as DiagnosisResultType } from '../store/agriStore'

interface Props {
  result: DiagnosisResultType
  imageUrl: string
  onBack: () => void
}

export default function DiagnosisResult({ result, imageUrl, onBack }: Props) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'healthy': return 'text-agri-green bg-agri-green/10'
      case 'mild': return 'text-agri-lime bg-agri-lime/10'
      case 'moderate': return 'text-agri-amber bg-agri-amber/10'
      case 'severe': return 'text-red-500 bg-red-500/10'
      default: return 'text-gray-500 bg-gray-100'
    }
  }

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'healthy': return '健康'
      case 'mild': return '轻度'
      case 'moderate': return '中度'
      case 'severe': return '重度'
      default: return '未知'
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'bg-agri-green'
    if (confidence >= 0.7) return 'bg-agri-lime'
    if (confidence >= 0.5) return 'bg-agri-amber'
    return 'bg-red-500'
  }

  return (
    <div className="space-y-4">
      {/* 返回按钮 */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-agri-earth/70 hover:text-agri-earth"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        重新检测
      </button>

      {/* 图片和基本信息 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl overflow-hidden"
      >
        <div className="relative">
          <img src={imageUrl} alt="检测图片" className="w-full h-48 object-cover" />
          <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(result.severity)}`}>
            {getSeverityText(result.severity)}
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-agri-earth/60">作物</p>
              <p className="text-lg font-medium text-agri-earth">{result.crop}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-agri-earth/60">诊断结果</p>
              <p className={`text-lg font-medium ${result.disease === '健康' ? 'text-agri-green' : 'text-agri-amber'}`}>
                {result.disease}
              </p>
            </div>
          </div>

          {/* 置信度 */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-agri-earth/60 mb-1">
              <span>AI置信度</span>
              <span>{(result.confidence * 100).toFixed(1)}%</span>
            </div>
            <div className="confidence-bar">
              <div
                className={`confidence-fill ${getConfidenceColor(result.confidence)}`}
                style={{ width: `${result.confidence * 100}%` }}
              />
            </div>
          </div>

          {/* 描述 */}
          <p className="text-sm text-agri-earth/80 leading-relaxed">{result.description}</p>
        </div>
      </motion.div>

      {/* 防治建议 */}
      {result.treatment.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="result-card warning rounded-xl p-4"
        >
          <h3 className="text-agri-amber font-medium mb-3 flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            防治方法
          </h3>
          <ul className="space-y-2">
            {result.treatment.map((item, i) => (
              <li key={i} className="text-sm text-agri-earth/80 flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-agri-amber/20 text-agri-amber text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                {item}
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* 预防措施 */}
      {result.prevention.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="result-card rounded-xl p-4"
        >
          <h3 className="text-agri-green font-medium mb-3 flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            预防措施
          </h3>
          <ul className="space-y-2">
            {result.prevention.map((item, i) => (
              <li key={i} className="text-sm text-agri-earth/80 flex items-start gap-2">
                <span className="text-agri-green">•</span>
                {item}
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  )
}
