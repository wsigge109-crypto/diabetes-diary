import { SITE_URL } from '../utils/seo.js';

export default function Seo({ title, description, path, robots }) {
  const url = `${SITE_URL}${path}`;

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {robots ? <meta name="robots" content={robots} /> : null}
    </>
  );
}
