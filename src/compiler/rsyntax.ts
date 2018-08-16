import * as parse5 from 'parse5';

/**
 * @file r tag ast compile
 * add more syntactic sugar
 */

export default abstract class Rsyntax {
    static ast: any;

    static compile(html) {
        const ast = this.ast = parse5.parseFragment(html)['childNodes'][0];
        let funcs = {};
        let context;
        let source;
        
        ast.attrs.forEach(attr => {
            switch (attr.name) {
                case 'source':
                    source = attr.value;
                    break;
                case 'context':
                    context = attr.value;
                    break;
            }

            if (/^e-/.test(attr.name)) {
                funcs[attr.name.replace('e-', '')] = attr.value;
            }
        });

        return this.toRenderFunc(context, source, funcs);
    }

    static toRenderFunc(context, source, funcs) {
        let code = `with(this){start('${source}', node, {`;
        
        for (let key in funcs) {
            code += `'${key}': ${context}.${funcs[key]}`;
        }

        code += `});}`;

        return new Function(code);
    }
}