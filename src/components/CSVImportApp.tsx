import React, { useState } from 'react';
import { Upload, ArrowRight, CheckCircle, AlertCircle, FileText, Columns, Eye, History, Settings, Database, Download, Search, Filter, X, Save, Edit, Trash2, RefreshCw, Calendar, Clock, AlertTriangle, ChevronDown, FileDown } from 'lucide-react';

type CsvRow = Record<string, string>;           // 任意の列名→文字列
type Mapping = Record<string, string>;          // CSV列 → システム項目

const CSVImportApp: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<'upload'|'mapping'|'preview'|'result'|'history'|'data'|'settings'>('upload');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);  // ← File | null を明示
  const [mappings, setMappings] = useState<Mapping>({});                // ← 型付け
  const [searchTerm, setSearchTerm] = useState<string>('');

  const csvColumns: string[] = ['氏名', 'メールアドレス', '電話番号', '住所', '年齢'];
  const systemFields: string[] = ['name', 'email', 'phone', 'address', 'age', 'created_at', 'company', 'department'];

  const previewData: CsvRow[] = [
    { '氏名': '山田太郎', 'メールアドレス': 'yamada@example.com', '電話番号': '090-1234-5678', '住所': '東京都渋谷区', '年齢': '32' },
    { '氏名': '佐藤花子', 'メールアドレス': 'sato@example.com', '電話番号': '080-9876-5432', '住所': '大阪府大阪市', '年齢': '28' },
    { '氏名': '鈴木一郎', 'メールアドレス': 'suzuki@example.com', '電話番号': '070-5555-1234', '住所': '愛知県名古屋市', '年齢': '45' }
  ];

  const historyData = [
    { id: 1, fileName: '顧客リスト_202410.csv', date: '2024-10-07 14:30', status: 'success', total: 1500, success: 1500, failed: 0 },
    { id: 2, fileName: '新規登録_202410.csv', date: '2024-10-06 10:15', status: 'success', total: 850, success: 845, failed: 5 },
    { id: 3, fileName: 'データ更新_202410.csv', date: '2024-10-05 16:45', status: 'partial', total: 2000, success: 1950, failed: 50 },
    { id: 4, fileName: '一括登録_202410.csv', date: '2024-10-04 09:20', status: 'failed', total: 500, success: 0, failed: 500 },
  ];

  
  const importedData = [
    { id: 1, name: '山田太郎', email: 'yamada@example.com', phone: '090-1234-5678', company: 'ABC商事', created: '2024-10-07' },
    { id: 2, name: '佐藤花子', email: 'sato@example.com', phone: '080-9876-5432', company: 'XYZ株式会社', created: '2024-10-06' },
    { id: 3, name: '鈴木一郎', email: 'suzuki@example.com', phone: '070-5555-1234', company: 'DEF商会', created: '2024-10-05' },
    { id: 4, name: '田中美咲', email: 'tanaka@example.com', phone: '080-1111-2222', company: 'GHI産業', created: '2024-10-04' },
  ];
  // イベント/関数に型を付ける
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) setUploadedFile(file);
  };

  const handleMapping = (csvCol: string, sysField: string) => {
    setMappings(prev => ({ ...prev, [csvCol]: sysField }));
  };

  const UploadScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">CSV取り込み</h1>
          <p className="text-blue-200">ファイルをアップロードして取り込みを開始します</p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="border-4 border-dashed border-blue-300 rounded-lg p-12 text-center hover:border-orange-400 transition-colors cursor-pointer">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="w-16 h-16 mx-auto mb-4 text-blue-900" />
              <h3 className="text-xl font-semibold text-blue-900 mb-2">
                CSVファイルをドラッグ&ドロップ
              </h3>
              <p className="text-gray-600 mb-4">または</p>
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                ファイルを選択
              </button>
            </label>
          </div>

          {uploadedFile && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-blue-900 mr-3" />
                  <div>
                    <p className="font-semibold text-blue-900">{uploadedFile.name}</p>
                    <p className="text-sm text-gray-600">{(uploadedFile.size / 1024).toFixed(2)} KB</p>
                  </div>
                </div>
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              <p>• 対応形式: CSV (.csv)</p>
              <p>• 推奨: 100万行まで対応</p>
              <p>• 文字コード: UTF-8, Shift-JIS自動判定</p>
            </div>
            <button
              onClick={() => uploadedFile && setCurrentScreen('mapping')}
              disabled={!uploadedFile}
              className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-colors ${
                uploadedFile
                  ? 'bg-blue-900 hover:bg-blue-800 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              次へ
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const MappingScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">カラムマッピング</h1>
          <p className="text-blue-200">CSVのカラムとシステムのフィールドを対応させてください</p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center p-4 bg-orange-50 border-l-4 border-orange-500 rounded flex-1 mr-4">
              <AlertCircle className="w-5 h-5 text-orange-600 mr-3" />
              <p className="text-sm text-orange-800">必須フィールド（name, email）は必ずマッピングしてください</p>
            </div>
            <button className="flex items-center px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors">
              <Save className="w-4 h-4 mr-2" />
              テンプレート保存
            </button>
          </div>

          <div className="space-y-4">
            {csvColumns.map((col, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center">
                    <Columns className="w-4 h-4 text-blue-900 mr-2" />
                    <span className="font-semibold text-blue-900">{col}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">CSVカラム</p>
                </div>
                
                <ArrowRight className="w-5 h-5 text-gray-400" />
                
                <div className="flex-1">
                  <select
                    onChange={(e) => handleMapping(col, e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    defaultValue=""
                  >
                    <option value="">選択してください</option>
                    {systemFields.map((field) => (
                      <option key={field} value={field}>
                        {field}
                        {(field === 'name' || field === 'email') && ' *'}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">システムフィールド</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-between">
            <button
              onClick={() => setCurrentScreen('upload')}
              className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              戻る
            </button>
            <button
              onClick={() => setCurrentScreen('preview')}
              className="flex items-center px-6 py-3 bg-blue-900 hover:bg-blue-800 text-white rounded-lg font-semibold transition-colors"
            >
              プレビューを確認
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const PreviewScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">データプレビュー</h1>
          <p className="text-blue-200">取り込み内容を確認してください（最初の3件を表示）</p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="mb-6 flex items-center justify-between p-4 bg-green-50 border-l-4 border-green-500 rounded">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
              <p className="text-sm text-green-800">マッピング完了: {csvColumns.length}カラム</p>
            </div>
            <span className="text-sm font-semibold text-green-800">全{previewData.length}件</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-blue-900">
                  <th className="px-4 py-3 text-left text-white font-semibold border border-blue-800">#</th>
                  {csvColumns.map((col, idx) => (
                    <th key={idx} className="px-4 py-3 text-left text-white font-semibold border border-blue-800">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewData.map((row, rowIdx) => (
                  <tr key={rowIdx} className="hover:bg-blue-50 transition-colors">
                    <td className="px-4 py-3 border border-gray-300 font-semibold text-gray-700">
                      {rowIdx + 1}
                    </td>
                    {csvColumns.map((col, colIdx) => (
                      <td key={colIdx} className="px-4 py-3 border border-gray-300 text-gray-700">
                        {row[col]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">取り込み設定</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">重複チェック: </span>
                <span className="font-semibold text-blue-900">メールアドレスで確認</span>
              </div>
              <div>
                <span className="text-gray-600">エラー時の動作: </span>
                <span className="font-semibold text-blue-900">スキップして継続</span>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-between">
            <button
              onClick={() => setCurrentScreen('mapping')}
              className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              戻る
            </button>
            <button 
              onClick={() => setCurrentScreen('result')}
              className="flex items-center px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors shadow-lg"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              取り込みを実行
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const ResultScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">取り込み結果</h1>
          <p className="text-blue-200">処理が完了しました</p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border-2 border-green-500">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-green-900">成功</h3>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-green-900">1,495</p>
              <p className="text-sm text-green-700 mt-1">件</p>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-lg border-2 border-red-500">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-red-900">失敗</h3>
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <p className="text-3xl font-bold text-red-900">5</p>
              <p className="text-sm text-red-700 mt-1">件</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border-2 border-blue-500">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-blue-900">合計</h3>
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-blue-900">1,500</p>
              <p className="text-sm text-blue-700 mt-1">件</p>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-blue-900 mb-4">処理情報</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center">
                <FileText className="w-4 h-4 text-blue-900 mr-2" />
                <span className="text-gray-600">ファイル名: </span>
                <span className="font-semibold text-blue-900 ml-2">顧客リスト_202410.csv</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 text-blue-900 mr-2" />
                <span className="text-gray-600">処理時間: </span>
                <span className="font-semibold text-blue-900 ml-2">2.3秒</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 text-blue-900 mr-2" />
                <span className="text-gray-600">実行日時: </span>
                <span className="font-semibold text-blue-900 ml-2">2024-10-07 14:30:15</span>
              </div>
              <div className="flex items-center">
                <Database className="w-4 h-4 text-blue-900 mr-2" />
                <span className="text-gray-600">処理速度: </span>
                <span className="font-semibold text-blue-900 ml-2">652件/秒</span>
              </div>
            </div>
          </div>

          <div className="bg-red-50 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-red-900 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                エラー詳細
              </h3>
              <button className="flex items-center px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors">
                <Download className="w-4 h-4 mr-1" />
                エラーログ
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-red-200">
                    <th className="text-left py-2 text-red-900">行番号</th>
                    <th className="text-left py-2 text-red-900">エラー内容</th>
                    <th className="text-left py-2 text-red-900">データ</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-red-100">
                    <td className="py-2 text-red-800">156</td>
                    <td className="py-2 text-red-800">メールアドレス形式が不正</td>
                    <td className="py-2 text-red-700 text-xs">invalid-email</td>
                  </tr>
                  <tr className="border-b border-red-100">
                    <td className="py-2 text-red-800">342</td>
                    <td className="py-2 text-red-800">必須項目が未入力</td>
                    <td className="py-2 text-red-700 text-xs">name列が空</td>
                  </tr>
                  <tr className="border-b border-red-100">
                    <td className="py-2 text-red-800">789</td>
                    <td className="py-2 text-red-800">重複データ</td>
                    <td className="py-2 text-red-700 text-xs">test@example.com</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setCurrentScreen('history')}
              className="flex items-center px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <History className="w-5 h-5 mr-2" />
              履歴を確認
            </button>
            <button
              onClick={() => setCurrentScreen('upload')}
              className="flex items-center px-6 py-3 bg-blue-900 hover:bg-blue-800 text-white rounded-lg font-semibold transition-colors"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              新規取り込み
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const HistoryScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">取り込み履歴</h1>
          <p className="text-blue-200">過去の取り込み実行結果を確認できます</p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="mb-6 flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="ファイル名で検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
              <option>すべてのステータス</option>
              <option>成功</option>
              <option>一部失敗</option>
              <option>失敗</option>
            </select>
            <button className="flex items-center px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors">
              <Filter className="w-4 h-4 mr-2" />
              フィルター
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-blue-900">
                  <th className="px-4 py-3 text-left text-white font-semibold">ファイル名</th>
                  <th className="px-4 py-3 text-left text-white font-semibold">実行日時</th>
                  <th className="px-4 py-3 text-left text-white font-semibold">ステータス</th>
                  <th className="px-4 py-3 text-left text-white font-semibold">合計</th>
                  <th className="px-4 py-3 text-left text-white font-semibold">成功</th>
                  <th className="px-4 py-3 text-left text-white font-semibold">失敗</th>
                  <th className="px-4 py-3 text-left text-white font-semibold">操作</th>
                </tr>
              </thead>
              <tbody>
                {historyData.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-blue-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 text-blue-900 mr-2" />
                        <span className="font-semibold text-gray-700">{item.fileName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-sm">{item.date}</td>
                    <td className="px-4 py-3">
                      {item.status === 'success' && (
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                          成功
                        </span>
                      )}
                      {item.status === 'partial' && (
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                          一部失敗
                        </span>
                      )}
                      {item.status === 'failed' && (
                        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
                          失敗
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-700 font-semibold">{item.total.toLocaleString()}</td>
                    <td className="px-4 py-3 text-green-700 font-semibold">{item.success.toLocaleString()}</td>
                    <td className="px-4 py-3 text-red-700 font-semibold">{item.failed.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <button className="p-2 text-blue-900 hover:bg-blue-100 rounded transition-colors" title="ダウンロード">
                        <Download className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-gray-600">全 {historyData.length} 件中 1-{historyData.length} 件を表示</p>
            <div className="flex gap-2">
              <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">前へ</button>
              <button className="px-3 py-1 bg-blue-900 text-white rounded">1</button>
              <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">2</button>
              <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">次へ</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const DataManagementScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">データ管理</h1>
          <p className="text-blue-200">取り込んだデータの確認・編集・削除ができます</p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="mb-6 flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="名前やメールアドレスで検索..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <button className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
              <FileDown className="w-4 h-4 mr-2" />
              エクスポート
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-blue-900">
                  <th className="px-4 py-3 text-left text-white font-semibold">
                    <input type="checkbox" className="rounded" />
                  </th>
                  <th className="px-4 py-3 text-left text-white font-semibold">ID</th>
                  <th className="px-4 py-3 text-left text-white font-semibold">名前</th>
                  <th className="px-4 py-3 text-left text-white font-semibold">メールアドレス</th>
                  <th className="px-4 py-3 text-left text-white font-semibold">電話番号</th>
                  <th className="px-4 py-3 text-left text-white font-semibold">会社名</th>
                  <th className="px-4 py-3 text-left text-white font-semibold">登録日</th>
                  <th className="px-4 py-3 text-left text-white font-semibold">操作</th>
                </tr>
              </thead>
              <tbody>
                {importedData.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-blue-50 transition-colors">
                    <td className="px-4 py-3">
                      <input type="checkbox" className="rounded" />
                    </td>
                    <td className="px-4 py-3 text-gray-600 font-semibold">{item.id}</td>
                    <td className="px-4 py-3 text-gray-700 font-semibold">{item.name}</td>
                    <td className="px-4 py-3 text-gray-600">{item.email}</td>
                    <td className="px-4 py-3 text-gray-600">{item.phone}</td>
                    <td className="px-4 py-3 text-gray-600">{item.company}</td>
                    <td className="px-4 py-3 text-gray-600 text-sm">{item.created}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button className="p-2 text-blue-900 hover:bg-blue-100 rounded transition-colors" title="編集">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-100 rounded transition-colors" title="削除">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
              <Trash2 className="w-4 h-4 mr-2" />
              選択したデータを削除
            </button>
            <div className="flex gap-2">
              <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">前へ</button>
              <button className="px-3 py-1 bg-blue-900 text-white rounded">1</button>
              <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">2</button>
              <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">次へ</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const SettingsScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">設定</h1>
          <p className="text-blue-200">取り込みの既定設定やテンプレートを管理します</p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="space-y-8">
            <div className="border-b pb-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                デフォルト設定
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">重複チェック方法</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                    <option>メールアドレスで確認</option>
                    <option>電話番号で確認</option>
                    <option>名前とメールアドレスで確認</option>
                    <option>重複チェックなし</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">エラー時の動作</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                    <option>スキップして継続</option>
                    <option>処理を中断</option>
                    <option>警告を表示して確認</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">文字コード</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                    <option>自動判定</option>
                    <option>UTF-8</option>
                    <option>Shift-JIS</option>
                    <option>EUC-JP</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">バッチサイズ</label>
                  <input 
                    type="number" 
                    defaultValue="1000"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">一度に処理する行数（大容量ファイル対応）</p>
                </div>
              </div>
            </div>

            <div className="border-b pb-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                <Save className="w-5 h-5 mr-2" />
                マッピングテンプレート
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div>
                    <p className="font-semibold text-gray-700">顧客マスタ用テンプレート</p>
                    <p className="text-sm text-gray-500">5カラムのマッピング設定</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-blue-900 text-white text-sm rounded hover:bg-blue-800 transition-colors">
                      読込
                    </button>
                    <button className="px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50 transition-colors">
                      編集
                    </button>
                    <button className="px-3 py-1 border border-red-300 text-red-700 text-sm rounded hover:bg-red-50 transition-colors">
                      削除
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div>
                    <p className="font-semibold text-gray-700">問い合わせ用テンプレート</p>
                    <p className="text-sm text-gray-500">8カラムのマッピング設定</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-blue-900 text-white text-sm rounded hover:bg-blue-800 transition-colors">
                      読込
                    </button>
                    <button className="px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50 transition-colors">
                      編集
                    </button>
                    <button className="px-3 py-1 border border-red-300 text-red-700 text-sm rounded hover:bg-red-50 transition-colors">
                      削除
                    </button>
                  </div>
                </div>

                <button className="w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-orange-400 hover:text-orange-600 transition-colors">
                  <Save className="w-5 h-5 mr-2" />
                  新しいテンプレートを作成
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                <Database className="w-5 h-5 mr-2" />
                データベース接続情報
              </h3>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">データベース: </span>
                    <span className="font-semibold text-blue-900">PostgreSQL 14.5</span>
                  </div>
                  <div>
                    <span className="text-gray-600">接続状態: </span>
                    <span className="font-semibold text-green-700">接続中</span>
                  </div>
                  <div>
                    <span className="text-gray-600">ホスト: </span>
                    <span className="font-semibold text-blue-900">localhost:5432</span>
                  </div>
                  <div>
                    <span className="text-gray-600">データベース名: </span>
                    <span className="font-semibold text-blue-900">csv_import_db</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-4">
            <button className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
              キャンセル
            </button>
            <button className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors">
              設定を保存
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="bg-blue-950 border-b border-blue-800 px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">CSV Import System</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentScreen('upload')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                currentScreen === 'upload'
                  ? 'bg-orange-500 text-white'
                  : 'text-blue-200 hover:text-white'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span className="text-sm font-semibold">取込</span>
            </button>
            <button
              onClick={() => setCurrentScreen('mapping')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                currentScreen === 'mapping'
                  ? 'bg-orange-500 text-white'
                  : 'text-blue-200 hover:text-white'
              }`}
            >
              <Columns className="w-4 h-4" />
              <span className="text-sm font-semibold">マッピング</span>
            </button>
            <button
              onClick={() => setCurrentScreen('preview')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                currentScreen === 'preview'
                  ? 'bg-orange-500 text-white'
                  : 'text-blue-200 hover:text-white'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span className="text-sm font-semibold">プレビュー</span>
            </button>
            <button
              onClick={() => setCurrentScreen('result')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                currentScreen === 'result'
                  ? 'bg-orange-500 text-white'
                  : 'text-blue-200 hover:text-white'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-semibold">結果</span>
            </button>
            <button
              onClick={() => setCurrentScreen('history')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                currentScreen === 'history'
                  ? 'bg-orange-500 text-white'
                  : 'text-blue-200 hover:text-white'
              }`}
            >
              <History className="w-4 h-4" />
              <span className="text-sm font-semibold">履歴</span>
            </button>
            <button
              onClick={() => setCurrentScreen('data')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                currentScreen === 'data'
                  ? 'bg-orange-500 text-white'
                  : 'text-blue-200 hover:text-white'
              }`}
            >
              <Database className="w-4 h-4" />
              <span className="text-sm font-semibold">データ</span>
            </button>
            <button
              onClick={() => setCurrentScreen('settings')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                currentScreen === 'settings'
                  ? 'bg-orange-500 text-white'
                  : 'text-blue-200 hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span className="text-sm font-semibold">設定</span>
            </button>
          </div>
        </div>
      </div>

      {currentScreen === 'upload' && <UploadScreen />}
      {currentScreen === 'mapping' && <MappingScreen />}
      {currentScreen === 'preview' && <PreviewScreen />}
      {currentScreen === 'result' && <ResultScreen />}
      {currentScreen === 'history' && <HistoryScreen />}
      {currentScreen === 'data' && <DataManagementScreen />}
      {currentScreen === 'settings' && <SettingsScreen />}
    </div>
  );
};

export default CSVImportApp;