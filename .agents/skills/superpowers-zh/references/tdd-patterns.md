# TDD 模式與範例

## 模式 1: 最小實作 (Fake It Until You Make It)
當你不確定複雜邏輯如何實作時，先回傳一個常數使測試通過。
1. 測試：`expect(add(1, 1)).toBe(2)`
2. 實作：`const add = () => 2;`
3. 重構：將 `2` 改為 `a + b`。

## 模式 2: 三角測量 (Triangulation)
使用兩個以上的測試案例來歸納出通用的實作。
1. 案例 A：`add(1, 1) -> 2`
2. 案例 B：`add(1, 2) -> 3`
3. 實作：現在可以確定邏輯是 `a + b` 而非固定的 `2`。

## 模式 3: 顯著錯誤 (Obvious Implementation)
如果你已經知道如何實作，直接寫出正確的邏輯。

## 針對 React 的 TDD
1. 使用 `Vitest` 或 `Jest` + `React Testing Library`。
2. 優先測試使用者的行為（例如點擊、輸入）而非內部狀態。
3. 範例：
   ```typescript
   // 測試案例
   test('點擊按鈕後應顯示成功訊息', async () => {
     render(<MyComponent />);
     fireEvent.click(screen.getByText('送出'));
     expect(await screen.findByText('成功')).toBeInTheDocument();
   });
   ```
