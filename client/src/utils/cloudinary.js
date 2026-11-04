const insert = (url, transformation) => url.replace('/upload/', `/upload/${transformation}/`);

const safeName = (name = '') =>
  name
    .replace(/\.[^.]+$/, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Za-z0-9_-]+/g, '_')
    .slice(0, 60) || 'document';

export const thumbnailUrl = (doc) =>
  doc.mimeType === 'application/pdf'
    ? insert(doc.url, 'pg_1,c_fill,w_400,h_260').replace(/\.pdf$/i, '.jpg')
    : insert(doc.url, 'c_fill,w_400,h_260,q_auto,f_auto');

export const downloadUrl = (doc) => insert(doc.url, `fl_attachment:${safeName(doc.name)}`);