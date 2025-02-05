import TurndownService from 'turndown';
import type { ImageType } from '../readFile/type';
import { getNanoid } from '../tools';

// @ts-ignore
const turndownPluginGfm = require('joplin-turndown-plugin-gfm');




export const matchMdImgTextAndUpload = (text: string) => {
  const base64Regex = /!\[([^\]]*)\]\((data:image\/[^;]+;base64[^)]+)\)/g;
  const imageList: ImageType[] = [];

  text = text.replace(base64Regex, (match, altText, base64Url) => {
    const uuid = `IMAGE_${getNanoid(12)}_IMAGE`;
    const mime = base64Url.split(';')[0].split(':')[1];
    const base64 = base64Url.split(',')[1];

    imageList.push({
      uuid,
      base64,
      mime
    });

    // 保持原有的 alt 文本，只替换 base64 部分
    return `![${altText}](${uuid})`;
  });

  return {
    text,
    imageList
  };
};


export const html2md = (
  html: string
): {
  rawText: string;
  imageList: ImageType[];
} => {
  const turndownService = new TurndownService({
    headingStyle: 'atx',
    bulletListMarker: '-',
    codeBlockStyle: 'fenced',
    fence: '```',
    emDelimiter: '_',
    strongDelimiter: '**',
    linkStyle: 'inlined',
    linkReferenceStyle: 'full'
  });

  try {
    turndownService.remove(['i', 'script', 'iframe', 'style']);
    turndownService.use(turndownPluginGfm.gfm);

    const { text, imageList } = matchMdImgTextAndUpload(html);

    return {
      rawText: turndownService.turndown(text),
      imageList
    };
  } catch (error) {
    console.log('html 2 markdown error', error);
    return {
      rawText: '',
      imageList: []
    };
  }
};
