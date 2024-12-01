import {
    WholeWord,
    Dot,
    FileText,
    Focus,
} from 'lucide-react';
import { OpenaiIcon } from './icons'

export const generationType = [
    {   
        label: 'Short',
        value: 'short',
        icon: <WholeWord />
    },
    {
        label: 'Sentence',
        value: 'sentence',
        icon: <Dot />
    },
    {
        label: 'Full',
        value: 'full',
        icon: <FileText />
    },
    {
        label: 'Custom',
        value: 'custom',
        icon: <Focus />
    }
];


export const models = [
    {
        "model": "gpt-4o-mini", // 模型名(对应OneAPI中渠道的模型名)
        "name": "gpt-4o-mini", // 模型别名
        "avatar": <OpenaiIcon />, // 模型的logo
        "maxContext": 125000, // 最大上下文
        "maxResponse": 16000, // 最大回复
        "quoteMaxToken": 120000, // 最大引用内容
        "maxTemperature": 1.2, // 最大温度
        "charsPointsPrice": 0, // n积分/1k token（商业版）
        "censor": false, // 是否开启敏感校验（商业版）
        "vision": true, // 是否支持图片输入
        "datasetProcess": true, // 是否设置为文本理解模型（QA），务必保证至少有一个为true，否则知识库会报错
        "usedInClassify": true, // 是否用于问题分类（务必保证至少有一个为true）
        "usedInExtractFields": true, // 是否用于内容提取（务必保证至少有一个为true）
        "usedInToolCall": true, // 是否用于工具调用（务必保证至少有一个为true）
        "usedInQueryExtension": true, // 是否用于问题优化（务必保证至少有一个为true）
        "toolChoice": true, // 是否支持工具选择（分类，内容提取，工具调用会用到。目前只有gpt支持）
        "functionCall": false, // 是否支持函数调用（分类，内容提取，工具调用会用到。会优先使用 toolChoice，如果为false，则使用 functionCall，如果仍为 false，则使用提示词模式）
        "customCQPrompt": "", // 自定义文本分类提示词（不支持工具和函数调用的模型
        "customExtractPrompt": "", // 自定义内容提取提示词
        "defaultSystemChatPrompt": "", // 对话默认携带的系统提示词
        "defaultConfig": {}, // 请求API时，挟带一些默认配置（比如 GLM4 的 top_p）
        "fieldMap": {} // 字段映射（o1 模型需要把 max_tokens 映射为 max_completion_tokens）
      },
      {
        "model": "gpt-4o",
        "name": "gpt-4o",
        "avatar": <OpenaiIcon />,
        "maxContext": 125000,
        "maxResponse": 4000,
        "quoteMaxToken": 120000,
        "maxTemperature": 1.2,
        "charsPointsPrice": 0,
        "censor": false,
        "vision": true,
        "datasetProcess": true,
        "usedInClassify": true,
        "usedInExtractFields": true,
        "usedInToolCall": true,
        "usedInQueryExtension": true,
        "toolChoice": true,
        "functionCall": false,
        "customCQPrompt": "",
        "customExtractPrompt": "",
        "defaultSystemChatPrompt": "",
        "defaultConfig": {},
        "fieldMap": {}
      },
      {
        "model": "o1-mini",
        "name": "o1-mini",
        "avatar": <OpenaiIcon />,
        "maxContext": 125000,
        "maxResponse": 4000,
        "quoteMaxToken": 120000,
        "maxTemperature": 1.2,
        "charsPointsPrice": 0,
        "censor": false,
        "vision": false,
        "datasetProcess": true,
        "usedInClassify": true,
        "usedInExtractFields": true,
        "usedInToolCall": true,
        "usedInQueryExtension": true,
        "toolChoice": false,
        "functionCall": false,
        "customCQPrompt": "",
        "customExtractPrompt": "",
        "defaultSystemChatPrompt": "",
        "defaultConfig": {
          "temperature": 1,
          "stream": false
        },
        "fieldMap": {
          "max_tokens": "max_completion_tokens"
        }
      },
      {
        "model": "o1-preview",
        "name": "o1-preview",
        "avatar": <OpenaiIcon />,
        "maxContext": 125000,
        "maxResponse": 4000,
        "quoteMaxToken": 120000,
        "maxTemperature": 1.2,
        "charsPointsPrice": 0,
        "censor": false,
        "vision": false,
        "datasetProcess": true,
        "usedInClassify": true,
        "usedInExtractFields": true,
        "usedInToolCall": true,
        "usedInQueryExtension": true,
        "toolChoice": false,
        "functionCall": false,
        "customCQPrompt": "",
        "customExtractPrompt": "",
        "defaultSystemChatPrompt": "",
        "defaultConfig": {
          "temperature": 1,
          "stream": false
        },
        "fieldMap": {
          "max_tokens": "max_completion_tokens"
        }
      }
];