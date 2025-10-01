# root-cli 実装メモ

## 実装方針

- 指示された機能のみを実装する
- 余計な機能は追加しない

## 実装した機能

### BLE接続コマンド

`root-cli connect` コマンドで iRobot Root に BLE 接続できる。

参考コード: `scratch2root/scratch-vm/src/extensions/scratch3_scratch2root/index.js` の `connect` 関数 (L203-)

## 使用技術

- Node.js (ES modules)
- @abandonware/noble: BLE通信ライブラリ (Node.js環境用)
- commander: CLIフレームワーク

## 使い方

```bash
npm install
node cli.js connect
```
