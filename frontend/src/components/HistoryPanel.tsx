import { motion } from 'framer-motion'
import { useAgriStore } from '../store/agriStore'

interface Props {
  onClose: () => void
}

export default function HistoryPanel({ onClose }: Props) {
  const { history, clearHistory, setImage, analyzeImage } = useAgriStore()

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString('zh-CN') + ' ' + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  }

  const handleReview = (imageUrl: string) => {
    setImage(imageUrl)
    analyzeImage(imageUrl)
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25 }}
        className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-agri-cream"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-agri-earth/10 flex items-center justify-between">
          <h2 className="text-lg font-medium text-agri-earth">历史记录</h2>
          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                className="text-sm text-red-500 hover:text-red-600"
              >
                清空
              </button>
            )}
            <button onClick={onClose} className="p-2 text-agri-earth/60">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-4 overflow-y-auto" style={{ height: 'calc(100vh - 64px)' }}>
          {history.length === 0 ? (
            <div className="text-center py-20 text-agri-earth/50">
              <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p>暂无历史记录</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="history-card p-3 flex gap-3"
                  onClick={() => handleReview(item.imageUrl)}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.crop}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-agri-earth">{item.crop}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        item.severity === 'healthy' ? 'bg-agri-green/10 text-agri-green' :
                        item.severity === 'mild' ? 'bg-agri-lime/10 text-agri-lime' :
                        item.severity === 'moderate' ? 'bg-agri-amber/10 text-agri-amber' :
                        'bg-red-100 text-red-500'
                      }`}>
                        {item.disease}
                      </span>
                    </div>
                    <p className="text-xs text-agri-earth/60 truncate">{item.description}</p>
                    <p className="text-xs text-agri-earth/40 mt-1">{formatTime(item.timestamp)}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
