import { markdownToHtml, defineMdastPlugin } from 'satteri';
import katex from 'katex';

const satteriKatex = defineMdastPlugin({
  name: 'satteri-katex',

  math(node) {
    console.log('>>> MATH:', node.value);

    return {
      raw: katex.renderToString(node.value, {
        output: 'htmlAndMathml',
        displayMode: true,
      }),
      mdxExpressions: false,
    };
  },

  inlineMath(node) {
    console.log('>>> INLINE MATH:', node.value);

    return {
      raw: katex.renderToString(node.value, {
        output: 'htmlAndMathml',
        displayMode: false,
      }),
      mdxExpressions: false,
    };
  },
});

const markdown = `
Inline math: $x^2 + y^2 = z^2$

Display math:

$$
x^2 + y^2 = z^2
$$
`;

const html = markdownToHtml(markdown, {
  features: {
    math: true,
  },
  mdastPlugins: [satteriKatex],
});

console.log(html);