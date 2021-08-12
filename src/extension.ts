import * as vscode from 'vscode';

let ctrl: vscode.TestController | undefined = undefined;

export async function activate(context: vscode.ExtensionContext) {
  const populateExternalTestRun = () => {
    if (!ctrl) return;
    try {
      const parent = ctrl.items.get('TestParent') as vscode.TestItem;
      const test1 = parent.children.get('Test1') as vscode.TestItem;
      const test2 = parent.children.get('Test2') as vscode.TestItem;

      const testRun = ctrl.createTestRun(new vscode.TestRunRequest(), 'duration-bug', false);
      testRun.passed(test1, 1000);
      testRun.passed(test2, 2000);
      testRun.end();

    } catch (e) {
      console.error(e);
    }
  };

  context.subscriptions.push(vscode.commands.registerCommand('duration-bug.initializeTests', () => {
    if (ctrl === undefined) {
      ctrl = vscode.tests.createTestController('duration-bug', 'duration-bug');
      const parent = ctrl.createTestItem('TestParent', 'Test Parent');
      parent.children.add(ctrl.createTestItem('Test1', 'Test 1'));
      parent.children.add(ctrl.createTestItem('Test2', 'Test 2'));
      ctrl.items.add(parent);
      context.subscriptions.push(ctrl);

      populateExternalTestRun();
    }
  }));

  context.subscriptions.push(vscode.commands.registerCommand('duration-bug.populateExternalTestRun', () => {
    populateExternalTestRun();
  }));
}
