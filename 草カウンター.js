/// @ 0.0.1
// 草カウンター
//  by @fried_butter@voskey.icalo.net
// 【参考】
// 逮捕カウンター
//　　by @_okaz@voskey.icalo.net
//
//　過去のノートを1000ノート分拾ってきて、逮捕率や逮捕系リアクション数を数えちゃうぞ
//

//================変更必要箇所(ここから)====================

//デバッグ用
let timestamps = []
@showTimestamps(){
    var res = ""
    for (let index, timestamps.len) {
        if (index > 0) res = `{res}Δt = {(timestamps[index].t-timestamps[index-1].t)/1000}s{Str:lf}`
        res = `{res}{Json:stringify(timestamps[index])}{Str:lf}`
    }
    Mk:dialog("timestamps", res, "info")
}

//定数
let playUrl = THIS_URL
let userId = USER_ID

//対象とするリアクションリスト
let emojis = [
  ":kusa_akarisou@.:"
  ":kusahaemasune_kiritan@.:"
  ":kusaa@.:"
  ":aa_kusa_taiyou_pokapokadekusa@.:"
  ":daisougen@.:"
]

//ハッシュタグ
let hashtag = "#草カウンター"

//モード
let modeList = [
    {text: "1000ノート", amountOfNotes: 1000},
    {text: "全ノート", amountOfNotes: if (userId==null) 0 else Mk:api("users/show", {userId: userId}).notesCount}
]

// 表示テキストの定義。意味もなく多言語対応
let uiTexts = {}
if (LOCALE == "ja-KS") { // 関西弁
    uiTexts.gettingNotes = "ノートを取得しとるでwwwwwww"
    uiTexts.checkingNotes = "ノートの:reaction_shooting:を探索しとるでwwwwwww"
    uiTexts.choosingMode = "取得するノート数を選んだってやwwwwwww"
    uiTexts.post = "草率を公表するwwwwwww"
} else { // それ以外だったら普通に
    uiTexts.gettingNotes = "ノートを取得していますwwwwwww"
    uiTexts.checkingNotes = "ノートの:reaction_shooting:を探索していますwwwwwww"
    uiTexts.choosingMode = "取得するノート数を選んでくださいwwwwwww"
    uiTexts.post = "草率を公表するwwwwwww"
}

//結果テキストの定義
let resultTexts = {
    notLoggedInUser: [
        `$[x2 :faa_kiritan:]{Str:lf}あなたはwwwwwwwまだ:voskey_icon:すきーでノートしたことがないようですねwwwwwwwwwwwwww`
    ],
    nonPostUser: [
        `$[x2 :faa_kiritan:]{Str:lf}あなたはwwwwwwwまだ:voskey_icon:すきーでノートしたことがないようですねwwwwwwwwwwwwww。`
    ],
    nonKandou: [
        `$[x2 :faa_kiritan:]{Str:lf}あなたはwwwwwwwどうやら草がwww存在しないwwwようですね。:voskey_icon:すきーにwwwこんな:big:がいるなんてwwwwwwwwwwwwww`
    ],
    kandou: [
        //ここでは関数の形式で返している(rateとindexを埋め込めるように)
        @(rate, index){`$[x2 :faa_kiritan:]{Str:lf}あなたの草率は{rate}%、生えた草は{index}ですwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww`}
    ]
}

@randomSelect(v, f){v[f(0, v.len-1)]}
//結果のテキストの形式
@selectResultText(countData, notes){
    //結果を条件別にランダムに表示
    if (userId==null) return randomSelect(resultTexts.notLoggedInUser, Math:rnd)
    if (notes.len==0) return randomSelect(resultTexts.nonPostUser, Math:rnd)
    if (countData.noteAmount==0) return randomSelect(resultTexts.nonKandou, Math:rnd)
    else {
        //取得したノートに対して条件を満たすノートの割合検索
        let rate = Math:round(10000 * countData.noteAmount / notes.len) / 100
        //1000ノートあたりのリアクション数
        let index = Math:round(countData.reactionAmount / notes.len * 1000)
        let result = randomSelect(resultTexts.kandou, Math:rnd)
        return result(rate, index)
    }
}

//ノートを取得中のUi
@renderGettingNotesUi(limit){
    Ui:render([
		Ui:C:container({
			align: "center",
			children: [
				Ui:C:mfm({text: uiTexts.gettingNotes}),
                gettingNotesUi
			]
		})
	])
}

//ノートについたリアクションチェック中のUi
@renderCheckingNotesUi(){
    Ui:render([
		Ui:C:container({
			align: "center",
			children: [
				Ui:C:mfm({text: uiTexts.checkingNotes})
            ]
		})
	])
}

//モード選択画面
@renderInitUi(){
    Ui:render([
        Ui:C:container({
            align: "center",
            children: [
                Ui:C:mfm({text: uiTexts.choosingMode}),
                Ui:C:buttons({
                    buttons: modeList.map(@(mode){
                        {
                            text: mode.text,
                            onClick: @(){do(mode)}
                        }
                    })
                })
            ]
        })
    ])
}

//結果表示画面
@renderResultUi(mode, countData, notes){
    let result = selectResultText(countData, notes)
    Ui:render([
		Ui:C:container({
			align: "center",
			children: [
				Ui:C:mfm({ text: result })
				Ui:C:postFormButton({
					text: uiTexts.post,
					rounded: true,
					primary: true,
					form: {
						text: `{result}{Str:lf}<small>調査対象:{mode.text}</small>{Str:lf}{hashtag}{Str:lf}{playUrl}`
					}
				})
			]
		})
	])
}

//================変更必要箇所(ここまで)====================

let gettingNotesUi = Ui:C:mfm({})
//取得関数
@getData(endpoint, params, token){
    gettingNotesUi.update({text: `取得中:残り{params.limit}`})
    if (params.limit <= 0) return []
    let t = Math:min(params.limit, 100)
    let limit = params.limit
    params.limit = t
    var data = null
    loop {
        data = if (token == "") {Mk:api(endpoint, params)} else {Mk:api(endpoint, params, token)}
        if (Core:type(data)=="arr") break
    }
    if (data.len == 0) return []
    params.limit = limit - data.len
    params.untilId = data[data.len - 1].id
    return data.concat(getData(endpoint, params, token))
}

//ノートに含まれるemojisで指定した絵文字の数を数える
@countNoteReactions(note, emojis){
    let reactions = note.reactions
    Obj:keys(reactions).reduce(@(accumulator, reaction){accumulator + (if (emojis.incl(reaction)) reactions[reaction] else 0)}, 0)
}

//ノートよりそれぞれ何ノートあり、何個リアクションがあるかを調べる
@dataCountFromNote(notes, emojis){
    //絵文字を含むノートのみ集める
    let selectedNote = notes.filter(@(note){
        //ノートごとのemojisで指定したリアクションがついている数を取得
        let reactionCount = countNoteReactions(note, emojis)
        //reactionCountが0ならfalseでfilterで除かれる
        return (
            if (reactionCount>0) {
                //reactionCountが0以上の場合にのみnote.reactionCountを保存
                //(それ以外はfilterで弾かれるので代入する意味がない)
                note.reactionCount = reactionCount
                true
            }
            else false
        )
    })
    //カウント結果を返す。
    return {
        noteAmount: selectedNote.len,
        reactionAmount: selectedNote.reduce(@(accumulator, note){accumulator + note.reactionCount}, 0)
    }
}

//実行
@do(mode){
    //ログインの有無
    let notes = if (userId!=null) {
        //ノート取得中であることを表すUI
        renderGettingNotesUi()
        //ノート取得
        let params = {userId: userId, includeReplies: false, limit: mode.amountOfNotes, includeMyRenotes: false}
        getData("users/notes", params, "")
    }
    else {
        []
    }
    //ノート調査中であることを表すUI
    renderCheckingNotesUi()
    //リアクションのカウントデータを取得
    let countData = dataCountFromNote(notes, emojis)
    //結果を表示
    renderResultUi(mode, countData, notes)    
}

//最初のUI表示
renderInitUi()