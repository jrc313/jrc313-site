import katex from 'katex';
import { defineHastPlugin } from 'satteri';

export function satteriKatex(options = {}) {
	const katexOptions = {
		output: 'htmlAndMathml',
		throwOnError: true,
		...options,
	};

	return defineHastPlugin({
		name: 'satteri-katex',

		element: {
			filter: ['code'],

			visit(node, ctx) {
				const className = node.properties?.className;

				if (!Array.isArray(className)) {
					return;
				}

				const isDisplay = className.includes('math-display');
				const isMath = className.includes('language-math');

				if (!isMath) {
					return;
				}

				const tex = node.children
					.filter((child) => child.type === 'text')
					.map((child) => child.value)
					.join('');

				const html = katex.renderToString(tex, {
					...katexOptions,
					displayMode: isDisplay,
				});

				ctx.replaceNode(node, {
					type: 'raw',
					value: html,
				});
			},
		},
	});
}
