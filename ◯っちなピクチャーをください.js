/// @ 0.19.0
//日替わりからミリ秒刻みに変更
//振りなおしボタン追加 specialthanks!:@SuzukiMintu
//参考元：足立◯イ
//https://voskey.icalo.net/play/aach8ea4oc
//チータス（@Chitasu）さん
//参考元：舐める！あおいちゃん
//あんぱん（@BUTAyaro1999）さん
//https://voskey.icalo.net/play/a8x52a1c39

let choices = [
	"あ", "い", "う", "え", "お", "あ゙", "い゙", "ヴ", "え゙", "お゙",
	"か", "き", "く", "け", "こ", "が", "ぎ", "ぐ", "げ", "ご",
 	"さ", "し", "す", "せ", "そ", "ざ", "じ", "ず", "ぜ", "ぞ",
 	"た", "ち", "つ", "て", "と", "だ", "ぢ", "づ", "で", "ど",
 	"な", "に", "ぬ", "ね", "の", "な゙", "に゙", "ぬ゙", "ね゙", "の゙",
 	"は", "ひ", "ふ", "へ", "ほ", "ば", "び", "ぶ", "べ", "ぼ", "ぱ", "ぴ", "ぷ", "ぺ", "ぽ",
 	"ま", "み", "む", "め", "も", "ま゙", "み゙", "む゙", "め゙", "も゙",
 	"や", "ゆ", "よ", "や゙", "ゆ゙", "よ゙",
 	"ら", "り", "る", "れ", "ろ", "ら゙", "り゙", "る゙", "れ゙", "ろ゙",
 	"わ", "を", "ん",
 	"きゃ", "きゅ", "きょ",
 	"しゃ", "しゅ", "しょ",
 	"ちゃ", "ちゅ", "ちょ",
 	"にゃ", "にゅ", "にょ",
 	"ひゃ", "ひゅ", "ひょ",
 	"みゃ", "みゅ", "みょ",
 	"りゃ", "りゅ", "りょ",
 	"ぎゃ", "ぎゅ", "ぎょ",
 	"じゃ", "じゅ", "じょ",
 	"びゃ", "びゅ", "びょ",
 	"ぴゃ", "ぴゅ", "ぴょ",]
	
@main() {
	// ミリ秒刻みの乱数生成器
	let random = Math:gen_rng(`{THIS_ID}{USER_ID}{Date:year()}{Date:month()}{Date:day()}{Date:minute()}{Date:second()}{Date:millisecond()}`)
	
	let chosen = choices[random(0, (choices.len - 1))]
	let result = `<center>{chosen}っちなピクチャーをください
$[tada.speed=0s $[tada.speed=0s $[tada.speed=0s :berobero_aoi:]]] </center>`
  
  Render(result)
}

// UIを表示
@Render(result) {
	Ui:render([
		Ui:C:container({
  		align: 'center'
    	children: [
    		// リザルト描画
	    	Ui:C:mfm({ text: result })
	    	// 振り直しボタン描画
	    	Ui:C:buttons({
	    		buttons: [{
	    			text: "ふり直す"
	    			onClick: main
	    		}]
	    	})
	    	// 投稿ボタン描画
      	Ui:C:postFormButton({
  	    	text: "投稿する"
        	rounded: true
        	primary: true
        	form: {
    	    	text: `{result}{Str:lf}{THIS_URL}`
        	}
      	})
    	]
  	})
	])
}

main()