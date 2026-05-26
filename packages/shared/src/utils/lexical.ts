export function extractTextFromLexical(lexical: any): string {
  if (!lexical?.root?.children) return '';

  const texts: string[] = [];

  function traverse(node: any) {
    if (!node) return;
    if (node.type === 'text' && node.text) texts.push(node.text);
    if (Array.isArray(node.children)) node.children.forEach(traverse);
  }

  lexical.root.children.forEach(traverse);
  return texts.join(' ');
}

export function lexicalToHtml(lexical: any): string {
  if (!lexical?.root?.children) return '';

  function traverse(node: any): string {
    if (!node) return '';

    if (node.type === 'text') {
      let text = node.text || '';
      if (node.bold) text = `<strong>${text}</strong>`;
      if (node.italic) text = `<em>${text}</em>`;
      if (node.underline) text = `<u>${text}</u>`;
      return text;
    }

    if (node.type === 'paragraph') {
      const content = (node.children || []).map(traverse).join('');
      return `<p>${content}</p>`;
    }

    if (node.type === 'heading') {
      const level = node.tag || 'h2';
      const content = (node.children || []).map(traverse).join('');
      return `<${level}>${content}</${level}>`;
    }

    if (node.type === 'list') {
      const tag = node.listType === 'number' ? 'ol' : 'ul';
      const items = (node.children || [])
        .map((child: any) => `<li>${traverse(child)}</li>`)
        .join('');
      return `<${tag}>${items}</${tag}>`;
    }

    if (node.type === 'listitem') {
      return (node.children || []).map(traverse).join('');
    }

    if (Array.isArray(node.children)) {
      return node.children.map(traverse).join('');
    }

    return '';
  }

  return lexical.root.children.map(traverse).join('');
}
