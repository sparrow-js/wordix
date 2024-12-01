'use client'
import { useState } from 'react'
import copy from 'copy-to-clipboard'
import s from './style.module.css'
import {Tooltip} from '@/components/ui/Tooltip'

type ICopyBtnProps = {
  value: string
  className?: string
  isPlain?: boolean
}

const CopyBtn = ({
  value,
  className,
  isPlain,
}: ICopyBtnProps) => {
  const [isCopied, setIsCopied] = useState(false)

  return (
    <div className={`${className}`}>
      <Tooltip
        title={(isCopied ? 'copied' : 'copy')}
      >
        <div
          className={'box-border p-0.5 flex items-center justify-center rounded-md bg-white cursor-pointer'}
          style={!isPlain
            ? {
              boxShadow: '0px 4px 8px -2px rgba(16, 24, 40, 0.1), 0px 2px 4px -2px rgba(16, 24, 40, 0.06)',
            }
            : {}}
          onClick={() => {
            copy(value)
            setIsCopied(true)
          }}
        >
          <div className={`w-6 h-6 rounded-md hover:bg-gray-50  ${s.copyIcon} ${isCopied ? s.copied : ''}`}></div>
        </div>
      </Tooltip>
    </div>
  )
}

export default CopyBtn
