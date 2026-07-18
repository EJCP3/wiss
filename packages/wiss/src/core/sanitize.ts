const ALLOWED_TAGS = new Set(['B', 'I', 'STRONG', 'EM', 'A', 'SPAN', 'BR', 'CODE', 'U']);
const ALLOWED_ATTRS = new Set(['href', 'target', 'rel', 'class', 'style']);

export function sanitizeHtml(html: string): HTMLSpanElement {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const span = document.createElement('span');

  function sanitizeNode(node: Node): Node | null {
    if (node.nodeType === Node.TEXT_NODE) {
      return document.createTextNode(node.textContent || '');
    }
    
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element;
      const tagName = el.tagName.toUpperCase();

      if (ALLOWED_TAGS.has(tagName)) {
        const cloned = document.createElement(tagName);
        
        Array.from(el.attributes).forEach((attr) => {
          const attrName = attr.name.toLowerCase();
          if (ALLOWED_ATTRS.has(attrName)) {
            // Prevent javascript: hrefs
            if (attrName === 'href' && attr.value.trim().toLowerCase().startsWith('javascript:')) {
              return;
            }
            cloned.setAttribute(attr.name, attr.value);
          }
        });

        Array.from(el.childNodes).forEach((child) => {
          const sanitizedChild = sanitizeNode(child);
          if (sanitizedChild) cloned.appendChild(sanitizedChild);
        });
        
        return cloned;
      } else {
        // Tag not allowed: extract its children directly
        const wrapper = document.createDocumentFragment();
        Array.from(el.childNodes).forEach((child) => {
          const sanitizedChild = sanitizeNode(child);
          if (sanitizedChild) wrapper.appendChild(sanitizedChild);
        });
        return wrapper;
      }
    }
    return null;
  }

  Array.from(doc.body.childNodes).forEach((child) => {
    const sanitized = sanitizeNode(child);
    if (sanitized) span.appendChild(sanitized);
  });

  return span;
}
