import * as monacoEditor from 'monaco-editor';

/* eslint-disable no-template-curly-in-string */
export const getSuggestions = (
  position: monacoEditor.Position,
  model: monacoEditor.editor.ITextModel
): monacoEditor.languages.CompletionItem[] => {
  const word = model.getWordUntilPosition(position);
  const range = {
    startLineNumber: position.lineNumber,
    startColumn: word.startColumn,
    endLineNumber: position.lineNumber,
    endColumn: word.endColumn,
  };

  const suggestionsWithUsings: Array<{ suggestion: monacoEditor.languages.CompletionItem; using?: string }> = [
    // Console
    {
      suggestion: {
        label: 'Console.WriteLine',
        kind: monacoEditor.languages.CompletionItemKind.Function,
        insertText: 'Console.WriteLine(${1:message});',
        insertTextRules: monacoEditor.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Writes the specified data, followed by the current line terminator, to the standard output stream.',
        range: range,
      },
      using: 'System',
    },
    {
      suggestion: {
        label: 'Console.ReadLine',
        kind: monacoEditor.languages.CompletionItemKind.Function,
        insertText: 'Console.ReadLine();',
        documentation: 'Reads the next line of characters from the standard input stream.',
        range: range,
      },
      using: 'System',
    },
    {
      suggestion: {
        label: 'Console.Clear',
        kind: monacoEditor.languages.CompletionItemKind.Function,
        insertText: 'Console.Clear();',
        documentation: 'Clears the console buffer and corresponding console window of display information.',
        range: range,
      },
      using: 'System',
    },

    // Loops
    {
      suggestion: {
        label: 'for loop',
        kind: monacoEditor.languages.CompletionItemKind.Snippet,
        insertText: 'for (int ${1:i} = 0; ${1:i} < ${2:count}; ${1:i}++) {\n\t$0\n}',
        insertTextRules: monacoEditor.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Basic for loop',
        range: range,
      },
      using: undefined,
    },
    {
      suggestion: {
        label: 'foreach loop',
        kind: monacoEditor.languages.CompletionItemKind.Snippet,
        insertText: 'foreach (var ${1:item} in ${2:collection}) {\n\t$0\n}',
        insertTextRules: monacoEditor.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Iterates through the items in a collection.',
        range: range,
      },
      using: undefined,
    },
    {
      suggestion: {
        label: 'while loop',
        kind: monacoEditor.languages.CompletionItemKind.Snippet,
        insertText: 'while (${1:condition}) {\n\t$0\n}',
        insertTextRules: monacoEditor.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Executes a block of statements as long as the condition evaluates to true.',
        range: range,
      },
      using: undefined,
    },
    {
      suggestion: {
        label: 'do-while loop',
        kind: monacoEditor.languages.CompletionItemKind.Snippet,
        insertText: 'do {\n\t$0\n} while (${1:condition});',
        insertTextRules: monacoEditor.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Executes a block of statements at least once and then repeats while the condition evaluates to true.',
        range: range,
      },
      using: undefined,
    },

    // Conditionals
    {
      suggestion: {
        label: 'if statement',
        kind: monacoEditor.languages.CompletionItemKind.Snippet,
        insertText: 'if (${1:condition}) {\n\t$0\n}',
        insertTextRules: monacoEditor.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Executes a block of code if the condition evaluates to true.',
        range: range,
      },
      using: undefined,
    },
    {
      suggestion: {
        label: 'else',
        kind: monacoEditor.languages.CompletionItemKind.Keyword,
        insertText: 'else {\n\t$0\n}',
        documentation: 'Executes a block of code if the corresponding if condition evaluates to false.',
        range: range,
      },
      using: undefined,
    },
    {
      suggestion: {
        label: 'switch',
        kind: monacoEditor.languages.CompletionItemKind.Snippet,
        insertText: 'switch (${1:variable}) {\n\tcase ${2:case1}:\n\t\t$0\n\t\tbreak;\n\tdefault:\n\t\tbreak;\n}',
        insertTextRules: monacoEditor.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Executes a block of code depending on the value of the variable.',
        range: range,
      },
      using: undefined,
    },

    // Class and Namespace
    {
      suggestion: {
        label: 'class',
        kind: monacoEditor.languages.CompletionItemKind.Snippet,
        insertText: 'class ${1:ClassName} {\n\t$0\n}',
        insertTextRules: monacoEditor.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Defines a new class.',
        range: range,
      },
      using: undefined,
    },
    {
      suggestion: {
        label: 'namespace',
        kind: monacoEditor.languages.CompletionItemKind.Snippet,
        insertText: 'namespace ${1:NamespaceName} {\n\t$0\n}',
        insertTextRules: monacoEditor.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Defines a namespace to organize code.',
        range: range,
      },
      using: undefined,
    },
    {
      suggestion: {
        label: 'interface',
        kind: monacoEditor.languages.CompletionItemKind.Snippet,
        insertText: 'interface ${1:InterfaceName} {\n\t$0\n}',
        insertTextRules: monacoEditor.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Defines a new interface.',
        range: range,
      },
      using: undefined,
    },
    {
      suggestion: {
        label: 'struct',
        kind: monacoEditor.languages.CompletionItemKind.Snippet,
        insertText: 'struct ${1:StructName} {\n\t$0\n}',
        insertTextRules: monacoEditor.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Defines a value type that can encapsulate data and related functionality.',
        range: range,
      },
      using: undefined,
    },

    // Access Modifiers
    {
      suggestion: {
        label: 'public',
        kind: monacoEditor.languages.CompletionItemKind.Keyword,
        insertText: 'public',
        documentation: 'Defines a public access modifier.',
        range: range,
      },
      using: undefined,
    },
    {
      suggestion: {
        label: 'private',
        kind: monacoEditor.languages.CompletionItemKind.Keyword,
        insertText: 'private',
        documentation: 'Defines a private access modifier.',
        range: range,
      },
      using: undefined,
    },
    {
      suggestion: {
        label: 'protected',
        kind: monacoEditor.languages.CompletionItemKind.Keyword,
        insertText: 'protected',
        documentation: 'Defines a protected access modifier.',
        range: range,
      },
      using: undefined,
    },
    {
      suggestion: {
        label: 'internal',
        kind: monacoEditor.languages.CompletionItemKind.Keyword,
        insertText: 'internal',
        documentation: 'Defines an internal access modifier.',
        range: range,
      },
      using: undefined,
    },

    // Data Types
    {
      suggestion: {
        label: 'int',
        kind: monacoEditor.languages.CompletionItemKind.Keyword,
        insertText: 'int',
        documentation: 'Represents a 32-bit integer.',
        range: range,
      },
      using: undefined,
    },
    {
      suggestion: {
        label: 'string',
        kind: monacoEditor.languages.CompletionItemKind.Keyword,
        insertText: 'string',
        documentation: 'Represents a sequence of characters.',
        range: range,
      },
      using: undefined,
    },
    {
      suggestion: {
        label: 'bool',
        kind: monacoEditor.languages.CompletionItemKind.Keyword,
        insertText: 'bool',
        documentation: 'Represents a boolean value (true or false).',
        range: range,
      },
      using: undefined,
    },
    {
      suggestion: {
        label: 'double',
        kind: monacoEditor.languages.CompletionItemKind.Keyword,
        insertText: 'double',
        documentation: 'Represents a double-precision floating point number.',
        range: range,
      },
      using: undefined,
    },
    {
      suggestion: {
        label: 'List<T>',
        kind: monacoEditor.languages.CompletionItemKind.Snippet,
        insertText: 'List<${1:Type}> ${2:listName} = new List<${1:Type}>();',
        insertTextRules: monacoEditor.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Represents a strongly-typed list of objects.',
        range: range,
      },
      using: 'System.Collections.Generic',
    },
    {
      suggestion: {
        label: 'Dictionary<TKey, TValue>',
        kind: monacoEditor.languages.CompletionItemKind.Snippet,
        insertText: 'Dictionary<${1:TKey}, ${2:TValue}> ${3:dictionaryName} = new Dictionary<${1:TKey}, ${2:TValue}>();',
        insertTextRules: monacoEditor.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Represents a collection of keys and values.',
        range: range,
      },
      using: 'System.Collections.Generic',
    },

    // Miscellaneous
    {
      suggestion: {
        label: 'return',
        kind: monacoEditor.languages.CompletionItemKind.Keyword,
        insertText: 'return ${1:value};',
        documentation: 'Exits the current method and optionally returns a value.',
        range: range,
      },
      using: undefined,
    },
    {
      suggestion: {
        label: 'null',
        kind: monacoEditor.languages.CompletionItemKind.Keyword,
        insertText: 'null',
        documentation: 'Represents the null value.',
        range: range,
      },
      using: undefined,
    },
    {
      suggestion: {
        label: 'new',
        kind: monacoEditor.languages.CompletionItemKind.Keyword,
        insertText: 'new ${1:Type}(${2:args});',
        documentation: 'Creates a new instance of a class.',
        range: range,
      },
      using: undefined,
    },
    {
      suggestion: {
        label: 'using directive',
        kind: monacoEditor.languages.CompletionItemKind.Snippet,
        insertText: 'using ${1:NamespaceName};',
        insertTextRules: monacoEditor.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Imports a namespace into the current file.',
        range: range,
      },
      using: undefined,
    },
    {
      suggestion: {
        label: 'lock',
        kind: monacoEditor.languages.CompletionItemKind.Snippet,
        insertText: 'lock (${1:lockObject}) {\n\t$0\n}',
        insertTextRules: monacoEditor.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Provides a mechanism that synchronizes access to objects.',
        range: range,
      },
      using: undefined,
    },
    {
      suggestion: {
        label: 'nameof',
        kind: monacoEditor.languages.CompletionItemKind.Keyword,
        insertText: 'nameof(${1:variable});',
        documentation: 'Gets the name of a variable, type, or member as a string.',
        range: range,
      },
      using: undefined,
    },
    {
      suggestion: {
        label: 'try-catch',
        kind: monacoEditor.languages.CompletionItemKind.Snippet,
        insertText: 'try {\n\t$0\n} catch (${1:Exception} ${2:ex}) {\n\t\n}',
        insertTextRules: monacoEditor.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Handles exceptions that occur during program execution.',
        range: range,
      },
      using: undefined,
    },
    {
      suggestion: {
        label: 'throw',
        kind: monacoEditor.languages.CompletionItemKind.Snippet,
        insertText: 'throw new ${1:Exception}(${2:message});',
        insertTextRules: monacoEditor.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Throws a new exception.',
        range: range,
      },
      using: undefined,
    },
    {
      suggestion: {
        label: 'try-finally',
        kind: monacoEditor.languages.CompletionItemKind.Snippet,
        insertText: 'try {\n\t$0\n} finally {\n\t\n}',
        insertTextRules: monacoEditor.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Executes a block of code, ensuring that a finally block is executed afterward.',
        range: range,
      },
      using: undefined,
    },

    // Async and Await
    {
      suggestion: {
        label: 'async method',
        kind: monacoEditor.languages.CompletionItemKind.Snippet,
        insertText: 'async Task ${1:MethodName}(${2:parameters}) {\n\t$0\n}',
        insertTextRules: monacoEditor.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Defines an asynchronous method.',
        range: range,
      },
      using: 'System.Threading.Tasks',
    },
    {
      suggestion: {
        label: 'await',
        kind: monacoEditor.languages.CompletionItemKind.Keyword,
        insertText: 'await ${1:Task};',
        documentation: 'Waits asynchronously for the completion of a Task.',
        range: range,
      },
      using: 'System.Threading.Tasks',
    },

    // LINQ Methods
    {
      suggestion: {
        label: 'LINQ Select',
        kind: monacoEditor.languages.CompletionItemKind.Snippet,
        insertText: '${1:collection}.Select(${2:item} => ${3:expression});',
        insertTextRules: monacoEditor.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Projects each element of a sequence into a new form.',
        range: range,
      },
      using: 'System.Linq',
    },
    {
      suggestion: {
        label: 'LINQ Where',
        kind: monacoEditor.languages.CompletionItemKind.Snippet,
        insertText: '${1:collection}.Where(${2:item} => ${3:condition});',
        insertTextRules: monacoEditor.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Filters a sequence of values based on a predicate.',
        range: range,
      },
      using: 'System.Linq',
    },

    // File IO
    {
      suggestion: {
        label: 'File.ReadAllText',
        kind: monacoEditor.languages.CompletionItemKind.Function,
        insertText: 'File.ReadAllText(${1:path});',
        documentation: 'Opens a text file, reads all lines of the file, and then closes the file.',
        range: range,
      },
      using: 'System.IO',
    },
    {
      suggestion: {
        label: 'File.WriteAllText',
        kind: monacoEditor.languages.CompletionItemKind.Function,
        insertText: 'File.WriteAllText(${1:path}, ${2:content});',
        documentation: 'Creates a new file, writes the specified string to the file, and then closes the file.',
        range: range,
      },
      using: 'System.IO',
    },

    // Threads and Tasks
    {
      suggestion: {
        label: 'Task.Run',
        kind: monacoEditor.languages.CompletionItemKind.Function,
        insertText: 'Task.Run(() => {\n\t$0\n});',
        documentation: 'Queues the specified work to run on the thread pool and returns a Task object.',
        range: range,
      },
      using: 'System.Threading.Tasks',
    },
    {
      suggestion: {
        label: 'Thread.Sleep',
        kind: monacoEditor.languages.CompletionItemKind.Function,
        insertText: 'Thread.Sleep(${1:milliseconds});',
        documentation: 'Suspends the current thread for the specified amount of time.',
        range: range,
      },
      using: 'System.Threading',
    },

    // Math Methods
    {
      suggestion: {
        label: 'Math.Max',
        kind: monacoEditor.languages.CompletionItemKind.Function,
        insertText: 'Math.Max(${1:value1}, ${2:value2});',
        documentation: 'Returns the larger of two numbers.',
        range: range,
      },
      using: 'System',
    },
    {
      suggestion: {
        label: 'Math.Min',
        kind: monacoEditor.languages.CompletionItemKind.Function,
        insertText: 'Math.Min(${1:value1}, ${2:value2});',
        documentation: 'Returns the smaller of two numbers.',
        range: range,
      },
      using: 'System',
    },
    {
      suggestion: {
        label: 'Math.Round',
        kind: monacoEditor.languages.CompletionItemKind.Function,
        insertText: 'Math.Round(${1:value});',
        documentation: 'Rounds a value to the nearest integral value.',
        range: range,
      },
      using: 'System',
    },

    // Reflection
    {
      suggestion: {
        label: 'typeof',
        kind: monacoEditor.languages.CompletionItemKind.Keyword,
        insertText: 'typeof(${1:Type});',
        documentation: 'Gets the `Type` object for the specified type.',
        range: range,
      },
      using: undefined,
    },
    {
      suggestion: {
        label: 'GetType',
        kind: monacoEditor.languages.CompletionItemKind.Function,
        insertText: '${1:instance}.GetType();',
        documentation: 'Gets the `Type` of the current instance.',
        range: range,
      },
      using: undefined,
    },
  ];

  // 既存の`using`ディレクティブを取得
  const existingUsings = model
    .getValue()
    .split('\n')
    .filter((line) => line.trim().startsWith('using'))
    .map((line) => line.trim());

  // `using` を含めた補完候補の生成
  const suggestions = suggestionsWithUsings.map(({ suggestion, using }) => {
    if (!using || existingUsings.includes(`using ${using};`)) {
      return suggestion;
    }

    // `using` を挿入する位置を決定（ファイルの先頭）
    const firstUsingLine = model
      .getLinesContent()
      .findIndex((line) => line.startsWith('using '));

    const usingRange =
      firstUsingLine !== -1
        ? new monacoEditor.Range(
          firstUsingLine + 1,
          1,
          firstUsingLine + 1,
          1
        )
        : new monacoEditor.Range(1, 1, 1, 1); // `using` がなければファイルの先頭に挿入

    return {
      ...suggestion,
      additionalTextEdits: [
        {
          range: usingRange,
          text: `using ${using};\n`,
        },
      ],
    };
  });

  return suggestions;
};
