import type {
    FC,
    ReactNode,
  } from 'react'
  import { memo, useEffect, useRef, useState } from 'react'
  import type {
    ChatConfig,
    ChatItem,
  } from '../type'

  import BasicContent from './basic-content'

  import { cn } from "@/lib/utils"
  
  type AnswerProps = {
    item: ChatItem
    question: string
    index: number
    config?: ChatConfig
    answerIcon?: ReactNode
    responding?: boolean
    showPromptLog?: boolean
    chatAnswerContainerInner?: string
    hideProcessDetail?: boolean
    appData?: any
    noChatInput?: boolean
  }
  const Answer: FC<AnswerProps> = ({
    item,
    question,
    index,
    config,
    answerIcon,
    responding,
    showPromptLog,
    chatAnswerContainerInner,
    hideProcessDetail,
    appData,
    noChatInput,
  }) => {
    const {
      content,
      citation,
      agent_thoughts,
      more,
      annotation,
      workflowProcess,
      allFiles,
      message_files,
    } = item
    const hasAgentThoughts = !!agent_thoughts?.length
  
    const [containerWidth, setContainerWidth] = useState(0)
    const [contentWidth, setContentWidth] = useState(0)
    const containerRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)
  
    const getContainerWidth = () => {
      if (containerRef.current)
        setContainerWidth(containerRef.current?.clientWidth + 16)
    }
    useEffect(() => {
      getContainerWidth()
    }, [])
  
    const getContentWidth = () => {
      if (contentRef.current)
        setContentWidth(contentRef.current?.clientWidth)
    }
  
    useEffect(() => {
      if (!responding)
        getContentWidth()
    }, [responding])
  
    // Recalculate contentWidth when content changes (e.g., SVG preview/source toggle)
    useEffect(() => {
      if (!containerRef.current)
        return
      const resizeObserver = new ResizeObserver(() => {
        getContentWidth()
      })
      resizeObserver.observe(containerRef.current)
      return () => {
        resizeObserver.disconnect()
      }
    }, [])
  
    return (
      <div className='flex mb-2 last:mb-0'>
        <div className='chat-answer-container group grow w-0 ml-4' ref={containerRef}>
          <div className={cn('group relative pr-10', chatAnswerContainerInner)}>
            <div
              ref={contentRef}
              className={cn('relative inline-block px-4 py-3 max-w-full bg-gray-100 rounded-b-2xl rounded-tr-2xl text-sm text-gray-900', workflowProcess && 'w-full')}
            >
              {
                content && !hasAgentThoughts && (
                  <BasicContent item={item} />
                )
              }
    
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  export default memo(Answer)
  