// React
import { useEffect } from "react";

export default function PageMeta({
  title = "Readymate",
  description = "Readymate application",
  keywords = "",
}) {
  useEffect(() => {
    document.title = title;

    const setMetaTag = (name, content) => {
      if (!content) return;

      let metaTag = document.querySelector(`meta[name="${name}"]`);

      if (!metaTag) {
        metaTag = document.createElement("meta");
        metaTag.setAttribute("name", name);
        document.head.appendChild(metaTag);
      }

      metaTag.setAttribute("content", content);
    };

    setMetaTag("description", description);
    setMetaTag("keywords", keywords);
  }, [title, description, keywords]);

  return null;
}
