# root-cli 実装メモ

## 実装方針

- 指示された機能のみを実装する
- 余計な機能は追加しない

## アーキテクチャ

### デーモン・コマンド方式

1. **デーモンプロセス**: `node cli.js` で起動し、Root robot に BLE 接続を維持
2. **コマンドプロセス**: `node cli.js <command>` で起動し、Unix ソケット経由でデーモンにコマンドを送信
3. **IPC通信**: `/tmp/root-cli/daemon.sock` を使用してプロセス間通信

### ファイル構成

- `cli.js`: エントリーポイント。引数なしでデーモン起動、引数ありでコマンド実行
- `commands/daemon.js`: デーモンプロセス。BLE接続維持とIPCサーバー
- `commands/forward.js`: 前進コマンド。IPCクライアント
- `lib/ipc.js`: IPC通信の共通処理
- `lib/protocol.js`: Root robot のプロトコル実装 (CRC8, コマンドビルダー)

## 実装した機能

### デーモン

`node cli.js` で Root robot に接続し、接続を維持。Ctrl-C で切断して終了。

### 前進コマンド

`node cli.js forward <distance>` で指定距離 (mm) 前進。

参考コード: `scratch2root/scratch-vm/src/extensions/scratch3_scratch2root/index.js`

## 使用技術

- Node.js (ES modules)
- @abandonware/noble: BLE通信ライブラリ (Node.js環境用)
- commander: CLIフレームワーク
- net: Unix ソケット通信 (IPC)

## 使い方

```bash
npm install

# デーモン起動
node cli.js

# 別ターミナルでコマンド実行
node cli.js forward 100
```
