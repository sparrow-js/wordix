import type { InputForm, ChatItem } from './type'
import { InputVarType } from './type'
import { getProcessedFiles } from '@/components/base/file-uploader/utils'

export const processOpeningStatement = (openingStatement: string, inputs: Record<string, any>, inputsForm: InputForm[]) => {
  if (!openingStatement)
    return openingStatement

  return openingStatement.replace(/\{\{([^}]+)\}\}/g, (match, key) => {
    const name = inputs[key]
    if (name) { // has set value
      return name
    }

    const valueObj = inputsForm.find(v => v.variable === key)
    return valueObj ? `{{${valueObj.label}}}` : match
  })
}

export const getProcessedInputs = (inputs: Record<string, any>, inputsForm: InputForm[]) => {
  const processedInputs = { ...inputs }

  inputsForm.forEach((item) => {
    if (item.type === InputVarType.multiFiles && inputs[item.variable])
      processedInputs[item.variable] = getProcessedFiles(inputs[item.variable])

    if (item.type === InputVarType.singleFile && inputs[item.variable])
      processedInputs[item.variable] = getProcessedFiles([inputs[item.variable]])[0]
  })

  return processedInputs
}


export function getLastAnswer(chatList: ChatItem[]) {
  for (let i = chatList.length - 1; i >= 0; i--) {
    const item = chatList[i]
    if (item.isAnswer && !item.isOpeningStatement)
      return item
  }
  return null
}