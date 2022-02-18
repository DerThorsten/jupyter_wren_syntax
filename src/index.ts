import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { ICodeMirror } from '@jupyterlab/codemirror';

function registerWrenFileType(app: JupyterFrontEnd) {
  app.docRegistry.addFileType({
    name: 'wren',
    displayName: 'wren',
    extensions: ['wren'],
    mimeTypes: ['text/x-wren']
  });
}

function defineWrenCodeMirrorMode(code_mirror_singleton: any) {
  (code_mirror_singleton as any).defineSimpleMode('wren', {
    // The start state contains the rules that are initially used
    start: [
      // The regex matches the token, the token property contains the type
      { regex: /"(?:[^\\]|\\.)*?(?:"|$)/, token: 'string' },
      // You can match multiple tokens at once. Note that the captured
      // groups must span the whole string in this case
      {
        regex: /(function)(\s+)([a-z$][\w$]*)/,
        token: ['keyword', null, 'variable-2']
      },
      // Rules are matched in the order in which they appear, so there is
      // no ambiguity between this one and the one above
      {
        regex:
          /(?:function|as|break|class|construct|continue|else|false|for|foreign|if|import|in|is|null|return|static|super|this|true|var|while)\b/,
        token: 'keyword'
      },
      { regex: /true|false|null/, token: 'atom' },
      {
        regex: /0x[a-f\d]+|[-+]?(?:\.\d+|\d+\.?\d*)(?:e[-+]?\d+)?/i,
        token: 'number'
      },
      { regex: /\/\/.*/, token: 'comment' },
      { regex: /\/(?:[^\\]|\\.)*?\//, token: 'variable-3' },
      // A next property will cause the mode to move to a different state
      { regex: /\/\*/, token: 'comment', next: 'comment' },
      { regex: /[-+/*=<>!~.%?:]+/, token: 'operator' },
      // indent and dedent properties guide autoindentation
      { regex: /[{[(]/, indent: true },
      { regex: /[}]\)]/, dedent: true },
      { regex: /[a-z$][\w$]*/, token: 'variable' }
    ],
    // The multi-line comment state.
    comment: [
      { regex: /.*?\*\//, token: 'comment', next: 'start' },
      { regex: /.*/, token: 'comment' }
    ],
    // The meta property contains global information about the mode. It
    // can contain properties like lineComment, which are supported by
    // all modes, and also directives like dontIndentStates, which are
    // specific to simple modes.
    meta: {
      dontIndentStates: ['comment'],
      lineComment: '//'
    }
  });

  (code_mirror_singleton as any).defineMIME('text/x-wren', 'wren');

  (code_mirror_singleton as any).modeInfo.push({
    ext: ['wren'],
    mime: 'text/x-wren',
    mode: 'wren',
    name: 'wren'
  });
}

/**
 * Initialization data for the jupyter-wren-syntax extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyter-wren-syntax:plugin',
  autoStart: true,
  requires: [ICodeMirror],
  activate: (app: JupyterFrontEnd, codeMirror: ICodeMirror) => {
    registerWrenFileType(app);
    defineWrenCodeMirrorMode(codeMirror.CodeMirror);
  }
};

export default plugin;
