import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAgriStore } from '../store/agriStore'

interface Props {
  onClose: () => void
}

export default function SettingsModal({ onClose }: Props) {
  const { qiwenApiKey, setQiwenApiKey } = useAgriStore()
  const [apiKey, setApiKey] = useState(qiwenApiKey)

  const handleSave = () => {
    setQiwenApiKey(apiKey)
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-agri-earth/10 flex items-center justify-between">
          <h2 className="text-lg font-medium text-agri-earth">设置</h2>
          <button onClick={onClose} className="p-2 text-agri-earth/60">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 space-y-6">
          <div>
            <label className="block text-sm text-agri-earth/70 mb-2">通义千问 API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-xxxxxxxxxxxxxxxx"
              className="w-full px-4 py-3 border border-agri-earth/20 rounded-xl text-agri-earth placeholder-agri-earth/40 focus:border-agri-green focus:outline-none"
            />
            <p className="text-xs text-agri-earth/50 mt-2">
              配置API Key后可使用AI智能识别功能
            </p>
          </div>

          <div className="p-4 rounded-xl bg-agri-green/5 border border-agri-green/20">
            <h4 className="text-sm text-agri-green font-medium mb-2">边缘计算优势</h4>
            <ul className="text-xs text-agri-earth/70 space-y-1">
              <li>- 图片边缘预处理，减少传输带宽</li>
              <li>- 边缘缓存常见病害数据</li>
              <li>- PWA支持，可离线使用</li>
              <li>- 适合农村弱网环境</li>
            </ul>
          </div>
        </div>

        <div className="p-4 border-t border-agri-earth/10 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-agri-earth/20 rounded-xl text-agri-earth/70"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 bg-agri-green text-white rounded-xl font-medium"
          >
            保存
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
