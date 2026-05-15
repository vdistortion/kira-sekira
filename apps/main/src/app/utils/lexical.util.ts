/**
 * Извлекает простой текст из Lexical richText объекта.
 * Payload возвращает структуру вида:
 * {
 *   root: {
 *     children: [
 *       { type: 'paragraph', children: [{ type: 'text', text: '...' }] },
 *       ...
 *     ]
 *   }
 * }
 */

export function extractTextFromLexical(lexical: any): string {
  if (!lexical || !lexical.root || !lexical.root.children) {
    return '';
  }

  const texts: string[] = [];

  function traverse(node: any) {
    if (!node) return;

    if (node.type === 'text' && node.text) {
      texts.push(node.text);
    }

    if (node.children && Array.isArray(node.children)) {
      node.children.forEach((child: any) => traverse(child));
    }
  }

  lexical.root.children.forEach((child: any) => traverse(child));
  return texts.join(' ');
}

/**
 * Конвертирует Lexical в простой HTML (параграфы, жирный, курсив).
 * Для более сложного рендера используй @payloadcms/richtext-lexical/react
 */
export function lexicalToHtml(lexical: any): string {
  if (!lexical || !lexical.root || !lexical.root.children) {
    return '';
  }

  let html = '';

  function traverse(node: any): string {
    if (!node) return '';

    // Текстовый узел
    if (node.type === 'text') {
      let text = node.text || '';
      if (node.bold) text = `<strong>${text}</strong>`;
      if (node.italic) text = `<em>${text}</em>`;
      if (node.underline) text = `<u>${text}</u>`;
      return text;
    }

    // Параграф
    if (node.type === 'paragraph') {
      const content = (node.children || []).map((child: any) => traverse(child)).join('');
      return `<p>${content}</p>`;
    }

    // Заголовок
    if (node.type === 'heading') {
      const level = node.tag || 'h2';
      const content = (node.children || []).map((child: any) => traverse(child)).join('');
      return `<${level}>${content}</${level}>`;
    }

    // Список
    if (node.type === 'list') {
      const tag = node.listType === 'number' ? 'ol' : 'ul';
      const items = (node.children || [])
        .map((child: any) => `<li>${traverse(child)}</li>`)
        .join('');
      return `<${tag}>${items}</${tag}>`;
    }

    if (node.type === 'listitem') {
      return (node.children || []).map((child: any) => traverse(child)).join('');
    }

    // Рекурсивно обходим детей
    if (node.children && Array.isArray(node.children)) {
      return node.children.map((child: any) => traverse(child)).join('');
    }

    return '';
  }

  lexical.root.children.forEach((child: any) => {
    html += traverse(child);
  });

  return html;
}
