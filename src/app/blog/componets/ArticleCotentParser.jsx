import React from 'react';
import parse from 'html-react-parser';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';

SyntaxHighlighter.registerLanguage('jsx', jsx);

function HTMLContentParser({ content }) {
  const extractCode = (node) => {
    if (node.type === 'text') {
      return node.data;
    }
    if (node.children && node.children.length > 0) {
      return node.children.map(extractCode).join('');
    }
    return '';
  };

  const parseOptions = {
    replace: (domNode) => {
      if (domNode.type === 'tag') {
        switch (domNode.name) {
          case 'h1':
            return <h2 className="text-4xl font-bold mb-4">{domNode.children[0].data}</h2>;
          case 'p':
            return (
              <p className="mb-4">
                {domNode.children.map((child, index) => (child.type === 'tag' && child.name === 'img'
                  ? (
                    <img
                      key={`img-${index}-${child.attribs.src}`}
                      src={child.attribs.src}
                      alt={child.attribs.alt}
                      className="max-w-full h-auto my-2"
                    />
                  )
                  : child.data || ''))}
              </p>
            );
          case 'img':
            return (
              <img
                key={`img-${domNode.attribs.src}`}
                src={domNode.attribs.src}
                alt={domNode.attribs.alt}
                className="max-w-full h-auto my-2"
              />
            );
          case 'blockquote':
            return (
              <div className="border-l-4 border-primary pl-2 my-2 w-full">
                <p className="italic">{domNode.children[0].data}</p>
              </div>
            );
          case 'pre':
            const code = extractCode(domNode);
            const language = domNode.attribs['data-language'] || 'javascript';
            return (
              <div className="my-2 rounded-lg">
                <SyntaxHighlighter language={language} style={prism}>
                  {code}
                </SyntaxHighlighter>
              </div>
            );
          default:
            return domNode;
        }
      }
    },
  };

  return <>{parse(content, parseOptions)}</>;
}

export default HTMLContentParser;