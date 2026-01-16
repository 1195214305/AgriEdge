import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAgriStore } from './store/agriStore'
import Header from './components/Header'
import ImageUpload from './components/ImageUpload'
import DiagnosisResult from './components/DiagnosisResult'
import HistoryPanel from './components/HistoryPanel'
import SettingsModal from './components/SettingsModal'

function App() {
  const { currentImage, currentResult, isAnalyzing, clearResult } = useAgriStore()
  const [showSettings, setShowSettings] = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  return (
    <div className="min-h-screen bg-agri-cream">
      <Header
        onSettingsClick={() => setShowSettings(true)}
        onHistoryClick={() => setShowHistory(true)}
      />

      <main className="container mx-auto px-4 py-6 max-w-2xl">
        {/* 上传区域或结果展示 */}
        <AnimatePresence mode="wait">
          {!currentImage ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ImageUpload />
            </motion.div>
          ) : currentResult ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <DiagnosisResult
                result={currentResult}
                imageUrl={currentImage}
                onBack={clearResult}
              />
            </motion.div>
          ) : (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <div className="relative w-48 h-48 mx-auto mb-6 rounded-xl overflow-hidden">
                <img src={currentImage} alt="分析中" className="w-full h-full object-cover" />
                {isAnalyzing && <div className="scan-line" />}
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-12 h-12 border-4 border-agri-green border-t-transparent rounded-full mx-auto mb-4"
              />
              <p className="text-agri-earth text-lg">AI正在分析图片...</p>
              <p className="text-agri-earth/60 text-sm mt-2">边缘节点预处理 + AI诊断</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 使用说明 */}
        {!currentImage && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8"
          >
            <h2 className="text-lg font-medium text-agri-earth mb-4">使用方法</h2>
            <div className="grid grid-cols-3 gap-4">
              {[
                { step: 1, title: '拍照上传', desc: '对准病害部位' },
                { step: 2, title: 'AI分析', desc: '边缘快速识别' },
                { step: 3, title: '获取方案', desc: '防治建议' }
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-12 h-12 rounded-full bg-agri-green/10 flex items-center justify-center mx-auto mb-2">
                    <span className="text-agri-green font-bold">{item.step}</span>
                  </div>
                  <p className="text-sm font-medium text-agri-earth">{item.title}</p>
                  <p className="text-xs text-agri-earth/60 mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* 技术说明 */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-white rounded-xl p-4"
        >
          <h3 className="text-sm font-medium text-agri-leaf mb-3">边缘计算技术</h3>
          <div className="space-y-2 text-xs text-agri-earth/70">
            <p>- 图片在边缘节点预处理压缩，减少带宽消耗</p>
            <p>- 边缘函数作为AI模型API的安全网关</p>
            <p>- 常见病害结果边缘缓存，加速响应</p>
            <p>- 支持离线使用(PWA)，适合农村弱网环境</p>
          </div>
        </motion.section>
      </main>

      {/* 底部 */}
      <footer className="py-6 text-center text-agri-earth/50 text-xs">
        <p>本项目由<a href="https://www.aliyun.com/product/esa" className="text-agri-green">阿里云ESA</a>提供加速、计算和保护</p>
      </footer>

      {/* 模态框 */}
      <AnimatePresence>
        {showSettings && (
          <SettingsModal onClose={() => setShowSettings(false)} />
        )}
        {showHistory && (
          <HistoryPanel onClose={() => setShowHistory(false)} />
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
