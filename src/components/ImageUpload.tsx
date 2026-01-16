import { useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useAgriStore } from '../store/agriStore'

export default function ImageUpload() {
  const { setImage, analyzeImage } = useAgriStore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('请上传图片文件')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const imageData = e.target?.result as string
      setImage(imageData)
      analyzeImage(imageData)
    }
    reader.readAsDataURL(file)
  }, [setImage, analyzeImage])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  // 调用摄像头
  const handleCamera = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.capture = 'environment'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) handleFile(file)
    }
    input.click()
  }

  return (
    <div className="space-y-4">
      {/* 拖拽上传区 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`upload-zone rounded-2xl p-8 text-center cursor-pointer ${isDragging ? 'dragover' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-agri-green/10 flex items-center justify-center">
          <svg className="w-10 h-10 text-agri-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>

        <p className="text-agri-earth font-medium mb-2">点击或拖拽上传图片</p>
        <p className="text-sm text-agri-earth/60">支持 JPG、PNG 格式</p>
      </motion.div>

      {/* 拍照按钮 */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onClick={handleCamera}
        className="w-full touch-btn bg-agri-green text-white rounded-xl flex items-center justify-center gap-3"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        拍照识别
      </motion.button>

      {/* 示例图片 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="pt-4"
      >
        <p className="text-xs text-agri-earth/60 mb-3">或选择示例图片体验：</p>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {['水稻叶片', '玉米茎秆', '小麦穗部', '番茄果实'].map((name, i) => (
            <button
              key={i}
              onClick={() => {
                // 使用占位图模拟
                const mockImage = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%2322c55e' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' fill='white' text-anchor='middle' dy='.3em'%3E${encodeURIComponent(name)}%3C/text%3E%3C/svg%3E`
                setImage(mockImage)
                analyzeImage(mockImage)
              }}
              className="flex-shrink-0 w-20 h-20 rounded-xl bg-agri-green/10 flex items-center justify-center text-xs text-agri-earth hover:bg-agri-green/20 transition-colors"
            >
              {name}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
