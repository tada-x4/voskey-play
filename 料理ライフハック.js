// クリップからランダムにノートを選ぶplay
// created by @fried_butter@voskey.icalo.net
// 改変や丸コピなどはお好きにどうぞ
// 【更新履歴】
// 2025/11/04 初リリース
// 2025/11/07 改変しやすくした

//改変時はここから変えてください！
// クリップID
let clipId = 'aemtrnd9kv'
//ロード中に表示する文字
let loadingUiText = '<center>$[tada.speed=0s $[position.x=1.7 :nowloading:$[position.x=-1.7 :cook_zundamon:]]]</center>'
//ハッシュタグ
let hash_tag = '#料理ライフハック'
//投稿ボタンの文字
let note_button_text = '料理知識をTLに投下'
//ここまで

// ここからプログラム本体部分
// ロード画面表示
Ui:render([
  Ui:C:mfm({ text: loadingUiText })
])

// 使う変数定義
var note_ids = []
var note_vaule_replace = ''

// 最初の取得
var clips_raw = Mk:api('clips/notes',{
	clipId: clipId,
	limit: 100
})

// clips/notesは100件までしか取れないので最後のノートをuntilIdにセットして再度取得
loop {
	// 1回で取ったノート数をカウントする
	var notes_count = 0
	// 取ったノート一覧のIDを配列に格納
	each let clip,clips_raw {
		notes_count = notes_count + 1
		note_ids.push(clip.id)
	} 
	// ノート件数が100件以下ならループを抜ける
	if notes_count < 100 {
		break
	}
	// 100件あるなら続けて取る
	clips_raw = Mk:api('clips/notes',{
		clipId: clipId,
		untilId: note_ids[note_ids.len-1],
		limit: 100
	})
}

// シードが「PlayID+ユーザーID+YYYYMMDD hh:mm:ss」である乱数生成器を用意
let random = Math:gen_rng(`{THIS_ID}{USER_ID}{Date:year()}{Date:month()}{Date:day()}{Date:hour()}{Date:minute()}{Date:second()}`)
// スクラッチパッドでのデバッグ用
//let random = Math:gen_rng(`{USER_ID}{Date:year()}{Date:month()}{Date:day()}{Date:hour()}{Date:minute()}{Date:second()}`)

// ランダムに選択肢を選ぶ
let chosen = note_ids[random(0, (note_ids.len - 1))]
// 選ばれたノートIDの内容を取得する
let note_value = Mk:api('notes/show',{
	noteId: chosen
})

//文字列がない（画像だけ）の場合テキストは[画像]としておく
if note_value.text == null {
	note_vaule_replace = '[画像]'
}
else{
	// メンションは置き換える（@→＠）
	note_vaule_replace = note_value.text.replace('@','＠')
}

// 結果のテキスト
let result = `**{note_vaule_replace}**
**?[元ノート]({SERVER_URL}/notes/{chosen})**`

//フォームの要素を決定
var form = {
						text: `{result}{Str:lf}{Str:lf}{hash_tag}
{THIS_URL}`
}

//CWがあった場合追加
if note_value.cw != null {
	form.cw = note_value.cw
}

// UIを表示
Ui:render([
	Ui:C:container({
		align: 'center'
		children: [
			Ui:C:mfm({ text: result })
			Ui:C:postFormButton({
				text: `{note_button_text}`
				rounded: true
				primary: true
				form: form
			})
		]
	})
])