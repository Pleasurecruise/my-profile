interface OgMeta {
  title: string;
  description: string;
  imageUrl: string;
  pageUrl: string;
  type?: "website" | "article";
}

export function injectOgTags(response: Response, meta: OgMeta): Response {
  const { title, description, imageUrl, pageUrl, type = "website" } = meta;
  const content = (v: string) => setAttr("content", v);
  const setAttr = (name: string, value: string) => ({
    element: (el: Element) => void el.setAttribute(name, value),
  });

  return new HTMLRewriter()
    .on("title", { element: (el) => void el.setInnerContent(title) })
    .on('link[rel="canonical"]', setAttr("href", pageUrl))
    .on('meta[name="description"]', content(description))
    .on('meta[property="og:title"]', content(title))
    .on('meta[property="og:description"]', content(description))
    .on('meta[property="og:image"]', content(imageUrl))
    .on('meta[property="og:url"]', content(pageUrl))
    .on('meta[property="og:type"]', content(type))
    .on('meta[name="twitter:title"]', content(title))
    .on('meta[name="twitter:description"]', content(description))
    .on('meta[name="twitter:image"]', content(imageUrl))
    .transform(response);
}
